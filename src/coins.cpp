// Copyright (c) 2012-2016 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include "coins.h"

#include "memusage.h"
#include "random.h"

#include <assert.h>

/**
 * calculate number of bytes for the bitmask, and its number of non-zero bytes
 * each bit in the bitmask represents the availability of one output, but the
 * availabilities of the first two outputs are encoded separately
 */
void CCoins::CalcMaskSize(unsigned int &nBytes, unsigned int &nNonzeroBytes) const {
    unsigned int nLastUsedByte = 0;
    for (unsigned int b = 0; 2+b*8 < vout.size(); b++) {
        bool fZero = true;
        for (unsigned int i = 0; i < 8 && 2+b*8+i < vout.size(); i++) {
            if (!vout[2+b*8+i].IsNull()) {
                fZero = false;
                continue;
            }
        }
        if (!fZero) {
            nLastUsedByte = b + 1;
            nNonzeroBytes++;
        }
    }
    nBytes += nLastUsedByte;
}

bool CCoins::Spend(uint32_t nPos) 
{
    if (nPos >= vout.size() || vout[nPos].IsNull())
        return false;
    vout[nPos].SetNull();
    Cleanup();
    return true;
}

bool CCoinsView::GetCoins(const uint256 &txid, CCoins &coins) const { return false; }
bool CCoinsView::HaveCoins(const uint256 &txid) const { return false; }
uint256 CCoinsView::GetBestBlock() const { return uint256(); }
bool CCoinsView::BatchWrite(CCoinsMap &mapCoins, const uint256 &hashBlock) { return false; }
CCoinsViewCursor *CCoinsView::Cursor() const { return 0; }


CCoinsViewBacked::CCoinsViewBacked(CCoinsView *viewIn) : base(viewIn) { }
bool CCoinsViewBacked::GetCoins(const uint256 &txid, CCoins &coins) const { return base->GetCoins(txid, coins); }
bool CCoinsViewBacked::HaveCoins(const uint256 &txid) const { return base->HaveCoins(txid); }
uint256 CCoinsViewBacked::GetBestBlock() const { return base->GetBestBlock(); }
void CCoinsViewBacked::SetBackend(CCoinsView &viewIn) { base = &viewIn; }
bool CCoinsViewBacked::BatchWrite(CCoinsMap &mapCoins, const uint256 &hashBlock) { return base->BatchWrite(mapCoins, hashBlock); }
CCoinsViewCursor *CCoinsViewBacked::Cursor() const { return base->Cursor(); }

SaltedTxidHasher::SaltedTxidHasher() : k0(GetRand(std::numeric_limits<uint64_t>::max())), k1(GetRand(std::numeric_limits<uint64_t>::max())) {}

CCoinsViewCache::CCoinsViewCache(CCoinsView *baseIn) : CCoinsViewBacked(baseIn), cachedCoinsUsage(0), hasModifier(false) { }

CCoinsViewCache::~CCoinsViewCache()
{
    assert(!hasModifier);
}

size_t CCoinsViewCache::DynamicMemoryUsage() const {
    return memusage::DynamicUsage(cacheCoins) + cachedCoinsUsage;
}

CCoinsMap::const_iterator CCoinsViewCache::FetchCoins(const uint256 &txid) const {
    CCoinsModifier modifier(*this, txid);
    modifier.Fetch();
    modifier.Flush();
    return modifier.it;
}

bool CCoinsViewCache::GetCoins(const uint256 &txid, CCoins &coins) const {
    CCoinsMap::const_iterator it = FetchCoins(txid);
    if (it != cacheCoins.end()) {
        coins = it->second.coins;
        return true;
    }
    return false;
}

CCoinsModifier CCoinsViewCache::ModifyCoins(const uint256 &txid) {
    return CCoinsModifier(*this, txid);
}

/* ModifyNewCoins allows for faster coin modification when creating the new
 * outputs from a transaction.  It assumes that BIP 30 (no duplicate txids)
 * applies and has already been tested for (or the test is not required due to
 * BIP 34, height in coinbase).  If we can assume BIP 30 then we know that any
 * non-coinbase transaction we are adding to the UTXO must not already exist in
 * the utxo unless it is fully spent.  Thus we can check only if it exists DIRTY
 * at the current level of the cache, in which case it is not safe to mark it
 * FRESH (b/c then its spentness still needs to flushed).  If it's not dirty and
 * doesn't exist or is pruned in the current cache, we know it either doesn't
 * exist or is pruned in parent caches, which is the definition of FRESH.  The
 * exception to this is the two historical violations of BIP 30 in the chain,
 * both of which were coinbases.  We do not mark these fresh so we we can ensure
 * that they will still be properly overwritten when spent.
 */
CCoinsModifier CCoinsViewCache::ModifyNewCoins(const uint256 &txid, bool coinbase) {
    CCoinsModifier modifier(*this, txid);
    CCoinsCacheEntry entry;
    // If we are modifying a new non-coinbase transaction, we can assume no
    // transaction with the given txid previously existed, so any transaction
    // entry in the base view below the cache will be pruned (have no unspent
    // outputs), and the cache entry can be marked fresh.
    // If we are modifying a new coinbase transaction, we can't make any
    // assumption about any transaction entry in the base view below the cache,
    // so the new pruned cache entry which will replace it must be marked dirty.
    entry.flags |= coinbase ? CCoinsCacheEntry::DIRTY : CCoinsCacheEntry::FRESH;
    modifier.Set(std::move(entry));
    return modifier;
}

const CCoins* CCoinsViewCache::AccessCoins(const uint256 &txid) const {
    CCoinsMap::const_iterator it = FetchCoins(txid);
    if (it == cacheCoins.end()) {
        return NULL;
    } else {
        return &it->second.coins;
    }
}

bool CCoinsViewCache::HaveCoins(const uint256 &txid) const {
    CCoinsMap::const_iterator it = FetchCoins(txid);
    // We're using vtx.empty() instead of IsPruned here for performance reasons,
    // as we only care about the case where a transaction was replaced entirely
    // in a reorganization (which wipes vout entirely, as opposed to spending
    // which just cleans individual outputs).
    return (it != cacheCoins.end() && !it->second.coins.vout.empty());
}

bool CCoinsViewCache::HaveCoinsInCache(const uint256 &txid) const {
    CCoinsMap::const_iterator it = cacheCoins.find(txid);
    return it != cacheCoins.end();
}

uint256 CCoinsViewCache::GetBestBlock() const {
    if (hashBlock.IsNull())
        hashBlock = base->GetBestBlock();
    return hashBlock;
}

void CCoinsViewCache::SetBestBlock(const uint256 &hashBlockIn) {
    hashBlock = hashBlockIn;
}

bool CCoinsViewCache::BatchWrite(CCoinsMap &mapCoins, const uint256 &hashBlockIn) {
    assert(!hasModifier);
    for (CCoinsMap::iterator it = mapCoins.begin(); it != mapCoins.end();) {
        if (it->second.flags & CCoinsCacheEntry::DIRTY) { // Ignore non-dirty entries (optimization).
            CCoinsModifier(*this, it->first).Set(std::move(it->second));
        }
        CCoinsMap::iterator itOld = it++;
        mapCoins.erase(itOld);
    }
    hashBlock = hashBlockIn;
    return true;
}

bool CCoinsViewCache::Flush() {
    bool fOk = base->BatchWrite(cacheCoins, hashBlock);
    cacheCoins.clear();
    cachedCoinsUsage = 0;
    return fOk;
}

void CCoinsViewCache::Uncache(const uint256& hash)
{
    CCoinsMap::iterator it = cacheCoins.find(hash);
    if (it != cacheCoins.end() && it->second.flags == 0) {
        cachedCoinsUsage -= it->second.coins.DynamicMemoryUsage();
        cacheCoins.erase(it);
    }
}

unsigned int CCoinsViewCache::GetCacheSize() const {
    return cacheCoins.size();
}

const CTxOut &CCoinsViewCache::GetOutputFor(const CTxIn& input) const
{
    const CCoins* coins = AccessCoins(input.prevout.hash);
    assert(coins && coins->IsAvailable(input.prevout.n));
    return coins->vout[input.prevout.n];
}

CAmount CCoinsViewCache::GetValueIn(const CTransaction& tx) const
{
    if (tx.IsCoinBase())
        return 0;

    CAmount nResult = 0;
    for (unsigned int i = 0; i < tx.vin.size(); i++)
        nResult += GetOutputFor(tx.vin[i]).nValue;

    return nResult;
}

bool CCoinsViewCache::HaveInputs(const CTransaction& tx) const
{
    if (!tx.IsCoinBase()) {
        for (unsigned int i = 0; i < tx.vin.size(); i++) {
            const COutPoint &prevout = tx.vin[i].prevout;
            const CCoins* coins = AccessCoins(prevout.hash);
            if (!coins || !coins->IsAvailable(prevout.n)) {
                return false;
            }
        }
    }
    return true;
}

double CCoinsViewCache::GetPriority(const CTransaction &tx, int nHeight, CAmount &inChainInputValue) const
{
    inChainInputValue = 0;
    if (tx.IsCoinBase())
        return 0.0;
    double dResult = 0.0;
    BOOST_FOREACH(const CTxIn& txin, tx.vin)
    {
        const CCoins* coins = AccessCoins(txin.prevout.hash);
        assert(coins);
        if (!coins->IsAvailable(txin.prevout.n)) continue;
        if (coins->nHeight <= nHeight) {
            dResult += (double)(coins->vout[txin.prevout.n].nValue) * (nHeight-coins->nHeight);
            inChainInputValue += coins->vout[txin.prevout.n].nValue;
        }
    }
    return tx.ComputePriority(dResult);
}

CCoinsModifier::CCoinsModifier(const CCoinsViewCache& cache_, const uint256& txid) : cache(&cache_), it(cache_.cacheCoins.find(txid)), new_entry(txid, {}), has_new_entry(false)
{
    assert(!cache->hasModifier);
    cache->hasModifier = true;
}

// Initialize new_entry by fetching from the base view, if there isn't already
// an existing cache entry and has_new_entry is false.
void CCoinsModifier::Fetch()
{
    if (has_new_entry || it != cache->cacheCoins.end())
        return;
    has_new_entry = true;

    cache->base->GetCoins(new_entry.first, new_entry.second.coins);

    if (new_entry.second.coins.IsPruned())
        new_entry.second.flags |= CCoinsCacheEntry::FRESH;
}

// Add DIRTY flag to new_entry. If has_new_entry if false, first populates
// new_entry by copying the existing cache entry if there is one, or falling
// back to a lookup in the base view.
void CCoinsModifier::Modify()
{
    Fetch();
    if (!has_new_entry) {
        has_new_entry = true;
        assert(it != cache->cacheCoins.end());
        new_entry.second = it->second;
    }
    new_entry.second.flags |= CCoinsCacheEntry::DIRTY;
}

// Set new_entry to the specified value. Requires has_new_entry is false;
void CCoinsModifier::Set(CCoinsCacheEntry value)
{
    assert(!has_new_entry);
    has_new_entry = true;

    bool existing_entry = it != cache->cacheCoins.end();
    bool existing_pruned = existing_entry && it->second.coins.IsPruned();
    bool existing_dirty = existing_entry && it->second.flags & CCoinsCacheEntry::DIRTY;
    bool existing_fresh = existing_entry && it->second.flags & CCoinsCacheEntry::FRESH;
    bool new_pruned = existing_entry && it->second.coins.IsPruned();
    bool new_dirty = value.flags & CCoinsCacheEntry::DIRTY;
    bool new_fresh = value.flags & CCoinsCacheEntry::FRESH;

    // If the new value is marked FRESH, assert any existing cache entry is
    // pruned, otherwise it means the FRESH flag was misapplied.
    if (new_fresh && existing_entry && !existing_pruned)
        throw std::logic_error("FRESH flag misapplied to cache of base transaction with spendable outputs");

    // If a cache entry is pruned but not dirty, it should be marked fresh.
    if (new_pruned && !new_fresh && !new_dirty)
        throw std::logic_error("Missing FRESH or DIRTY flags for pruned cache entry.");

    // Set the ccoin value.
    new_entry.second.coins = std::move(value.coins);

    // If `existing_fresh` is true it means the `this->cache->base` CCoin is
    // pruned (has no unspent outputs), and nothing here changes that, so keep
    // the FRESH flag.
    // If `new_fresh` is true, it means that the `this->cache` CCoin is pruned,
    // which implies that the `this-cache->base` CCoin is also pruned as long as
    // the cache is not dirty, so keep the FRESH flag in this case as well.
    if (existing_fresh || (new_fresh && !existing_dirty))
        new_entry.second.flags |= CCoinsCacheEntry::FRESH;

    if (existing_dirty || new_dirty)
        new_entry.second.flags |= CCoinsCacheEntry::DIRTY;
}

// Update cache.cacheCoins with the contents of new_entry, and set
// has_new_entry to false. Does nothing if has_new_entry is false.
void CCoinsModifier::Flush()
{
    if (!has_new_entry)
        return;
    has_new_entry = false;

    new_entry.second.coins.Cleanup();

    bool erase = (new_entry.second.flags & CCoinsCacheEntry::FRESH) && new_entry.second.coins.IsPruned();

    if (it != cache->cacheCoins.end()) {
        cache->cachedCoinsUsage -= it->second.coins.DynamicMemoryUsage();
        if (erase) {
            cache->cacheCoins.erase(it);
            it = cache->cacheCoins.end();
        } else {
            it->second = std::move(new_entry.second);
        }
    } else if (!erase) {
        it = cache->cacheCoins.emplace(std::move(new_entry)).first;
    }

    // If the coin still exists after the modification, add the new usage
    if (it != cache->cacheCoins.end())
        cache->cachedCoinsUsage += it->second.coins.DynamicMemoryUsage();
}

CCoinsModifier::CCoinsModifier(CCoinsModifier&& old) : cache(std::move(old.cache)), it(std::move(old.it)), new_entry(std::move(old.new_entry)), has_new_entry(std::move(old.has_new_entry))
{
    old.cache = nullptr;
    old.has_new_entry = false;
}

CCoinsModifier::~CCoinsModifier()
{
    if (cache) {
        assert(cache->hasModifier);
        cache->hasModifier = false;
    }
    Flush();
}

CCoinsViewCursor::~CCoinsViewCursor()
{
}
