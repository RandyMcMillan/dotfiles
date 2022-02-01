// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <chain.h>
#include <chainparams.h>
#include <interfaces/chain.h>
#include <node/chain.h>
#include <threadinterrupt.h>
#include <uint256.h>
#include <undo.h>
#include <validation.h>

namespace node {
interfaces::BlockInfo MakeBlockInfo(const CBlockIndex* index, const CBlock* data)
{
    interfaces::BlockInfo info{index ? *index->phashBlock : uint256::ZERO};
    if (index) {
        info.prev_hash = index->pprev ? index->pprev->phashBlock : nullptr;
        info.height = index->nHeight;
        LOCK(::cs_main);
        info.file_number = index->nFile;
        info.data_pos = index->nDataPos;
    }
    info.data = data;
    return info;
}

bool ReadBlockData(const CBlockIndex* block, CBlock* data, CBlockUndo* undo_data, interfaces::BlockInfo& info)
{
    if (data) {
        auto& consensus_params = Params().GetConsensus();
        if (ReadBlockFromDisk(*data, block, consensus_params)) {
            info.data = data;
        } else {
            info.error = strprintf("%s: Failed to read block %s from disk", __func__, block->GetBlockHash().ToString());
            return false;
        }
    }
    if (undo_data && block->nHeight > 0) {
        if (UndoReadFromDisk(*undo_data, block)) {
            info.undo_data = undo_data;
        } else {
            info.error = strprintf("%s: Failed to read block %s undo data from disk", __func__, block->GetBlockHash().ToString());
            return false;
        }
    }
    return true;
}

bool SyncChain(const CChain& chain, const CBlockIndex* block, std::shared_ptr<interfaces::Chain::Notifications> notifications, const CThreadInterrupt& interrupt, std::function<void()> on_sync)
{
    while (true) {
        AssertLockNotHeld(::cs_main);
        WAIT_LOCK(::cs_main, main_lock);

        bool rewind = false;
        if (!block) {
            block = chain.Genesis();
        } else if (chain.Contains(block)) {
            block = chain.Next(block);
        } else {
            rewind = true;
        }

        if (block) {
            // Release cs_main while reading block data and sending notifications.
            REVERSE_LOCK(main_lock);
            interfaces::BlockInfo block_info = MakeBlockInfo(block);
            block_info.chain_tip = false;
            CBlock data;
            CBlockUndo undo_data;
            ReadBlockData(block, &data, &undo_data, block_info);
            if (rewind) {
                notifications->blockDisconnected(block_info);
                block = Assert(block->pprev);
            } else {
                notifications->blockConnected(block_info);
            }
        } else {
            block = chain.Tip();
        }

        bool synced = block == chain.Tip();
        if (synced || interrupt) {
            if (synced && on_sync) on_sync();
            if (block) {
                CBlockLocator locator = chain.GetLocator(block);
                // Release cs_main while calling notification handlers.
                REVERSE_LOCK(main_lock);
                if (synced) notifications->blockConnected(MakeBlockInfo(block));
                notifications->chainStateFlushed(locator);
            }
            return synced;
        }
    }
}
} // namespace node
