#ifndef BITCOIN_TEST_ARGSMAN_TESTS_SETTINGS_H
#define BITCOIN_TEST_ARGSMAN_TESTS_SETTINGS_H

#include <common/setting.h>

#include <string>
#include <vector>

using RegTestSetting = common::Setting<
    "-regtest", common::Unset, common::SettingOptions{.legacy = true},
    "regtest">;

using TestNetSetting = common::Setting<
    "-testnet", common::Unset, common::SettingOptions{.legacy = true},
    "testnet">;

using HSetting = common::Setting<
    "-h", std::vector<std::string>, common::SettingOptions{.legacy = true}>;

using HSettingStr = common::Setting<
    "-h", std::string, common::SettingOptions{.legacy = true}>;

using HSettingBool = common::Setting<
    "-h", bool, common::SettingOptions{.legacy = true}>;

#endif // BITCOIN_TEST_ARGSMAN_TESTS_SETTINGS_H
