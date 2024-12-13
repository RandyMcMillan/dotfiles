#ifndef BITCOIN_INIT_SETTINGS_H
#define BITCOIN_INIT_SETTINGS_H

#include <addrman.h>
#include <chainparamsbase.h>
#include <common/args.h>
#include <common/setting.h>
#include <init.h>

#include <string>
#include <vector>

using CheckAddrManSetting = common::Setting<
    "-checkaddrman=<n>", int64_t, common::SettingOptions{.legacy = true, .debug_only = true},
    "Run addrman consistency checks every <n> operations. Use 0 to disable. (default: %u)">
    ::HelpArgs<DEFAULT_ADDRMAN_CONSISTENCY_CHECKS>
    ::Category<OptionsCategory::DEBUG_TEST>;

using VersionSetting = common::Setting<
    "-version", bool, common::SettingOptions{.legacy = true},
    "Print version and exit">;

using ConfSetting = common::Setting<
    "-conf=<file>", std::string, common::SettingOptions{.legacy = true},
    "Specify path to read-only configuration file. Relative paths will be prefixed by datadir location (only useable from command line, not configuration file) (default: %s)">
    ::HelpFn<[](const auto& fmt) { return strprintf(fmt, BITCOIN_CONF_FILENAME); }>;

using ConfSettingPath = common::Setting<
    "-conf=<file>", fs::path, common::SettingOptions{.legacy = true}>
    ::DefaultFn<[] { return BITCOIN_CONF_FILENAME; }>;

using DataDirSetting = common::Setting<
    "-datadir=<dir>", std::string, common::SettingOptions{.legacy = true, .disallow_negation = true},
    "Specify data directory">;

using DataDirSettingPath = common::Setting<
    "-datadir=<dir>", fs::path, common::SettingOptions{.legacy = true, .disallow_negation = true}>;

using RpcCookieFileSetting = common::Setting<
    "-rpccookiefile=<loc>", fs::path, common::SettingOptions{.legacy = true},
    "Location of the auth cookie. Relative paths will be prefixed by a net-specific datadir location. (default: data dir)">
    ::Category<OptionsCategory::RPC>;

using RpcPasswordSetting = common::Setting<
    "-rpcpassword=<pw>", std::string, common::SettingOptions{.legacy = true, .sensitive = true},
    "Password for JSON-RPC connections">
    ::Category<OptionsCategory::RPC>;

using RpcPortSetting = common::Setting<
    "-rpcport=<port>", int64_t, common::SettingOptions{.legacy = true, .network_only = true},
    "Listen for JSON-RPC connections on <port> (default: %u, testnet3: %u, testnet4: %u, signet: %u, regtest: %u)">
    ::DefaultFn<[] { return BaseParams().RPCPort(); }>
    ::HelpFn<[](const auto& fmt, const auto& defaultBaseParams, const auto& testnetBaseParams, const auto& testnet4BaseParams, const auto& signetBaseParams, const auto& regtestBaseParams) { return strprintf(fmt, defaultBaseParams->RPCPort(), testnetBaseParams->RPCPort(), testnet4BaseParams->RPCPort(), signetBaseParams->RPCPort(), regtestBaseParams->RPCPort()); }>
    ::Category<OptionsCategory::RPC>;

using RpcUserSetting = common::Setting<
    "-rpcuser=<user>", std::string, common::SettingOptions{.legacy = true, .sensitive = true},
    "Username for JSON-RPC connections">
    ::Category<OptionsCategory::RPC>;

using DaemonSetting = common::Setting<
    "-daemon", bool, common::SettingOptions{.legacy = true},
    "Run in the background as a daemon and accept commands (default: %d)">
    ::HelpArgs<DEFAULT_DAEMON>;

using DaemonWaitSetting = common::Setting<
    "-daemonwait", bool, common::SettingOptions{.legacy = true},
    "Wait for initialization to be finished before exiting. This implies -daemon (default: %d)">
    ::Default<DEFAULT_DAEMONWAIT>;

using FastPruneSetting = common::Setting<
    "-fastprune", std::optional<bool>, common::SettingOptions{.legacy = true, .debug_only = true},
    "Use smaller block files and lower minimum prune height for testing purposes">
    ::Category<OptionsCategory::DEBUG_TEST>;

using BlocksDirSetting = common::Setting<
    "-blocksdir=<dir>", std::string, common::SettingOptions{.legacy = true},
    "Specify directory to hold blocks subdirectory for *.dat files (default: <datadir>)">;

using BlocksDirSettingPath = common::Setting<
    "-blocksdir=<dir>", fs::path, common::SettingOptions{.legacy = true}>;

using SettingsSetting = common::Setting<
    "-settings=<file>", fs::path, common::SettingOptions{.legacy = true},
    "Specify path to dynamic settings data file. Can be disabled with -nosettings. File is written at runtime and not meant to be edited by users (use %s instead for custom settings). Relative paths will be prefixed by datadir location. (default: %s)">
    ::DefaultFn<[] { return BITCOIN_SETTINGS_FILENAME; }>
    ::HelpFn<[](const auto& fmt) { return strprintf(fmt, BITCOIN_CONF_FILENAME, BITCOIN_SETTINGS_FILENAME); }>;

using HelpDebugSetting = common::Setting<
    "-help-debug", bool, common::SettingOptions{.legacy = true},
    "Print help message with debugging options and exit">
    ::Category<OptionsCategory::DEBUG_TEST>;

#endif // BITCOIN_INIT_SETTINGS_H
