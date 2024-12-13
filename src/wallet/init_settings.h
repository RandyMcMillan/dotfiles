#ifndef BITCOIN_WALLET_INIT_SETTINGS_H
#define BITCOIN_WALLET_INIT_SETTINGS_H

#include <common/setting.h>
#include <outputtype.h>
#include <wallet/wallet.h>

#include <string>
#include <vector>

namespace wallet {

using WalletSetting = common::Setting<
    "-wallet=<path>", std::vector<std::string>, common::SettingOptions{.legacy = true, .network_only = true},
    "Specify wallet path to load at startup. Can be used multiple times to load multiple wallets. Path is to a directory containing wallet data and log files. If the path is not absolute, it is interpreted relative to <walletdir>. This only loads existing wallets and does not create new ones. For backwards compatibility this also accepts names of existing top-level data files in <walletdir>.">
    ::Category<OptionsCategory::WALLET>;

using AddressTypeSetting = common::Setting<
    "-addresstype", std::string, common::SettingOptions{.legacy = true},
    "What type of addresses to use (\"legacy\", \"p2sh-segwit\", \"bech32\", or \"bech32m\", default: \"%s\")">
    ::HelpFn<[](const auto& fmt) { return strprintf(fmt, FormatOutputType(DEFAULT_ADDRESS_TYPE)); }>
    ::Category<OptionsCategory::WALLET>;
} // namespace wallet

#endif // BITCOIN_WALLET_INIT_SETTINGS_H
