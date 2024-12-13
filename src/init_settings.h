#ifndef BITCOIN_INIT_SETTINGS_H
#define BITCOIN_INIT_SETTINGS_H

#include <addrman.h>
#include <chainparamsbase.h>
#include <common/args.h>
#include <common/setting.h>
#include <httpserver.h>
#include <init.h>
#include <util/string.h>

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

using TestSetting = common::Setting<
    "-test=<option>", std::vector<std::string>, common::SettingOptions{.legacy = true, .debug_only = true},
    "Pass a test-only option. Options include : %s.">
    ::HelpFn<[](const auto& fmt) { return strprintf(fmt, util::Join(TEST_OPTIONS_DOC, ", ")); }>
    ::Category<OptionsCategory::DEBUG_TEST>;

using AllowIgnoredConfSetting = common::Setting<
    "-allowignoredconf", bool, common::SettingOptions{.legacy = true},
    "For backwards compatibility, treat an unused %s file in the datadir as a warning, not an error.">
    ::HelpFn<[](const auto& fmt) { return strprintf(fmt, BITCOIN_CONF_FILENAME); }>;

using RpcCookiePermsSetting = common::Setting<
    "-rpccookieperms=<readable-by>", std::optional<std::string>, common::SettingOptions{.legacy = true},
    "Set permissions on the RPC auth cookie file so that it is readable by [owner|group|all] (default: owner [via umask 0077])">
    ::Category<OptionsCategory::RPC>;

using RpcAuthSetting = common::Setting<
    "-rpcauth=<userpw>", std::vector<std::string>, common::SettingOptions{.legacy = true, .sensitive = true},
    "Username and HMAC-SHA-256 hashed password for JSON-RPC connections. The field <userpw> comes in the format: <USERNAME>:<SALT>$<HASH>. A canonical python script is included in share/rpcauth. The client then connects normally using the rpcuser=<USERNAME>/rpcpassword=<PASSWORD> pair of arguments. This option can be specified multiple times">
    ::Category<OptionsCategory::RPC>;

using RpcWhitelistDefaultSetting = common::Setting<
    "-rpcwhitelistdefault", bool, common::SettingOptions{.legacy = true},
    "Sets default behavior for rpc whitelisting. Unless rpcwhitelistdefault is set to 0, if any -rpcwhitelist is set, the rpc server acts as if all rpc users are subject to empty-unless-otherwise-specified whitelists. If rpcwhitelistdefault is set to 1 and no -rpcwhitelist is set, rpc server acts as if all rpc users are subject to empty whitelists.">
    ::Category<OptionsCategory::RPC>;

using RpcWhitelistSetting = common::Setting<
    "-rpcwhitelist=<whitelist>", std::vector<std::string>, common::SettingOptions{.legacy = true},
    "Set a whitelist to filter incoming RPC calls for a specific user. The field <whitelist> comes in the format: <USERNAME>:<rpc 1>,<rpc 2>,...,<rpc n>. If multiple whitelists are set for a given user, they are set-intersected. See -rpcwhitelistdefault documentation for information on default whitelist behavior.">
    ::Category<OptionsCategory::RPC>;

using RpcAllowIpSetting = common::Setting<
    "-rpcallowip=<ip>", std::vector<std::string>, common::SettingOptions{.legacy = true},
    "Allow JSON-RPC connections from specified source. Valid values for <ip> are a single IP (e.g. 1.2.3.4), a network/netmask (e.g. 1.2.3.4/255.255.255.0), a network/CIDR (e.g. 1.2.3.4/24), all ipv4 (0.0.0.0/0), or all ipv6 (::/0). This option can be specified multiple times">
    ::Category<OptionsCategory::RPC>;

using RpcBindSetting = common::Setting<
    "-rpcbind=<addr>[:port]", std::vector<std::string>, common::SettingOptions{.legacy = true, .network_only = true},
    "Bind to given address to listen for JSON-RPC connections. Do not expose the RPC server to untrusted networks such as the public internet! This option is ignored unless -rpcallowip is also passed. Port is optional and overrides -rpcport. Use [host]:port notation for IPv6. This option can be specified multiple times (default: 127.0.0.1 and ::1 i.e., localhost)">
    ::Category<OptionsCategory::RPC>;

using RpcServerTimeoutSetting = common::Setting<
    "-rpcservertimeout=<n>", int64_t, common::SettingOptions{.legacy = true, .debug_only = true},
    "Timeout during HTTP requests (default: %d)">
    ::Default<DEFAULT_HTTP_SERVER_TIMEOUT>
    ::Category<OptionsCategory::RPC>;

using RpcWorkQueueSetting = common::Setting<
    "-rpcworkqueue=<n>", int64_t, common::SettingOptions{.legacy = true, .debug_only = true},
    "Set the depth of the work queue to service RPC calls (default: %d)">
    ::Default<DEFAULT_HTTP_WORKQUEUE>
    ::Category<OptionsCategory::RPC>;

using RpcThreadsSetting = common::Setting<
    "-rpcthreads=<n>", int64_t, common::SettingOptions{.legacy = true},
    "Set the number of threads to service RPC calls (default: %d)">
    ::Default<DEFAULT_HTTP_THREADS>
    ::Category<OptionsCategory::RPC>;

using AlertNotifySetting = common::Setting<
    "-alertnotify=<cmd>", std::string, common::SettingOptions{.legacy = true},
    "Execute command when an alert is raised (%s in cmd is replaced by message)">;

#endif // BITCOIN_INIT_SETTINGS_H
