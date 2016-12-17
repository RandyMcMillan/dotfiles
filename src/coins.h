// Copyright (c) 2009-2010 Satoshi Nakamoto
// Copyright (c) 2009-2016 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_COINS_H
#define BITCOIN_COINS_H

#include "compressor.h"
#include "core_memusage.h"
#include "hash.h"
#include "memusage.h"
#include "serialize.h"
#include "uint256.h"

#include <assert.h>
#include <stdint.h>

#include <boost/foreach.hpp>
#include <boost/unordered_map.hpp>

/** 
 * Pruned version of CTransaction: only retains metadata and unspent transaction outputs
 *
 * Serialized format:
 * - VARINT(coinbase + height * 2)
 * - the non-spent CTxOut (via CTxOutCompressor)
 */
class CCoins
{
public:
    //! whether transaction is a coinbase
    bool fCoinBase;

    //! unspent transaction outputs; spent outputs are .IsNull()
    CTxOut out;

    //! at which height this transaction was included in the active block chain
    uint32_t nHeight;

    //! construct a CCoins from a CTransaction, at a given height
    CCoins(CTxOut&& outIn, int nHeightIn, bool fCoinBaseIn) : fCoinBase(fCoinBaseIn), out(std::move(outIn)), nHeight(nHeightIn) {}
    CCoins(const CTxOut& outIn, int nHeightIn, bool fCoinBaseIn) : fCoinBase(fCoinBaseIn), out(outIn), nHeight(nHeightIn) {}

    void Clear() {
        out.SetNull();
        fCoinBase = false;
        nHeight = 0;
    }

    //! empty constructor
    CCoins() : fCoinBase(false), nHeight(0) { }

    //! equality test
    friend bool operator==(const CCoins &a, const CCoins &b) {
         // Empty CCoins objects are always equal.
         if (a.IsPruned() && b.IsPruned())
             return true;
         return a.fCoinBase == b.fCoinBase &&
                a.nHeight == b.nHeight &&
                a.out == b.out;
    }
    friend bool operator!=(const CCoins &a, const CCoins &b) {
        return !(a == b);
    }

    bool IsCoinBase() const {
        return fCoinBase;
    }

    template<typename Stream>
    void Serialize(Stream &s) const {
        uint32_t code = nHeight * 2 + fCoinBase;
        assert(code != 0);
        ::Serialize(s, VARINT(code));
        ::Serialize(s, CTxOutCompressor(REF(out)));
    }

    template<typename Stream>
    void Unserialize(Stream &s) {
        uint32_t code;
        ::Unserialize(s, VARINT(code));
        nHeight = code >> 1;
        fCoinBase = code & 1;
        ::Unserialize(s, REF(CTxOutCompressor(out)));
    }

    bool IsPruned() const {
        return !fCoinBase && nHeight == 0;
    }

    size_t DynamicMemoryUsage() const {
        return memusage::DynamicUsage(out.scriptPubKey);
    }
};

class SaltedOutpointHasher
{
private:
    /** Salt */
    const uint64_t k0, k1;

public:
    SaltedOutpointHasher();

    /**
     * This *must* return size_t. With Boost 1.46 on 32-bit systems the
     * unordered_map will behave unpredictably if the custom hasher returns a
     * uint64_t, resulting in failures when syncing the chain (#4634).
     */
    size_t operator()(const COutPoint& id) const {
        return SipHashUint256Extra(k0, k1, id.hash, id.n);
    }
};

struct CCoinsCacheEntry
{
    CCoins coins; // The actual cached data.
    unsigned char flags;

    enum Flags {
        DIRTY = (1 << 0), // This cache entry is potentially different from the version in the parent view.
        FRESH = (1 << 1), // The parent view does not have this entry (or it is pruned).
        /* Note that FRESH is a performance optimization with which we can
         * erase coins that are fully spent if we know we do not need to
         * flush the changes to the parent cache.  It is always safe to
         * not mark FRESH if that condition is not guaranteed.
         */
    };

    CCoinsCacheEntry() : flags(0) {}
    explicit CCoinsCacheEntry(std::nullptr_t) : coins(), flags(0) {}
    explicit CCoinsCacheEntry(CCoins&& coins_) : coins(std::move(coins_)), flags(0) {}

    size_t DynamicMemoryUsage() const {
        return coins.DynamicMemoryUsage();
    }
};

typedef boost::unordered_map<COutPoint, CCoinsCacheEntry, SaltedOutpointHasher> CCoinsMap;

/** Cursor for iterating over CoinsView state */
class CCoinsViewCursor
{
public:
    CCoinsViewCursor(const uint256 &hashBlockIn): hashBlock(hashBlockIn) {}
    virtual ~CCoinsViewCursor();

    virtual bool GetKey(COutPoint &key) const = 0;
    virtual bool GetValue(CCoins &coins) const = 0;
    /* Don't care about GetKeySize here */
    virtual unsigned int GetValueSize() const = 0;

    virtual bool Valid() const = 0;
    virtual void Next() = 0;

    //! Get best block at the time this cursor was created
    const uint256 &GetBestBlock() const { return hashBlock; }
private:
    uint256 hashBlock;
};

/** Abstract view on the open txout dataset. */
class CCoinsView
{
public:
    //! Retrieve the CCoins (unspent transaction outputs) for a given txid
    virtual bool GetCoins(const COutPoint &txid, CCoins &coins) const;

    //! Just check whether we have data for a given txid.
    //! This may (but cannot always) return true for fully spent transactions
    virtual bool HaveCoins(const COutPoint &txid) const;

    //! Retrieve the block hash whose state this CCoinsView currently represents
    virtual uint256 GetBestBlock() const;

    //! Do a bulk modification (multiple CCoins changes + BestBlock change).
    //! The passed mapCoins can be modified.
    virtual bool BatchWrite(CCoinsMap &mapCoins, const uint256 &hashBlock);

    //! Get a cursor to iterate over the whole state
    virtual CCoinsViewCursor *Cursor() const;

    //! As we use CCoinsViews polymorphically, have a virtual destructor
    virtual ~CCoinsView() {}
};


/** CCoinsView backed by another CCoinsView */
class CCoinsViewBacked : public CCoinsView
{
protected:
    CCoinsView *base;

public:
    CCoinsViewBacked(CCoinsView *viewIn);
    bool GetCoins(const COutPoint &txid, CCoins &coins) const;
    bool HaveCoins(const COutPoint &txid) const;
    uint256 GetBestBlock() const;
    void SetBackend(CCoinsView &viewIn);
    bool BatchWrite(CCoinsMap &mapCoins, const uint256 &hashBlock);
    CCoinsViewCursor *Cursor() const;
};


class CCoinsViewCache;

/** 
 * A reference to a mutable cache entry. Encapsulating it allows us to run
 *  cleanup code after the modification is finished, and keeping track of
 *  concurrent modifications. 
 */
class CCoinsModifier
{
private:
    const CCoinsViewCache* cache;
    CCoinsMap::iterator it;
    CCoinsMap::value_type new_entry;
    bool has_new_entry;

    CCoinsModifier(const CCoinsViewCache& cache_, const COutPoint& outpoint);
    void Fetch();
    void Modify();
    void Set(CCoinsCacheEntry value);
    void Flush();

public:
    CCoins* operator->() { Modify(); return &new_entry.second.coins; }
    CCoins& operator*() { Modify(); return new_entry.second.coins; }
    CCoinsModifier(CCoinsModifier&& old);
    CCoinsModifier(const CCoinsModifier&) = delete;
    CCoinsModifier& operator=(const CCoinsModifier&) = delete;
    ~CCoinsModifier();
    friend class CCoinsViewCache;
};

/** CCoinsView that adds a memory cache for transactions to another CCoinsView */
class CCoinsViewCache : public CCoinsViewBacked
{
protected:
    /**
     * Make mutable so that we can "fill the cache" even from Get-methods
     * declared as "const".  
     */
    mutable uint256 hashBlock;
    mutable CCoinsMap cacheCoins;

    /* Cached dynamic memory usage for the inner CCoins objects. */
    mutable size_t cachedCoinsUsage;

    /* Whether this cache has an active modifier. */
    mutable bool hasModifier;

public:
    CCoinsViewCache(CCoinsView *baseIn);
    ~CCoinsViewCache();

    // Standard CCoinsView methods
    bool GetCoins(const COutPoint &txid, CCoins &coins) const;
    bool HaveCoins(const COutPoint &txid) const;
    uint256 GetBestBlock() const;
    void SetBestBlock(const uint256 &hashBlock);
    bool BatchWrite(CCoinsMap &mapCoins, const uint256 &hashBlock);

    /**
     * Check if we have the given tx already loaded in this cache.
     * The semantics are the same as HaveCoins(), but no calls to
     * the backing CCoinsView are made.
     */
    bool HaveCoinsInCache(const COutPoint &txid) const;

    /**
     * Return a pointer to CCoins in the cache, or NULL if not found. This is
     * more efficient than GetCoins. Modifications to other cache entries are
     * allowed while accessing the returned pointer.
     */
    const CCoins* AccessCoins(const COutPoint &txid) const;

    /**
     * Add coins. Does not assume the coins don't exist in the cache already.
     */
    void AddCoin(const COutPoint& txid, CCoins&& coins, bool potential_overwrite);

    void AddCoins(const CTransaction& tx, int nHeight);

    void SpendCoin(const COutPoint &txid, CCoins* moveto = nullptr);

    /**
     * Push the modifications applied to this cache to its base.
     * Failure to call this method before destruction will cause the changes to be forgotten.
     * If false is returned, the state of this cache (and its backing view) will be undefined.
     */
    bool Flush();

    /**
     * Removes the transaction with the given hash from the cache, if it is
     * not modified.
     */
    void Uncache(const COutPoint &txid);

    //! Calculate the size of the cache (in number of transactions)
    unsigned int GetCacheSize() const;

    //! Calculate the size of the cache (in bytes)
    size_t DynamicMemoryUsage() const;

    /** 
     * Amount of bitcoins coming in to a transaction
     * Note that lightweight clients may not know anything besides the hash of previous transactions,
     * so may not be able to calculate this.
     *
     * @param[in] tx	transaction for which we are checking input total
     * @return	Sum of value of all inputs (scriptSigs)
     */
    CAmount GetValueIn(const CTransaction& tx) const;

    //! Check whether all prevouts of the transaction are present in the UTXO set represented by this view
    bool HaveInputs(const CTransaction& tx) const;

    /**
     * Return priority of tx at height nHeight. Also calculate the sum of the values of the inputs
     * that are already in the chain.  These are the inputs that will age and increase priority as
     * new blocks are added to the chain.
     */
    double GetPriority(const CTransaction &tx, int nHeight, CAmount &inChainInputValue) const;

    const CTxOut &GetOutputFor(const CTxIn& input) const;

    friend class CCoinsModifier;

private:
    CCoinsMap::iterator FetchCoins(const COutPoint &txid) const;

    /**
     * By making the copy constructor private, we prevent accidentally using it when one intends to create a cache on top of a base cache.
     */
    CCoinsViewCache(const CCoinsViewCache &);
};

#endif // BITCOIN_COINS_H
