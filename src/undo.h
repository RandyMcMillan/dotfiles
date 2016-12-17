// Copyright (c) 2009-2010 Satoshi Nakamoto
// Copyright (c) 2009-2016 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_UNDO_H
#define BITCOIN_UNDO_H

#include "compressor.h"
#include "primitives/transaction.h"
#include "serialize.h"

/** Undo information for a CTxIn
 *
 *  Contains the prevout's CTxOut being spent, and if this was the
 *  last output of the affected transaction, its metadata as well
 *  (coinbase or not, height, transaction version)
 */
class CTxInUndoSerializer
{
    CCoins* txout;

public:
    template<typename Stream>
    void Serialize(Stream &s) const {
        ::Serialize(s, VARINT(txout->nHeight * 2 + (txout->fCoinBase ? 1 : 0)));
        if (txout->nHeight > 0) {
            ::Serialize(s, (unsigned char)0);
        }
        ::Serialize(s, CTxOutCompressor(REF(txout->out)));
    }

    template<typename Stream>
    void Unserialize(Stream &s) {
        unsigned int nCode = 0;
        ::Unserialize(s, VARINT(nCode));
        txout->nHeight = nCode / 2;
        txout->fCoinBase = nCode & 1;
        if (txout->nHeight > 0) {
            int nVersionDummy;
            ::Unserialize(s, VARINT(nVersionDummy));
        }
        ::Unserialize(s, REF(CTxOutCompressor(REF(txout->out))));
    }

    CTxInUndoSerializer(const CCoins* coins) : txout(const_cast<CCoins*>(coins)) {}
};

/** Undo information for a CTransaction */
class CTxUndo
{
public:
    // undo information for all txins
    std::vector<CCoins> vprevout;

    template <typename Stream>
    void Serialize(Stream& s) const {
        // TODO: avoid reimplementing vector serializer
        uint64_t count = vprevout.size();
        ::Serialize(s, COMPACTSIZE(REF(count)));
        uint64_t n = 0;
        while (n < count) {
            ::Serialize(s, REF(CTxInUndoSerializer(&vprevout[n++])));
        }
    }

    template <typename Stream>
    void Unserialize(Stream& s) {
        // TODO: avoid reimplementing vector deserializer
        uint64_t count;
        ::Unserialize(s, COMPACTSIZE(count));
        if (count > 111111) { // TODO: avoid hardcoding max txouts per tx
            throw std::ios_base::failure("Too many input undo records");
        }
        vprevout.resize(count);
        uint64_t n = 0;
        while (n < count) {
            ::Unserialize(s, REF(CTxInUndoSerializer(&vprevout[n++])));
        }
    }
};

/** Undo information for a CBlock */
class CBlockUndo
{
public:
    std::vector<CTxUndo> vtxundo; // for all but the coinbase

    ADD_SERIALIZE_METHODS;

    template <typename Stream, typename Operation>
    inline void SerializationOp(Stream& s, Operation ser_action) {
        READWRITE(vtxundo);
    }
};

#endif // BITCOIN_UNDO_H
