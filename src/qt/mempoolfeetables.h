
// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_QT_MEMPOOLFEETABLES_H
#define BITCOIN_QT_MEMPOOLFEETABLES_H

#include <QAbstractTableModel>
#include <QList>
#include <QModelIndex>
#include <QStringList>
#include <QVariant>

#include <qt/clientmodel.h>

/**
   Qt model providing information about mempool fee ranges.
 */
class MempoolFeeTableModel : public QAbstractTableModel
{
    Q_OBJECT

public:
    explicit MempoolFeeTableModel(QObject* parent = nullptr);
    ~MempoolFeeTableModel();

    enum ColumnIndex {
        FeeRange = 0,
        TxCount,
        TotalSize,
        TotalWeight
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
    void updateModel(const std::vector<interfaces::mempool_feeinfo>& fee_info);
    void setSelectedRange(int range);

private:
    QList<interfaces::mempool_feeinfo> m_fee_data;
    int m_selected_range = -1;
    int m_sort_column = -1;
    Qt::SortOrder m_sort_order = Qt::AscendingOrder;
    const QStringList columns{
        /*: Title of Mempool Fee Table column which contains the fee range. */
        tr("Fee Range (sat/vB)   "),
        /*: Title of Mempool Fee Table column which contains the number of transactions in the fee range. */
        tr("Transactions   "),
        /*: Title of Mempool Fee Table column which contains the total size of transactions in the fee range. */
        tr("   Total Size"),
        tr("   Total Weight (WU)")};

    static const std::vector<QString> FEE_RANGE_STRINGS;
};

#endif // BITCOIN_QT_MEMPOOLFEETABLES_H
