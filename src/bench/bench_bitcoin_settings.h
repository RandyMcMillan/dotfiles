// Copyright (c) 2024 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_BENCH_BENCH_BITCOIN_SETTINGS_H
#define BITCOIN_BENCH_BENCH_BITCOIN_SETTINGS_H

#include <common/setting.h>

#include <cstdint>
#include <string>
#include <vector>

static const char* DEFAULT_BENCH_FILTER = ".*";
static constexpr int64_t DEFAULT_MIN_TIME_MS{10};
/** Priority level default value, run "all" priority levels */
static constexpr auto DEFAULT_PRIORITY{"all"};

using AsymptoteSetting = common::Setting<
    "-asymptote=<n1,n2,n3,...>", std::string, common::SettingOptions{.legacy = true},
    "Test asymptotic growth of the runtime of an algorithm, if supported by the benchmark">;

using FilterSetting = common::Setting<
    "-filter=<regex>", std::string, common::SettingOptions{.legacy = true},
    "Regular expression filter to select benchmark by name (default: %s)">
    ::DefaultFn<[] { return DEFAULT_BENCH_FILTER; }>;

#endif // BITCOIN_BENCH_BENCH_BITCOIN_SETTINGS_H
