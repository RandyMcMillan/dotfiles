#ifndef BITCOIN_WALLET_INIT_SETTINGS_H
#define BITCOIN_WALLET_INIT_SETTINGS_H

#include <common/setting.h>
#include <outputtype.h>
#include <wallet/coincontrol.h>
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

using AvoidPartialSpendsSetting = common::Setting<
    "-avoidpartialspends", bool, common::SettingOptions{.legacy = true},
    "Group outputs by address, selecting many (possibly all) or none, instead of selecting on a per-output basis. Privacy is improved as addresses are mostly swept with fewer transactions and outputs are aggregated in clean change addresses. It may result in higher fees due to less optimal coin selection caused by this added limitation and possibly a larger-than-necessary number of inputs being used. Always enabled for wallets with \"avoid_reuse\" enabled, otherwise default: %u.">
    ::DefaultFn<[] { return DEFAULT_AVOIDPARTIALSPENDS; }>
    ::Category<OptionsCategory::WALLET>;

using ChangeTypeSetting = common::Setting<
    "-changetype", std::string, common::SettingOptions{.legacy = true},
    "What type of change to use (\"legacy\", \"p2sh-segwit\", \"bech32\", or \"bech32m\"). Default is \"legacy\" when "
                   "-addresstype=legacy, else it is an implementation detail.">
    ::Category<OptionsCategory::WALLET>;
} // namespace wallet

#endif // BITCOIN_WALLET_INIT_SETTINGS_H
