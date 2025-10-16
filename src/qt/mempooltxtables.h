
// Copyright (c) 2023 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_QT_MEMPOOLTXTABLES_H
#define BITCOIN_QT_MEMPOOLTXTABLES_H

#include <QAbstractTableModel>
#include <QList>
#include <QModelIndex>
#include <QStringList>
#include <QVariant>

#include <interfaces/wallet.h>

/**
   Qt model providing information about mempool transactions from the active wallet.
 */
class MempoolTxTableModel : public QAbstractTableModel
{
    Q_OBJECT

public:
    explicit MempoolTxTableModel(QObject* parent = nullptr);
    ~MempoolTxTableModel();

    enum ColumnIndex {
        TxID = 0,
        Amount,
        Fee,
        Status,
        OriginalIndexRole = Qt::UserRole
    };

    /** @name Methods overridden from QAbstractTableModel
        @{*/
    int rowCount(const QModelIndex& parent = QModelIndex()) const override;
    int columnCount(const QModelIndex& parent = QModelIndex()) const override;
    QVariant data(const QModelIndex& index, int role = Qt::DisplayRole) const override;
    QVariant headerData(int section, Qt::Orientation orientation, int role = Qt::DisplayRole) const override;
    QModelIndex index(int row, int column, const QModelIndex& parent = QModelIndex()) const override;
    Qt::ItemFlags flags(const QModelIndex &index) const override;
    void sort(int column, Qt::SortOrder order = Qt::AscendingOrder) override;
    /*@}*/

public Q_SLOTS:
    void updateModel(const std::set<interfaces::WalletTx>& wallet_transactions, bool has_active_wallet);

public:
    QList<interfaces::WalletTx> m_tx_data;
    int m_sort_column = -1;
    Qt::SortOrder m_sort_order = Qt::AscendingOrder;
    const QStringList columns{
        /*: Title of Mempool Tx Table column which contains the transaction ID. */
        tr("TXID"),
        /*: Title of Mempool Tx Table column which contains the amount. */
        tr("Amount"),
        /*: Title of Mempool Tx Table column which contains the fee. */
        tr("Fee"),
        /*: Title of Mempool Tx Table column which contains the status. */
        tr("Status")
    };
};

#endif // BITCOIN_QT_MEMPOOLTXTABLES_H
