// Copyright (c) 2011-2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_QT_CLIENTMODEL_H
#define BITCOIN_QT_CLIENTMODEL_H

#include <QMutex>
#include <QObject>
#include <QDateTime>

#include <atomic>
#include <memory>
#include <sync.h>
#include <uint256.h>

#include <netaddress.h>
#include <interfaces/node.h>
#include <interfaces/wallet.h> // New: Include for interfaces::WalletTx

class BanTableModel;
class CBlockIndex;
class OptionsModel;
class PeerTableModel;
class PeerTableSortProxy;
enum class SynchronizationState;
struct LocalServiceInfo;

namespace interfaces {
class Handler;
class Node;
struct BlockTip;
}

QT_BEGIN_NAMESPACE
class QTimer;
QT_END_NAMESPACE

enum class BlockSource {
    NONE,
    DISK,
    NETWORK,
};

enum class SyncType {
    HEADER_PRESYNC,
    HEADER_SYNC,
    BLOCK_SYNC
};

enum NumConnections {
    CONNECTIONS_NONE = 0,
    CONNECTIONS_IN   = (1U << 0),
    CONNECTIONS_OUT  = (1U << 1),
    CONNECTIONS_ALL  = (CONNECTIONS_IN | CONNECTIONS_OUT),
};

/** Model for Bitcoin network client. */
class ClientModel : public QObject
{
    Q_OBJECT

public:
    explicit ClientModel(interfaces::Node& node, OptionsModel *optionsModel, QObject *parent = nullptr);
    ~ClientModel();

    // Delete copy constructor and assignment operator to prevent implicit copying
    ClientModel(const ClientModel&) = delete;
    ClientModel& operator=(const ClientModel&) = delete;

    void stop();

    interfaces::Node& node() const { return m_node; }
    OptionsModel *getOptionsModel();
    PeerTableModel *getPeerTableModel();
    PeerTableSortProxy* peerTableSortProxy();
    BanTableModel *getBanTableModel();

    //! Return number of connections, default is in- and outbound (total)
    int getNumConnections(unsigned int flags = CONNECTIONS_ALL) const;
    std::map<CNetAddr, LocalServiceInfo> getNetLocalAddresses() const;
    int getNumBlocks() const;
    uint256 getBestBlockHash() EXCLUSIVE_LOCKS_REQUIRED(!m_cached_tip_mutex);
    int getHeaderTipHeight() const;
    int64_t getHeaderTipTime() const;

    //! Returns the block source of the current importing/syncing state
    BlockSource getBlockSource() const;
    //! Return warnings to be displayed in status bar
    QString getStatusBarWarnings() const;

    QString formatFullVersion() const;
    QString formatSubVersion() const;
    bool isReleaseVersion() const;
    QString formatClientStartupTime() const;
    QString dataDir() const;
    QString blocksDir() const;

    bool getProxyInfo(std::string& ip_port) const;

    // caches for the best header: hash, number of blocks and block time
    mutable std::atomic<int> cachedBestHeaderHeight;
    mutable std::atomic<int64_t> cachedBestHeaderTime;
    mutable std::atomic<int> m_cached_num_blocks{-1};

    Mutex m_cached_tip_mutex;
    uint256 m_cached_tip_blocks GUARDED_BY(m_cached_tip_mutex){};

    typedef std::pair<int64_t, std::vector<interfaces::mempool_feeinfo>> mempool_feehist_sample; //!< sample plus timestamp
    mutable QMutex m_mempool_locker;
    const static size_t m_mempool_max_samples{540};
    const static size_t m_mempool_collect_intervall{20}; // 540*20 = 3h of sample window
    std::vector<mempool_feehist_sample> m_mempool_feehist;
    std::atomic<int64_t> m_mempool_feehist_last_sample_timestamp{0};

    std::set<interfaces::WalletTx> m_wallet_transactions; // New: Stores active wallet's mempool transactions

private:
    interfaces::Node& m_node;
    std::unique_ptr<interfaces::Handler> m_handler_show_progress;
    std::unique_ptr<interfaces::Handler> m_handler_notify_num_connections_changed;
    std::unique_ptr<interfaces::Handler> m_handler_notify_network_active_changed;
    std::unique_ptr<interfaces::Handler> m_handler_notify_alert_changed;
    std::unique_ptr<interfaces::Handler> m_handler_banned_list_changed;
    std::unique_ptr<interfaces::Handler> m_handler_notify_block_tip;
    std::unique_ptr<interfaces::Handler> m_handler_notify_header_tip;

    std::vector<std::unique_ptr<interfaces::Handler>> m_event_handlers;
    OptionsModel *optionsModel;
    PeerTableModel* peerTableModel{nullptr};
    PeerTableSortProxy* m_peer_table_sort_proxy{nullptr};
    BanTableModel* banTableModel{nullptr};

    //! A thread to interact with m_node asynchronously
    QThread* const m_thread;

    void TipChanged(SynchronizationState sync_state, interfaces::BlockTip tip, double verification_progress, SyncType synctype) EXCLUSIVE_LOCKS_REQUIRED(!m_cached_tip_mutex);
    void subscribeToCoreSignals();
    void unsubscribeFromCoreSignals();

Q_SIGNALS:
    void numConnectionsChanged(int count);
    void numBlocksChanged(int count, const QDateTime& blockDate, double nVerificationProgress, SyncType header, SynchronizationState sync_state);
    void mempoolSizeChanged(long count, size_t mempoolSizeInBytes, size_t maxUsageInBytes);
    void mempoolFeeHistChanged();
    void mempoolRangeSelected(int selectedRange);
    void networkActiveChanged(bool networkActive);
    void alertsChanged(const QString &warnings);
    void bytesChanged(quint64 totalBytesIn, quint64 totalBytesOut);
    void walletTxChanged(); // New: Signal emitted when wallet transactions in mempool change

    //! Fired when a message should be reported to the user
    void message(const QString &title, const QString &message, unsigned int style);

    // Show progress dialog e.g. for verifychain
    void showProgress(const QString &title, int nProgress);
};

#endif // BITCOIN_QT_CLIENTMODEL_H
