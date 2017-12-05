#include <interfaces/init.h>

#include <interfaces/capnp/ipc.h>
#include <interfaces/node.h>
#include <util/memory.h>

namespace interfaces {
void MakeProxy(NodeClientParam&);
namespace {
class LocalInitImpl : public LocalInit
{
public:
    LocalInitImpl(int argc, char* argv[]) : LocalInit(/* exe_name */ "bitcoin-gui", /* log_suffix= */ ".gui")
    {
        m_protocol = capnp::MakeCapnpProtocol(m_exe_name, *this);
        m_process = MakeIpcProcess(argc, argv, m_exe_name, *m_protocol);
    }
    std::unique_ptr<Node> makeNode() override
    {
        std::unique_ptr<Node> node;
        spawnProcess("bitcoin-node", [&](Init& init) -> Base& {
            node = init.makeNode();
            return *node;
        });
        return node;
    }
    void makeNodeClient(NodeClientParam& param) override { MakeProxy(param); }
};
} // namespace

std::unique_ptr<LocalInit> MakeGuiInit(int argc, char* argv[], InitInterfaces&)
{
    return MakeUnique<LocalInitImpl>(argc, argv);
}
} // namespace interfaces
