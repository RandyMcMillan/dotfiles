#ifndef BITCOIN_IPC_SERIALIZE_H
#define BITCOIN_IPC_SERIALIZE_H

#include "ipc/messages.capnp.h"

#include <kj/string.h>
#include <string>

class CNodeStats;
class CNodeStateStats;

namespace ipc {
namespace serialize {

//!@{
//! Functions to serialize / deserialize bitcoin objects that don't
//! already provide their own serialization.
void BuildNodeStats(messages::NodeStats::Builder&& builder, const CNodeStats& nodeStats);
void ReadNodeStats(CNodeStats& nodeStats, const messages::NodeStats::Reader& reader);
void BuildNodeStateStats(messages::NodeStateStats::Builder&& builder, const CNodeStateStats& nodeStateStats);
void ReadNodeStateStats(CNodeStateStats& nodeStateStats, const messages::NodeStateStats::Reader& reader);
//!@}

//! Convert kj::String to std::string.
inline std::string ToString(const kj::StringPtr& str) { return {str.cStr(), str.size()}; }

} // namespace serialize
} // namespace ipc

#endif // BITCOIN_IPC_SERIALIZE_H
