// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <QMouseEvent>
#include <QSettings>
#include <QtMath>
#include <interfaces/wallet.h>
#include <qt/clickableitems.h>
#include <qt/clientmodel.h>
#include <qt/forms/ui_mempooldetail.h>
#include <qt/guiutil.h>
#include <qt/mempoolconstants.h>
#include <qt/mempooldetail.h>
#include <qt/platformstyle.h>


const QSize FONT_RANGE(8, 24);
const char mempoolDetailFontSizeKey[] = "mempoolDetailFontSize";


MempoolDetail::MempoolDetail(QWidget* parent) : QWidget(parent)
{
    if (parent) {
        parent->installEventFilter(this);
        raise();
    }

    this->setAutoFillBackground(true);

    QPalette pal = this->palette();
    pal.setColor(QPalette::Window, pal.color(QPalette::Window));
    this->setPalette(pal);

    QSettings settings;
    m_font_size = settings.value(mempoolDetailFontSizeKey, 12).toReal();
    if (m_font_size < FONT_RANGE.width() || m_font_size > FONT_RANGE.height()) {
        m_font_size = 12;
    }

    // autoadjust font size
    QGraphicsTextItem testText("jY"); // screendesign expected 27.5 pixel in width for this string
    testText.setFont(QFont(LABEL_FONT, LABEL_TITLE_SIZE, QFont::Light));
    LABEL_TITLE_SIZE *= 27.5 / testText.boundingRect().width();
    LABEL_KV_SIZE *= 27.5 / testText.boundingRect().width();

    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("LABEL_TITLE_SIZE = %s\n", LABEL_TITLE_SIZE);
        LogPrintf("LABEL_KV_SIZE = %s\n", LABEL_KV_SIZE);
    }

    m_timer = new QTimer(this);
    connect(m_timer, &QTimer::timeout, this, &MempoolDetail::updateFeeTable);
    m_timer->start(1000);
}

void MempoolDetail::setPlatformStyle(const PlatformStyle* platform_style)

{
    m_platform_style = platform_style;
    m_temp_widget = new QWidget(this);
    m_temp_widget->setFixedSize(QSize(100, 22)); // Adjust size as needed to match original button area
    m_top_layout = new QHBoxLayout();
    m_top_layout->addStretch();
    m_top_layout->addWidget(m_temp_widget);

    m_fee_table_model = new MempoolFeeTableModel(this);

    m_fee_table = new QTableView(this);
    m_fee_table->horizontalHeader()->setStretchLastSection(true);
    m_fee_table->scrollToBottom();
    m_fee_table->setModel(m_fee_table_model);
    m_fee_table->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_fee_table->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_fee_table->setEditTriggers(QAbstractItemView::NoEditTriggers);
    m_fee_table->setSelectionBehavior(QAbstractItemView::SelectRows);
    m_fee_table->setSelectionMode(QAbstractItemView::SingleSelection);
    m_fee_table->setAlternatingRowColors(false);
    m_fee_table->setStyleSheet("QTableView { background-color: transparent; border: 1px solid gray; border-radius: 5px; }");
    m_fee_table->setSortingEnabled(true);
    m_fee_table->sortByColumn(m_fee_table_model->m_sort_column, m_fee_table_model->m_sort_order);
    m_fee_table->verticalHeader()->setVisible(false);

    QHeaderView* m_fee_table_header = m_fee_table->horizontalHeader();
    m_fee_table_header->resizeSection(MempoolFeeTableModel::FeeRange, 100);// fits default width
    m_fee_table_header->resizeSection(MempoolFeeTableModel::TxCount, 35);
    m_fee_table_header->resizeSection(MempoolFeeTableModel::TotalSize, 55);
    m_fee_table_header->resizeSection(MempoolFeeTableModel::TotalWeight, 50);

    QVBoxLayout* main_layout = new QVBoxLayout(this);
    main_layout->addLayout(m_top_layout);
    main_layout->addWidget(m_fee_table);
    setLayout(main_layout);

    connect(m_fee_table->selectionModel(), &QItemSelectionModel::currentRowChanged, this, [this](const QModelIndex& current, const QModelIndex& previous) {
        if (!current.isValid()) {
            m_selected_range = -1;
        } else {
            m_selected_range = m_fee_table_model->index(current.row(), 0).data(MempoolFeeTableModel::OriginalIndexRole).toInt();
        }
        if (m_clientmodel) {
            Q_EMIT m_clientmodel->mempoolRangeSelected(m_selected_range);
        }
        m_fee_table_model->setSelectedRange(m_selected_range);
    });
}

void MempoolDetail::setClientModel(ClientModel* model)
{
    m_clientmodel = model;

    if (model) {
        connect(model, &ClientModel::mempoolFeeHistChanged, this, &MempoolDetail::updateFeeTable);
        connect(model, &ClientModel::numBlocksChanged, this, &MempoolDetail::updateFeeTable);
        connect(model, &ClientModel::mempoolRangeSelected, this, &MempoolDetail::onRangeSelected);
        MempoolDetail::updateFeeTable();
    }
}

void MempoolDetail::updateFeeTable()
{
    if (m_clientmodel) {
        QMutexLocker locker(&m_clientmodel->m_mempool_locker);
        if (!m_clientmodel->m_mempool_feehist.empty()) {
            int selected_row = m_fee_table->selectionModel()->currentIndex().row();
            m_fee_table_model->updateModel(m_clientmodel->m_mempool_feehist[0].second);
            QSignalBlocker blocker(m_fee_table->selectionModel());
            if (selected_row >= 0 && selected_row < m_fee_table->model()->rowCount()) {
                m_fee_table->selectRow(selected_row);
            }
        }
    }
}

void MempoolDetail::setFontSize(qreal newSize)
{
    if (newSize < FONT_RANGE.width() || newSize > FONT_RANGE.height())
        return;

    m_font_size = newSize;
    QSettings settings;
    settings.setValue(mempoolDetailFontSizeKey, m_font_size);
    if (m_clientmodel) {
    }
}

void MempoolDetail::onRangeSelected(int range)
{
    QSignalBlocker blocker(m_fee_table->selectionModel());
    int row_to_select = -1;
    for (int i = 0; i < m_fee_table_model->rowCount(); ++i) {
        if (m_fee_table_model->index(i, 0).data(MempoolFeeTableModel::OriginalIndexRole).toInt() == range) {
            row_to_select = i;
            break;
        }
    }

    if (row_to_select != -1) {
        m_fee_table->selectRow(row_to_select);
    } else {
        m_fee_table->clearSelection();
    }
    m_fee_table_model->setSelectedRange(range);
}

void MempoolDetail::mousePressEvent(QMouseEvent* event)
{
    Q_EMIT objectClicked(this);

    QWidget::mousePressEvent(event);
    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("mousePressEvent\n");
        LogPrintf("event->pos().x() %s\n", event->pos().x());
        LogPrintf("event->pos().y() %s\n", event->pos().y());
        LogPrintf("event->type() %s\n", event->type());
        LogPrintf("event->type() %s\n", event->type());
    }

}

void MempoolDetail::mouseReleaseEvent(QMouseEvent* event)
{
    Q_EMIT objectClicked(this);

    QWidget::mouseReleaseEvent(event);
    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("mousePressEvent\n");
        LogPrintf("event->pos().x() %s\n", event->pos().x());
        LogPrintf("event->pos().y() %s\n", event->pos().y());
        LogPrintf("event->type() %s\n", event->type());
        LogPrintf("event->type() %s\n", event->type());
    }
}

void MempoolDetail::mouseDoubleClickEvent(QMouseEvent* event)
{
    Q_EMIT objectClicked(this);

    QWidget::mouseDoubleClickEvent(event);
    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("mousePressEvent\n");
        LogPrintf("event->pos().x() %s\n", event->pos().x());
        LogPrintf("event->pos().y() %s\n", event->pos().y());
    }
}

void MempoolDetail::mouseMoveEvent(QMouseEvent* event)
{
    Q_EMIT objectClicked(this);

    QWidget::mouseMoveEvent(event);
    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("mousePressEvent\n");
        LogPrintf("event->pos().x() %s\n", event->pos().x());
        LogPrintf("event->pos().y() %s\n", event->pos().y());
    }
}

void MempoolDetail::enterEvent(QEnterEvent* event)
{
    Q_EMIT objectClicked(this);

    QEvent* this_event = event;
    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("enterEvent\n");
        LogPrintf("this_event->type() %s\n", this_event->type());
        LogPrintf("this_event->type() %s\n", this_event->type());
    }
    showFeeRanges(this_event);
    showFeeRects(this_event);
}

void MempoolDetail::leaveEvent(QEvent* event)
{
    Q_EMIT objectClicked(this);

    QEvent* this_event = event;
    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("leaveEvent\n");
        LogPrintf("this_event->type() %s\n", this_event->type());
        LogPrintf("this_event->type() %s\n", this_event->type());
    }
    hideFeeRanges(this_event);
    hideFeeRects(this_event);
}

void MempoolDetail::changeEvent(QEvent* e)

{
    // No buttons to update on palette change anymore

    QWidget::changeEvent(e);
}


void MempoolDetail::showFeeRanges(QEvent* event)
{
    QEvent* this_event = event;
    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("leaveEvent\n");
        LogPrintf("this_event->type() %s\n", this_event->type());
        LogPrintf("this_event->type() %s\n", this_event->type());
    }
};
void MempoolDetail::hideFeeRanges(QEvent* event)
{
    QEvent* this_event = event;
    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("leaveEvent\n");
        LogPrintf("this_event->type() %s\n", this_event->type());
        LogPrintf("this_event->type() %s\n", this_event->type());
    }
    updateFeeTable();
};

void MempoolDetail::showFeeRects(QEvent* event)
{
    QEvent* this_event = event;
    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("leaveEvent\n");
        LogPrintf("this_event->type() %s\n", this_event->type());
        LogPrintf("this_event->type() %s\n", this_event->type());
    }
};
void MempoolDetail::hideFeeRects(QEvent* event)
{
    QEvent* this_event = event;
    if (MEMPOOL_GRAPH_LOGGING) {
        LogPrintf("leaveEvent\n");
        LogPrintf("this_event->type() %s\n", this_event->type());
        LogPrintf("this_event->type() %s\n", this_event->type());
    }
};
