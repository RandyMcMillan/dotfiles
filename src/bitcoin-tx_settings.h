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

using DelInSetting = common::Setting<
    "delin=N", common::Unset, common::SettingOptions{.legacy = true},
    "Delete input N from TX">
    ::Category<OptionsCategory::COMMANDS>;

using DelOutSetting = common::Setting<
    "delout=N", common::Unset, common::SettingOptions{.legacy = true},
    "Delete output N from TX">
    ::Category<OptionsCategory::COMMANDS>;

using InSetting = common::Setting<
    "in=TXID:VOUT(:SEQUENCE_NUMBER)", common::Unset, common::SettingOptions{.legacy = true},
    "Add input to TX">
    ::Category<OptionsCategory::COMMANDS>;

using LockTimeSetting = common::Setting<
    "locktime=N", common::Unset, common::SettingOptions{.legacy = true},
    "Set TX lock time to N">
    ::Category<OptionsCategory::COMMANDS>;

using NVersionSetting = common::Setting<
    "nversion=N", common::Unset, common::SettingOptions{.legacy = true},
    "Set TX version to N">
    ::Category<OptionsCategory::COMMANDS>;

using OutAddrSetting = common::Setting<
    "outaddr=VALUE:ADDRESS", common::Unset, common::SettingOptions{.legacy = true},
    "Add address-based output to TX">
    ::Category<OptionsCategory::COMMANDS>;

#endif // BITCOIN_BITCOIN_TX_SETTINGS_H
