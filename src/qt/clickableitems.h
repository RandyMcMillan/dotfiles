// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef BITCOIN_QT_CLICKABLEITEMS_H
#define BITCOIN_QT_CLICKABLEITEMS_H

#include <QGraphicsItem>
#include <QGraphicsRectItem>
#include <QGraphicsSceneMouseEvent>
#include <QGraphicsSimpleTextItem>
#include <QObject>

class ClickableTextItem : public QObject, public QGraphicsSimpleTextItem
{
    Q_OBJECT
protected:
    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
Q_SIGNALS:
    void objectClicked(QGraphicsItem*);
};

class ClickableRectItem : public QObject, public QGraphicsRectItem
{
    Q_OBJECT
protected:
    void mousePressEvent(QGraphicsSceneMouseEvent *event) override;
Q_SIGNALS:
    void objectClicked(QGraphicsItem*);
};

#endif // BITCOIN_QT_CLICKABLEITEMS_H
