// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_QT_MEMPOOLDETAIL_H
#define BITCOIN_QT_MEMPOOLDETAIL_H

#include <QEvent>
#include <QWidget>
#include <QToolButton>
#include <QHBoxLayout>
#include <QTimer>

#include <policy/fees.h>

#include <qt/mempoolfeetables.h>
#include <interfaces/wallet.h>

class ClientModel;
class PlatformStyle;

class MempoolDetail : public QWidget
{
    Q_OBJECT

public:
    explicit MempoolDetail(QWidget *parent = Q_NULLPTR);
    void setClientModel(ClientModel *model);
    void setPlatformStyle(const PlatformStyle* platform_style);

public Q_SLOTS:
    void onRangeSelected(int range);
    void fontBigger();
    void fontSmaller();
    void resetFontSize();
    void updateFeeTable();

    void mousePressEvent(QMouseEvent        *event) override;
    void mouseReleaseEvent(QMouseEvent      *event) override;
    void mouseDoubleClickEvent(QMouseEvent  *event) override;
    void mouseMoveEvent(QMouseEvent         *event) override;

    void showFeeRects (QEvent *event);
    void showFeeRanges(QEvent *event);

    void hideFeeRects (QEvent *event);
    void hideFeeRanges(QEvent *event);

Q_SIGNALS:
    void objectClicked(QWidget*);

private:
    ClientModel* m_clientmodel = Q_NULLPTR;
    const PlatformStyle* m_platform_style{nullptr};

    QTableView *m_fee_table{nullptr};
    MempoolFeeTableModel *m_fee_table_model{nullptr};

    virtual void enterEvent(QEnterEvent      *event) override;
    virtual void leaveEvent(QEvent           *event) override;
    void changeEvent(QEvent* e) override;

    int m_selected_range = -1;
    qreal m_font_size;
    void setFontSize(qreal newSize);

    QTimer* m_timer;
    QToolButton* m_font_bigger_button;
    QToolButton* m_font_smaller_button;
    QToolButton* m_font_reset_button;
    QHBoxLayout* m_button_layout;
};

#endif // BITCOIN_QT_MEMPOOLDETAIL_H
