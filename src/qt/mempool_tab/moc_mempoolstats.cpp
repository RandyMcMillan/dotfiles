/****************************************************************************
** Meta object code from reading C++ file 'mempoolstats.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "qt/mempool_tab/mempoolstats.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'mempoolstats.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.2. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_ClickableTextItem_t {
    QByteArrayData data[4];
    char stringdata0[48];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_ClickableTextItem_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_ClickableTextItem_t qt_meta_stringdata_ClickableTextItem = {
    {
QT_MOC_LITERAL(0, 0, 17), // "ClickableTextItem"
QT_MOC_LITERAL(1, 18, 13), // "objectClicked"
QT_MOC_LITERAL(2, 32, 0), // ""
QT_MOC_LITERAL(3, 33, 14) // "QGraphicsItem*"

    },
    "ClickableTextItem\0objectClicked\0\0"
    "QGraphicsItem*"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_ClickableTextItem[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       1,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       1,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    1,   19,    2, 0x06 /* Public */,

 // signals: parameters
    QMetaType::Void, 0x80000000 | 3,    2,

       0        // eod
};

void ClickableTextItem::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<ClickableTextItem *>(_o);
        Q_UNUSED(_t)
        switch (_id) {
        case 0: _t->objectClicked((*reinterpret_cast< QGraphicsItem*(*)>(_a[1]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (ClickableTextItem::*)(QGraphicsItem * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ClickableTextItem::objectClicked)) {
                *result = 0;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject ClickableTextItem::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_ClickableTextItem.data,
    qt_meta_data_ClickableTextItem,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *ClickableTextItem::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *ClickableTextItem::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_ClickableTextItem.stringdata0))
        return static_cast<void*>(this);
    if (!strcmp(_clname, "QGraphicsSimpleTextItem"))
        return static_cast< QGraphicsSimpleTextItem*>(this);
    return QObject::qt_metacast(_clname);
}

int ClickableTextItem::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 1)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 1;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 1)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 1;
    }
    return _id;
}

// SIGNAL 0
void ClickableTextItem::objectClicked(QGraphicsItem * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}
struct qt_meta_stringdata_ClickableRectItem_t {
    QByteArrayData data[4];
    char stringdata0[48];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_ClickableRectItem_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_ClickableRectItem_t qt_meta_stringdata_ClickableRectItem = {
    {
QT_MOC_LITERAL(0, 0, 17), // "ClickableRectItem"
QT_MOC_LITERAL(1, 18, 13), // "objectClicked"
QT_MOC_LITERAL(2, 32, 0), // ""
QT_MOC_LITERAL(3, 33, 14) // "QGraphicsItem*"

    },
    "ClickableRectItem\0objectClicked\0\0"
    "QGraphicsItem*"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_ClickableRectItem[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       1,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       1,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    1,   19,    2, 0x06 /* Public */,

 // signals: parameters
    QMetaType::Void, 0x80000000 | 3,    2,

       0        // eod
};

void ClickableRectItem::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<ClickableRectItem *>(_o);
        Q_UNUSED(_t)
        switch (_id) {
        case 0: _t->objectClicked((*reinterpret_cast< QGraphicsItem*(*)>(_a[1]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (ClickableRectItem::*)(QGraphicsItem * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ClickableRectItem::objectClicked)) {
                *result = 0;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject ClickableRectItem::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_ClickableRectItem.data,
    qt_meta_data_ClickableRectItem,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *ClickableRectItem::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *ClickableRectItem::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_ClickableRectItem.stringdata0))
        return static_cast<void*>(this);
    if (!strcmp(_clname, "QGraphicsRectItem"))
        return static_cast< QGraphicsRectItem*>(this);
    return QObject::qt_metacast(_clname);
}

int ClickableRectItem::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 1)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 1;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 1)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 1;
    }
    return _id;
}

// SIGNAL 0
void ClickableRectItem::objectClicked(QGraphicsItem * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}
struct qt_meta_stringdata_MempoolStats_t {
    QByteArrayData data[33];
    char stringdata0[397];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_MempoolStats_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_MempoolStats_t qt_meta_stringdata_MempoolStats = {
    {
QT_MOC_LITERAL(0, 0, 12), // "MempoolStats"
QT_MOC_LITERAL(1, 13, 13), // "objectClicked"
QT_MOC_LITERAL(2, 27, 0), // ""
QT_MOC_LITERAL(3, 28, 8), // "QWidget*"
QT_MOC_LITERAL(4, 37, 9), // "drawChart"
QT_MOC_LITERAL(5, 47, 14), // "drawDetailView"
QT_MOC_LITERAL(6, 62, 8), // "detail_x"
QT_MOC_LITERAL(7, 71, 8), // "detail_y"
QT_MOC_LITERAL(8, 80, 7), // "detailX"
QT_MOC_LITERAL(9, 88, 7), // "detailY"
QT_MOC_LITERAL(10, 96, 11), // "detailWidth"
QT_MOC_LITERAL(11, 108, 12), // "detailHeight"
QT_MOC_LITERAL(12, 121, 13), // "drawHorzLines"
QT_MOC_LITERAL(13, 135, 11), // "x_increment"
QT_MOC_LITERAL(14, 147, 16), // "current_x_bottom"
QT_MOC_LITERAL(15, 164, 17), // "amount_of_h_lines"
QT_MOC_LITERAL(16, 182, 11), // "maxheight_g"
QT_MOC_LITERAL(17, 194, 8), // "maxwidth"
QT_MOC_LITERAL(18, 203, 6), // "bottom"
QT_MOC_LITERAL(19, 210, 6), // "size_t"
QT_MOC_LITERAL(20, 217, 17), // "max_txcount_graph"
QT_MOC_LITERAL(21, 235, 9), // "LABELFONT"
QT_MOC_LITERAL(22, 245, 15), // "mousePressEvent"
QT_MOC_LITERAL(23, 261, 12), // "QMouseEvent*"
QT_MOC_LITERAL(24, 274, 5), // "event"
QT_MOC_LITERAL(25, 280, 17), // "mouseReleaseEvent"
QT_MOC_LITERAL(26, 298, 21), // "mouseDoubleClickEvent"
QT_MOC_LITERAL(27, 320, 14), // "mouseMoveEvent"
QT_MOC_LITERAL(28, 335, 12), // "showFeeRects"
QT_MOC_LITERAL(29, 348, 7), // "QEvent*"
QT_MOC_LITERAL(30, 356, 13), // "showFeeRanges"
QT_MOC_LITERAL(31, 370, 12), // "hideFeeRects"
QT_MOC_LITERAL(32, 383, 13) // "hideFeeRanges"

    },
    "MempoolStats\0objectClicked\0\0QWidget*\0"
    "drawChart\0drawDetailView\0detail_x\0"
    "detail_y\0detailX\0detailY\0detailWidth\0"
    "detailHeight\0drawHorzLines\0x_increment\0"
    "current_x_bottom\0amount_of_h_lines\0"
    "maxheight_g\0maxwidth\0bottom\0size_t\0"
    "max_txcount_graph\0LABELFONT\0mousePressEvent\0"
    "QMouseEvent*\0event\0mouseReleaseEvent\0"
    "mouseDoubleClickEvent\0mouseMoveEvent\0"
    "showFeeRects\0QEvent*\0showFeeRanges\0"
    "hideFeeRects\0hideFeeRanges"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_MempoolStats[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      16,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       1,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    1,   94,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
       4,    0,   97,    2, 0x0a /* Public */,
       5,    2,   98,    2, 0x0a /* Public */,
       8,    0,  103,    2, 0x0a /* Public */,
       9,    0,  104,    2, 0x0a /* Public */,
      10,    0,  105,    2, 0x0a /* Public */,
      11,    0,  106,    2, 0x0a /* Public */,
      12,    8,  107,    2, 0x0a /* Public */,
      22,    1,  124,    2, 0x0a /* Public */,
      25,    1,  127,    2, 0x0a /* Public */,
      26,    1,  130,    2, 0x0a /* Public */,
      27,    1,  133,    2, 0x0a /* Public */,
      28,    1,  136,    2, 0x0a /* Public */,
      30,    1,  139,    2, 0x0a /* Public */,
      31,    1,  142,    2, 0x0a /* Public */,
      32,    1,  145,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void, 0x80000000 | 3,    2,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void, QMetaType::QReal, QMetaType::QReal,    6,    7,
    QMetaType::Int,
    QMetaType::Int,
    QMetaType::Int,
    QMetaType::Int,
    QMetaType::Void, QMetaType::QReal, QMetaType::QPointF, QMetaType::Int, QMetaType::QReal, QMetaType::QReal, QMetaType::QReal, 0x80000000 | 19, QMetaType::QFont,   13,   14,   15,   16,   17,   18,   20,   21,
    QMetaType::Void, 0x80000000 | 23,   24,
    QMetaType::Void, 0x80000000 | 23,   24,
    QMetaType::Void, 0x80000000 | 23,   24,
    QMetaType::Void, 0x80000000 | 23,   24,
    QMetaType::Void, 0x80000000 | 29,   24,
    QMetaType::Void, 0x80000000 | 29,   24,
    QMetaType::Void, 0x80000000 | 29,   24,
    QMetaType::Void, 0x80000000 | 29,   24,

       0        // eod
};

void MempoolStats::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<MempoolStats *>(_o);
        Q_UNUSED(_t)
        switch (_id) {
        case 0: _t->objectClicked((*reinterpret_cast< QWidget*(*)>(_a[1]))); break;
        case 1: _t->drawChart(); break;
        case 2: _t->drawDetailView((*reinterpret_cast< qreal(*)>(_a[1])),(*reinterpret_cast< qreal(*)>(_a[2]))); break;
        case 3: { int _r = _t->detailX();
            if (_a[0]) *reinterpret_cast< int*>(_a[0]) = std::move(_r); }  break;
        case 4: { int _r = _t->detailY();
            if (_a[0]) *reinterpret_cast< int*>(_a[0]) = std::move(_r); }  break;
        case 5: { int _r = _t->detailWidth();
            if (_a[0]) *reinterpret_cast< int*>(_a[0]) = std::move(_r); }  break;
        case 6: { int _r = _t->detailHeight();
            if (_a[0]) *reinterpret_cast< int*>(_a[0]) = std::move(_r); }  break;
        case 7: _t->drawHorzLines((*reinterpret_cast< const qreal(*)>(_a[1])),(*reinterpret_cast< QPointF(*)>(_a[2])),(*reinterpret_cast< const int(*)>(_a[3])),(*reinterpret_cast< qreal(*)>(_a[4])),(*reinterpret_cast< qreal(*)>(_a[5])),(*reinterpret_cast< qreal(*)>(_a[6])),(*reinterpret_cast< size_t(*)>(_a[7])),(*reinterpret_cast< QFont(*)>(_a[8]))); break;
        case 8: _t->mousePressEvent((*reinterpret_cast< QMouseEvent*(*)>(_a[1]))); break;
        case 9: _t->mouseReleaseEvent((*reinterpret_cast< QMouseEvent*(*)>(_a[1]))); break;
        case 10: _t->mouseDoubleClickEvent((*reinterpret_cast< QMouseEvent*(*)>(_a[1]))); break;
        case 11: _t->mouseMoveEvent((*reinterpret_cast< QMouseEvent*(*)>(_a[1]))); break;
        case 12: _t->showFeeRects((*reinterpret_cast< QEvent*(*)>(_a[1]))); break;
        case 13: _t->showFeeRanges((*reinterpret_cast< QEvent*(*)>(_a[1]))); break;
        case 14: _t->hideFeeRects((*reinterpret_cast< QEvent*(*)>(_a[1]))); break;
        case 15: _t->hideFeeRanges((*reinterpret_cast< QEvent*(*)>(_a[1]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (MempoolStats::*)(QWidget * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&MempoolStats::objectClicked)) {
                *result = 0;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject MempoolStats::staticMetaObject = { {
    QMetaObject::SuperData::link<QWidget::staticMetaObject>(),
    qt_meta_stringdata_MempoolStats.data,
    qt_meta_data_MempoolStats,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *MempoolStats::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *MempoolStats::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_MempoolStats.stringdata0))
        return static_cast<void*>(this);
    return QWidget::qt_metacast(_clname);
}

int MempoolStats::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QWidget::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 16)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 16;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 16)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 16;
    }
    return _id;
}

// SIGNAL 0
void MempoolStats::objectClicked(QWidget * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
