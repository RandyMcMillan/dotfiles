#ifndef BITCOIN_BITCOIN_WALLET_SETTINGS_H
#define BITCOIN_BITCOIN_WALLET_SETTINGS_H

#include <common/setting.h>

#include <string>
#include <vector>

using VersionSetting = common::Setting<
    "-version", bool, common::SettingOptions{.legacy = true},
    "Print version and exit">;

using DataDirSetting = common::Setting<
    "-datadir=<dir>", std::string, common::SettingOptions{.legacy = true, .disallow_negation = true},
    "Specify data directory">;

#endif // BITCOIN_BITCOIN_WALLET_SETTINGS_H
