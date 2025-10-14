// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_QT_MEMPOOLSTATS_H
#define BITCOIN_QT_MEMPOOLSTATS_H

#include <QEvent>
#include <QWidget>
#include <QGraphicsItem>
#include <QGraphicsRectItem>
#include <QGraphicsScene>
#include <QGraphicsSimpleTextItem>
#include <QGraphicsView>
#include <QMutex>

#include <policy/fees.h>
#include <qt/mempooldetail.h>
#include <qt/mempoolfeetables.h>
#include <interfaces/wallet.h>
#include <qt/clickableitems.h>

#include <set>
#include <vector>
#include <memory>
#include <interfaces/handler.h>

QT_BEGIN_NAMESPACE
class QTableView;
QT_END_NAMESPACE

class MempoolStats : public QWidget
{
    Q_OBJECT

public:
    explicit MempoolStats(QWidget *parent = Q_NULLPTR);
    QGraphicsView *m_gfx_view;
    QGraphicsScene *m_scene;
    ClientModel *m_clientmodel;
    void setClientModel(ClientModel *model);
    void setMempoolDetailView(MempoolDetail* mempool_detail);
    void drawChart();
    void drawHorzLines(const qreal x_increment, QPointF current_x_bottom, const int amount_of_h_lines, qreal maxheight_g, qreal maxwidth, qreal bottom, size_t max_txcount_graph, QFont LABELFONT);
    void drawWalletTxIndicators();

public Q_SLOTS:
    void onMempoolRangeSelected(int selectedRange);
    void onFeePathClicked(int feeRangeIndex);

protected:
    void resizeEvent(QResizeEvent *event) override;
    void showEvent(QShowEvent *event) override;

    int m_selected_range = -1;
    MempoolDetail* m_mempool_detail{nullptr};
    QMutex m_wallet_tx_mutex;
    std::set<interfaces::WalletTx> m_wallet_transactions;
    std::vector<std::unique_ptr<interfaces::Handler>> m_wallet_handlers;
    QList<QGraphicsItem*> m_wallet_indicator_items;
    QList<ClickableFeePathItem*> m_fee_path_items;

public Q_SLOTS:
    void onWalletTxChanged();

Q_SIGNALS:
    void walletTxChanged();
};

#endif // BITCOIN_QT_MEMPOOLSTATS_H
