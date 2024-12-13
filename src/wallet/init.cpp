// Copyright (c) 2009-2010 Satoshi Nakamoto
// Copyright (c) 2009-2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <bitcoin-build-config.h> // IWYU pragma: keep

#include <common/args.h>
#include <init.h>
#include <interfaces/chain.h>
#include <interfaces/init.h>
#include <interfaces/wallet.h>
#include <net.h>
#include <node/context.h>
#include <node/interface_ui.h>
#include <outputtype.h>
#include <univalue.h>
#include <util/check.h>
#include <util/moneystr.h>
#include <util/translation.h>
#include <wallet/init_settings.h>
#ifdef USE_BDB
#include <wallet/bdb.h>
#endif
#include <wallet/coincontrol.h>
#include <wallet/wallet.h>
#include <walletinitinterface.h>

using node::NodeContext;

namespace wallet {
class WalletInit : public WalletInitInterface
{
public:
    //! Was the wallet component compiled in.
    bool HasWalletSupport() const override {return true;}

    //! Return the wallets help message.
    void AddWalletOptions(ArgsManager& argsman) const override;

    //! Wallets parameter interaction
    bool ParameterInteraction() const override;

    //! Add wallets that should be opened to list of chain clients.
    void Construct(NodeContext& node) const override;
};

void WalletInit::AddWalletOptions(ArgsManager& argsman) const
{
    AddressTypeSetting::Register(argsman);
    AvoidPartialSpendsSetting::Register(argsman);
    ChangeTypeSetting::Register(argsman);
    ConsolidateFeeRateSetting::Register(argsman);
    DisableWalletSetting::Register(argsman);
    DiscardFeeSetting::Register(argsman);

    FallbackFeeSetting::Register(argsman);
    KeyPoolSetting::Register(argsman);
    MaxApsFeeSetting::Register(argsman);
    MaxTxFeeSetting::Register(argsman);
    MinTxFeeSetting::Register(argsman);
    PayTxFeeSetting::Register(argsman);
#ifdef ENABLE_EXTERNAL_SIGNER
    SignerSetting::Register(argsman);
#endif
    SpendZeroConfChangeSetting::Register(argsman);
    TxConfirmTargetSetting::Register(argsman);
    WalletSetting::Register(argsman);
    WalletBroadcastSetting::Register(argsman);
    WalletDirSetting::Register(argsman);
#if HAVE_SYSTEM
    WalletNotifySetting::Register(argsman);
#endif
    WalletRbfSetting::Register(argsman);

#ifdef USE_BDB
    argsman.AddArg("-dblogsize=<n>", strprintf("Flush wallet database activity from memory to disk log every <n> megabytes (default: %u)", DatabaseOptions().max_log_mb), ArgsManager::ALLOW_ANY | ArgsManager::DEBUG_ONLY, OptionsCategory::WALLET_DEBUG_TEST);
    argsman.AddArg("-flushwallet", strprintf("Run a thread to flush wallet periodically (default: %u)", DEFAULT_FLUSHWALLET), ArgsManager::ALLOW_ANY | ArgsManager::DEBUG_ONLY, OptionsCategory::WALLET_DEBUG_TEST);
    argsman.AddArg("-privdb", strprintf("Sets the DB_PRIVATE flag in the wallet db environment (default: %u)", !DatabaseOptions().use_shared_memory), ArgsManager::ALLOW_ANY | ArgsManager::DEBUG_ONLY, OptionsCategory::WALLET_DEBUG_TEST);
    argsman.AddArg("-swapbdbendian", "Swaps the internal endianness of BDB wallet databases (default: false)", ArgsManager::ALLOW_ANY | ArgsManager::DEBUG_ONLY, OptionsCategory::WALLET_DEBUG_TEST);
#else
    argsman.AddHiddenArgs({"-dblogsize", "-flushwallet", "-privdb", "-swapbdbendian"});
#endif

#ifdef USE_SQLITE
    argsman.AddArg("-unsafesqlitesync", "Set SQLite synchronous=OFF to disable waiting for the database to sync to disk. This is unsafe and can cause data loss and corruption. This option is only used by tests to improve their performance (default: false)", ArgsManager::ALLOW_ANY | ArgsManager::DEBUG_ONLY, OptionsCategory::WALLET_DEBUG_TEST);
#else
    argsman.AddHiddenArgs({"-unsafesqlitesync"});
#endif

    argsman.AddArg("-walletrejectlongchains", strprintf("Wallet will not create transactions that violate mempool chain limits (default: %u)", DEFAULT_WALLET_REJECT_LONG_CHAINS), ArgsManager::ALLOW_ANY | ArgsManager::DEBUG_ONLY, OptionsCategory::WALLET_DEBUG_TEST);
    argsman.AddArg("-walletcrosschain", strprintf("Allow reusing wallet files across chains (default: %u)", DEFAULT_WALLETCROSSCHAIN), ArgsManager::ALLOW_ANY | ArgsManager::DEBUG_ONLY, OptionsCategory::WALLET_DEBUG_TEST);
}

bool WalletInit::ParameterInteraction() const
{
#ifdef USE_BDB
     if (!BerkeleyDatabaseSanityCheck()) {
         return InitError(Untranslated("A version conflict was detected between the run-time BerkeleyDB library and the one used during compilation."));
     }
#endif
    if (DisableWalletSetting::Get(gArgs)) {
        for (const std::string& wallet : WalletSetting::Get(gArgs)) {
            LogPrintf("%s: parameter interaction: -disablewallet -> ignoring -wallet=%s\n", __func__, wallet);
        }

        return true;
    }

    if (gArgs.GetBoolArg("-blocksonly", DEFAULT_BLOCKSONLY) && gArgs.SoftSetBoolArg("-walletbroadcast", false)) {
        LogPrintf("%s: parameter interaction: -blocksonly=1 -> setting -walletbroadcast=0\n", __func__);
    }

    return true;
}

void WalletInit::Construct(NodeContext& node) const
{
    ArgsManager& args = *Assert(node.args);
    if (DisableWalletSetting::Get(args)) {
        LogPrintf("Wallet disabled!\n");
        return;
    }
    auto wallet_loader = node.init->makeWalletLoader(*node.chain);
    node.wallet_loader = wallet_loader.get();
    node.chain_clients.emplace_back(std::move(wallet_loader));
}
} // namespace wallet

const WalletInitInterface& g_wallet_init_interface = wallet::WalletInit();
