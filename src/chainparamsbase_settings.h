#ifndef BITCOIN_CHAINPARAMSBASE_SETTINGS_H
#define BITCOIN_CHAINPARAMSBASE_SETTINGS_H

#include <chainparamsbase.h>
#include <common/setting.h>

#include <string>
#include <vector>

using SignetSeedNodeSetting = common::Setting<
    "-signetseednode", std::vector<std::string>, common::SettingOptions{.legacy = true, .disallow_negation = true},
    "Specify a seed node for the signet network, in the hostname[:port] format, e.g. sig.net:1234 (may be used multiple times to specify multiple seed nodes; defaults to the global default signet test network seed node(s))">
    ::Category<OptionsCategory::CHAINPARAMS>;

using SignetChallengeSetting = common::Setting<
    "-signetchallenge", std::vector<std::string>, common::SettingOptions{.legacy = true, .disallow_negation = true},
    "Blocks must satisfy the given script to be considered valid (only for signet networks; defaults to the global default signet test network challenge)">
    ::Category<OptionsCategory::CHAINPARAMS>;

using TestActivationHeightSetting = common::Setting<
    "-testactivationheight=name@height.", std::vector<std::string>, common::SettingOptions{.legacy = true, .debug_only = true},
    "Set the activation height of 'name' (segwit, bip34, dersig, cltv, csv). (regtest-only)">
    ::Category<OptionsCategory::DEBUG_TEST>;

using VbParamsSetting = common::Setting<
    "-vbparams=deployment:start:end[:min_activation_height]", std::vector<std::string>, common::SettingOptions{.legacy = true, .debug_only = true},
    "Use given start/end times and min_activation_height for specified version bits deployment (regtest-only)">
    ::Category<OptionsCategory::CHAINPARAMS>;

using ChainSetting = common::Setting<
    "-chain=<chain>", std::optional<std::string>, common::SettingOptions{.legacy = true},
    "Use the chain <chain> (default: main). Allowed values: " LIST_CHAIN_NAMES>
    ::Category<OptionsCategory::CHAINPARAMS>;

#endif // BITCOIN_CHAINPARAMSBASE_SETTINGS_H
