// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_QT_MEMPOOLDETAIL_H
#define BITCOIN_QT_MEMPOOLDETAIL_H

#include <QEvent>
#include <QWidget>
#include <QGraphicsItem>
#include <QGraphicsRectItem>
#include <QGraphicsScene>
#include <QGraphicsSimpleTextItem>
#include <QGraphicsView>

#include <policy/fees.h>

class ClientModel;

class ClickableTextItemDetail : public QObject, public QGraphicsSimpleTextItem
{
    Q_OBJECT
protected:
    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
Q_SIGNALS:
    void objectClicked(QGraphicsItem*);
};

class ClickableRectItemDetail : public QObject, public QGraphicsRectItem
{
    Q_OBJECT
protected:
    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
Q_SIGNALS:
    void objectClicked(QGraphicsItem*);
};


class MempoolDetail : public QWidget
{
    Q_OBJECT

public:
    explicit MempoolDetail(QWidget *parent = Q_NULLPTR);
    void setClientModel(ClientModel *model);

public Q_SLOTS:
    void drawChart();
    void drawFeeRanges(qreal bottom);
    void drawFeeRects(qreal bottom, int maxwidth, int display_up_to_range, int fee_subtotal_tx, bool ADD_TEXT);

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

    QGraphicsView *m_gfx_detail;
    QGraphicsScene *m_scene;

    virtual void enterEvent(QEvent           *event) override;
    virtual void leaveEvent(QEvent           *event) override;
    virtual void resizeEvent(QResizeEvent    *event) override;
    virtual void showEvent(QShowEvent        *event) override;
    virtual void hideEvent(QHideEvent        *event) override;

    int m_selected_range = -1;
};

#endif // BITCOIN_QT_MEMPOOLDETAIL_H
