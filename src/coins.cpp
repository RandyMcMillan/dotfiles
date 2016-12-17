// Copyright (c) 2012-2016 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include "coins.h"

#include "memusage.h"
#include "random.h"

#include <assert.h>

bool CCoinsView::GetCoins(const COutPoint &txid, CCoins &coins) const { return false; }
bool CCoinsView::HaveCoins(const COutPoint &txid) const { return false; }
uint256 CCoinsView::GetBestBlock() const { return uint256(); }
bool CCoinsView::BatchWrite(CCoinsMap &mapCoins, const uint256 &hashBlock) { return false; }
CCoinsViewCursor *CCoinsView::Cursor() const { return 0; }


CCoinsViewBacked::CCoinsViewBacked(CCoinsView *viewIn) : base(viewIn) { }
bool CCoinsViewBacked::GetCoins(const COutPoint &txid, CCoins &coins) const { return base->GetCoins(txid, coins); }
bool CCoinsViewBacked::HaveCoins(const COutPoint &txid) const { return base->HaveCoins(txid); }
uint256 CCoinsViewBacked::GetBestBlock() const { return base->GetBestBlock(); }
void CCoinsViewBacked::SetBackend(CCoinsView &viewIn) { base = &viewIn; }
bool CCoinsViewBacked::BatchWrite(CCoinsMap &mapCoins, const uint256 &hashBlock) { return base->BatchWrite(mapCoins, hashBlock); }
CCoinsViewCursor *CCoinsViewBacked::Cursor() const { return base->Cursor(); }

SaltedOutpointHasher::SaltedOutpointHasher() : k0(GetRand(std::numeric_limits<uint64_t>::max())), k1(GetRand(std::numeric_limits<uint64_t>::max())) {}

CCoinsViewCache::CCoinsViewCache(CCoinsView *baseIn) : CCoinsViewBacked(baseIn), cachedCoinsUsage(0), hasModifier(false) { }

CCoinsViewCache::~CCoinsViewCache() {}

size_t CCoinsViewCache::DynamicMemoryUsage() const {
    return memusage::DynamicUsage(cacheCoins) + cachedCoinsUsage;
}

CCoinsMap::iterator CCoinsViewCache::FetchCoins(const COutPoint &outpoint) const {
    CCoinsModifier modifier(*this, outpoint);
    modifier.Fetch();
    modifier.Flush();
    return modifier.it;
}

bool CCoinsViewCache::GetCoins(const COutPoint &txid, CCoins &coins) const {
    CCoinsMap::const_iterator it = FetchCoins(txid);
    if (it != cacheCoins.end()) {
        coins = it->second.coins;
        return true;
    }
    return false;
}

void CCoinsViewCache::AddCoin(const COutPoint &outpoint, CCoins&& coins, bool possible_overwrite) {
    CCoinsModifier modifier(*this, outpoint);
    CCoinsCacheEntry entry;
    entry.coins = std::move(coins);
    entry.flags = CCoinsCacheEntry::DIRTY | (possible_overwrite ? 0 : CCoinsCacheEntry::FRESH);
    modifier.Set(std::move(entry));
}

void CCoinsViewCache::AddCoins(const CTransaction &tx, int nHeight) {
    bool fCoinbase = tx.IsCoinBase();
    const uint256& txid = tx.GetHash();
    for (size_t i = 0; i < tx.vout.size(); ++i) {
        if (!tx.vout[i].scriptPubKey.IsUnspendable()) {
            AddCoin(COutPoint(txid, i), CCoins(tx.vout[i], nHeight, fCoinbase), fCoinbase);
        }
    }
}

void CCoinsViewCache::SpendCoin(const COutPoint &outpoint, CCoins* moveout) {
    CCoinsModifier modifier(*this, outpoint);
    if (moveout) {
        *moveout = std::move(*modifier);
    }
    modifier->Clear();
}

const CCoins* CCoinsViewCache::AccessCoins(const COutPoint &txid) const {
    CCoinsMap::const_iterator it = FetchCoins(txid);
    if (it == cacheCoins.end()) {
        return NULL;
    } else {
        return &it->second.coins;
    }
}

bool CCoinsViewCache::HaveCoins(const COutPoint &txid) const {
    CCoinsMap::const_iterator it = FetchCoins(txid);
    return (it != cacheCoins.end() && !it->second.coins.IsPruned());
}

bool CCoinsViewCache::HaveCoinsInCache(const COutPoint &txid) const {
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

void CCoinsViewCache::Uncache(const COutPoint& hash)
{
    CCoinsMap::iterator it = cacheCoins.find(hash);
    if (it != cacheCoins.end() && it->second.flags == 0) {
        cachedCoinsUsage -= it->second.DynamicMemoryUsage();
        cacheCoins.erase(it);
    }
}

unsigned int CCoinsViewCache::GetCacheSize() const {
    return cacheCoins.size();
}

const CTxOut &CCoinsViewCache::GetOutputFor(const CTxIn& input) const
{
    const CCoins* coins = AccessCoins(input.prevout);
    assert(coins);
    return coins->out;
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
            if (!HaveCoins(tx.vin[i].prevout)) {
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
        const CCoins* coins = AccessCoins(txin.prevout);
        assert(coins);
        if (!coins->IsPruned() && (int)coins->nHeight <= nHeight) {
            dResult += (double)(coins->out.nValue) * (nHeight-coins->nHeight);
            inChainInputValue += coins->out.nValue;
        }
    }
    return tx.ComputePriority(dResult);
}

CCoinsModifier::CCoinsModifier(const CCoinsViewCache& cache_, const COutPoint& outpoint) : cache(&cache_), it(cache_.cacheCoins.find(outpoint)), new_entry(outpoint, {}), has_new_entry(false)
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
