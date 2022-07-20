// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.
#ifndef BITCOIN_NODE_DB_ARGS_H
#define BITCOIN_NODE_DB_ARGS_H

class ArgsManager;
struct DBWrapperOptions;

namespace node {
// Override current options with args values, if any were specified.
// Counterpart to \ref wallet::ReadDatabaseArgs
void ReadDatabaseArgs(const ArgsManager& args, DBWrapperOptions& options);
} // namespace node

#endif // BITCOIN_NODE_DB_ARGS_H
