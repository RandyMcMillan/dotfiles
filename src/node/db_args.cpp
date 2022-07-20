// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <node/db_args.h>

#include <dbwrapper.h>
#include <util/system.h>

namespace node {
void ReadDatabaseArgs(const ArgsManager& args, DBWrapperOptions& options)
{
    if (auto compact = args.GetBoolArg("-forcecompactdb")) {
        options.do_compact = *compact;
    }
}
} // namespace node
