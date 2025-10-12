
// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <qt/mempoolfeetables.h>

#include <qt/guiutil.h>

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
        }
    } else if (role == Qt::TextAlignmentRole) {
        switch (column) {
        case FeeRange:
            return QVariant(Qt::AlignLeft | Qt::AlignVCenter);
        case TxCount:
            return QVariant(Qt::AlignLeft | Qt::AlignVCenter);
        case TotalSize:
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
                }
            } else { // DescendingOrder
                switch (static_cast<ColumnIndex>(column)) {
                case FeeRange:
                    return a.fee_from > b.fee_from;
                case TxCount:
                    return a.tx_count > b.tx_count;
                case TotalSize:
                    return a.total_size > b.total_size;
                }
            }
            return false; // Should not be reached
        });
    endResetModel();
}

void MempoolFeeTableModel::updateModel(const std::vector<interfaces::mempool_feeinfo>& fee_info)
{
    QList<interfaces::mempool_feeinfo> new_fee_data;
    new_fee_data.reserve(fee_info.size());
    for (const auto& entry : fee_info) {
        new_fee_data.append(entry);
    }

    // Handle row addition or removal as suggested in Qt Docs. See:
    // - https://doc.qt.io/qt-5/model-view-programming.html#inserting-and-removing-rows
    // - https://doc.qt.io/qt-5/model-view-programming.html#resizable-models
    // We assume that the fee_info vector is sorted by fee_from.
    for (int i = 0; i < m_fee_data.size();) {
        if (i < new_fee_data.size() && m_fee_data.at(i).fee_from == new_fee_data.at(i).fee_from) {
            // Check for modifications in existing rows
            if (m_fee_data.at(i).tx_count != new_fee_data.at(i).tx_count ||
                m_fee_data.at(i).total_size != new_fee_data.at(i).total_size) {
                m_fee_data[i] = new_fee_data[i];
                Q_EMIT dataChanged(index(i, 0), index(i, columnCount() - 1));
            }
            ++i;
            continue;
        }
        // A row has been removed from the table.
        beginRemoveRows(QModelIndex(), i, i);
        m_fee_data.erase(m_fee_data.begin() + i);
        endRemoveRows();
    }

    if (m_fee_data.size() < new_fee_data.size()) {
        // Some rows have been added to the end of the table.
        beginInsertRows(QModelIndex(), m_fee_data.size(), new_fee_data.size() - 1);
        m_fee_data.swap(new_fee_data);
        endInsertRows();
    } else {
        m_fee_data.swap(new_fee_data);
    }

    const auto top_left = index(0, 0);
    const auto bottom_right = index(rowCount() - 1, columnCount() - 1);
    Q_EMIT dataChanged(top_left, bottom_right);
}
