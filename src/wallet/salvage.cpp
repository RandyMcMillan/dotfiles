// Copyright (c) 2009-2010 Satoshi Nakamoto
// Copyright (c) 2009-2021 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <streams.h>
#include <util/fs.h>
#include <util/translation.h>
#include <wallet/bdb.h>
#include <wallet/salvage.h>
#include <wallet/wallet.h>
#include <wallet/walletdb.h>

namespace wallet {
/* End of headers, beginning of key/value data */
static const char *HEADER_END = "HEADER=END";
/* End of key/value data */
static const char *DATA_END = "DATA=END";
typedef std::pair<std::vector<unsigned char>, std::vector<unsigned char> > KeyValPair;

static bool KeyFilter(const std::string& type)
{
    return WalletBatch::IsKeyType(type) || type == DBKeys::HDCHAIN;
}

util::Result<void> RecoverDatabaseFile(const ArgsManager& args, const fs::path& file_path)
{
    util::Result<void> result;
    DatabaseOptions options;
    ReadDatabaseArgs(args, options);
    options.require_existing = true;
    options.verify = false;
    options.require_format = DatabaseFormat::BERKELEY;
    auto database = MakeDatabase(file_path, options) >> result;
    if (!database) return {util::Error{}, std::move(result)};

    BerkeleyDatabase& berkeley_database = static_cast<BerkeleyDatabase&>(**database);
    std::string filename = berkeley_database.Filename();
    std::shared_ptr<BerkeleyEnvironment> env = berkeley_database.env;

    if (!(env->Open() >> result)) return {util::Error{}, std::move(result)};

    // Recovery procedure:
    // move wallet file to walletfilename.timestamp.bak
    // Call Salvage with fAggressive=true to
    // get as much data as possible.
    // Rewrite salvaged data to fresh wallet file
    // Rescan so any missing transactions will be
    // found.
    int64_t now = GetTime();
    std::string newFilename = strprintf("%s.%d.bak", filename, now);

    int ret = env->dbenv->dbrename(nullptr, filename.c_str(), nullptr,
                                   newFilename.c_str(), DB_AUTO_COMMIT);
    if (ret != 0)
    {
        return {util::Error{strprintf(Untranslated("Failed to rename %s to %s"), filename, newFilename)}, std::move(result)};
    }

    /**
     * Salvage data from a file. The DB_AGGRESSIVE flag is being used (see berkeley DB->verify() method documentation).
     * key/value pairs are appended to salvagedData which are then written out to a new wallet file.
     * NOTE: reads the entire database into memory, so cannot be used
     * for huge databases.
     */
    std::vector<KeyValPair> salvagedData;

    std::stringstream strDump;

    Db db(env->dbenv.get(), 0);
    ret = db.verify(newFilename.c_str(), nullptr, &strDump, DB_SALVAGE | DB_AGGRESSIVE);
    if (ret == DB_VERIFY_BAD) {
        result.AddWarning(Untranslated("Salvage: Database salvage found errors, all data may not be recoverable."));
    }
    if (ret != 0 && ret != DB_VERIFY_BAD) {
        return {util::Error{strprintf(Untranslated("Salvage: Database salvage failed with result %d."), ret)}, std::move(result)};
    }

    // Format of bdb dump is ascii lines:
    // header lines...
    // HEADER=END
    //  hexadecimal key
    //  hexadecimal value
    //  ... repeated
    // DATA=END

    std::string strLine;
    while (!strDump.eof() && strLine != HEADER_END)
        getline(strDump, strLine); // Skip past header

    std::string keyHex, valueHex;
    while (!strDump.eof() && keyHex != DATA_END) {
        getline(strDump, keyHex);
        if (keyHex != DATA_END) {
            if (strDump.eof())
                break;
            getline(strDump, valueHex);
            if (valueHex == DATA_END) {
                result.AddWarning(Untranslated("Salvage: WARNING: Number of keys in data does not match number of values."));
                break;
            }
            salvagedData.push_back(make_pair(ParseHex(keyHex), ParseHex(valueHex)));
        }
    }

    if (keyHex != DATA_END) {
        result = {util::Error{}, util::Warning{Untranslated("Salvage: WARNING: Unexpected end of file while reading salvage output.")}};
    } else if (ret != 0) {
        result = {util::Error{}};
    }

    if (salvagedData.empty())
    {
        return {util::Error{strprintf(Untranslated("Salvage(aggressive) found no records in %s."), newFilename)}, std::move(result)};
    }

    std::unique_ptr<Db> pdbCopy = std::make_unique<Db>(env->dbenv.get(), 0);
    ret = pdbCopy->open(nullptr,               // Txn pointer
                            filename.c_str(),   // Filename
                            "main",             // Logical db name
                            DB_BTREE,           // Database type
                            DB_CREATE,          // Flags
                            0);
    if (ret > 0) {
        pdbCopy->close(0);
        return {util::Error{strprintf(Untranslated("Cannot create database file %s"), filename)}, std::move(result)};
    }

    DbTxn* ptxn = env->TxnBegin();
    CWallet dummyWallet(nullptr, "", CreateDummyWalletDatabase());
    for (KeyValPair& row : salvagedData)
    {
        /* Filter for only private key type KV pairs to be added to the salvaged wallet */
        DataStream ssKey{row.first};
        CDataStream ssValue(row.second, SER_DISK, CLIENT_VERSION);
        std::string strType, strErr;
        bool fReadOK;
        {
            // Required in LoadKeyMetadata():
            LOCK(dummyWallet.cs_wallet);
            fReadOK = ReadKeyValue(&dummyWallet, ssKey, ssValue, strType, strErr, KeyFilter);
        }
        if (!KeyFilter(strType)) {
            continue;
        }
        if (!fReadOK)
        {
            result.AddWarning(strprintf(Untranslated("WARNING: WalletBatch::Recover skipping %s: %s"), strType, strErr));
            continue;
        }
        Dbt datKey(row.first.data(), row.first.size());
        Dbt datValue(row.second.data(), row.second.size());
        int ret2 = pdbCopy->put(ptxn, &datKey, &datValue, DB_NOOVERWRITE);
        if (ret2 > 0) {
            result = {util::Error{}};
        }
    }
    ptxn->commit(0);
    pdbCopy->close(0);

    return result;
}
} // namespace wallet
