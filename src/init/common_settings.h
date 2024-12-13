#ifndef BITCOIN_INIT_COMMON_SETTINGS_H
#define BITCOIN_INIT_COMMON_SETTINGS_H

#include <common/setting.h>
#include <logging.h>

#include <string>
#include <vector>

using DebugSetting = common::Setting<
    "-debug=<category>", std::vector<std::string>, common::SettingOptions{.legacy = true},
    "Output debug and trace logging (default: -nodebug, supplying <category> is optional). "
        "If <category> is not supplied or if <category> is 1 or \"all\", output all debug logging. If <category> is 0 or \"none\", any other categories are ignored. Other valid values for <category> are: %s. This option can be specified multiple times to output multiple categories.">
    ::HelpFn<[](const auto& fmt) { return strprintf(fmt, LogInstance().LogCategoriesString()); }>
    ::Category<OptionsCategory::DEBUG_TEST>;

#endif // BITCOIN_INIT_COMMON_SETTINGS_H
