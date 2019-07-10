#ifndef BITCOIN_INTERFACES_CONFIG_H
#define BITCOIN_INTERFACES_CONFIG_H

namespace interfaces {

// Build options for current executable.
struct Config
{
    const char* exe_name;
    const char* log_suffix;
};

extern const Config g_config;

} // namespace interfaces

#endif // BITCOIN_INTERFACES_CONFIG_H
