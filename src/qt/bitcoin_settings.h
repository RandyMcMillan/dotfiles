#ifndef BITCOIN_QT_BITCOIN_SETTINGS_H
#define BITCOIN_QT_BITCOIN_SETTINGS_H

#include <common/setting.h>
#include <qt/intro.h>

#include <string>
#include <vector>

using ChooseDataDirSetting = common::Setting<
    "-choosedatadir", bool, common::SettingOptions{.legacy = true},
    "Choose data directory on startup (default: %u)">
    ::Default<DEFAULT_CHOOSE_DATADIR>
    ::Category<OptionsCategory::GUI>;

using LangSetting = common::Setting<
    "-lang=<lang>", std::string, common::SettingOptions{.legacy = true},
    "Set language, for example \"de_DE\" (default: system locale)">
    ::Category<OptionsCategory::GUI>;

using MinSetting = common::Setting<
    "-min", bool, common::SettingOptions{.legacy = true},
    "Start minimized">
    ::Category<OptionsCategory::GUI>;

#endif // BITCOIN_QT_BITCOIN_SETTINGS_H
