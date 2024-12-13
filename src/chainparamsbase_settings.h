#ifndef BITCOIN_CHAINPARAMSBASE_SETTINGS_H
#define BITCOIN_CHAINPARAMSBASE_SETTINGS_H

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

#endif // BITCOIN_CHAINPARAMSBASE_SETTINGS_H
