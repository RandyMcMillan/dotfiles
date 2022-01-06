#include <qt/mempool_tab/mempoolstats.h>
#include <qt/mempool_tab/mempooldetail.h>

static const char    *LABEL_FONT                 = "Arial";
static int           LABEL_TITLE_SIZE            = 22;
static int           LABEL_KV_SIZE               = 12;
static const int     LABEL_LEFT_SIZE             = 0;// space + #.# MvB -- //
static const int     LABEL_RIGHT_SIZE            = 0;

static float         POINT_SIZE                  = 12;


static const int     GRAPH_PADDING_LEFT          = 50+LABEL_LEFT_SIZE;
static const int     GRAPH_PADDING_LEFT_ADJUST   = 35;
static const int     GRAPH_PADDING_RIGHT         = 20+LABEL_RIGHT_SIZE;
static const int     GRAPH_PADDING_TOP           = 50;
static const int     GRAPH_PADDING_TOP_LABEL     = 0;
static const int     GRAPH_PADDING_BOTTOM        = 50; //qreal bottom
//scalar
static const double  GRAPH_MAXHEIGHT_G_SCALAR    = 0.7;

static const double  GRAPH_PATH_SCALAR           = 1.5;

static const double  GRAPH_HORZ_LINE_SCALAR      = 1.0;

static const int     GRAPH_AMOUNT_OF_HORZ_LINES  = 5;

static const double  GRAPH_X_SCALE_ADJUST        = 1.0;//TODO: this will be dynamic via a gui pill box later x_increment in mempoolstats.cpp


bool const GRAPH_ADD_TOTAL_TEXT                  = true;

static const int     ITEM_TX_COUNT_PADDING_LEFT  = 5;
static const int     ITEM_TX_COUNT_PADDING_RIGHT = 5;

const qreal C_X                                  = 0;
const qreal C_W                                  = 12;
const qreal C_H                                  = 12;
const qreal C_MARGIN                             = 4;

static const int     DETAIL_PADDING_LEFT         = C_W+5;
static const int     DETAIL_PADDING_RIGHT        = 50;//inside m_gfx_view
static const double  DETAIL_VIEW_MIN_WIDTH       = 250.0+DETAIL_PADDING_LEFT+DETAIL_PADDING_RIGHT;
static const double  DETAIL_VIEW_MAX_WIDTH       = 250.0+DETAIL_PADDING_LEFT+DETAIL_PADDING_RIGHT;

static const int     DETAIL_PADDING_TOP          = 0;
static const int     DETAIL_PADDING_BOTTOM       = 0;//used to calculate qreal bottom in mempooldetail.cpp
static const double  DETAIL_VIEW_MIN_HEIGHT      = 2*DETAIL_VIEW_MIN_WIDTH;
static const double  DETAIL_VIEW_MAX_HEIGHT      = 2*DETAIL_VIEW_MAX_WIDTH;

static const double  DETAIL_WIDTH_SCALAR         = 1.0;
static const double  DETAIL_HEIGHT_SCALAR        = 1.0;
bool const DETAIL_ADD_TOTAL_TEXT                 = true;

bool const MEMPOOL_GRAPH_LOGGING                 = false;
bool const MEMPOOL_HORZ_LINE_LOGGING             = true;
bool const MEMPOOL_DETAIL_LOGGING                = true;
bool const DETAIL_VIEW_HIDE_EVENT                = false;

bool const ADD_TEXT                              = true;
bool const ADD_FEE_RANGES                        = true;
bool const ADD_FEE_RECTS                         = true;

static const qreal FEE_TEXT_Z                    = 10;

const static std::vector<QColor> colors = {

QColor(212,29, 97, 255), //0-1
QColor(140,43,168, 255), //1-2
QColor(93, 58,175, 255), //2-3
QColor(57, 76,169, 255), //3-4
QColor(40,138,226, 255), //4-5
QColor(30,157,227, 255), //5-6
QColor(34,172,192, 255), //6-8
QColor(25,137,123, 255), //8-10
QColor(74,159, 75, 255), //10-12
QColor(127,178,72, 255), //12-15
QColor(192,201,64, 255), //15-20
QColor(252,214,69, 255), //20-30
QColor(253,178,39, 255), //30-40
QColor(248,139,33, 255), //40-50
QColor(240,80, 42, 255), //60-70
QColor(108,76, 66, 255), //70-80
QColor(117,117,117,255), //80-90
QColor(85,110,121, 255), //100-125
QColor(180,28, 34, 255), //125-150
QColor(134,17, 79, 255), //175-200
QColor(73, 27,138, 255), //200-250
QColor(48, 33,144, 255), //250-300
QColor(26, 39,124, 255), //300-350
QColor(18, 74,159, 255), //350-400
QColor(12, 89,153, 255), //450-500
QColor(14, 96,99,  255), //500-550
QColor(33, 93,35,  255), //700-750
//
QColor(10, 77,64,  255), //600-650
//reverse order
QColor(33, 93,35,  255), //700-750
QColor(14, 96,99,  255), //500-550
QColor(12, 89,153, 255), //450-500
QColor(18, 74,159, 255), //350-400
QColor(26, 39,124, 255), //300-350
QColor(48, 33,144, 255), //250-300
QColor(73, 27,138, 255), //200-250
QColor(134,17, 79, 255), //175-200
QColor(180,28, 34, 255), //125-150
QColor(85,110,121, 255), //100-125
QColor(117,117,117,255), //80-90
QColor(108,76, 66, 255), //70-80
QColor(240,80, 42, 255), //60-70
QColor(248,139,33, 255), //40-50
QColor(253,178,39, 255), //30-40
QColor(252,214,69, 255), //20-30
QColor(192,201,64, 255), //15-20
QColor(127,178,72, 255), //12-15
QColor(74,159, 75, 255), //10-12
QColor(25,137,123, 255), //8-10
QColor(34,172,192, 255), //6-8
QColor(30,157,227, 255), //5-6
QColor(40,138,226, 255), //4-5
QColor(57, 76,169, 255), //3-4
QColor(93, 58,175, 255), //2-3
QColor(140,43,168, 255), //1-2
QColor(212,29, 97, 255), //0-1

};
