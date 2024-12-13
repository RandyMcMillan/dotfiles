#ifndef BITCOIN_BITCOIN_TX_SETTINGS_H
#define BITCOIN_BITCOIN_TX_SETTINGS_H

#include <common/setting.h>

#include <string>
#include <vector>

using VersionSetting = common::Setting<
    "-version", bool, common::SettingOptions{.legacy = true},
    "Print version and exit">;

using CreateSetting = common::Setting<
    "-create", bool, common::SettingOptions{.legacy = true},
    "Create new, empty TX.">;

using JsonSetting = common::Setting<
    "-json", bool, common::SettingOptions{.legacy = true},
    "Select JSON output">;

#endif // BITCOIN_BITCOIN_TX_SETTINGS_H
