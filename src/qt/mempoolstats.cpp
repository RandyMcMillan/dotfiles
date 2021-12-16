// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <QtMath>
#include <QMouseEvent>
#include <qt/guiutil.h>
#include <qt/clientmodel.h>
#include <qt/mempoolstats.h>
#include <qt/mempooldetail.h>
#include <qt/mempoolconstants.h>
#include <qt/forms/ui_mempoolstats.h>

MempoolStats::MempoolStats(QWidget *parent) : QWidget(parent)
{
    if (parent) {
        parent->installEventFilter(this);
        raise();
    }

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
    m_detail_view = new MempoolDetail(this);
    m_detail_view->setStyleSheet("background-color: rgb(28,31,49)");

    m_scene = new QGraphicsScene(m_gfx_view);
    m_gfx_view->setScene(m_scene);
    m_gfx_view->setBackgroundBrush(QColor(16, 18, 31, 127));
    m_gfx_view->setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform);
    m_gfx_view->setMouseTracking(true);

    if (m_clientmodel)
        drawChart();
}

void MempoolStats::drawDetailView(
        qreal detail_x,
        qreal detail_y,
        qreal detail_width,
        qreal detail_height
        ){

    if (MEMPOOL_DETAIL_LOGGING){

        LogPrintf("detail_x = %s\n", detail_x);
        LogPrintf("detail_y = %s\n", detail_y);
        LogPrintf("detail_width = %s\n", detail_width);
        LogPrintf("detail_height = %s\n", detail_height);

    }
    //m_detail_view->setGeometry(detail_x, detail_y, detail_width, detail_height);

    m_detail_view->setGeometry(
            //rect().left()/1.618,
            detail_x,
            //rect().top()/1.618,
            detail_y,
            //rect().width()-GRAPH_PADDING_RIGHT,
            detail_width,
            std::max(
                (0.1 * rect().width() ),
                (0.9 * rect().height())
        ));


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
                //m_scene->addText(QString::number(grid_tx_count/100).rightJustified(4, ' ')+QString("MvB"), LABELFONT);
                m_scene->addText(QString::number(grid_tx_count/1).rightJustified(4, ' ')+QString("vB"), LABELFONT);
            //item_tx_count->setPos(GRAPH_PADDING_LEFT+maxwidth, lY-(item_tx_count->boundingRect().height()/2));
            //TODO: use text rect width to adjust
            item_tx_count->setDefaultTextColor(Qt::white);
            item_tx_count->setPos(GRAPH_PADDING_LEFT-60, lY-(item_tx_count->boundingRect().height()/2));

        }
    }

QPen gridPen(QColor(57,59,69, 200), 0.75, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin);
m_scene->addPath(tx_count_grid_path, gridPen);

}

void MempoolStats::drawChart()
{
    if (!m_clientmodel)
        return;

    m_scene->clear();

    //
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
    //let view touch boths sides//we will place an over lay of boxes 
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
        const qreal x_increment = 1.0 * (width() - (GRAPH_PADDING_LEFT + GRAPH_PADDING_RIGHT) ) / m_clientmodel->m_mempool_max_samples; //samples.size();
        QPointF current_x_bottom = QPointF(current_x,bottom);

        drawHorzLines(x_increment, current_x_bottom, amount_of_h_lines, maxheight_g, maxwidth, bottom, max_txcount_graph, gridFont);
        //drawFeeRanges(bottom, gridFont);
        //drawFeeRects(bottom, maxwidth, display_up_to_range, ADD_TEXT, gridFont);

        //drawDetailView(detailX(),70,100,100);

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
    QString total_text = tr("Last %1 hours").arg(QString::number(m_clientmodel->m_mempool_max_samples*m_clientmodel->m_mempool_collect_intervall/3600));
    for (auto feepath : fee_paths) {
        // close paths
        if (i > 0) {

            feepath.lineTo(fee_paths[i-1].currentPosition());
            feepath.connectPath(fee_paths[i-1].toReversed());

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
            total_text = "transactions in selected fee range: "+QString::number(fee_subtotal_txcount[i]);
        }
        QPen pen_blue(pen_color, 1, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin);
        m_scene->addPath(feepath, pen_blue, QBrush(brush_color));
        i++;
    }

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
        connect(model, &ClientModel::mempoolFeeHistChanged, this, &MempoolStats::drawChart);
        m_detail_view->setClientModel(model);
        drawChart();
    }
}


int MempoolStats::detailX(){

    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("m_gfx_view()->width() =  %s\n",m_gfx_view->width());
    }
    return m_gfx_view->width()*0.66;

}
int MempoolStats::detailY(){

    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("m_gfx_view()->height() =  %s\n",m_gfx_view->height());
    }
    return m_gfx_view->height()*0.1;

}

void ClickableTextItem::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this); }
void ClickableRectItem::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this); }

void MempoolStats::mousePressEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mousePressEvent(event);

    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("mousePressEvent\n");
        LogPrintf("event->pos().x() %s\n",event->pos().x());
        LogPrintf("event->pos().y() %s\n",event->pos().y());
    }
}
void MempoolStats::mouseReleaseEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mouseReleaseEvent(event);
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("mouseReleaseEvent\n");
        LogPrintf("event->pos().x() %s\n",event->pos().x());
        LogPrintf("event->pos().y() %s\n",event->pos().y());
    }
}
void MempoolStats::mouseDoubleClickEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mouseDoubleClickEvent(event);
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("mouseDoubleClickEvent\n");
        LogPrintf("event->pos().x() %s\n",event->pos().x());
        LogPrintf("event->pos().y() %s\n",event->pos().y());
    }
    //mempool_right->show();
}
void MempoolStats::mouseMoveEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mouseMoveEvent(event);
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("mouseMoveEvent\n");
        LogPrintf("event->pos().x() %s\n",event->pos().x());
        LogPrintf("event->pos().y() %s\n",event->pos().y());
    }
    if (m_gfx_view->width()/2 > event->pos().x()){

        LogPrintf("event->pos().x() %s\n",event->pos().x());
        LogPrintf("m_gfx_view->width()/2 %s\n",m_gfx_view->width()/2);

    }
}

void MempoolStats::enterEvent(QEvent *event) { Q_EMIT objectClicked(this);

    QEvent *this_event = event;
    QMouseEvent *mouseEvent = static_cast<QMouseEvent*>(event);

    mPoint.setX(mouseEvent->pos().x());
    mPoint.setY(mouseEvent->pos().y());
    drawDetailView(detailX(), detailY(), m_gfx_view->width()*0.33, m_gfx_view->height()*0.5);

    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("enterEvent\n");
        LogPrintf("mPoint.rx()\n",mPoint.rx());
        LogPrintf("mPoint.ry()\n",mPoint.ry());
        LogPrintf("this_event->type()    %s\n",this_event->type());
        LogPrintf("mouseEvent->pos().x() %s\n",mouseEvent->pos().x());
        LogPrintf("mouseEvent->pos().y() %s\n",mouseEvent->pos().y());
    }

}

void MempoolStats::leaveEvent(QEvent *event) { Q_EMIT objectClicked(this);

QEvent *this_event = event;
if (MEMPOOL_GRAPH_LOGGING){
    LogPrintf("leaveEvent\n");
    LogPrintf("this_event->type() %s\n",this_event->type());
}

if (event->type() == QEvent::MouseMove)
  {
    QMouseEvent *mouseEvent = static_cast<QMouseEvent*>(event);
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("mouseMoveEvent\n");
        LogPrintf("mouseMoveEvent\n");
        LogPrintf("mouseMoveEvent\n");
        LogPrintf("mouseMoveEvent\n");
        LogPrintf("mouseMoveEvent\n");
        LogPrintf("mouseMoveEvent\n");
        LogPrintf("mouseMoveEvent\n");
        LogPrintf("event->pos().x() %s\n",mouseEvent->pos().x());
        LogPrintf("event->pos().y() %s\n",mouseEvent->pos().y());
    }
  }

    //hideFeeRanges(this_event);
    //hideFeeRects(this_event);
    drawDetailView(0,0,0,0);

}

void MempoolStats::showFeeRanges(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("showFeeRanges\n");
        LogPrintf("this_event->type() %s\n",this_event->type());
    }

};
void MempoolStats::hideFeeRanges(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("hideFeeRanges\n");
        LogPrintf("this_event->type() %s\n",this_event->type());
    }

};

void MempoolStats::showFeeRects(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("leaveEvent\n");
        LogPrintf("this_event->type() %s\n",this_event->type());
    }

};
void MempoolStats::hideFeeRects(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("leaveEvent\n");
        LogPrintf("this_event->type() %s\n",this_event->type());
    }

};

