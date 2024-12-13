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

using ValueSetting = common::Setting<
    "-value", std::vector<std::string>, common::SettingOptions{.legacy = true}>;

using ValueSettingStr = common::Setting<
    "-value", std::string, common::SettingOptions{.legacy = true}>;

using ValueSettingInt = common::Setting<
    "-value", int64_t, common::SettingOptions{.legacy = true}>;

using ValueSettingBool = common::Setting<
    "-value", bool, common::SettingOptions{.legacy = true}>;

using ASetting = common::Setting<
    "-a", std::vector<std::string>, common::SettingOptions{.legacy = true}>;

using ASettingStr = common::Setting<
    "-a", std::string, common::SettingOptions{.legacy = true}>;

using ASettingBool = common::Setting<
    "-a", bool, common::SettingOptions{.legacy = true}>;

using BSetting = common::Setting<
    "-b", std::vector<std::string>, common::SettingOptions{.legacy = true}>;

using BSettingStr = common::Setting<
    "-b", std::string, common::SettingOptions{.legacy = true}>;

using BSettingBool = common::Setting<
    "-b", bool, common::SettingOptions{.legacy = true}>;

using CccSetting = common::Setting<
    "-ccc", std::vector<std::string>, common::SettingOptions{.legacy = true}>;

using CccSettingStr = common::Setting<
    "-ccc", std::string, common::SettingOptions{.legacy = true}>;

using CccSettingBool = common::Setting<
    "-ccc", bool, common::SettingOptions{.legacy = true}>;

using FSetting = common::Setting<
    "f", bool, common::SettingOptions{.legacy = true}>
    ::Default<true>
    ::HelpArgs<>;

#endif // BITCOIN_TEST_ARGSMAN_TESTS_SETTINGS_H
