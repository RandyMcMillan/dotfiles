#ifndef BITCOIN_TEST_ARGSMAN_TESTS_SETTINGS_H
#define BITCOIN_TEST_ARGSMAN_TESTS_SETTINGS_H

#include <common/setting.h>

#include <string>
#include <vector>

using RegTestSetting = common::Setting<
    "-regtest", common::Unset, common::SettingOptions{.legacy = true},
    "regtest">;

#endif // BITCOIN_TEST_ARGSMAN_TESTS_SETTINGS_H
