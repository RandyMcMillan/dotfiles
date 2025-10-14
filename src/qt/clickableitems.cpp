// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <qt/clickableitems.h>

void ClickableTextItem::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this); }
void ClickableRectItem::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this); }

ClickableFeePathItem::ClickableFeePathItem(int feeRangeIndex, QGraphicsItem *parent)
    : QGraphicsPathItem(parent),
      m_feeRangeIndex(feeRangeIndex)
{
    setFlag(QGraphicsItem::ItemIsSelectable);
}

void ClickableFeePathItem::mousePressEvent(QGraphicsSceneMouseEvent *event)
{
    Q_UNUSED(event);
    Q_EMIT feePathClicked(m_feeRangeIndex);
}
