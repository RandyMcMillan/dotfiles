// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <QtMath>
#include <QMouseEvent>
#include <qt/guiutil.h>
#include <qt/clientmodel.h>
#include <qt/mempoolstats.h>
#include <qt/mempooldetail.h>
#include <qt/mempoolfeetables.h>
#include <QTableView>
#include <qt/mempoolconstants.h>
#include <qt/forms/ui_mempoolstats.h>
#include <interfaces/wallet.h>

MempoolStats::MempoolStats(QWidget *parent) : QWidget(parent)
{
    if (parent) {

        parent->installEventFilter(this);
        raise();

    }
    //setMouseTracking(true);

    // autoadjust font size
    QGraphicsTextItem testText("jY"); //screendesign expected 27.5 pixel in width for this string
    testText.setFont(QFont(LABEL_FONT, LABEL_TITLE_SIZE, QFont::Light));
    LABEL_TITLE_SIZE *= 27.5/testText.boundingRect().width();
    LABEL_KV_SIZE *= 27.5/testText.boundingRect().width();

    if (MEMPOOL_GRAPH_LOGGING){

        LogPrintf("LABEL_TITLE_SIZE = %s\n",LABEL_TITLE_SIZE);
        LogPrintf("LABEL_KV_SIZE = %s\n",LABEL_KV_SIZE);

    }

    m_gfx_view = new QGraphicsView(this);
    m_scene = new QGraphicsScene(m_gfx_view);
    m_gfx_view->setScene(m_scene);
    m_gfx_view->setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform);
    m_gfx_view->setBackgroundBrush(QBrush(QColor(17, 19, 31)));

    if (m_clientmodel)
        drawChart();
}

void MempoolStats::drawHorzLines(
        const qreal x_increment,
        QPointF current_x_bottom,
        const int amount_of_h_lines,
        qreal maxheight_g,
        qreal maxwidth,
        qreal bottom,
        size_t max_txcount_graph,
        QFont LABELFONT){

    QPainterPath tx_count_grid_path(current_x_bottom);
    int bottomTxCount = 0;
    for (int i=0; i < amount_of_h_lines; i++)
    {
        qreal lY = bottom-i*(maxheight_g/(amount_of_h_lines-1));
        //TODO: use text rect width to adjust
        tx_count_grid_path.moveTo(GRAPH_PADDING_LEFT-0, lY);
        tx_count_grid_path.lineTo(GRAPH_PADDING_LEFT+maxwidth, lY);
        //tx_count_grid_path.lineTo(GRAPH_PADDING_LEFT, lY);

        size_t grid_tx_count =
            (float)i*(max_txcount_graph-bottomTxCount)/(amount_of_h_lines-1) + bottomTxCount;

        if (MEMPOOL_GRAPH_LOGGING){

            LogPrintf("i = %s\n",i);
            LogPrintf("lY = %s\n",lY);

        }
        //Add text ornament
        if (ADD_TEXT) {

            QGraphicsTextItem *item_tx_count =
                m_scene->addText(QString::number(grid_tx_count/1).rightJustified(4, ' ')+QString("vB"), LABELFONT);
            item_tx_count->setDefaultTextColor(QColor(255, 255, 255)); // White text for dark background
            item_tx_count->setPos(GRAPH_PADDING_LEFT-60, lY-(item_tx_count->boundingRect().height()/2));

        }
    }

QPen gridPen(QColor(200, 200, 200), 0.75, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin); // Light gray for grid lines
m_scene->addPath(tx_count_grid_path, gridPen);

}

void MempoolStats::drawChart()
{
    if (!m_clientmodel)
        return;

    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("Active wallet transactions: %s\n", m_wallet_transactions.size());
    }

    m_scene->clear();
    m_fee_path_items.clear();

    qreal current_x = 0 + GRAPH_PADDING_LEFT; //Must be zero to begin with!!!
    // TODO: calc dynamic GRAPH_PADDING_BOTTOM
    const qreal bottom = (m_gfx_view->scene()->sceneRect().height() - GRAPH_PADDING_BOTTOM);
    const qreal maxheight_g = (m_gfx_view->scene()->sceneRect().height() - (GRAPH_PADDING_TOP + GRAPH_PADDING_TOP_LABEL + GRAPH_PADDING_BOTTOM) );
    if (MEMPOOL_GRAPH_LOGGING){

        LogPrintf("bottom = %s\n",bottom);
        LogPrintf("maxheight_g = %s\n",maxheight_g);

    }

    std::vector<QPainterPath> fee_paths;
    std::vector<size_t> fee_subtotal_txcount;
    size_t max_txcount=0;
    QFont gridFont;
    gridFont.setPointSize(12);
    gridFont.setWeight(QFont::Bold);
    int display_up_to_range = 0;
    qreal maxwidth = m_gfx_view->scene()->sceneRect().width() - (GRAPH_PADDING_LEFT + GRAPH_PADDING_RIGHT);
    {
        // we are going to access the clientmodel feehistogram directly avoding a copy
        QMutexLocker locker(&m_clientmodel->m_mempool_locker);

        size_t max_txcount_graph=0;

        if (m_clientmodel->m_mempool_feehist.size() == 0) {
            // draw nothing
            return;
        }

        fee_subtotal_txcount.resize(m_clientmodel->m_mempool_feehist[0].second.size());
        // calculate max tx for upper bound of chart
        for (const ClientModel::mempool_feehist_sample& sample : m_clientmodel->m_mempool_feehist) {
            uint64_t txcount = 0;
            int i = 0;
            for (const interfaces::mempool_feeinfo& list_entry : sample.second) {
                LogPrintf("i = %s\n", i);
                txcount += list_entry.tx_count;

                LogPrintf("txcount = %s\n", txcount);

                fee_subtotal_txcount[i] += list_entry.tx_count;

                LogPrintf("list_entry.tx_count = %s\n", list_entry.tx_count );
                LogPrintf("fee_subtotal_txcount[i] = %s\n",fee_subtotal_txcount[i]);
                i++;
            }
            if (txcount > max_txcount) max_txcount = txcount;
                LogPrintf("maxcount = %s\n", max_txcount);
        }

        // hide ranges we don't have txns
        for(size_t i = 0; i < fee_subtotal_txcount.size(); i++) {
            if (fee_subtotal_txcount[i] > 0) {
                display_up_to_range = i;
            }
        }

        // make a nice y-axis scale
        const int amount_of_h_lines = AMOUNT_OF_H_LINES;
        if (max_txcount > 0) {
            int val = qFloor(log10(1.0*max_txcount/amount_of_h_lines));
            int stepbase = qPow(10.0f, val);
            int step = qCeil((1.0*max_txcount/amount_of_h_lines) / stepbase) * stepbase;
            max_txcount_graph = step*amount_of_h_lines;
            if (MEMPOOL_GRAPH_LOGGING){

                LogPrintf("max_txcount_graph = %s\n",max_txcount_graph);

            }
        }

        // calculate the x axis step per sample
        // we ignore the time difference of collected samples due to locking issues
        qreal x_increment;
        if (m_clientmodel->m_mempool_feehist.size() > 1) {
            x_increment = 1.0 * (width() - (GRAPH_PADDING_LEFT + GRAPH_PADDING_RIGHT) ) / (m_clientmodel->m_mempool_feehist.size() - 1);
        } else if (m_clientmodel->m_mempool_feehist.size() == 1) {
            x_increment = maxwidth; // If only one sample, fill the width
        } else {
            x_increment = 0; // No samples, no increment
        }
        QPointF current_x_bottom = QPointF(current_x,bottom);

        drawHorzLines(x_increment, current_x_bottom, amount_of_h_lines, maxheight_g, maxwidth, bottom, max_txcount_graph, gridFont);

        // draw the paths
        bool first_sample = true;
        qreal initial_x_for_paths = GRAPH_PADDING_LEFT;

        for (const ClientModel::mempool_feehist_sample& sample : m_clientmodel->m_mempool_feehist) {
            current_x += x_increment;
            // Ensure current_x does not exceed the rightmost boundary
            qreal clamped_current_x = std::min(current_x, GRAPH_PADDING_LEFT + maxwidth);

            int i = 0;
            qreal y_current_sample = bottom;
            for (const interfaces::mempool_feeinfo& list_entry : sample.second) {
                if (i > display_up_to_range) {
                    continue;
                }
                y_current_sample -= (maxheight_g / max_txcount_graph * list_entry.tx_count);

                if (first_sample) {
                    fee_paths.emplace_back(QPointF(GRAPH_PATH_SCALAR * initial_x_for_paths, bottom));
                    fee_paths[i].lineTo(GRAPH_PATH_SCALAR * clamped_current_x, y_current_sample);
                } else {
                    fee_paths[i].lineTo(GRAPH_PATH_SCALAR * clamped_current_x, y_current_sample);
                }
                i++;
            }
            first_sample = false;
        }
    } // release lock for the actual drawing

    int i = 0;
    QString total_text = tr("Last %1 hours").arg(QString::number(m_clientmodel->m_mempool_max_samples*m_clientmodel->m_mempool_collect_intervall/3600));
    for (auto feepath : fee_paths) {
        // close paths
        if (i > 0) {

            feepath.lineTo(fee_paths[i-1].currentPosition());
            feepath.connectPath(fee_paths[i-1].toReversed());

        } else {

            feepath.lineTo(GRAPH_PATH_SCALAR * std::min(current_x, GRAPH_PADDING_LEFT + maxwidth), bottom);
            feepath.lineTo(GRAPH_PADDING_LEFT, bottom);

        }

        QColor pen_color = colors[(i < static_cast<int>(colors.size()) ? i : static_cast<int>(colors.size())-1)];
        QColor brush_color = pen_color;
        //mempool paths
        pen_color.setAlpha(255);
        brush_color.setAlpha(200);
        if (static_cast<size_t>(i) < m_clientmodel->m_mempool_feehist[0].second.size()) {
            int original_index = m_clientmodel->m_mempool_feehist[0].second[i].original_index;
            if (m_selected_range >= 0 && m_selected_range != original_index) {
                //dimmer
                pen_color.setAlpha(127);
                brush_color.setAlpha(100);
            }
            if (m_selected_range >= 0 && m_selected_range == original_index) {
                total_text = "transactions in selected fee range: "+QString::number(m_clientmodel->m_mempool_feehist[0].second[i].tx_count);
            }
            ClickableFeePathItem* fee_path_item = new ClickableFeePathItem(original_index);
            fee_path_item->setPath(feepath);
            fee_path_item->setPen(QPen(pen_color, 1, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin));
            fee_path_item->setBrush(QBrush(brush_color));
            m_scene->addItem(fee_path_item);
            m_fee_path_items.append(fee_path_item);
            connect(fee_path_item, &ClickableFeePathItem::feePathClicked, this, &MempoolStats::onFeePathClicked);
        }
        i++;
    }

    // Draw wallet transaction indicators
    drawWalletTxIndicators();

    if(ADD_TOTAL_TEXT){

        QGraphicsTextItem *item_tx_count = m_scene->addText(total_text, gridFont);
        item_tx_count->setPos(GRAPH_PADDING_LEFT+(maxwidth/2), bottom);

    }

}//end drawChart()

// We override the virtual resizeEvent of the QWidget to adjust tables column
// sizes as the tables width is proportional to the dialogs width.
void MempoolStats::resizeEvent(QResizeEvent *event)
{
    QWidget::resizeEvent(event);
    m_gfx_view->resize(size());

    m_gfx_view->scene()->setSceneRect(
            rect().left()/1.618,
            rect().top()/1.618,
            rect().width()-GRAPH_PADDING_RIGHT,
            std::max(
                (0.1 * rect().width() ),
                (0.9 * rect().height())
        ));
    m_gfx_view->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_gfx_view->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);

    drawChart();
}

void MempoolStats::showEvent(QShowEvent *event)
{
    QWidget::showEvent(event);
    if (m_clientmodel)
        drawChart();
}

void MempoolStats::setClientModel(ClientModel *model)
{
    m_clientmodel = model;
    if (model) {
        connect(model, &ClientModel::mempoolFeeHistChanged, this, &MempoolStats::drawChart, Qt::QueuedConnection);
        connect(model, &ClientModel::mempoolRangeSelected, this, &MempoolStats::onMempoolRangeSelected);
        if (m_mempool_detail) {
            connect(model, &ClientModel::mempoolFeeHistChanged, m_mempool_detail, &MempoolDetail::updateFeeTable);
        }

        // Connect to wallet transaction changes
        m_wallet_handlers.clear();
        for (std::unique_ptr<interfaces::Wallet>& wallet_ptr : model->node().walletLoader().getWallets()) {
            m_wallet_handlers.emplace_back(wallet_ptr->handleTransactionChanged(std::bind(&MempoolStats::onWalletTxChanged, this)));
        }
        onWalletTxChanged();
        drawChart();
    }
}

void MempoolStats::setMempoolDetailView(MempoolDetail* mempool_detail)
{
    m_mempool_detail = mempool_detail;
}

void MempoolStats::onMempoolRangeSelected(int selectedRange)
{
    m_selected_range = selectedRange;
    drawChart();
}

void MempoolStats::drawWalletTxIndicators()
{
    // The wallet transaction indicator items are cleared when the scene is cleared
    m_wallet_indicator_items.clear();

    if (!m_clientmodel)
        return;

    std::set<interfaces::WalletTx> wallet_transactions_copy;
    {
        QMutexLocker locker(&m_wallet_tx_mutex);
        wallet_transactions_copy = m_wallet_transactions;
    }

    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("drawWalletTxIndicators: wallet_transactions_copy size: %s\n", wallet_transactions_copy.size());
    }

    // Draw wallet transaction indicators
    if (!wallet_transactions_copy.empty()) {
        qreal indicator_x = m_gfx_view->scene()->sceneRect().width() - GRAPH_PADDING_RIGHT - 50; // Adjust position as needed
        qreal indicator_y = GRAPH_PADDING_TOP; // Adjust position as needed
        qreal y_offset = 20; // Vertical spacing between indicators

        QFont gridFont;
        //gridFont.setPointSize(36);
        gridFont.setWeight(QFont::Bold);

        for (const interfaces::WalletTx& wtx : wallet_transactions_copy) {
            if (!wtx.tx) continue;
            bool in_mempool = false;
            CAmount net_amount = 0;

            for (std::unique_ptr<interfaces::Wallet>& wallet_ptr : m_clientmodel->node().walletLoader().getWallets()) {
                if (!wallet_ptr) continue;
                interfaces::WalletTxStatus tx_status;
                int num_blocks;
                int64_t block_time;

                if (wallet_ptr->tryGetTxStatus(wtx.tx->GetHash(), tx_status, num_blocks, block_time)) {
                    if (tx_status.depth_in_main_chain == 0 && !tx_status.is_abandoned) {
                        in_mempool = true;
                        net_amount = wtx.credit - wtx.debit;
                        break; // Found status for this transaction, no need to check other wallets
                    }
                }
            }

            if (MEMPOOL_GRAPH_LOGGING) {
                LogPrintf("drawWalletTxIndicators: tx %s, in_mempool: %s, net_amount: %s\n", wtx.tx->GetHash().ToString(), in_mempool, net_amount);
            }

            if (in_mempool) {
                QGraphicsTextItem *sign_item = nullptr;
                QColor sign_color;

                if (net_amount > 0) { // Receive transaction
                    gridFont.setPointSize(36);
                    sign_item = m_scene->addText("+", gridFont);
                    sign_color = QColor(0, 255, 0); // Green
                } else if (net_amount < 0) { // Send transaction
                    gridFont.setPointSize(48);
                    sign_item = m_scene->addText("-", gridFont);
                    sign_color = QColor(255, 0, 0); // Red
                }

                if (sign_item) {
                    sign_item->setDefaultTextColor(sign_color);
                    sign_item->setPos(indicator_x, indicator_y);
                    sign_item->setToolTip(QString::fromStdString(wtx.tx->GetHash().ToString()));
                    m_wallet_indicator_items.append(sign_item); // Store the item
                    indicator_y += y_offset; // Move down for the next indicator
                }
            }
        }
    }
}

void ClickableTextItem::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this); }
void ClickableRectItem::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this); }

void MempoolStats::onFeePathClicked(int feeRangeIndex)
{
    if (m_clientmodel) {
        if (m_selected_range == feeRangeIndex) {
            // A second click on the same range deselects it.
            Q_EMIT m_clientmodel->mempoolRangeSelected(-1);
        } else {
            Q_EMIT m_clientmodel->mempoolRangeSelected(feeRangeIndex);
        }
    }
}

void MempoolStats::onWalletTxChanged()
{
    {
        QMutexLocker locker(&m_wallet_tx_mutex);
        m_wallet_transactions.clear();
        if (m_clientmodel) {
            for (std::unique_ptr<interfaces::Wallet>& wallet_ptr : m_clientmodel->node().walletLoader().getWallets()) {
                if (!wallet_ptr) continue;
                for (const interfaces::WalletTx& wtx : wallet_ptr->getWalletTxs()) {
                    m_wallet_transactions.insert(wtx);
                }
            }
        }
    }
    QMetaObject::invokeMethod(this, "drawChart", Qt::QueuedConnection);
    Q_EMIT walletTxChanged();
}
