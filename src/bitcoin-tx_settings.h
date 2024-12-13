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

using OutDataSetting = common::Setting<
    "outdata=[VALUE:]DATA", common::Unset, common::SettingOptions{.legacy = true},
    "Add data-based output to TX">
    ::Category<OptionsCategory::COMMANDS>;

using OutMultiSigSetting = common::Setting<
    "outmultisig=VALUE:REQUIRED:PUBKEYS:PUBKEY1:PUBKEY2:....[:FLAGS]", common::Unset, common::SettingOptions{.legacy = true},
    "Add Pay To n-of-m Multi-sig output to TX. n = REQUIRED, m = PUBKEYS. "
        "Optionally add the \"W\" flag to produce a pay-to-witness-script-hash output. "
        "Optionally add the \"S\" flag to wrap the output in a pay-to-script-hash.">
    ::Category<OptionsCategory::COMMANDS>;

using OutPubKeySetting = common::Setting<
    "outpubkey=VALUE:PUBKEY[:FLAGS]", common::Unset, common::SettingOptions{.legacy = true},
    "Add pay-to-pubkey output to TX. "
        "Optionally add the \"W\" flag to produce a pay-to-witness-pubkey-hash output. "
        "Optionally add the \"S\" flag to wrap the output in a pay-to-script-hash.">
    ::Category<OptionsCategory::COMMANDS>;

#endif // BITCOIN_BITCOIN_TX_SETTINGS_H
