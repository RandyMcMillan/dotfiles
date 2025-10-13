
// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <qt/mempoolfeetables.h>
#include <qt/mempoolconstants.h>

#include <qt/guiutil.h>
#include <QApplication>

#include <QDebug>

MempoolFeeTableModel::MempoolFeeTableModel(QObject* parent)
    : QAbstractTableModel(parent)
{
}

MempoolFeeTableModel::~MempoolFeeTableModel() = default;

int MempoolFeeTableModel::rowCount(const QModelIndex& parent) const
{
    if (parent.isValid()) {
        return 0;
    }
    return m_fee_data.size();
}

int MempoolFeeTableModel::columnCount(const QModelIndex& parent) const
{
    if (parent.isValid()) {
        return 0;
    }
    return columns.length();
}

void MempoolFeeTableModel::setSelectedRange(int range)
{
    if (m_selected_range != range) {
        m_selected_range = range;
        Q_EMIT dataChanged(index(0, 0), index(rowCount() - 1, columnCount() - 1));
    }
}

QVariant MempoolFeeTableModel::data(const QModelIndex& index, int role) const
{
    if(!index.isValid())
        return QVariant();

    const interfaces::mempool_feeinfo* fee_info = static_cast<const interfaces::mempool_feeinfo*>(index.internalPointer());

    const auto column = static_cast<ColumnIndex>(index.column());
    if (role == Qt::DisplayRole) {
        switch (column) {
        case FeeRange:
            return QString("%1-%2").arg(fee_info->fee_from - 1).arg(fee_info->fee_to - 1);
        case TxCount:
            return (qint64)fee_info->tx_count;
        case TotalSize:
            return GUIUtil::formatBytes(fee_info->total_size);
        case TotalWeight:
            return (qint64)fee_info->total_weight;
        case TotalVBytes:
            return (qint64)fee_info->total_vbytes;
        }
    } else if (role == Qt::BackgroundRole) {
        int row = index.row();
        QColor background_color = colors[(row < static_cast<int>(colors.size()) ? row : static_cast<int>(colors.size()) - 1)];
        if (m_selected_range >= 0 && m_selected_range != row) {
            background_color.setAlpha(100); // Dim non-selected rows
        }
        return background_color;
    } else if (role == Qt::ForegroundRole) {
        if (m_selected_range == index.row()) {
            return QVariant(QApplication::palette().highlightedText().color());
        } else {
            return QVariant(QApplication::palette().windowText().color());
        }
    } else if (role == Qt::TextAlignmentRole) {
        switch (column) {
        case FeeRange:
            return QVariant(Qt::AlignLeft | Qt::AlignVCenter);
        case TxCount:
            return QVariant(Qt::AlignLeft | Qt::AlignVCenter);
        case TotalSize:
            return QVariant(Qt::AlignRight | Qt::AlignVCenter);
        case TotalWeight:
            return QVariant(Qt::AlignRight | Qt::AlignVCenter);
        case TotalVBytes:
            return QVariant(Qt::AlignRight | Qt::AlignVCenter);
        }
    }
    return QVariant();
}

QVariant MempoolFeeTableModel::headerData(int section, Qt::Orientation orientation, int role) const
{
    if(orientation == Qt::Horizontal)
    {
        if(role == Qt::DisplayRole && section < columns.size())
        {
            return columns[section];
        } else if (role == Qt::BackgroundRole) {
            return QApplication::palette().window().color();
        }
    }
    return QVariant();
}

Qt::ItemFlags MempoolFeeTableModel::flags(const QModelIndex &index) const
{
    if (!index.isValid()) return Qt::NoItemFlags;

    Qt::ItemFlags retval = Qt::ItemIsSelectable | Qt::ItemIsEnabled;
    return retval;
}

QModelIndex MempoolFeeTableModel::index(int row, int column, const QModelIndex& parent) const
{
    Q_UNUSED(parent);

    if (0 <= row && row < rowCount() && 0 <= column && column < columnCount()) {
        return createIndex(row, column, const_cast<interfaces::mempool_feeinfo*>(&m_fee_data[row]));
    }

    return QModelIndex();
}



void MempoolFeeTableModel::sort(int column, Qt::SortOrder order)
{
    beginResetModel();
    std::sort(m_fee_data.begin(), m_fee_data.end(),
        [&](const interfaces::mempool_feeinfo& a, const interfaces::mempool_feeinfo& b) {
            if (order == Qt::AscendingOrder) {
                switch (static_cast<ColumnIndex>(column)) {
                case FeeRange:
                    return a.fee_from < b.fee_from;
                case TxCount:
                    return a.tx_count < b.tx_count;
                case TotalSize:
                    return a.total_size < b.total_size;
                case TotalWeight:
                    return a.total_weight < b.total_weight;
                case TotalVBytes:
                    return a.total_vbytes < b.total_vbytes;
                }
            } else { // DescendingOrder
                switch (static_cast<ColumnIndex>(column)) {
                case FeeRange:
                    return a.fee_from > b.fee_from;
                case TxCount:
                    return a.tx_count > b.tx_count;
                case TotalSize:
                    return a.total_size > b.total_size;
                case TotalWeight:
                    return a.total_weight > b.total_weight;
                case TotalVBytes:
                    return a.total_vbytes > b.total_vbytes;
                }
            }
            return false; // Should not be reached
        });
    endResetModel();
}

void MempoolFeeTableModel::updateModel(const std::vector<interfaces::mempool_feeinfo>& fee_info)
{
    beginResetModel();
    m_fee_data.clear();
    m_fee_data.reserve(fee_info.size());
    for (const auto& entry : fee_info) {
        m_fee_data.append(entry);
    }
    endResetModel();
}
