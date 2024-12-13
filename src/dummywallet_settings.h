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

using ChangeTypeSettingHidden = common::Setting<
    "-changetype", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

using ConsolidateFeeRateSettingHidden = common::Setting<
    "-consolidatefeerate=<amt>", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

using DisableWalletSettingHidden = common::Setting<
    "-disablewallet", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

using DiscardFeeSettingHidden = common::Setting<
    "-discardfee=<amt>", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

using FallbackFeeSettingHidden = common::Setting<
    "-fallbackfee=<amt>", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

using KeyPoolSettingHidden = common::Setting<
    "-keypool=<n>", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

using MaxApsFeeSettingHidden = common::Setting<
    "-maxapsfee=<n>", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

using MaxTxFeeSettingHidden = common::Setting<
    "-maxtxfee=<amt>", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

using MinTxFeeSettingHidden = common::Setting<
    "-mintxfee=<amt>", common::Unset, common::SettingOptions{.legacy = true}>
    ::Category<OptionsCategory::HIDDEN>;

#endif // BITCOIN_DUMMYWALLET_SETTINGS_H
