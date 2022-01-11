// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <QtMath>
#include <QMouseEvent>
#include <qt/guiutil.h>
#include <qt/clientmodel.h>
#include <qt/mempool_tab/mempoolstats.h>
#include <qt/mempool_tab/mempooldetail.h>
#include <qt/mempool_tab/mempoolconstants.h>
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

        LogPrintf("\nLABEL_TITLE_SIZE = %s\n",LABEL_TITLE_SIZE);
        LogPrintf("\nLABEL_KV_SIZE = %s\n",LABEL_KV_SIZE);

    }

    m_gfx_view = new QGraphicsView(this);
    m_detail_view = new MempoolDetail(this);
    m_scene = new QGraphicsScene(m_gfx_view);

    m_gfx_view->setScene(m_scene);
    m_gfx_view->setBackgroundBrush(QColor(16, 18, 31, 127));
    m_gfx_view->setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform);
    m_gfx_view->setMouseTracking(true);
    //m_gfx_view->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    //m_gfx_view->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);

    m_gfx_view->setGeometry(0,0,0,0);

    if (m_clientmodel) {
        drawChart();
    } else { /* TODO: add something to indicate condition... */ };

}

void MempoolStats::drawDetailView(
        qreal detail_x,
        qreal detail_y
        ){

    if (MEMPOOL_GRAPH_LOGGING | MEMPOOL_DETAIL_LOGGING){

        LogPrintf("\ndetail_x = %s\n", detail_x);
        LogPrintf("\ndetail_y = %s\n", detail_y);

    }

    m_detail_view->setGeometry(
            detail_x,
            detail_y,
            std::max(
                (0.0),
                (DETAIL_VIEW_MIN_WIDTH)),
            std::max(
                (0.0),
                (DETAIL_VIEW_MIN_HEIGHT))
            );

    //m_detail_view->drawDetail();//bad - very laggy
    m_detail_view->show();

}

void MempoolStats::drawHorzLines(
        qreal x_increment,
        QPointF current_x_bottom,
        const int amount_of_h_lines,
        qreal maxheight_g,
        qreal maxwidth,
        qreal bottom,
        size_t max_txcount_graph,
        QFont LABELFONT){

    qreal _maxheight = std::max((double)(maxheight_g),(double)(GRAPH_PADDING_TOP+GRAPH_PADDING_BOTTOM));

    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nbottom = %s\n",bottom);
        LogPrintf("\nmaxheight_g = %s\n",maxheight_g);
        LogPrintf("\nmaxwidth = %s\n",maxwidth);
        LogPrintf("\n_maxheight = %s\n",_maxheight);
    }

    QPainterPath tx_count_grid_path(current_x_bottom);
    QPainterPath tick_path(current_x_bottom);
    int bottomTxCount = 0;
    for (int i=0; i < amount_of_h_lines; i++)
    {
        //qreal lY = bottom-i*(maxheight_g/(amount_of_h_lines-1)*GRAPH_HORZ_LINE_Y_SCALAR);
        //scaling
        //qreal lY = bottom-i*(maxheight_g/(amount_of_h_lines-1)*GRAPH_HORZ_LINE_Y_SCALAR);
        qreal lY = bottom-i*(maxheight_g/(amount_of_h_lines-1))*GRAPH_HORZ_LINE_Y_SCALAR;
        //qreal lY = bottom-i*(_maxheight/(amount_of_h_lines-1));
        //TODO: use text rect width to adjust
        tx_count_grid_path.moveTo(GRAPH_HORZ_LINE_X_SCALAR*(GRAPH_PADDING_LEFT+GRAPH_PADDING_LEFT_ADJUST), lY);
        tx_count_grid_path.lineTo(GRAPH_HORZ_LINE_X_SCALAR*(GRAPH_PADDING_LEFT+GRAPH_PADDING_LEFT_ADJUST+maxwidth), lY);

        for (int n=0; n < maxwidth; n++){
                tick_path.moveTo(GRAPH_HORZ_LINE_X_SCALAR*(GRAPH_PADDING_LEFT+GRAPH_PADDING_LEFT_ADJUST+n), bottom);
                tick_path.lineTo(GRAPH_HORZ_LINE_X_SCALAR*(GRAPH_PADDING_LEFT+GRAPH_PADDING_LEFT_ADJUST+n), bottom+3);
                QPen gridPen(QColor(57,59,69,200), 0.1, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin);
                m_scene->addPath(tick_path, gridPen);
                n+=(maxwidth/18);
        }

        size_t grid_tx_count =
            (float)i*(max_txcount_graph-bottomTxCount)/(amount_of_h_lines-1) + bottomTxCount;

        if (MEMPOOL_HORZ_LINE_LOGGING){
            LogPrintf("\ni = %s",i);
            LogPrintf("\nGRAPH_HORZ_LINE_X_SCALAR*(GRAPH_PADDING_LEFT+0        = %s",GRAPH_HORZ_LINE_X_SCALAR*(GRAPH_PADDING_LEFT+0));
            LogPrintf("\nGRAPH_HORZ_LINE_X_SCALAR*(GRAPH_PADDING_LEFT+maxwidth = %s",GRAPH_HORZ_LINE_X_SCALAR*(GRAPH_PADDING_LEFT+maxwidth));
            LogPrintf("\nlY                                                    = %s",lY);
            LogPrintf("\ngrid_tx_count                                         = %s",grid_tx_count);
        }
        //Add text ornament
        if (ADD_TEXT) {
            QString horz_line_range_text = QString::number(grid_tx_count/2.0).rightJustified(4, ' ');
            QGraphicsTextItem *item_tx_count =
                //m_scene->addText(QString::number(grid_tx_count/100).rightJustified(4, ' ')+QString("MvB"), LABELFONT);
                m_scene->addText(QString("%1").arg(horz_line_range_text)+QString(" vB"), LABELFONT);
                //item_tx_count->setPos(GRAPH_PADDING_LEFT+maxwidth, lY-(item_tx_count->boundingRect().height()/2));
                //TODO: use text rect width to adjust
                item_tx_count->setDefaultTextColor(colors[16]);
                item_tx_count->setPos(GRAPH_PADDING_LEFT-40, lY-(item_tx_count->boundingRect().height()/2));
        }
    }

QPen gridPen(QColor(57,59,69,200), 0.75, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin);
m_scene->addPath(tx_count_grid_path, gridPen);

}

void MempoolStats::drawChart()
{
    if (!m_clientmodel)
        return;

    m_scene->clear();

    //
    qreal current_x = 0 + GRAPH_PADDING_LEFT + GRAPH_PADDING_LEFT_ADJUST;
    const qreal bottom = (m_gfx_view->scene()->sceneRect().height() - GRAPH_PADDING_BOTTOM);
    //const qreal maxheight_g = (m_gfx_view->scene()->sceneRect().height() - (GRAPH_PADDING_TOP + GRAPH_PADDING_TOP_LABEL + GRAPH_PADDING_BOTTOM) );
    //const qreal maxheight_g = (m_gfx_view->scene()->sceneRect().height() - (m_gfx_view->scene()->sceneRect().height() * 0.2));
    const qreal maxheight_g = (m_gfx_view->scene()->sceneRect().height() * GRAPH_MAXHEIGHT_G_SCALAR) - GRAPH_PADDING_TOP;


    if (MEMPOOL_GRAPH_LOGGING){

        LogPrintf("\nbottom = %s\n",bottom);
        LogPrintf("\nmaxheight_g = %s\n",maxheight_g);

    }

    std::vector<QPainterPath> fee_paths;
    std::vector<size_t> fee_subtotal_txcount;
    size_t max_txcount=0;
    QFont gridFont;
    gridFont.setPointSize(POINT_SIZE);
    gridFont.setWeight(QFont::Bold);
    int display_up_to_range = 0;
    //let view touch boths sides//we will place an over lay of boxes 
    qreal maxwidth = m_gfx_view->scene()->sceneRect().width() - (GRAPH_PADDING_LEFT + GRAPH_PADDING_LEFT_ADJUST + GRAPH_PADDING_RIGHT);
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

                txcount += list_entry.tx_count;
                fee_subtotal_txcount[i] += list_entry.tx_count;

                if (MEMPOOL_GRAPH_LOGGING){
                    LogPrintf("\ni = %s\n", i);
                    LogPrintf("\ntxcount = %s\n", txcount);
                    LogPrintf("\nlist_entry.tx_count = %s\n", list_entry.tx_count);
                    LogPrintf("\nfee_subtotal_txcount[i] = %s\n",fee_subtotal_txcount[i]);
                }

                i++;
            }
            if (txcount > max_txcount) max_txcount = txcount;

                if (MEMPOOL_GRAPH_LOGGING){
                    LogPrintf("\nmax_txcount = %s\n", max_txcount);
                }

        }

        // hide ranges we don't have txns
        for (size_t i = 0; i < fee_subtotal_txcount.size(); i++) {
            if (MEMPOOL_GRAPH_LOGGING){
                LogPrintf("\nfee_subtotal_txcount.size() = %s\n",fee_subtotal_txcount.size());
            }
            if (fee_subtotal_txcount[i] > 0) {
                display_up_to_range = i;
                if (MEMPOOL_GRAPH_LOGGING){
                    LogPrintf("\nfee_subtotal_txcount[i] = %s\n",fee_subtotal_txcount[i]);
                }
            }
        }

        // make a nice y-axis scale
        const int amount_of_h_lines = GRAPH_AMOUNT_OF_HORZ_LINES;
        if (max_txcount > 0) {
            int val = qFloor(log10(max_txcount/amount_of_h_lines));
            int stepbase = qPow(10.0f, val);
            int step = qCeil((max_txcount/amount_of_h_lines) / stepbase) * stepbase;
            max_txcount_graph = step*amount_of_h_lines;
            if (MEMPOOL_GRAPH_LOGGING){

                LogPrintf("\nval = %s\n", val);
                LogPrintf("\nstepbase = %s\n", stepbase);
                LogPrintf("\nstep = %s\n", step);
                LogPrintf("\nmax_txcount_graph = %s\n", max_txcount_graph);

            }
        }

        // calculate the x axis step per sample
        // we ignore the time difference of collected samples due to locking issues
        // TODO: implement x scale pillbox adjust here
        // Replace GRAPH_X_SCALE_ADJUST with function call connected to pillbox
        //


            if (MEMPOOL_GRAPH_LOGGING){

                LogPrintf("\nm_clientmodel->m_mempool_max_samples = %s\n", m_clientmodel->m_mempool_max_samples);

            }



        const qreal x_increment =
            (width() - (GRAPH_PADDING_LEFT + GRAPH_PADDING_LEFT_ADJUST + GRAPH_PADDING_RIGHT)) / (m_clientmodel->m_mempool_max_samples / GRAPH_X_SCALE_ADJUST); //samples.size();
        QPointF current_x_bottom = QPointF(current_x,bottom);

        drawHorzLines(x_increment, current_x_bottom, amount_of_h_lines, maxheight_g, maxwidth, bottom, max_txcount_graph, gridFont);
        //drawFeeRanges(bottom, gridFont);
        //drawFeeRects(bottom, maxwidth, display_up_to_range, ADD_TEXT, gridFont);

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
                    //fee_paths.emplace_back(QPointF(GRAPH_PATH_SCALAR*current_x, y));//affects scale height draw
                    fee_paths.emplace_back(QPointF(current_x-(0), GRAPH_PATH_SCALAR*y));//scalar affects scale height draw

                }
                else {
                    //              TODO:dynamic scalar
                    //fee_paths[i].lineTo(GRAPH_PATH_SCALAR*current_x, y);//affects scale height draw
                    fee_paths[i].lineTo(current_x, GRAPH_PATH_SCALAR*y);//scalar affects scale height draw

                }
                i++;
            }
            first = false;
        }
    } // release lock for the actual drawing

    int i = 0;




    //QString total_text = "test 267";//tr("").arg(QString::number(m_clientmodel->m_mempool_max_samples*m_clientmodel->m_mempool_collect_intervall/3600));
    //QString total_text = tr("").arg(QString::number(m_clientmodel->m_mempool_max_samples*m_clientmodel->m_mempool_collect_intervall/3600));
    QString total_text = tr("Last %1 hours").arg(QString::number(m_clientmodel->m_mempool_max_samples*m_clientmodel->m_mempool_collect_intervall/3600));

    if (MEMPOOL_CLIENT_MODEL_LOGGING){
            LogPrintf("\nm_mempool_feehist_last_sample_timestamp = %s",(int)m_clientmodel->m_mempool_feehist_last_sample_timestamp);
            LogPrintf("\nm_clientmodel->m_mempool_max_samples = %s",(int)m_clientmodel->m_mempool_max_samples);
            LogPrintf("\nm_clientmodel->m_mempool_collect_interval = %s",(int)m_clientmodel->m_mempool_collect_intervall);
            LogPrintf("\nm_clientmodel->m_mempool_collect_interval/3600 = %s",(int)m_clientmodel->m_mempool_collect_intervall/3600);
            LogPrintf("\ncurrent_x = %s",current_x);
            LogPrintf("\nbottom = %s",bottom);
    }

    //QString total_text = tr("Last %1 hours").arg(QString::number(m_clientmodel->m_mempool_max_samples*m_clientmodel->m_mempool_collect_intervall/3600));
    //QString total_text = "";
    for (auto feepath : fee_paths) {

        pen_color = colors[(i < static_cast<int>(colors.size()) ? i : static_cast<int>(colors.size())-1)];
        brush_color = pen_color;
        pen_color.setAlpha(255);
        brush_color.setAlpha(200);

        //if (i > 0 && i < 31) {
        if (i > 0) {

            if (i > 0 && std::abs(fee_paths[i-1].currentPosition().y() - fee_paths[i].currentPosition().y() ) > POINT_SIZE) {
                QGraphicsTextItem *pathDot =
                m_scene->addText(
                    QString("⦿ (%1,%2)").arg(fee_paths[i-1].currentPosition().x()).arg(fee_paths[i-1].currentPosition().y()-30.0), gridFont);
                pathDot->setPos(fee_paths[i-1].currentPosition().x(), fee_paths[i-1].currentPosition().y()-30.0);
                pathDot->setZValue(i*10);
            } else { /* Check BlockTime */
                QGraphicsTextItem *timeTicker = m_scene->addText(QString("⦿"), gridFont);
                timeTicker->setPos(fee_paths[i-1].currentPosition().x(), bottom+POINT_SIZE);
                timeTicker->setZValue(i*10);
            }

            feepath.lineTo(fee_paths[i-1].currentPosition());
            feepath.connectPath(fee_paths[i-1].toReversed());

            if (MEMPOOL_GRAPH_LOGGING){
                LogPrintf("\ncurrent_x = %s",current_x);
                LogPrintf("\nbottom = %s",bottom);
                LogPrintf("\nfee_paths[i-1].toReversed().length() = %s",(double)fee_paths[i-1].toReversed().length());
            }

        } else {

            //i = 0 condition
            feepath.lineTo(current_x, bottom-(GRAPH_PADDING_TOP));
            feepath.lineTo(current_x, bottom-(0));

            if (MEMPOOL_GRAPH_LOGGING){
                LogPrintf("\ncurrent_x = %s",current_x);
                LogPrintf("\nbottom = %s",bottom);
                LogPrintf("\nfee_paths[i-1].toReversed().length() = %s",(double)fee_paths[i].toReversed().length());
            }

        }

        if (m_selected_range >= 0 && m_selected_range != i) {
            //dimmer
            pen_color.setAlpha(127);
            brush_color.setAlpha(100);
        }
        if (m_selected_range >= 0 && m_selected_range == i) {
            total_text = "transactions in selected fee range: "+QString::number(fee_subtotal_txcount[i]);
        }
        QPen path_pen(pen_color, 1, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin);
        m_scene->addPath(feepath, path_pen, QBrush(brush_color));
        i++;
    }

    if (GRAPH_ADD_TOTAL_TEXT){

        QGraphicsTextItem *item_tx_count = m_scene->addText(total_text, gridFont);
        item_tx_count->setPos(GRAPH_PADDING_LEFT+(maxwidth/2), bottom);

    }

}//end drawChart()

// We override the virtual resizeEvent of the QWidget to adjust tables column
// sizes as the tables width is proportional to the dialogs width.
void MempoolStats::resizeEvent(QResizeEvent *event)
{
    QWidget::resizeEvent(event);

    if (MEMPOOL_GRAPH_RESIZE_EVENT_LOGGING){
        //
        LogPrintf("\nMEMPOOL_GRAPH_RESIZE_EVENT_LOGGING");
        LogPrintf("\nMEMPOOL_GRAPH_RESIZE_EVENT_LOGGING");
        LogPrintf("\nMEMPOOL_GRAPH_RESIZE_EVENT_LOGGING");
        LogPrintf("\nMEMPOOL_GRAPH_RESIZE_EVENT_LOGGING");
        LogPrintf("\nMEMPOOL_GRAPH_RESIZE_EVENT_LOGGING");
        LogPrintf("\nsize().height() = %s",size().height());
        LogPrintf("\nsize().width()  = %s",size().width());

    }

    m_gfx_view->resize(size());

    m_gfx_view->scene()->setSceneRect(
            rect().left()/(LABEL_TITLE_SIZE/10),
            rect().top()/(LABEL_TITLE_SIZE/10),
            rect().width()-GRAPH_PADDING_RIGHT,
            std::max(
                (0.1 * rect().width()),
                (0.99 * rect().height())
        ));

    drawChart();
    drawDetailView(detailX(), detailY());


    QFont gridFont;
    QGraphicsTextItem *enterEvent = m_scene->addText(QString::number(rect().left())+","+QString::number(rect().top()), gridFont);
    enterEvent->setPos(rect().left()/2, rect().top()/2);

    QGraphicsTextItem *centerEvent = m_scene->addText(QString::number(m_gfx_view->width()/2)+","+QString::number(m_gfx_view->height()/2)+"", gridFont);
    centerEvent->setPos(m_gfx_view->width()/2, m_gfx_view->height()/2);

    QGraphicsTextItem *centerEvent_3 = m_scene->addText(QString::number(m_gfx_view->width()/3)+","+QString::number(m_gfx_view->height()/3)+"", gridFont);
    centerEvent_3->setPos(m_gfx_view->width()/3, m_gfx_view->height()/3);

    QGraphicsTextItem *centerEvent_66 = m_scene->addText(QString::number(m_gfx_view->width()*0.66)+","+QString::number(m_gfx_view->height()*0.66)+"", gridFont);
    centerEvent_66->setPos(m_gfx_view->width()*0.66, m_gfx_view->height()*0.66);

}

void MempoolStats::showEvent(QShowEvent *event)
{
    QWidget::showEvent(event);
    if (m_clientmodel)
        drawChart();

    QFont gridFont;
    //QGraphicsTextItem *enterEvent = m_scene->addText(QString::number(rect().left())+","+QString::number(rect().top()), gridFont);
    //enterEvent->setPos(rect().left()/2, rect().top()/2);

    QGraphicsTextItem *centerEvent = m_scene->addText(QString::number(m_gfx_view->width()/2)+","+QString::number(m_gfx_view->height()/2)+"", gridFont);
    centerEvent->setPos(m_gfx_view->width()/2, m_gfx_view->height()/2);

    //QGraphicsTextItem *centerEvent_3 = m_scene->addText(QString::number(m_gfx_view->width()/3)+","+QString::number(m_gfx_view->height()/3)+"", gridFont);
    //centerEvent_3->setPos(m_gfx_view->width()/3, m_gfx_view->height()/3);

    //QGraphicsTextItem *centerEvent_66 = m_scene->addText(QString::number(m_gfx_view->width()*0.66)+","+QString::number(m_gfx_view->height()*0.66)+"", gridFont);
    //centerEvent_66->setPos(m_gfx_view->width()*0.66, m_gfx_view->height()*0.66);

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
        LogPrintf("\nm_gfx_view()->width() =  %s\n",m_gfx_view->width());
    }
    //Calculate a distance from right side of m_gfx_view
    return m_gfx_view->width()-detailWidth()-DETAIL_PADDING_RIGHT;

}
int MempoolStats::detailY(){

    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nm_gfx_view()->height()*(POINT_SIZE/100) =  %s\n",m_gfx_view->height()*(POINT_SIZE/100));
    }
    return (m_gfx_view->height()*(POINT_SIZE/100));

}
int MempoolStats::detailWidth(){

    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nm_gfx_view()->width() =  %s\n", m_gfx_view->width());
        LogPrintf("\n25*rect().width()     =  %s\n", (25*rect().width()));
        LogPrintf("\nDETAIL_VIEW_MIN_WIDTH =  %s\n", DETAIL_VIEW_MIN_WIDTH);
    }

       return std::max(
               (0.25*rect().width()),
               (DETAIL_VIEW_MIN_WIDTH)
               );




    //return m_gfx_view->width()*0.15;

}
int MempoolStats::detailHeight(){

    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nm_gfx_view()->height()*0.5 =  %s\n",m_gfx_view->height()*0.5);
    }
    return m_gfx_view->height()*0.0;

}

void ClickableTextItem::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this); }
void ClickableRectItem::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this); }

void MempoolStats::mousePressEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mousePressEvent(event);
    QMouseEvent *mouseEvent = static_cast<QMouseEvent*>(event);

    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nmousePressEvent\n");
        LogPrintf("\nevent->pos().x() %s\n",event->pos().x());
        LogPrintf("\nevent->pos().y() %s\n",event->pos().y());
    }

    if (MEMPOOL_GRAPH_SINGLE_CLICK_LOGGING){

        // autoadjust font size
        QGraphicsTextItem testText("jY"); //screendesign expected 27.5 pixel in width for this string
        testText.setFont(QFont(LABEL_FONT, LABEL_TITLE_SIZE, QFont::Light));
        LABEL_TITLE_SIZE *= 27.5/testText.boundingRect().width();

        LogPrintf("\nLABEL_TITLE_SIZE = %s\n",LABEL_TITLE_SIZE);
        LogPrintf("\nLABEL_KV_SIZE = %s\n",LABEL_KV_SIZE);

        QFont gridFont;
        //QMouseEvent *mouseEvent = static_cast<QMouseEvent*>(event);
        QGraphicsTextItem *enterEventX = m_scene->addText(QString("⦿"), gridFont);
        enterEventX->setPos(mouseEvent->pos().x()-GRAPH_PADDING_RIGHT, mouseEvent->pos().y()-20.0);
        //enterEventX->setPos(mouseEvent->pos().x()-GRAPH_PADDING_LEFT, mouseEvent->pos().y()-GRAPH_PADDING_TOP);

    }

    if (mouseEvent->pos().x() <= m_gfx_view->width()/2 ){

        drawDetailView(detailX(), detailY());

    } else {

        drawDetailView(GRAPH_PADDING_LEFT+GRAPH_PADDING_LEFT_ADJUST, detailY());

    }
}
void MempoolStats::mouseReleaseEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mouseReleaseEvent(event);

    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nmouseReleaseEvent\n");
        LogPrintf("\nevent->pos().x() %s\n",event->pos().x());
        LogPrintf("\nevent->pos().y() %s\n",event->pos().y());
    }
        // autoadjust font size
    QGraphicsTextItem testText("jY"); //screendesign expected 27.5 pixel in width for this string
    testText.setFont(QFont(LABEL_FONT, LABEL_TITLE_SIZE, QFont::Light));
    LABEL_TITLE_SIZE *= 27.5/testText.boundingRect().width();
    LABEL_KV_SIZE *= 27.5/testText.boundingRect().width();

    if (MEMPOOL_GRAPH_LOGGING){

        LogPrintf("\nLABEL_TITLE_SIZE = %s\n",LABEL_TITLE_SIZE);
        LogPrintf("\nLABEL_KV_SIZE = %s\n",LABEL_KV_SIZE);

    }

    QFont gridFont;
    QMouseEvent *mouseEvent = static_cast<QMouseEvent*>(event);
    QGraphicsTextItem *mouseReleaseItem = m_scene->addText("mouseReleaseEvent: ("+QString::number(mouseEvent->pos().y())+","+QString::number(mouseEvent->pos().x())+")", gridFont);
    mouseReleaseItem->setPos(mouseEvent->pos().x(), mouseEvent->pos().y());
}
void MempoolStats::mouseDoubleClickEvent(QMouseEvent *event) { Q_EMIT objectClicked(this);

    QWidget::mouseDoubleClickEvent(event);
    QMouseEvent *mouseEvent = static_cast<QMouseEvent*>(event);

    if (MEMPOOL_GRAPH_DOUBLE_CLICK_LOGGING){
        LogPrintf("\nmouseDoubleClickEvent\n");
        LogPrintf("\nmouseDoubleClickEvent\n");
        LogPrintf("\nmouseDoubleClickEvent\n");
        LogPrintf("\nmouseDoubleClickEvent\n");
        LogPrintf("\nmouseDoubleClickEvent\n");
        LogPrintf("\nmouseDoubleClickEvent\n");
        LogPrintf("\nevent->pos().x() %s\n",event->pos().x());
        LogPrintf("\nevent->pos().y() %s\n",event->pos().y());
    }

    if (MEMPOOL_GRAPH_DOUBLE_CLICK_LOGGING){

        // autoadjust font size
        QGraphicsTextItem testText("jY"); //screendesign expected 27.5 pixel in width for this string
        testText.setFont(QFont(LABEL_FONT, LABEL_TITLE_SIZE, QFont::Light));
        LABEL_TITLE_SIZE *= 27.5/testText.boundingRect().width();
        LABEL_KV_SIZE *= 27.5/testText.boundingRect().width();

        LogPrintf("\nLABEL_TITLE_SIZE = %s\n",LABEL_TITLE_SIZE);
        LogPrintf("\nLABEL_KV_SIZE = %s\n",LABEL_KV_SIZE);

        QFont gridFont;
        QGraphicsTextItem *mouseDoubleClickItem =
            m_scene->addText("mouseDoubleClickEvent: ("+QString::number(mouseEvent->pos().y())+","+QString::number(mouseEvent->pos().x())+")", gridFont);
        mouseDoubleClickItem->setPos(mouseEvent->pos().x(), mouseEvent->pos().y());

    }

    if (mouseEvent->pos().x() <= m_gfx_view->width()/2 ){

        drawDetailView(detailX(), detailY());

    } else {

        drawDetailView(GRAPH_PADDING_LEFT+GRAPH_PADDING_LEFT_ADJUST, detailY());

    }
    //mempool_right->show();
}
void MempoolStats::mouseMoveEvent(QMouseEvent *mouseEvent) { Q_EMIT objectClicked(this);

    QWidget::mouseMoveEvent(mouseEvent);
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nmouseMoveEvent\n");
        LogPrintf("\nmouseEvent->pos().x() %s\n",mouseEvent->pos().x());
        LogPrintf("\nmouseevent->pos().y() %s\n",mouseEvent->pos().y());
        QFont gridFont;
        QGraphicsTextItem *enterEventX = m_scene->addText("mouseMoveEvent: ("+QString::number(mouseEvent->pos().x())+","+QString::number(mouseEvent->pos().y())+")", gridFont);
        enterEventX->setPos(mouseEvent->pos().x(), mouseEvent->pos().y());
    }
    if (mouseEvent->pos().x() <= m_gfx_view->width()/2 ){

        //drawDetailView(detailX(), detailY());

    } else {

        //drawDetailView(GRAPH_PADDING_LEFT+GRAPH_PADDING_LEFT_ADJUST, detailY());

    }

}

void MempoolStats::enterEvent(QEvent *event) { Q_EMIT objectClicked(this);

    drawChart();

    QEvent *this_event = event;
    QMouseEvent *mouseEvent = static_cast<QMouseEvent*>(event);

    mPoint.setX(mouseEvent->pos().x());
    mPoint.setY(mouseEvent->pos().y());

    if (MEMPOOL_GRAPH_LOGGING){
        QFont gridFont;
        QGraphicsTextItem *enterEventX = m_scene->addText("enterEvent: ("+QString::number(mouseEvent->pos().y())+","+QString::number(mouseEvent->pos().x())+")", gridFont);
        enterEventX->setPos(mouseEvent->pos().y(), mouseEvent->pos().x()-20);//NOTE: cartesian coords is reversed
        LogPrintf("\nenterEvent\n");
        LogPrintf("\nmPoint.rx()\n",(int){mPoint.rx()});
        LogPrintf("\nmPoint.ry()\n",(int){mPoint.ry()});
        LogPrintf("\nthis_event->type()    %s\n",this_event->type());
        LogPrintf("\nmouseEvent->pos().x() %s\n",(int){mouseEvent->pos().x()});
        LogPrintf("\nmouseEvent->pos().y() %s\n",(int){mouseEvent->pos().y()});
    }
    // autoadjust font size
    QGraphicsTextItem testText("jY"); //screendesign expected 27.5 pixel in width for this string
    testText.setFont(QFont(LABEL_FONT, LABEL_TITLE_SIZE, QFont::Light));
    LABEL_TITLE_SIZE *= 27.5/testText.boundingRect().width();
    LABEL_KV_SIZE *= 27.5/testText.boundingRect().width();

    if (MEMPOOL_GRAPH_LOGGING){

        LogPrintf("\nLABEL_TITLE_SIZE = %s\n",LABEL_TITLE_SIZE);
        LogPrintf("\nLABEL_KV_SIZE = %s\n",LABEL_KV_SIZE);

        LogPrintf("\nevent->pos().x() %s\n",mouseEvent->pos().x());
        LogPrintf("\nm_gfx_view->width()/2 %s\n",m_gfx_view->width()/2);

        LogPrintf("\nevent->pos().y() %s\n",mouseEvent->pos().y());
        LogPrintf("\nm_gfx_view->height()/2 %s\n",m_gfx_view->height()/2);
    }

    if (mouseEvent->pos().y() <= m_gfx_view->width()/2 ){

        drawDetailView(detailX(), detailY());

    } else {

        drawDetailView(GRAPH_PADDING_LEFT+GRAPH_PADDING_LEFT_ADJUST, detailY());

    }

}

void MempoolStats::leaveEvent(QEvent *event) { Q_EMIT objectClicked(this);

    drawChart();
QEvent *this_event = event;
if (MEMPOOL_GRAPH_LOGGING){
    LogPrintf("\nleaveEvent\n");
    LogPrintf("\nthis_event->type() %s\n",this_event->type());
}

QMouseEvent *mouseEvent = static_cast<QMouseEvent*>(event);
if (event->type() == QEvent::MouseMove)
  {
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nevent->pos().x() %s\n",mouseEvent->pos().x());
        LogPrintf("\nevent->pos().y() %s\n",mouseEvent->pos().y());
    }
  }
    if (mouseEvent->pos().y() <= m_gfx_view->width()/2 ){

        LogPrintf("\nevent->pos().x() %s\n",mouseEvent->pos().x());
        LogPrintf("\nevent->pos().y() %s\n",mouseEvent->pos().y());
        LogPrintf("\nm_gfx_view->width()/2 %s\n",m_gfx_view->width()/2);

    } else {

        LogPrintf("\nevent->pos().x() %s\n",mouseEvent->pos().x());
        LogPrintf("\nevent->pos().y() %s\n",mouseEvent->pos().y());
        LogPrintf("\nm_gfx_view->width()/2 %s\n",m_gfx_view->width()/2);

    }

    if (MEMPOOL_GRAPH_LOGGING){

        // autoadjust font size
        QGraphicsTextItem testText("jY"); //screendesign expected 27.5 pixel in width for this string
        testText.setFont(QFont(LABEL_FONT, LABEL_TITLE_SIZE, QFont::Light));
        LABEL_TITLE_SIZE *= 27.5/testText.boundingRect().width();
        LABEL_KV_SIZE *= 27.5/testText.boundingRect().width();

        LogPrintf("\nLABEL_TITLE_SIZE = %s\n",LABEL_TITLE_SIZE);
        LogPrintf("\nLABEL_KV_SIZE = %s\n",LABEL_KV_SIZE);

        QFont gridFont;
        QGraphicsTextItem *enterEventX = m_scene->addText(QString::number(mouseEvent->pos().x())+","+QString::number(mouseEvent->pos().y()), gridFont);
        enterEventX->setPos(mouseEvent->pos().x(), mouseEvent->pos().y());
        //hideFeeRanges(this_event);
        //hideFeeRects(this_event);
    }
    if (DETAIL_VIEW_HIDE_EVENT) {
        m_detail_view->hide();
    }

}

void MempoolStats::showFeeRanges(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nshowFeeRanges\n");
        LogPrintf("\nthis_event->type() %s\n",this_event->type());
    }

};
void MempoolStats::hideFeeRanges(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nhideFeeRanges\n");
        LogPrintf("\nthis_event->type() %s\n",this_event->type());
    }

};

void MempoolStats::showFeeRects(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nshowFeeRects\n");
        LogPrintf("\nthis_event->type() %s\n",this_event->type());
    }

};
void MempoolStats::hideFeeRects(QEvent *event){

    QEvent *this_event = event;
    if (MEMPOOL_GRAPH_LOGGING){
        LogPrintf("\nhideFeeRects\n");
        LogPrintf("\nthis_event->type() %s\n",this_event->type());
    }

};

