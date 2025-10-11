// Copyright (c) 2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include <qt/clickableitems.h>

void ClickableTextItem::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this); }
void ClickableRectItem::mousePressEvent(QGraphicsSceneMouseEvent *event) { Q_EMIT objectClicked(this); }
