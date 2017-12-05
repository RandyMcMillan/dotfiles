#include <interfaces/capnp/init.capnp.proxy-types.h>

namespace mp {

std::unique_ptr<interfaces::Handler>
ProxyServerMethodTraits<interfaces::capnp::messages::Chain::HandleNotificationsParams>::invoke(Context& context)
{
    auto params = context.call_context.getParams();
    auto notifications = MakeUnique<ProxyClient<interfaces::capnp::messages::ChainNotifications>>(
        params.getNotifications(), &context.proxy_server.m_connection, /* destroy_connection= */ false);
    auto handler = context.proxy_server.m_impl->handleNotifications(*notifications);
    handler->addCloseHook(MakeUnique<interfaces::Deleter<decltype(notifications)>>(std::move(notifications)));
    return handler;
}

void ProxyServerMethodTraits<interfaces::capnp::messages::Chain::RequestMempoolTransactionsParams>::invoke(
    Context& context)
{
    auto params = context.call_context.getParams();
    auto notifications = MakeUnique<ProxyClient<interfaces::capnp::messages::ChainNotifications>>(
        params.getNotifications(), &context.proxy_server.m_connection, /* destroy_connection= */ false);
    context.proxy_server.m_impl->requestMempoolTransactions(*notifications);
}

std::unique_ptr<interfaces::Handler>
ProxyServerMethodTraits<interfaces::capnp::messages::Chain::HandleRpcParams>::invoke(Context& context)
{
    auto params = context.call_context.getParams();
    auto command = params.getCommand();

    CRPCCommand::Actor actor;
    ReadFieldUpdate(TypeList<decltype(actor)>(), context, Make<ValueField>(command.getActor()), actor);
    std::vector<std::string> args;
    ReadFieldUpdate(TypeList<decltype(args)>(), context, Make<ValueField>(command.getArgNames()), args);

    auto rpc_command = MakeUnique<CRPCCommand>(
        command.getCategory(), command.getName(), std::move(actor), std::move(args), command.getUniqueId());
    auto handler = context.proxy_server.m_impl->handleRpc(*rpc_command);
    handler->addCloseHook(MakeUnique<interfaces::Deleter<decltype(rpc_command)>>(std::move(rpc_command)));
    return handler;
}

ProxyServerCustom<interfaces::capnp::messages::ChainClient, interfaces::ChainClient>::ProxyServerCustom(
    interfaces::ChainClient* impl,
    bool owned,
    Connection& connection)
    : ProxyServerBase(impl, owned, connection)
{
}

void ProxyServerCustom<interfaces::capnp::messages::ChainClient, interfaces::ChainClient>::invokeDestroy()
{
    if (m_scheduler) {
        m_scheduler->stop();
        m_result.get();
        m_scheduler.reset();
    }
    ProxyServerBase::invokeDestroy();
}

void ProxyServerMethodTraits<interfaces::capnp::messages::ChainClient::StartParams>::invoke(Context& context)
{
    if (!context.proxy_server.m_scheduler) {
        context.proxy_server.m_scheduler = MakeUnique<CScheduler>();
        CScheduler* scheduler = context.proxy_server.m_scheduler.get();
        context.proxy_server.m_result = std::async([scheduler]() {
            util::ThreadRename("schedqueue");
            scheduler->serviceQueue();
        });
    }
    context.proxy_server.m_impl->start(*context.proxy_server.m_scheduler);
}

void ProxyClientCustom<interfaces::capnp::messages::ChainNotifications,
    interfaces::Chain::Notifications>::TransactionAddedToMempool(const CTransactionRef& tx)
{
    self().transactionAddedToMempool(tx);
}
void ProxyClientCustom<interfaces::capnp::messages::ChainNotifications,
    interfaces::Chain::Notifications>::TransactionRemovedFromMempool(const CTransactionRef& ptx)
{
    self().transactionRemovedFromMempool(ptx);
}
void ProxyClientCustom<interfaces::capnp::messages::ChainNotifications,
    interfaces::Chain::Notifications>::BlockConnected(const CBlock& block,
    const std::vector<CTransactionRef>& tx_conflicted)
{
    self().blockConnected(block, tx_conflicted);
}
void ProxyClientCustom<interfaces::capnp::messages::ChainNotifications,
    interfaces::Chain::Notifications>::BlockDisconnected(const CBlock& block)
{
    self().blockDisconnected(block);
}
void ProxyClientCustom<interfaces::capnp::messages::ChainNotifications,
    interfaces::Chain::Notifications>::UpdatedBlockTip()
{
    self().updatedBlockTip();
}
void ProxyClientCustom<interfaces::capnp::messages::ChainNotifications,
    interfaces::Chain::Notifications>::ChainStateFlushed(const CBlockLocator& locator)
{
    self().chainStateFlushed(locator);
}

void CustomBuildMessage(InvokeContext& invoke_context,
    CValidationState const& state,
    interfaces::capnp::messages::ValidationState::Builder&& builder)
{
    int dos = 0;
    if (state.IsValid()) {
        builder.setValid(true);
        assert(!state.IsInvalid());
        assert(!state.IsError());
    } else if (state.IsError()) {
        builder.setError(true);
        assert(!state.IsInvalid());
    } else {
        assert(state.IsInvalid());
    }
    builder.setReason(int32_t(state.GetReason()));
    builder.setRejectCode(state.GetRejectCode());
    const std::string& reject_reason = state.GetRejectReason();
    if (!reject_reason.empty()) {
        builder.setRejectReason(reject_reason);
    }
    const std::string& debug_message = state.GetDebugMessage();
    if (!debug_message.empty()) {
        builder.setDebugMessage(debug_message);
    }
}

void CustomReadMessage(InvokeContext& invoke_context,
    interfaces::capnp::messages::ValidationState::Reader const& reader,
    CValidationState& state)
{
    if (reader.getValid()) {
        assert(!reader.getError());
        assert(!reader.getReason());
        assert(!reader.getRejectCode());
        assert(!reader.hasRejectReason());
        assert(!reader.hasDebugMessage());
    } else {
        state.Invalid(ValidationInvalidReason(reader.getReason()), false /* ret */, reader.getRejectCode(),
            reader.getRejectReason(), reader.getDebugMessage());
        if (reader.getError()) {
            state.Error({} /* reject reason */);
        }
    }
}

bool CustomHasValue(InvokeContext& invoke_context, const Coin& coin)
{
    // Spent coins cannot be serialized due to an assert in Coin::Serialize.
    return !coin.IsSpent();
}

} // namespace mp
