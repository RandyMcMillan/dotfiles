#include "ipc/util.h"

#include <kj/debug.h>

#include <future>

#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

namespace ipc {
namespace util {

void LoggingErrorHandler::taskFailed(kj::Exception&& exception)
{
    KJ_LOG(ERROR, "Uncaught exception in daemonized task.", exception);
}

EventLoop::EventLoop(std::thread&& thread) : ioContext(kj::setupAsyncIo()), thread(std::move(thread))
{
    int fds[2];
    KJ_SYSCALL(socketpair(AF_UNIX, SOCK_STREAM, 0, fds));
    waitFd = fds[0];
    postFd = fds[1];
}

EventLoop::~EventLoop()
{
    KJ_ASSERT(waitFd == -1);
    KJ_ASSERT(postFd == -1);
    if (thread.joinable()) {
        thread.join();
    }
}
void EventLoop::loop()
{
    kj::Own<kj::AsyncIoStream> waitStream{
        ioContext.lowLevelProvider->wrapSocketFd(waitFd, kj::LowLevelAsyncIoProvider::TAKE_OWNERSHIP)};
    char buffer;
    for (;;) {
        size_t bytes;
        waitStream->read(&buffer, 0, 1).then([&](size_t s) { bytes = s; }).wait(ioContext.waitScope);
        if (bytes == 0) {
            break;
        }
        postFn();
        taskSet.add(waitStream->write(&buffer, 1));
    }
    KJ_SYSCALL(close(waitFd));
    waitFd = -1;
}

void EventLoop::post(std::function<void()> fn)
{
    std::lock_guard<std::mutex> lock(postMutex);
    postFn = std::move(fn);
    char signal = '\0';
    KJ_SYSCALL(write(postFd, &signal, 1));
    KJ_SYSCALL(read(postFd, &signal, 1));
    postFn = nullptr;
}

void EventLoop::shutdown()
{
    KJ_SYSCALL(close(postFd));
    postFd = -1;
}

} // namespace util
} // namespace ipc
