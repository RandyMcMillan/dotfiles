/****************************************************************************
** Meta object code from reading C++ file 'mempooldetail.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "qt/mempool_tab/mempooldetail.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'mempooldetail.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.2. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_ClickableTextItemDetail_t {
    QByteArrayData data[4];
    char stringdata0[54];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_ClickableTextItemDetail_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_ClickableTextItemDetail_t qt_meta_stringdata_ClickableTextItemDetail = {
    {
QT_MOC_LITERAL(0, 0, 23), // "ClickableTextItemDetail"
QT_MOC_LITERAL(1, 24, 13), // "objectClicked"
QT_MOC_LITERAL(2, 38, 0), // ""
QT_MOC_LITERAL(3, 39, 14) // "QGraphicsItem*"

    },
    "ClickableTextItemDetail\0objectClicked\0"
    "\0QGraphicsItem*"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_ClickableTextItemDetail[] = {

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

void ClickableTextItemDetail::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<ClickableTextItemDetail *>(_o);
        Q_UNUSED(_t)
        switch (_id) {
        case 0: _t->objectClicked((*reinterpret_cast< QGraphicsItem*(*)>(_a[1]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (ClickableTextItemDetail::*)(QGraphicsItem * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ClickableTextItemDetail::objectClicked)) {
                *result = 0;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject ClickableTextItemDetail::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_ClickableTextItemDetail.data,
    qt_meta_data_ClickableTextItemDetail,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *ClickableTextItemDetail::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *ClickableTextItemDetail::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_ClickableTextItemDetail.stringdata0))
        return static_cast<void*>(this);
    if (!strcmp(_clname, "QGraphicsSimpleTextItem"))
        return static_cast< QGraphicsSimpleTextItem*>(this);
    return QObject::qt_metacast(_clname);
}

int ClickableTextItemDetail::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
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
void ClickableTextItemDetail::objectClicked(QGraphicsItem * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}
struct qt_meta_stringdata_ClickableRectItemDetail_t {
    QByteArrayData data[4];
    char stringdata0[54];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_ClickableRectItemDetail_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_ClickableRectItemDetail_t qt_meta_stringdata_ClickableRectItemDetail = {
    {
QT_MOC_LITERAL(0, 0, 23), // "ClickableRectItemDetail"
QT_MOC_LITERAL(1, 24, 13), // "objectClicked"
QT_MOC_LITERAL(2, 38, 0), // ""
QT_MOC_LITERAL(3, 39, 14) // "QGraphicsItem*"

    },
    "ClickableRectItemDetail\0objectClicked\0"
    "\0QGraphicsItem*"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_ClickableRectItemDetail[] = {

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

void ClickableRectItemDetail::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<ClickableRectItemDetail *>(_o);
        Q_UNUSED(_t)
        switch (_id) {
        case 0: _t->objectClicked((*reinterpret_cast< QGraphicsItem*(*)>(_a[1]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (ClickableRectItemDetail::*)(QGraphicsItem * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ClickableRectItemDetail::objectClicked)) {
                *result = 0;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject ClickableRectItemDetail::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_ClickableRectItemDetail.data,
    qt_meta_data_ClickableRectItemDetail,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *ClickableRectItemDetail::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *ClickableRectItemDetail::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_ClickableRectItemDetail.stringdata0))
        return static_cast<void*>(this);
    if (!strcmp(_clname, "QGraphicsRectItem"))
        return static_cast< QGraphicsRectItem*>(this);
    return QObject::qt_metacast(_clname);
}

int ClickableRectItemDetail::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
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
void ClickableRectItemDetail::objectClicked(QGraphicsItem * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}
struct qt_meta_stringdata_MempoolDetail_t {
    QByteArrayData data[22];
    char stringdata0[280];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_MempoolDetail_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_MempoolDetail_t qt_meta_stringdata_MempoolDetail = {
    {
QT_MOC_LITERAL(0, 0, 13), // "MempoolDetail"
QT_MOC_LITERAL(1, 14, 13), // "objectClicked"
QT_MOC_LITERAL(2, 28, 0), // ""
QT_MOC_LITERAL(3, 29, 8), // "QWidget*"
QT_MOC_LITERAL(4, 38, 10), // "drawDetail"
QT_MOC_LITERAL(5, 49, 13), // "drawFeeRanges"
QT_MOC_LITERAL(6, 63, 6), // "bottom"
QT_MOC_LITERAL(7, 70, 12), // "drawFeeRects"
QT_MOC_LITERAL(8, 83, 8), // "maxwidth"
QT_MOC_LITERAL(9, 92, 19), // "display_up_to_range"
QT_MOC_LITERAL(10, 112, 15), // "fee_subtotal_tx"
QT_MOC_LITERAL(11, 128, 15), // "mousePressEvent"
QT_MOC_LITERAL(12, 144, 12), // "QMouseEvent*"
QT_MOC_LITERAL(13, 157, 5), // "event"
QT_MOC_LITERAL(14, 163, 17), // "mouseReleaseEvent"
QT_MOC_LITERAL(15, 181, 21), // "mouseDoubleClickEvent"
QT_MOC_LITERAL(16, 203, 14), // "mouseMoveEvent"
QT_MOC_LITERAL(17, 218, 12), // "showFeeRects"
QT_MOC_LITERAL(18, 231, 7), // "QEvent*"
QT_MOC_LITERAL(19, 239, 13), // "showFeeRanges"
QT_MOC_LITERAL(20, 253, 12), // "hideFeeRects"
QT_MOC_LITERAL(21, 266, 13) // "hideFeeRanges"

    },
    "MempoolDetail\0objectClicked\0\0QWidget*\0"
    "drawDetail\0drawFeeRanges\0bottom\0"
    "drawFeeRects\0maxwidth\0display_up_to_range\0"
    "fee_subtotal_tx\0mousePressEvent\0"
    "QMouseEvent*\0event\0mouseReleaseEvent\0"
    "mouseDoubleClickEvent\0mouseMoveEvent\0"
    "showFeeRects\0QEvent*\0showFeeRanges\0"
    "hideFeeRects\0hideFeeRanges"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_MempoolDetail[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      12,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       1,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    1,   74,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
       4,    0,   77,    2, 0x0a /* Public */,
       5,    1,   78,    2, 0x0a /* Public */,
       7,    4,   81,    2, 0x0a /* Public */,
      11,    1,   90,    2, 0x0a /* Public */,
      14,    1,   93,    2, 0x0a /* Public */,
      15,    1,   96,    2, 0x0a /* Public */,
      16,    1,   99,    2, 0x0a /* Public */,
      17,    1,  102,    2, 0x0a /* Public */,
      19,    1,  105,    2, 0x0a /* Public */,
      20,    1,  108,    2, 0x0a /* Public */,
      21,    1,  111,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void, 0x80000000 | 3,    2,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void, QMetaType::QReal,    6,
    QMetaType::Void, QMetaType::QReal, QMetaType::Int, QMetaType::Int, QMetaType::Int,    6,    8,    9,   10,
    QMetaType::Void, 0x80000000 | 12,   13,
    QMetaType::Void, 0x80000000 | 12,   13,
    QMetaType::Void, 0x80000000 | 12,   13,
    QMetaType::Void, 0x80000000 | 12,   13,
    QMetaType::Void, 0x80000000 | 18,   13,
    QMetaType::Void, 0x80000000 | 18,   13,
    QMetaType::Void, 0x80000000 | 18,   13,
    QMetaType::Void, 0x80000000 | 18,   13,

       0        // eod
};

void MempoolDetail::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<MempoolDetail *>(_o);
        Q_UNUSED(_t)
        switch (_id) {
        case 0: _t->objectClicked((*reinterpret_cast< QWidget*(*)>(_a[1]))); break;
        case 1: _t->drawDetail(); break;
        case 2: _t->drawFeeRanges((*reinterpret_cast< qreal(*)>(_a[1]))); break;
        case 3: _t->drawFeeRects((*reinterpret_cast< qreal(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 4: _t->mousePressEvent((*reinterpret_cast< QMouseEvent*(*)>(_a[1]))); break;
        case 5: _t->mouseReleaseEvent((*reinterpret_cast< QMouseEvent*(*)>(_a[1]))); break;
        case 6: _t->mouseDoubleClickEvent((*reinterpret_cast< QMouseEvent*(*)>(_a[1]))); break;
        case 7: _t->mouseMoveEvent((*reinterpret_cast< QMouseEvent*(*)>(_a[1]))); break;
        case 8: _t->showFeeRects((*reinterpret_cast< QEvent*(*)>(_a[1]))); break;
        case 9: _t->showFeeRanges((*reinterpret_cast< QEvent*(*)>(_a[1]))); break;
        case 10: _t->hideFeeRects((*reinterpret_cast< QEvent*(*)>(_a[1]))); break;
        case 11: _t->hideFeeRanges((*reinterpret_cast< QEvent*(*)>(_a[1]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (MempoolDetail::*)(QWidget * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&MempoolDetail::objectClicked)) {
                *result = 0;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject MempoolDetail::staticMetaObject = { {
    QMetaObject::SuperData::link<QWidget::staticMetaObject>(),
    qt_meta_stringdata_MempoolDetail.data,
    qt_meta_data_MempoolDetail,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *MempoolDetail::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *MempoolDetail::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_MempoolDetail.stringdata0))
        return static_cast<void*>(this);
    return QWidget::qt_metacast(_clname);
}

int MempoolDetail::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QWidget::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 12)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 12;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 12)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 12;
    }
    return _id;
}

// SIGNAL 0
void MempoolDetail::objectClicked(QWidget * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
