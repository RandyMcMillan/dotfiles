// Copyright (c) 2019 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_UTIL_SETTINGS_H
#define BITCOIN_UTIL_SETTINGS_H

#include <map>
#include <string>
#include <vector>

class UniValue;

namespace util {

//! Settings value type (string/integer/boolean/null variant).
//!
//! @note UniValue is used here for convenience and because it can be easily
//!       serialized in a readable format. But any other variant type that can
//!       be assigned strings, int64_t, and bool values and has get_str(),
//!       get_int64(), get_bool(), isNum(), isBool(), isFalse(), isTrue() and
//!       isNull() methods can be substituted if there's a need to move away
//!       from UniValue. (An implementation with boost::variant was posted at
//!       https://github.com/bitcoin/bitcoin/pull/15934/files#r337691812)
using SettingsValue = UniValue;

//! Stored bitcoin settings. This struct combines settings from the command line
//! and a read-only configuration file.
struct Settings {
    //! Map of setting name to list of command line values.
    std::map<std::string, std::vector<SettingsValue>> command_line_options;
    //! Map of config section name and setting name to list of config file values.
    std::map<std::string, std::map<std::string, std::vector<SettingsValue>>> ro_config;
};

//! Map lookup helper.
template <typename Map, typename Key>
auto FindKey(Map&& map, Key&& key) -> decltype(&map.at(key))
{
    auto it = map.find(key);
    return it == map.end() ? nullptr : &it->second;
}

//! Accessor for list of settings.
struct SettingsSpan {
    explicit SettingsSpan() = default;
    explicit SettingsSpan(const SettingsValue& value) noexcept : SettingsSpan(&value, 1) {}
    explicit SettingsSpan(const SettingsValue* data, size_t size) noexcept : data(data), size(size) {}
    explicit SettingsSpan(const std::vector<SettingsValue>& vec) noexcept;
    const SettingsValue* begin() const;
    const SettingsValue* end() const;
    bool empty() const;

    const SettingsValue* data = nullptr;
    size_t size = 0;
};

} // namespace util

#endif // BITCOIN_UTIL_SETTINGS_H
