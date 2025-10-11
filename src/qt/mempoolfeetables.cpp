
// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <qt/mempoolfeetables.h>

#include <qt/guiutil.h>

#include <QDebug>

const std::vector<QString> MempoolFeeTableModel::FEE_RANGE_STRINGS = {
    "   0-1",   "   1-2",   "   2-3",    "   3-4",    "   4-5",    "   5-6",
    "   6-8",   "   8-10",  "  10-12",   "  12-15",   "  15-20",   "  20-30",
    "  30-40",  "  40-50",  "  60-70",   "  70-80",   "  80-90",   " 100-125",
    " 125-150", " 175-200", " 200-250",  " 250-300",  " 300-350",  " 350-400",
    " 450-500", " 500-550", " 600-650",  " 700-750",  " 800-850",  " 850-900",
    " 950-1000", "1000-1050", // 32 ranges?
};

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

    const interfaces::mempool_feeinfo& fee_info = m_fee_data.at(index.row());

    const auto column = static_cast<ColumnIndex>(index.column());
    if (role == Qt::DisplayRole) {
        switch (column) {
        case FeeRange:
            if (index.row() < FEE_RANGE_STRINGS.size()) {
                return QString("" + FEE_RANGE_STRINGS.at(index.row()) /*+ " sat/vB"*/);
            } else {
                return QString("N/A");
            }
        case TxCount:
            return (qint64)fee_info.tx_count;
        case TotalSize:
            return GUIUtil::formatBytes(fee_info.total_size);
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
        return createIndex(row, column);
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
    beginResetModel();
    m_fee_data.clear();
    for (const auto& entry : fee_info) {
        m_fee_data.append(entry);
    }
    endResetModel();
}
