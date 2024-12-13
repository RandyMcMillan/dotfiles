#ifndef BITCOIN_DUMMYWALLET_SETTINGS_H
#define BITCOIN_DUMMYWALLET_SETTINGS_H

#include <common/setting.h>

#include <string>
#include <vector>

using WalletSettingHidden = common::Setting<
    "-wallet=<path>", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

using AddressTypeSettingHidden = common::Setting<
    "-addresstype", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

using AvoidPartialSpendsSettingHidden = common::Setting<
    "-avoidpartialspends", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

#endif // BITCOIN_DUMMYWALLET_SETTINGS_H
