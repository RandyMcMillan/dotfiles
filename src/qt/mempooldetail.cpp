// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <QtMath>
#include <QMouseEvent>
#include <qt/guiutil.h>
#include <qt/clientmodel.h>
#include <qt/mempooldetail.h>
#include <qt/mempoolconstants.h>
#include <qt/forms/ui_mempooldetail.h>

MempoolDetail::MempoolDetail(QWidget *parent) : QWidget(parent)
{
    if (parent) {
        parent->installEventFilter(this);
        raise();
    }
    setMouseTracking(true);

    // autoadjust font size
    QGraphicsTextItem testText("jY"); //screendesign expected 27.5 pixel in width for this string
    testText.setFont(QFont("Roboto Mono", LABEL_TITLE_SIZE, QFont::Light));
    LABEL_TITLE_SIZE *= 27.5/testText.boundingRect().width();
    LABEL_KV_SIZE    *= 27.5/testText.boundingRect().width();

    if (MEMPOOL_DETAIL_LOGGING){

        LogPrintf("LABEL_TITLE_SIZE = %s\n",LABEL_TITLE_SIZE);
        LogPrintf("LABEL_KV_SIZE = %s\n",LABEL_KV_SIZE);

    }

    m_gfx_detail = new QGraphicsView(this);
    m_scene = new QGraphicsScene(m_gfx_detail);
    m_gfx_detail->setScene(m_scene);
    m_gfx_detail->setBackgroundBrush(QColor(28, 31, 49, 127));
    m_gfx_detail->setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform | QPainter::TextAntialiasing);
    m_gfx_detail->setMinimumHeight(DETAIL_VIEW_MIN_HEIGHT);
    m_gfx_detail->setMaximumHeight(DETAIL_VIEW_MAX_HEIGHT);
    m_gfx_detail->setMinimumWidth(DETAIL_VIEW_MIN_WIDTH);
    m_gfx_detail->setMaximumWidth(DETAIL_VIEW_MAX_WIDTH);
    m_gfx_detail->setStyleSheet("QScrollBar {width:0px;}");
    //m_gfx_detail->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    //m_gfx_detail->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);

    if (m_clientmodel)
        drawChart();
}

void MempoolDetail::drawFeeRanges( qreal bottom ){

    QFont gridFont;
    gridFont.setPointSize(12);
    gridFont.setWeight(QFont::Light);
    if (ADD_FEE_RANGES) {
        QGraphicsTextItem *fee_range_title =
        m_scene->addText("Fee ranges\n(sat/b)", gridFont);
        fee_range_title->setPos(2, bottom+10);
        }
}

void MempoolDetail::drawFeeRects( qreal bottom, int maxwidth, int display_up_to_range, int fee_subtotal_txcount, bool ADD_TEXT){

    double bottom_display_ratio = (bottom/display_up_to_range);
    QFont gridFont;
    gridFont.setPointSize(12);
    gridFont.setWeight(QFont::Bold);

    if (MEMPOOL_DETAIL_LOGGING){

        LogPrintf("\nbottom = %s",bottom);
        LogPrintf("\nbottom_display_ratio = %s",bottom_display_ratio);
        LogPrintf("\nmaxwidth = %s",maxwidth);
        LogPrintf("\ndisplay_up_to_range = %s",display_up_to_range);
        //LogPrintf("\nfee_path_delta = %s",QString::number(m_clientmodel->m_mempool_max_samples*m_clientmodel->m_mempool_collect_intervall/3600);

    }
        qreal c_y = bottom;
        c_y-=C_MARGIN;
        int i = 0;
        for (const interfaces::mempool_feeinfo& list_entry : m_clientmodel->m_mempool_feehist[0].second) {

        if (i > display_up_to_range) { continue; }

        m_gfx_detail->setMaximumHeight(DETAIL_VIEW_MAX_HEIGHT + c_y);


            ClickableRectItem *fee_rect_detail = new ClickableRectItem();
            if (c_y < (bottom + DETAIL_PADDING_BOTTOM + 80))
            //if (c_y < (DETAIL_VIEW_MAX_HEIGHT + DETAIL_PADDING_BOTTOM + 80))
            //if (c_y < (DETAIL_VIEW_MAX_HEIGHT + DETAIL_PADDING_BOTTOM))
                //we make slight adjustments for Qt::NoPen set below
                fee_rect_detail->setRect(C_X-10, c_y-5, C_W, C_H);

            if (MEMPOOL_DETAIL_LOGGING){
              //LogPrintf("\nfee_path_delta = %s\n", typeid(m_clientmodel->m_mempool_feehist[0].second).name());
              //LogPrintf("fee_path_delta = %s\n", QString::number(m_clientmodel->m_mempool_feehist[0].second));
                LogPrintf("\nc_y = %s",c_y);
                LogPrintf("\nc_y-5 = %s",c_y-5);

            }

            //Stack of rects on left
            QColor brush_color = colors[(i < static_cast<int>(colors.size()) ? i : static_cast<int>(colors.size())-1)];
            //brush_color.setAlpha(100);
            brush_color.setAlpha(255);
            if (m_selected_range >= 0 && m_selected_range != i) {
                // if one item is selected, hide out the other ones
                // fee range boxes
                brush_color.setAlpha(200);//not pressed
                //
            }

            fee_rect_detail->setBrush(QBrush(brush_color));
            fee_rect_detail->setPen(Qt::NoPen);//no outline only fill with QBrush
            fee_rect_detail->setCursor(Qt::PointingHandCursor);

            if (ADD_FEE_RANGES){

                QFont gridFont;
                gridFont.setPointSize(10);
                gridFont.setWeight(QFont::Light);

                QGraphicsTextItem *fee_text = m_scene->addText(QString::number(list_entry.fee_from)+" - "+QString::number(list_entry.fee_to), gridFont);
                //fee_text->setPlainText(QString::number(list_entry.fee_from)+" - "+QString::number(list_entry.fee_to));

                if (i+1 == static_cast<int>(m_clientmodel->m_mempool_feehist[0].second.size())) {
                    fee_text->setHtml(QString::number(list_entry.fee_from)+"+");
                }

                fee_text->setZValue(FEE_TEXT_Z);
                fee_text->setPos(C_W-7, c_y-C_H+C_MARGIN);
                fee_text->setDefaultTextColor(colors[16]);//REF: mempoolconstants.h

			QString total_text = "test 121";//tr("").arg(QString::number(m_clientmodel->m_mempool_max_samples*m_clientmodel->m_mempool_collect_intervall/3600));

			std::vector<size_t> fee_subtotal_txcount;

			fee_subtotal_txcount.resize(m_clientmodel->m_mempool_feehist[0].second.size());
            //LogPrintf("\n%s",m_clientmodel->m_mempool_feehist[0].second.size());
			QColor pen_color = colors[(i < static_cast<int>(colors.size()) ? i : static_cast<int>(colors.size())-1)];

            if(ADD_TOTAL_TEXT){

                QFont gridFont;
                gridFont.setPointSize(12);
                //gridFont.setWeight(QFont::Bold);

                //QGraphicsTextItem *item_tx_count = m_scene->addText(total_text, gridFont);
                //item_tx_count->setPos(ITEM_TX_COUNT_PADDING_LEFT, bottom);
                //item_tx_count->setPos(C_W-3, c_y-20);
                //item_tx_count->setPos(C_W+3, c_y-20);

            }

                //m_scene->addItem(fee_text);

            }

            if (ADD_FEE_RECTS){

                m_scene->addItem(fee_rect_detail);
                LogPrintf("\n__________________________items().length() = %s\n",(int)m_scene->items().length());

            }

            connect(fee_rect_detail, &ClickableRectItem::objectClicked, [this, i](QGraphicsItem*item) {
                // if clicked, we select or deselect if selected
                if (m_selected_range == i) {
                    m_selected_range = -1;
                } else {
                    m_selected_range = i;
                }
                drawChart();
            });

            c_y-=C_H+C_MARGIN;
            if (MEMPOOL_DETAIL_LOGGING){
                LogPrintf("\nc_y = %s",c_y);
                LogPrintf("\ni = %s\n",i);
            }
            i++;
        }

}

void MempoolDetail::drawChart()
{
    if (!m_clientmodel)
        return;

    m_scene->clear();

    //
    qreal current_x = 0 + GRAPH_PADDING_LEFT; //Must be zero to begin with!!!
    // TODO: calc dynamic GRAPH_PADDING_BOTTOM
    const qreal bottom = (m_gfx_detail->scene()->sceneRect().height() - DETAIL_PADDING_BOTTOM);
    const qreal maxheight_g = (m_gfx_detail->scene()->sceneRect().height() - (DETAIL_PADDING_TOP + DETAIL_PADDING_BOTTOM) );
    if (MEMPOOL_DETAIL_LOGGING){

        LogPrintf("\n");
        LogPrintf("\n");
        LogPrintf("\n");
        LogPrintf("\n");
        LogPrintf("bottom = %s\n",bottom);
        LogPrintf("maxheight_g = %s\n",maxheight_g);
        LogPrintf("\n");
        LogPrintf("\n");
        LogPrintf("\n");
        LogPrintf("\n");
        LogPrintf("\n");

    }

    std::vector<QPainterPath> fee_paths;
    std::vector<size_t> fee_subtotal_txcount;
    size_t max_txcount=0;
    QFont gridFont;
    gridFont.setPointSize(12);
	gridFont.setWeight(QFont::Bold);
    int display_up_to_range = 0;
    //let view touch boths sides//we will place an over lay of boxes 
    qreal maxwidth = m_gfx_detail->scene()->sceneRect().width();// - (GRAPH_PADDING_LEFT + GRAPH_PADDING_RIGHT);
    {
        // we are going to access the clientmodel feehistogram directly avoiding a copy
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
                if (MEMPOOL_DETAIL_LOGGING){
                    LogPrintf("\ni = %s", i);
                }
                txcount += list_entry.tx_count;

                if (MEMPOOL_DETAIL_LOGGING){
                    LogPrintf("\ntxcount = %s", txcount);
                }

                fee_subtotal_txcount[i] += list_entry.tx_count;

                if (MEMPOOL_DETAIL_LOGGING){
                    LogPrintf("\nlist_entry.tx_count = %s", list_entry.tx_count );
                    LogPrintf("\nfee_subtotal_txcount[i] = %s",fee_subtotal_txcount[i]);
                }
                i++;
            }
            if (txcount > max_txcount) max_txcount = txcount;
            if (MEMPOOL_DETAIL_LOGGING){
                LogPrintf("\nmaxcount = %s", max_txcount);
            }
        }

        // hide ranges we don't have txns
        for(size_t i = 0; i < fee_subtotal_txcount.size(); i++) {
            if (fee_subtotal_txcount[i] > 0) {
                display_up_to_range = i;
            }
        }

        // make a nice y-axis scale
        const int amount_of_h_lines = 5;
        if (max_txcount > 0) {
            int val = qFloor(log10(1.0*max_txcount/amount_of_h_lines));
            int stepbase = qPow(10.0f, val);
            int step = qCeil((1.0*max_txcount/amount_of_h_lines) / stepbase) * stepbase;
            max_txcount_graph = step*amount_of_h_lines;
            if (MEMPOOL_DETAIL_LOGGING){
                LogPrintf("\n");
                LogPrintf("\n");
                LogPrintf("\n");
                LogPrintf("\nmax_txcount_graph = %s",max_txcount_graph);
                LogPrintf("\n");
                LogPrintf("\n");
                LogPrintf("\n");
            }
        }

        // calculate the x axis step per sample
        // we ignore the time difference of collected samples due to locking issues
        const qreal x_increment = 1.0 * (width() - (GRAPH_PADDING_LEFT + GRAPH_PADDING_RIGHT) ) / m_clientmodel->m_mempool_max_samples; //samples.size();
        QPointF current_x_bottom = QPointF(current_x,bottom);

        //drawHorzLines(x_increment, current_x_bottom, amount_of_h_lines, maxheight_g, maxwidth, bottom, max_txcount_graph, gridFont);
        //drawFeeRanges(bottom, gridFont);
        //drawFeeRects(bottom, maxwidth, display_up_to_range, fee_subtotal_txcount ,ADD_TEXT, gridFont);

        // draw the paths
        bool first = true;
        for (const ClientModel::mempool_feehist_sample& sample : m_clientmodel->m_mempool_feehist) {
            current_x += x_increment;
            int i = 0;
            qreal y = bottom;
            for (const interfaces::mempool_feeinfo& list_entry : sample.second) {
                if (i > display_up_to_range) {
                    // skip ranges without txns
                    continue;
                }
                y -= (maxheight_g / max_txcount_graph * list_entry.tx_count);
                if (first) {
                    // first sample, initiate the path with first point
                    //                        TODO:dynamic scalar
                    fee_paths.emplace_back(QPointF(GRAPH_PATH_SCALAR*current_x, y));//affects scale height draw
                }
                else {
                    //              TODO:dynamic scalar
                    fee_paths[i].lineTo(GRAPH_PATH_SCALAR*current_x, y);//affects scale height draw
                }
                i++;
            }
            first = false;
        }
    } // release lock for the actual drawing

    int i = 0;
    QString total_text = "test 311";//tr("").arg(QString::number(m_clientmodel->m_mempool_max_samples*m_clientmodel->m_mempool_collect_intervall/3600));
    //QString total_text = tr("Last %1 hours").arg(QString::number(m_clientmodel->m_mempool_max_samples*m_clientmodel->m_mempool_collect_intervall));//10800 units
    for (auto feepath : fee_paths) {
        // close paths
        if (i > 0) {
            feepath.lineTo(fee_paths[i-1].currentPosition());
            feepath.connectPath(fee_paths[i-1].toReversed());
            //
        } else {
            feepath.lineTo(current_x, bottom);
            feepath.lineTo(GRAPH_PADDING_LEFT, bottom);
        }

        QColor pen_color = colors[(i < static_cast<int>(colors.size()) ? i : static_cast<int>(colors.size())-1)];
        QColor brush_color = pen_color;
        //mempool paths 
        pen_color.setAlpha(255);
        brush_color.setAlpha(200);
        if (m_selected_range >= 0 && m_selected_range != i) {
            //dimmer
            pen_color.setAlpha(127);
            brush_color.setAlpha(100);
        }
        if (m_selected_range >= 0 && m_selected_range == i) {
            total_text = "TXs in this range: "+QString::number(fee_subtotal_txcount[i]);
            LogPrintf("\n%s",m_clientmodel->m_mempool_feehist[0].second.size());
            if (ADD_TOTAL_TEXT){
                QGraphicsTextItem *item_tx_count = m_scene->addText(total_text, gridFont);
                item_tx_count->setDefaultTextColor(colors[16]);//REF: mempoolconstants.h
                item_tx_count->setPos(ITEM_TX_COUNT_PADDING_LEFT, bottom+20);
            }
        }

        if (MEMPOOL_DETAIL_LOGGING){
            LogPrintf("\nfee_subtotal_txcount[i] = %s",fee_subtotal_txcount[i]);
        }

        QPen pen_blue(pen_color, 1, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin);
        //m_scene->addPath(feepath, pen_blue, QBrush(brush_color));

        drawFeeRects(bottom, maxwidth, display_up_to_range, fee_subtotal_txcount[i], ADD_TEXT);
        i++;
    }

}//end drawChart()

// We override the virtual resizeEvent of the QWidget to adjust tables column
// sizes as the tables width is proportional to the dialogs width.
void MempoolDetail::resizeEvent(QResizeEvent *event)
{
    QWidget::resizeEvent(event);
    m_gfx_detail->resize(size());

    m_gfx_detail->scene()->setSceneRect(
            rect().left()/1.618,
            rect().top()/1.618,
            rect().width()-GRAPH_PADDING_RIGHT,
            std::max(
                (0.1 * rect().width() ),
                //(0.9 * rect().height())
                (0.6 * rect().height())
                ));
    drawChart();
}

void MempoolDetail::showEvent(QShowEvent *event)
{
    QWidget::showEvent(event);
    if (m_clientmodel)
        drawChart();
}

void MempoolDetail::hideEvent(QHideEvent *event)
{
    QWidget::hideEvent(event);
    if (m_clientmodel)
        drawChart();
}

void MempoolDetail::setClientModel(ClientModel *model)
{
    m_clientmodel = model;
    if (model) {
        connect(model, &ClientModel::mempoolFeeHistChanged, this, &MempoolDetail::drawChart);
        drawChart();
    }
}

void ClickableTextItemDetail::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this);

        LogPrintf("\nDETAIL ClickableTextItemDetail mousePressEvent");

}
void ClickableRectItemDetail::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this);

        LogPrintf("\nDETAIL ClickableRectItemDetail mousePressEvent");

}

void MempoolDetail::mousePressEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mousePressEvent(event);
    if (MEMPOOL_DETAIL_LOGGING){
        LogPrintf("\nDETAIL mousePressEvent");
        LogPrintf("\nevent->pos().x() %s",event->pos().x());
        LogPrintf("\nevent->pos().y() %s",event->pos().y());
        LogPrintf("\nevent->type() %s",event->type());
        LogPrintf("\nevent->type() %s",event->type());
    }
}
void MempoolDetail::mouseReleaseEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mouseReleaseEvent(event);
    if (MEMPOOL_DETAIL_LOGGING){
        LogPrintf("\nDETAIL mouseReleaseEvent");
        LogPrintf("\nevent->pos().x() %s",event->pos().x());
        LogPrintf("\nevent->pos().y() %s",event->pos().y());
        LogPrintf("\nevent->type() %s",event->type());
        LogPrintf("\nevent->type() %s",event->type());
    }
}
void MempoolDetail::mouseDoubleClickEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mouseDoubleClickEvent(event);
    if (MEMPOOL_DETAIL_LOGGING){
        LogPrintf("\nDETAIL mouseDoublePressEvent");
        LogPrintf("\nevent->pos().x() %s",event->pos().x());
        LogPrintf("\nevent->pos().y() %s",event->pos().y());
    }
}
void MempoolDetail::mouseMoveEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mouseMoveEvent(event);
    if (MEMPOOL_DETAIL_LOGGING){
        LogPrintf("\nDETAIL mouseMoveEvent");
        LogPrintf("\nevent->pos().x() %s",event->pos().x());
        LogPrintf("\nevent->pos().y() %s",event->pos().y());
    }
}

void MempoolDetail::enterEvent(QEvent *event) { Q_EMIT objectClicked(this);

    QEvent *this_event = event;
    if (MEMPOOL_DETAIL_LOGGING){
        LogPrintf("\nDETAIL enterEvent");
        LogPrintf("\nthis_event->type() %s",this_event->type());
        LogPrintf("\nthis_event->type() %s",this_event->type());
    }

    showFeeRanges(this_event);
    showFeeRects(this_event);

}

void MempoolDetail::leaveEvent(QEvent *event) { Q_EMIT objectClicked(this);

    QEvent *this_event = event;
    if (MEMPOOL_DETAIL_LOGGING){
        LogPrintf("\nDETAIL leaveEvent");
        LogPrintf("\nthis_event->type() %s",this_event->type());
        LogPrintf("\nthis_event->type() %s",this_event->type());
    }

    hideFeeRanges(this_event);
    hideFeeRects(this_event);

}

void MempoolDetail::showFeeRanges(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_DETAIL_LOGGING){
        LogPrintf("\nDETAIL leaveEvent");
        LogPrintf("\nthis_event->type() %s",this_event->type());
        LogPrintf("\nthis_event->type() %s",this_event->type());
    }

};
void MempoolDetail::hideFeeRanges(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_DETAIL_LOGGING){
        LogPrintf("\nDETAIL hideFeeRanges");
        LogPrintf("\nthis_event->type() %s",this_event->type());
        LogPrintf("\nthis_event->type() %s",this_event->type());
    }

};

void MempoolDetail::showFeeRects(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_DETAIL_LOGGING){
        LogPrintf("\nDETAIL showFeeRects");
        LogPrintf("\nthis_event->type() %s",this_event->type());
        LogPrintf("\nthis_event->type() %s",this_event->type());
    }

};
void MempoolDetail::hideFeeRects(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_DETAIL_LOGGING){
        LogPrintf("\nDETAIL hideFeeRects");
        LogPrintf("\nthis_event->type() %s",this_event->type());
        LogPrintf("\nthis_event->type() %s",this_event->type());
    }

};

