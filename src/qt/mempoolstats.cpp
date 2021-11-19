// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <qt/mempoolstats.h>
#include <qt/forms/ui_mempoolstats.h>
#include <QtMath>

#include <qt/clientmodel.h>
#include <qt/guiutil.h>

static const char *LABEL_FONT = "Roboto Mono";
static int LABEL_TITLE_SIZE = 22;
static int LABEL_KV_SIZE = 12;

static const int LABEL_LEFT_SIZE = 100;//30;
static const int LABEL_RIGHT_SIZE = 30;
static const int GRAPH_PADDING_LEFT = 30+LABEL_LEFT_SIZE;
static const int GRAPH_PADDING_RIGHT = 30+LABEL_RIGHT_SIZE;
static const int GRAPH_PADDING_TOP = 10;
static const int GRAPH_PADDING_TOP_LABEL = 10;
static const int GRAPH_PADDING_BOTTOM = 20;

void ClickableTextItem::mousePressEvent(QGraphicsSceneMouseEvent *event)
{
    Q_EMIT objectClicked(this);
}

void ClickableRectItem::mousePressEvent(QGraphicsSceneMouseEvent *event)
{
    Q_EMIT objectClicked(this);
}

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

    m_gfx_view = new QGraphicsView(this);
    m_scene = new QGraphicsScene(m_gfx_view);
    m_gfx_view->setScene(m_scene);
    m_gfx_view->setBackgroundBrush(QColor(16, 18, 31, 0));
    m_gfx_view->setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform);
    if (m_clientmodel)
        drawChart();
}

void MempoolStats::setClientModel(ClientModel *model)
{
    m_clientmodel = model;
    if (model) {
        connect(model, &ClientModel::mempoolFeeHistChanged, this, &MempoolStats::drawChart);
        drawChart();
    }
}

// define the colors for the feeranges
// TODO: find a more dynamic way to assign colors
const static std::vector<QColor> colors = {

QColor(212,29, 97,255), //0-1
QColor(140,43,168,255), //1-2
QColor(93, 58,175,255), //2-3
QColor(57, 76,169,255), //3-4
QColor(40,138,226,255), //4-5
QColor(30,157,227,255), //5-6
QColor(34,172,192,255), //6-8
QColor(25,137,123,255), //8-10
QColor(74,159, 75,255), //10-12
QColor(127,178,72,255), //12-15
QColor(192,201,64,255), //15-20
QColor(252,214,69,255), //20-30
QColor(253,178,39,255), //30-40
QColor(248,139,33,255), //40-50
QColor(240,80, 42,255), //60-70
QColor(108,76, 66,255), //70-80
QColor(117,117,117,255),//80-90
QColor(85,110,121,255), //100-125
QColor(180,28, 34,255), //125-150
QColor(134,17, 79,255), //175-200
QColor(73, 27,138,255), //200-250
QColor(48, 33,144,255), //250-300
QColor(26, 39,124,255), //300-350
QColor(18, 74,159,255), //350-400
QColor(12, 89,153,255), //450-500
QColor(14, 96,99,255),  //500-550
QColor(10, 77,64,255),  //600-650
QColor(33, 93,35,255),  //700-750

};

void MempoolStats::drawChart()
{
    if (!m_clientmodel)
        return;

    m_scene->clear();

    //
    qreal current_x = GRAPH_PADDING_LEFT;
    const qreal bottom = m_gfx_view->scene()->sceneRect().height()-GRAPH_PADDING_BOTTOM;
    const qreal maxheight_g = (m_gfx_view->scene()->sceneRect().height()-GRAPH_PADDING_TOP-GRAPH_PADDING_TOP_LABEL-GRAPH_PADDING_BOTTOM);


    std::vector<QPainterPath> fee_paths;
    std::vector<size_t> fee_subtotal_txcount;
    size_t max_txcount=0;
    QFont gridFont;
    gridFont.setPointSize(12);
	gridFont.setWeight(QFont::Bold);
    int display_up_to_range = 0;
    qreal maxwidth = m_gfx_view->scene()->sceneRect().width()-GRAPH_PADDING_LEFT-GRAPH_PADDING_RIGHT;
    {
        // we are going to access the clientmodel feehistogram directly avoding a copy
        QMutexLocker locker(&m_clientmodel->m_mempool_locker);

        /* TODO: remove
           helpful for testing/development (loading a prestored dataset)
        */
        //FILE *filestr = fsbridge::fopen("/tmp/statsdump", "rb");
        //CAutoFile file(filestr, SER_DISK, CLIENT_VERSION);
        //file >> m_clientmodel->m_mempool_feehist;
        //file.fclose();

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
                i++;
            }
            if (txcount > max_txcount) max_txcount = txcount;
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
        }

        // calculate the x axis step per sample
        // we ignore the time difference of collected samples due to locking issues
        const qreal x_increment = 1.0 * (width()-GRAPH_PADDING_LEFT-GRAPH_PADDING_RIGHT) / m_clientmodel->m_mempool_max_samples; //samples.size();

        // draw horizontal grid
        QPainterPath tx_count_grid_path(QPointF(current_x, bottom));
        int bottomTxCount = 0;
        for (int i=0; i < amount_of_h_lines; i++)
        {
            qreal lY = bottom-i*(maxheight_g/(amount_of_h_lines-1));
            tx_count_grid_path.moveTo(GRAPH_PADDING_LEFT, lY);
            tx_count_grid_path.lineTo(GRAPH_PADDING_LEFT+maxwidth, lY);

            size_t grid_tx_count = (float)i*(max_txcount_graph-bottomTxCount)/(amount_of_h_lines-1) + bottomTxCount;
            QGraphicsTextItem *item_tx_count = m_scene->addText(QString::number(grid_tx_count), gridFont);
            item_tx_count->setPos(GRAPH_PADDING_LEFT+maxwidth, lY-(item_tx_count->boundingRect().height()/2));
        }

        QPen gridPen(QColor(57,59,69, 200), 0.75, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin);
        m_scene->addPath(tx_count_grid_path, gridPen);


        // draw fee ranges;
        QGraphicsTextItem *fee_range_title = m_scene->addText("Fee ranges\n(sat/b)", gridFont);
        fee_range_title->setPos(2, bottom+10);

        qreal c_y = bottom;
        const qreal c_w = 10;
        const qreal c_h = 20;//10;
        const qreal c_margin = 2;
        c_y-=c_margin;
        int i = 0;
        for (const interfaces::mempool_feeinfo& list_entry : m_clientmodel->m_mempool_feehist[0].second) {
            if (i > display_up_to_range) {
                continue;
            }
            ClickableRectItem *fee_rect = new ClickableRectItem();
                            //(L,   B,   R, Top)
            fee_rect->setRect(10, c_y-7, c_w+100, c_h);

            //Stack of rects on left

            QColor brush_color = colors[(i < static_cast<int>(colors.size()) ? i : static_cast<int>(colors.size())-1)];
            brush_color.setAlpha(100);
            if (m_selected_range >= 0 && m_selected_range != i) {
                // if one item is selected, hide out the other ones
                // fee range boxes
                brush_color.setAlpha(10);
            }

            fee_rect->setBrush(QBrush(brush_color));
            fee_rect->setPen(Qt::NoPen);//no outline only fill with QBrush
            fee_rect->setCursor(Qt::PointingHandCursor);
            connect(fee_rect, &ClickableRectItem::objectClicked, [this, i](QGraphicsItem*item) {
                // if clicked, we select or deselect if selected
                if (m_selected_range == i) {
                    m_selected_range = -1;
                } else {
                    m_selected_range = i;
                }
                drawChart();

                /*TODO remove
                  store the existing feehistory to a temporary file
                */
                //FILE *filestr = fsbridge::fopen("/tmp/statsdump", "wb");
                //CAutoFile file(filestr, SER_DISK, CLIENT_VERSION);
                //file << m_clientmodel->m_mempool_feehist;
                //file.fclose();
            });
            //m_scene->addItem(fee_rect);

            //TODO: fix bug/crash on click
            QGraphicsTextItem *fee_text = m_scene->addText("fee_text", gridFont);
            fee_text->setPlainText(QString::number(list_entry.fee_from)+"-"+QString::number(list_entry.fee_to));
            if (i+1 == static_cast<int>(m_clientmodel->m_mempool_feehist[0].second.size())) {
                fee_text->setPlainText(QString::number(list_entry.fee_from)+"+");
            }
            fee_text->setFont(gridFont);
            fee_text->setPos(4+c_w-7, c_y-7);
            m_scene->addItem(fee_text);
            m_scene->addItem(fee_rect);

            c_y-=c_h+c_margin;
            i++;
        }

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
                    fee_paths.emplace_back(QPointF(current_x, y));
                }
                else {
                    fee_paths[i].lineTo(current_x, y);
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
        pen_color.setAlpha(100);
        brush_color.setAlpha(90);
        if (m_selected_range >= 0 && m_selected_range != i) {
            pen_color.setAlpha(90);
            brush_color.setAlpha(85);
        }
        if (m_selected_range >= 0 && m_selected_range == i) {
            total_text = "transactions in selected fee range: "+QString::number(fee_subtotal_txcount[i]);
        }
        QPen pen_blue(pen_color, 1, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin);
        m_scene->addPath(feepath, pen_blue, QBrush(brush_color));
        i++;
    }

    QGraphicsTextItem *item_tx_count = m_scene->addText(total_text, gridFont);
    item_tx_count->setPos(GRAPH_PADDING_LEFT+(maxwidth/2), bottom);
}

// We override the virtual resizeEvent of the QWidget to adjust tables column
// sizes as the tables width is proportional to the dialogs width.
void MempoolStats::resizeEvent(QResizeEvent *event)
{
    QWidget::resizeEvent(event);
    m_gfx_view->resize(size());
    //m_gfx_view->scene()->setSceneRect(rect().left(), rect().top(),rect().width(),std::max(rect().width(), rect().height()));
    //m_gfx_view->scene()->setSceneRect(rect().left()/2, rect().top()/2,rect().width(),std::max(rect().width()/2, rect().height()/2));//width working
    //m_gfx_view->scene()->setSceneRect(rect().left()/2, rect().top()/1,rect().width(),std::max(rect().width()/2, rect().height()/2));//working better
    //m_gfx_view->scene()->setSceneRect(rect().left()/2, rect().top()/1,rect().width()-GRAPH_PADDING_RIGHT,std::max(rect().width()/2, rect().height()/2));//better
    //m_gfx_view->scene()->setSceneRect(rect().left()/2, rect().top()/1,rect().width()-GRAPH_PADDING_RIGHT,std::max(rect().width()/2, rect().height()/1));//best so far
    m_gfx_view->scene()->setSceneRect(
            rect().left()/2,
            rect().top()/1,
            rect().width()-GRAPH_PADDING_RIGHT,
            std::max(
                rect().width()/2,
                rect().height()/1
            )
        );//best so far
    drawChart();
}

void MempoolStats::showEvent(QShowEvent *event)
{
    QWidget::showEvent(event);
    if (m_clientmodel)
        drawChart();
}
