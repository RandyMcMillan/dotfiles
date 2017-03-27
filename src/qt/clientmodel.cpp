// Copyright (c) 2011-2016 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include "clientmodel.h"

#include "bantablemodel.h"
#include "guiconstants.h"
#include "guiutil.h"
#include "peertablemodel.h"

#include "chainparams.h"
#include "checkpoints.h"
#include "clientversion.h"
#include "ipc/interfaces.h"
#include "validation.h"
#include "net.h"
#include "txmempool.h"
#include "ui_interface.h"
#include "util.h"

#include <stdint.h>

#include <QDebug>
#include <QTimer>

class CBlockIndex;

static const int64_t nClientStartupTime = GetTime();
static int64_t nLastHeaderTipUpdateNotification = 0;
static int64_t nLastBlockTipUpdateNotification = 0;

ClientModel::ClientModel(OptionsModel *_optionsModel, QObject *parent) :
    QObject(parent),
    optionsModel(_optionsModel),
    peerTableModel(0),
    banTableModel(0),
    pollTimer(0)
{
    peerTableModel = new PeerTableModel(this);
    banTableModel = new BanTableModel(this);
    pollTimer = new QTimer(this);
    connect(pollTimer, SIGNAL(timeout()), this, SLOT(updateTimer()));
    pollTimer->start(MODEL_UPDATE_DELAY);

    subscribeToCoreSignals();
}

ClientModel::~ClientModel()
{
    unsubscribeFromCoreSignals();
}

int ClientModel::getNumConnections(unsigned int flags) const
{
    CConnman::NumConnections connections = CConnman::CONNECTIONS_NONE;

    if(flags == CONNECTIONS_IN)
        connections = CConnman::CONNECTIONS_IN;
    else if (flags == CONNECTIONS_OUT)
        connections = CConnman::CONNECTIONS_OUT;
    else if (flags == CONNECTIONS_ALL)
        connections = CConnman::CONNECTIONS_ALL;

    if(FIXME_IMPLEMENT_IPC_VALUE(g_connman))
         return FIXME_IMPLEMENT_IPC_VALUE(g_connman)->GetNodeCount(connections);
    return 0;
}

int ClientModel::getNumBlocks() const
{
    LOCK(FIXME_IMPLEMENT_IPC_VALUE(cs_main));
    return FIXME_IMPLEMENT_IPC_VALUE(chainActive).Height();
}

int ClientModel::getHeaderTipHeight() const
{
    LOCK(FIXME_IMPLEMENT_IPC_VALUE(cs_main));
    if (!FIXME_IMPLEMENT_IPC_VALUE(pindexBestHeader))
        return 0;
    return FIXME_IMPLEMENT_IPC_VALUE(pindexBestHeader)->nHeight;
}

int64_t ClientModel::getHeaderTipTime() const
{
    LOCK(FIXME_IMPLEMENT_IPC_VALUE(cs_main));
    if (!FIXME_IMPLEMENT_IPC_VALUE(pindexBestHeader))
        return 0;
    return FIXME_IMPLEMENT_IPC_VALUE(pindexBestHeader)->GetBlockTime();
}

quint64 ClientModel::getTotalBytesRecv() const
{
    if(!FIXME_IMPLEMENT_IPC_VALUE(g_connman))
        return 0;
    return FIXME_IMPLEMENT_IPC_VALUE(g_connman)->GetTotalBytesRecv();
}

quint64 ClientModel::getTotalBytesSent() const
{
    if(!FIXME_IMPLEMENT_IPC_VALUE(g_connman))
        return 0;
    return FIXME_IMPLEMENT_IPC_VALUE(g_connman)->GetTotalBytesSent();
}

QDateTime ClientModel::getLastBlockDate() const
{
    LOCK(FIXME_IMPLEMENT_IPC_VALUE(cs_main));

    if (FIXME_IMPLEMENT_IPC_VALUE(chainActive).Tip())
        return QDateTime::fromTime_t(FIXME_IMPLEMENT_IPC_VALUE(chainActive).Tip()->GetBlockTime());

    return QDateTime::fromTime_t(Params().GenesisBlock().GetBlockTime()); // Genesis block's time of current network
}

long ClientModel::getMempoolSize() const
{
    return FIXME_IMPLEMENT_IPC_VALUE(mempool).size();
}

size_t ClientModel::getMempoolDynamicUsage() const
{
    return FIXME_IMPLEMENT_IPC_VALUE(mempool).DynamicMemoryUsage();
}

double ClientModel::getVerificationProgress(const CBlockIndex *tipIn) const
{
    CBlockIndex *tip = const_cast<CBlockIndex *>(tipIn);
    if (!tip)
    {
        LOCK(FIXME_IMPLEMENT_IPC_VALUE(cs_main));
        tip = FIXME_IMPLEMENT_IPC_VALUE(chainActive).Tip();
    }
    return GuessVerificationProgress(Params().TxData(), tip);
}

void ClientModel::updateTimer()
{
    // no locking required at this point
    // the following calls will acquire the required lock
    Q_EMIT mempoolSizeChanged(getMempoolSize(), getMempoolDynamicUsage());
    Q_EMIT bytesChanged(getTotalBytesRecv(), getTotalBytesSent());
}

void ClientModel::updateNumConnections(int numConnections)
{
    Q_EMIT numConnectionsChanged(numConnections);
}

void ClientModel::updateNetworkActive(bool networkActive)
{
    Q_EMIT networkActiveChanged(networkActive);
}

void ClientModel::updateAlert()
{
    Q_EMIT alertsChanged(getStatusBarWarnings());
}

bool ClientModel::inInitialBlockDownload() const
{
    return FIXME_IMPLEMENT_IPC_VALUE(IsInitialBlockDownload());
}

enum BlockSource ClientModel::getBlockSource() const
{
    if (FIXME_IMPLEMENT_IPC_VALUE(fReindex))
        return BLOCK_SOURCE_REINDEX;
    else if (FIXME_IMPLEMENT_IPC_VALUE(fImporting))
        return BLOCK_SOURCE_DISK;
    else if (getNumConnections() > 0)
        return BLOCK_SOURCE_NETWORK;

    return BLOCK_SOURCE_NONE;
}

void ClientModel::setNetworkActive(bool active)
{
    if (FIXME_IMPLEMENT_IPC_VALUE(g_connman)) {
        FIXME_IMPLEMENT_IPC(g_connman->SetNetworkActive(active));
    }
}

bool ClientModel::getNetworkActive() const
{
    if (FIXME_IMPLEMENT_IPC_VALUE(g_connman)) {
        return FIXME_IMPLEMENT_IPC_VALUE(g_connman)->GetNetworkActive();
    }
    return false;
}

QString ClientModel::getStatusBarWarnings() const
{
    return QString::fromStdString(FIXME_IMPLEMENT_IPC_VALUE(GetWarnings("gui")));
}

OptionsModel *ClientModel::getOptionsModel()
{
    return optionsModel;
}

PeerTableModel *ClientModel::getPeerTableModel()
{
    return peerTableModel;
}

BanTableModel *ClientModel::getBanTableModel()
{
    return banTableModel;
}

QString ClientModel::formatFullVersion() const
{
    return QString::fromStdString(FormatFullVersion());
}

QString ClientModel::formatSubVersion() const
{
    return QString::fromStdString(strSubVersion);
}

bool ClientModel::isReleaseVersion() const
{
    return CLIENT_VERSION_IS_RELEASE;
}

QString ClientModel::formatClientStartupTime() const
{
    return QDateTime::fromTime_t(nClientStartupTime).toString();
}

QString ClientModel::dataDir() const
{
    return GUIUtil::boostPathToQString(GetDataDir());
}

void ClientModel::updateBanlist()
{
    banTableModel->refresh();
}

// Handlers for core signals
static void ShowProgress(ClientModel *clientmodel, const std::string &title, int nProgress)
{
    // emits signal "showProgress"
    QMetaObject::invokeMethod(clientmodel, "showProgress", Qt::QueuedConnection,
                              Q_ARG(QString, QString::fromStdString(title)),
                              Q_ARG(int, nProgress));
}

static void NotifyNumConnectionsChanged(ClientModel *clientmodel, int newNumConnections)
{
    // Too noisy: qDebug() << "NotifyNumConnectionsChanged: " + QString::number(newNumConnections);
    QMetaObject::invokeMethod(clientmodel, "updateNumConnections", Qt::QueuedConnection,
                              Q_ARG(int, newNumConnections));
}

static void NotifyNetworkActiveChanged(ClientModel *clientmodel, bool networkActive)
{
    QMetaObject::invokeMethod(clientmodel, "updateNetworkActive", Qt::QueuedConnection,
                              Q_ARG(bool, networkActive));
}

static void NotifyAlertChanged(ClientModel *clientmodel)
{
    qDebug() << "NotifyAlertChanged";
    QMetaObject::invokeMethod(clientmodel, "updateAlert", Qt::QueuedConnection);
}

static void BannedListChanged(ClientModel *clientmodel)
{
    qDebug() << QString("%1: Requesting update for peer banlist").arg(__func__);
    QMetaObject::invokeMethod(clientmodel, "updateBanlist", Qt::QueuedConnection);
}

static void BlockTipChanged(ClientModel *clientmodel, bool initialSync, const CBlockIndex *pIndex, bool fHeader)
{
    // lock free async UI updates in case we have a new block tip
    // during initial sync, only update the UI if the last update
    // was > 250ms (MODEL_UPDATE_DELAY) ago
    int64_t now = 0;
    if (initialSync)
        now = GetTimeMillis();

    int64_t& nLastUpdateNotification = fHeader ? nLastHeaderTipUpdateNotification : nLastBlockTipUpdateNotification;

    // if we are in-sync, update the UI regardless of last update time
    if (!initialSync || now - nLastUpdateNotification > MODEL_UPDATE_DELAY) {
        //pass a async signal to the UI thread
        QMetaObject::invokeMethod(clientmodel, "numBlocksChanged", Qt::QueuedConnection,
                                  Q_ARG(int, pIndex->nHeight),
                                  Q_ARG(QDateTime, QDateTime::fromTime_t(pIndex->GetBlockTime())),
                                  Q_ARG(double, clientmodel->getVerificationProgress(pIndex)),
                                  Q_ARG(bool, fHeader));
        nLastUpdateNotification = now;
    }
}

void ClientModel::subscribeToCoreSignals()
{
    // Connect signals to client
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).ShowProgress.connect(boost::bind(ShowProgress, this, _1, _2));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).NotifyNumConnectionsChanged.connect(boost::bind(NotifyNumConnectionsChanged, this, _1));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).NotifyNetworkActiveChanged.connect(boost::bind(NotifyNetworkActiveChanged, this, _1));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).NotifyAlertChanged.connect(boost::bind(NotifyAlertChanged, this));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).BannedListChanged.connect(boost::bind(BannedListChanged, this));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).NotifyBlockTip.connect(boost::bind(BlockTipChanged, this, _1, _2, false));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).NotifyHeaderTip.connect(boost::bind(BlockTipChanged, this, _1, _2, true));
}

void ClientModel::unsubscribeFromCoreSignals()
{
    // Disconnect signals from client
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).ShowProgress.disconnect(boost::bind(ShowProgress, this, _1, _2));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).NotifyNumConnectionsChanged.disconnect(boost::bind(NotifyNumConnectionsChanged, this, _1));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).NotifyNetworkActiveChanged.disconnect(boost::bind(NotifyNetworkActiveChanged, this, _1));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).NotifyAlertChanged.disconnect(boost::bind(NotifyAlertChanged, this));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).BannedListChanged.disconnect(boost::bind(BannedListChanged, this));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).NotifyBlockTip.disconnect(boost::bind(BlockTipChanged, this, _1, _2, false));
    FIXME_IMPLEMENT_IPC_VALUE(uiInterface).NotifyHeaderTip.disconnect(boost::bind(BlockTipChanged, this, _1, _2, true));
}
