// Copyright (c) 2021-2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_NODE_CHAINSTATE_H
#define BITCOIN_NODE_CHAINSTATE_H

#include <util/result.h>
#include <util/translation.h>
#include <validation.h>

#include <cstdint>
#include <functional>
#include <tuple>

class CTxMemPool;

namespace node {

struct CacheSizes;

struct ChainstateLoadOptions {
    CTxMemPool* mempool{nullptr};
    bool block_tree_db_in_memory{false};
    bool coins_db_in_memory{false};
    bool reindex{false};
    bool reindex_chainstate{false};
    bool prune{false};
    int64_t check_blocks{DEFAULT_CHECKBLOCKS};
    int64_t check_level{DEFAULT_CHECKLEVEL};
    std::function<bool()> check_interrupt;
    std::function<void()> coins_error_cb;
};

//! Chainstate load errors. Simple applications can just treat all errors as
//! failures. More complex applications may want to try reindexing in the
//! generic error case, and pass an interrupt callback and exit cleanly in the
//! interrupted case.
enum class ChainstateLoadError { FAILURE, FAILURE_INCOMPATIBLE_DB, INTERRUPTED };

util::Result<void, ChainstateLoadError> LoadChainstate(ChainstateManager& chainman, const CacheSizes& cache_sizes,
                                                       const ChainstateLoadOptions& options);
util::Result<void, ChainstateLoadError> VerifyLoadedChainstate(ChainstateManager& chainman, const ChainstateLoadOptions& options);
} // namespace node

#endif // BITCOIN_NODE_CHAINSTATE_H
