
// Copyright (c) 2023 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <qt/mempooltxtables.h>

#include <qt/guiutil.h>
#include <qt/bitcoinunits.h> // New include for BitcoinUnits
#include <QApplication>
#include <QDebug>

MempoolTxTableModel::MempoolTxTableModel(QObject* parent)
    : QAbstractTableModel(parent)
{
    m_sort_column = TxID;
}

MempoolTxTableModel::~MempoolTxTableModel() = default;

int MempoolTxTableModel::rowCount(const QModelIndex& parent) const
{
    if (parent.isValid()) {
        return 0;
    }
    return m_tx_data.size();
}

int MempoolTxTableModel::columnCount(const QModelIndex& parent) const
{
    if (parent.isValid()) {
        return 0;
    }
    return columns.length();
}

QVariant MempoolTxTableModel::data(const QModelIndex& index, int role) const
{
    if(!index.isValid())
        return QVariant();

    const interfaces::WalletTx* wtx = static_cast<const interfaces::WalletTx*>(index.internalPointer());

    const auto column = static_cast<ColumnIndex>(index.column());
    if (role == Qt::DisplayRole) {
        switch (column) {
        case TxID:
            return QString::fromStdString(wtx->tx->GetHash().ToString());
        case Amount:
            return BitcoinUnits::formatWithUnit(BitcoinUnits::Unit::BTC, wtx->credit - wtx->debit, false, BitcoinUnits::SeparatorStyle::ALWAYS);
        case Fee:
            {
                CAmount fee = wtx->debit - wtx->credit - wtx->change;
                return BitcoinUnits::formatWithUnit(BitcoinUnits::Unit::BTC, fee, false, BitcoinUnits::SeparatorStyle::ALWAYS);
            }
        case Status:
            // For now, we'll just indicate if it's in the mempool. More detailed status can be added later.
            return tr("In Mempool");
        default:
            return QVariant();
        }
    } else if (role == Qt::ForegroundRole) {
        if (column == Amount) {
            if (wtx->credit - wtx->debit > 0) {
                return QColor(Qt::black);
            } else if (wtx->credit - wtx->debit < 0) {
                return QColor(Qt::red);
            }
        }
    } else if (role == OriginalIndexRole) {
        // We don't have a simple integer index for WalletTx, so we can return the TXID hash as a string
        return QString::fromStdString(wtx->tx->GetHash().ToString());
    } else if (role == Qt::TextAlignmentRole) {
        switch (column) {
        case TxID:
            return QVariant(Qt::AlignLeft | Qt::AlignVCenter);
        case Amount:
        case Fee:
            return QVariant(Qt::AlignRight | Qt::AlignVCenter);
        case Status:
            return QVariant(Qt::AlignCenter | Qt::AlignVCenter);
        default:
            return QVariant();
        }
    }
    return QVariant();
}

QVariant MempoolTxTableModel::headerData(int section, Qt::Orientation orientation, int role) const
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

Qt::ItemFlags MempoolTxTableModel::flags(const QModelIndex &index) const
{
    if (!index.isValid()) return Qt::NoItemFlags;

    Qt::ItemFlags retval = Qt::ItemIsSelectable | Qt::ItemIsEnabled;
    return retval;
}

QModelIndex MempoolTxTableModel::index(int row, int column, const QModelIndex& parent) const
{
    Q_UNUSED(parent);

    if (0 <= row && row < rowCount() && 0 <= column && column < columnCount()) {
        return createIndex(row, column, const_cast<interfaces::WalletTx*>(&m_tx_data[row]));
    }

    return QModelIndex();
}

void MempoolTxTableModel::sort(int column, Qt::SortOrder order)
{
    m_sort_column = column;
    m_sort_order = order;
    beginResetModel();
    std::sort(m_tx_data.begin(), m_tx_data.end(),
        [&](const interfaces::WalletTx& a, const interfaces::WalletTx& b) {
            if (order == Qt::AscendingOrder) {
                switch (static_cast<ColumnIndex>(column)) {
                case TxID:
                    return a.tx->GetHash().ToString() < b.tx->GetHash().ToString();
                case Amount:
                    return (a.credit - a.debit) < (b.credit - b.debit);
                case Fee:
                    return (a.debit - a.credit - a.change) < (b.debit - b.credit - b.change);
                case Status:
                    return false; // Status is not meaningfully sortable, maintain current order
                default:
                    return false;
                }
            } else { // DescendingOrder
                switch (static_cast<ColumnIndex>(column)) {
                case TxID:
                    return a.tx->GetHash().ToString() > b.tx->GetHash().ToString();
                case Amount:
                    return (a.credit - a.debit) > (b.credit - b.debit);
                case Fee:
                    return (a.debit - a.credit - a.change) > (b.debit - b.credit - b.change);
                case Status:
                    return false; // Status is not meaningfully sortable, maintain current order
                default:
                    return false;
                }
            }
            return false; // Should not be reached
        });
    endResetModel();
}

void MempoolTxTableModel::updateModel(const std::set<interfaces::WalletTx>& wallet_transactions, bool has_active_wallet)
{
    beginResetModel();
    m_tx_data.clear();

    if (!has_active_wallet || wallet_transactions.empty()) {
        endResetModel();
        return;
    }

    for (const auto& wtx : wallet_transactions) {
        // Only add transactions that are currently in the mempool
        // This logic might need to be more sophisticated if we want to show other statuses
        // For now, we assume the set only contains mempool transactions or we filter here.
        // The `drawWalletTxIndicators` in MempoolStats already checks for in_mempool status.
        // We'll rely on that for now, or add a similar check here if needed.
        m_tx_data.append(wtx);
    }
    if (m_sort_column != -1) {
        sort(m_sort_column, m_sort_order);
    }
    endResetModel();
}
