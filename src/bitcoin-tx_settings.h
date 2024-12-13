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

using TxIdSetting = common::Setting<
    "-txid", bool, common::SettingOptions{.legacy = true},
    "Output only the hex-encoded transaction id of the resultant transaction.">;

#endif // BITCOIN_BITCOIN_TX_SETTINGS_H
