// Copyright (c) 2017-2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_INDEX_BASE_H
#define BITCOIN_INDEX_BASE_H

#include <dbwrapper.h>
#include <interfaces/chain.h>
#include <interfaces/handler.h>
#include <util/threadinterrupt.h>
#include <validationinterface.h>

#include <string>

class BaseIndexNotifications;
class CBlock;
class Chainstate;
namespace interfaces {
class Chain;
} // namespace interfaces

struct IndexSummary {
    std::string name;
    bool synced{false};
    int best_block_height{0};
};

/**
 * Base class for indices of blockchain data. This handles block connected and
 * disconnected notifications and ensures blocks are indexed sequentially
 * according to their position in the active chain.
 */
class BaseIndex
{
protected:
    /**
     * The database stores a block locator of the chain the database is synced to
     * so that the index can efficiently determine the point it last stopped at.
     * A locator is used instead of a simple hash of the chain tip because blocks
     * and block index entries may not be flushed to disk until after this database
     * is updated.
    */
    class DB : public CDBWrapper
    {
    public:
        DB(const fs::path& path, size_t n_cache_size,
           bool f_memory = false, bool f_wipe = false, bool f_obfuscate = false);

        /// Read block locator of the chain that the index is in sync with.
        bool ReadBestBlock(CBlockLocator& locator) const;

        /// Write block locator of the chain that the index is in sync with.
        void WriteBestBlock(CDBBatch& batch, const CBlockLocator& locator);
    };

private:
    /// Whether the index is in sync with the main chain. The flag is flipped
    /// from false to true once, after which point this starts processing
    /// ValidationInterface notifications to stay in sync.
    ///
    /// Note that this will latch to true *immediately* upon startup if
    /// `m_chainstate->m_chain` is empty, which will be the case upon startup
    /// with an empty datadir if, e.g., `-txindex=1` is specified.
    std::atomic<bool> m_synced{false};

    /// The last block in the chain that the index is in sync with.
    std::optional<interfaces::BlockKey> m_best_block GUARDED_BY(m_mutex);

    /// Read best block locator and check that data needed to sync has not been pruned.
    bool Init();

    /// Write the current index state (eg. chain block locator and subclass-specific items) to disk.
    ///
    /// Recommendations for error handling:
    /// If called on a successor of the previous committed best block in the index, the index can
    /// continue processing without risk of corruption, though the index state will need to catch up
    /// from further behind on reboot. If the new state is not a successor of the previous state (due
    /// to a chain reorganization), the index must halt until Commit succeeds or else it could end up
    /// getting corrupted.
    bool Commit(const CBlockLocator& locator);

    /// Loop over disconnected blocks and call CustomRemove.
    bool Rewind(const interfaces::BlockKey& current_tip, const interfaces::BlockKey& new_tip);

    virtual bool AllowPrune() const = 0;

    mutable Mutex m_mutex;
    friend class BaseIndexNotifications;
    std::shared_ptr<BaseIndexNotifications> m_notifications GUARDED_BY(m_mutex);
    std::unique_ptr<interfaces::Handler> m_handler GUARDED_BY(m_mutex);

protected:
    std::unique_ptr<interfaces::Chain> m_chain;
    Chainstate* m_chainstate{nullptr};
    const std::string m_name;

    /// Return custom notification options for index.
    [[nodiscard]] virtual interfaces::Chain::NotifyOptions CustomOptions() { return {}; }

    /// Initialize internal state from the database and block index.
    [[nodiscard]] virtual bool CustomInit(const std::optional<interfaces::BlockKey>& block) { return true; }

    /// Write update index entries for a newly connected block.
    [[nodiscard]] virtual bool CustomAppend(const interfaces::BlockInfo& block) { return true; }

    /// Virtual method called internally by Commit that can be overridden to atomically
    /// commit more index state.
    virtual bool CustomCommit(CDBBatch& batch) { return true; }

    /// Rewind index by one block during a chain reorg.
    [[nodiscard]] virtual bool CustomRemove(const interfaces::BlockInfo& block) { return true; }

    virtual DB& GetDB() const = 0;

    /// Get the name of the index for display in logs.
    const std::string& GetName() const LIFETIMEBOUND { return m_name; }

    /// Update the internal best block index as well as the prune lock.
    void SetBestBlock(const interfaces::BlockKey& block) EXCLUSIVE_LOCKS_REQUIRED(!m_mutex);

public:
    BaseIndex(std::unique_ptr<interfaces::Chain> chain, std::string name);
    virtual ~BaseIndex();

    /// Blocks the current thread until the index is caught up to the current
    /// state of the block chain. This only blocks if the index has gotten in
    /// sync once and only needs to process blocks in the ValidationInterface
    /// queue. If the index is catching up from far behind, this method does
    /// not block and immediately returns false.
    bool BlockUntilSyncedToCurrentChain() const LOCKS_EXCLUDED(::cs_main) EXCLUSIVE_LOCKS_REQUIRED(!m_mutex);

    void Interrupt() EXCLUSIVE_LOCKS_REQUIRED(!m_mutex);

    /// Start initializes the sync state and registers the instance as a
    /// ValidationInterface so that it stays in sync with blockchain updates.
    [[nodiscard]] bool Start() EXCLUSIVE_LOCKS_REQUIRED(!m_mutex);

    /// Stops the instance from staying in sync with blockchain updates.
    void Stop() EXCLUSIVE_LOCKS_REQUIRED(!m_mutex);

    /// Get a summary of the index and its state.
    IndexSummary GetSummary() const EXCLUSIVE_LOCKS_REQUIRED(!m_mutex);
};

#endif // BITCOIN_INDEX_BASE_H
