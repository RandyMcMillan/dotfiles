#include <interfaces/init.h>
#include <util/memory.h>

namespace interfaces {

std::unique_ptr<LocalInit> MakeInit(int argc, char* argv[], InitInterfaces*)
{
    return MakeUnique<LocalInit>(nullptr, nullptr);
}

} // namespace interfaces
