// Copyright (c) 2024 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_BITCOIN_CLI_SETTINGS_H
#define BITCOIN_BITCOIN_CLI_SETTINGS_H

#include <common/args.h>
#include <common/setting.h>
#include <rpc/mining.h>

#include <cstdint>
#include <string>
#include <vector>

static const char DEFAULT_RPCCONNECT[] = "127.0.0.1";
static const int DEFAULT_HTTP_CLIENT_TIMEOUT=900;
static constexpr int DEFAULT_WAIT_CLIENT_TIMEOUT = 0;
static const bool DEFAULT_NAMED=false;
static constexpr uint8_t NETINFO_MAX_LEVEL{4};

/** Default number of blocks to generate for RPC generatetoaddress. */
static constexpr auto DEFAULT_NBLOCKS = "1";

/** Default -color setting. */
static constexpr auto DEFAULT_COLOR_SETTING{"auto"};

using VersionSetting = common::Setting<
    "-version", bool, common::SettingOptions{.legacy = true},
    "Print version and exit">;

using ConfSetting = common::Setting<
    "-conf=<file>", common::Unset, common::SettingOptions{.legacy = true},
    "Specify configuration file. Relative paths will be prefixed by datadir location. (default: %s)">
    ::HelpFn<[](const auto& fmt) { return strprintf(fmt, BITCOIN_CONF_FILENAME); }>;

using DataDirSetting = common::Setting<
    "-datadir=<dir>", std::string, common::SettingOptions{.legacy = true, .disallow_negation = true},
    "Specify data directory">;

using GenerateSetting = common::Setting<
    "-generate", bool, common::SettingOptions{.legacy = true},
    "Generate blocks, equivalent to RPC getnewaddress followed by RPC generatetoaddress. Optional positional integer "
                             "arguments are number of blocks to generate (default: %s) and maximum iterations to try (default: %s), equivalent to "
                             "RPC generatetoaddress nblocks and maxtries arguments. Example: bitcoin-cli -generate 4 1000">
    ::HelpFn<[](const auto& fmt) { return strprintf(fmt, DEFAULT_NBLOCKS, DEFAULT_MAX_TRIES); }>
    ::Category<OptionsCategory::CLI_COMMANDS>;

using AddrInfoSetting = common::Setting<
    "-addrinfo", bool, common::SettingOptions{.legacy = true},
    "Get the number of addresses known to the node, per network and total, after filtering for quality and recency. The total number of addresses known to the node may be higher.">
    ::Category<OptionsCategory::CLI_COMMANDS>;

using GetInfoSetting = common::Setting<
    "-getinfo", bool, common::SettingOptions{.legacy = true},
    "Get general information from the remote server. Note that unlike server-side RPC calls, the output of -getinfo is the result of multiple non-atomic requests. Some entries in the output may represent results from different states (e.g. wallet balance may be as of a different block from the chain state reported)">
    ::Category<OptionsCategory::CLI_COMMANDS>;

using NetInfoSetting = common::Setting<
    "-netinfo", bool, common::SettingOptions{.legacy = true},
    "Get network peer connection information from the remote server. An optional argument from 0 to %d can be passed for different peers listings (default: 0). If a non-zero value is passed, an additional \"outonly\" (or \"o\") argument can be passed to see outbound peers only. Pass \"help\" (or \"h\") for detailed help documentation.">
    ::HelpArgs<NETINFO_MAX_LEVEL>
    ::Category<OptionsCategory::CLI_COMMANDS>;

#endif // BITCOIN_BITCOIN_CLI_SETTINGS_H
