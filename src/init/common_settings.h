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

using PrintToConsoleSetting = common::Setting<
    "-printtoconsole", bool, common::SettingOptions{.legacy = true},
    "Send trace/debug info to console (default: 1 when no -daemon. To disable logging to file, set -nodebuglogfile)">
    ::Category<OptionsCategory::DEBUG_TEST>;

using DebugLogFileSetting = common::Setting<
    "-debuglogfile=<file>", fs::path, common::SettingOptions{.legacy = true},
    "Specify location of debug log file (default: %s). Relative paths will be prefixed by a net-specific datadir location. Pass -nodebuglogfile to disable writing the log to a file.">
    ::DefaultFn<[] { return DEFAULT_DEBUGLOGFILE; }>;

#endif // BITCOIN_INIT_COMMON_SETTINGS_H
