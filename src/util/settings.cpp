// Copyright (c) 2019 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <util/settings.h>

#include <univalue.h>

namespace util {

SettingsSpan::SettingsSpan(const std::vector<SettingsValue>& vec) noexcept : SettingsSpan(vec.data(), vec.size()) {}
const SettingsValue* SettingsSpan::begin() const { return data; }
const SettingsValue* SettingsSpan::end() const { return data + size; }
bool SettingsSpan::empty() const { return size == 0; }

} // namespace util
