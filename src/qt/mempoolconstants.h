#include <QColor>

static const char    *LABEL_FONT                 = "Roboto Mono";
static int           LABEL_TITLE_SIZE            = 22;
static int           LABEL_KV_SIZE               = 12;

static const int     LABEL_LEFT_SIZE             = 0;// space + #.# MvB -- //
static const int     LABEL_RIGHT_SIZE            = 0;
static const int     GRAPH_PADDING_LEFT          = 100+LABEL_LEFT_SIZE;
static const int     GRAPH_PADDING_RIGHT         = 50 +LABEL_RIGHT_SIZE;
static const int     GRAPH_PADDING_TOP           = 50;
static const int     GRAPH_PADDING_TOP_LABEL     = 0;
static const int     GRAPH_PADDING_BOTTOM        = 50;

static const int     ITEM_TX_COUNT_PADDING_LEFT  = 5;
static const int     ITEM_TX_COUNT_PADDING_RIGHT = 5;
static const int     AMOUNT_OF_H_LINES           = 9;
static const double  GRAPH_PATH_SCALAR           = 1.0;

const qreal C_X                                  = 10;
const qreal C_W                                  = 20;
const qreal C_H                                  = 20;
const qreal C_MARGIN                             = 2;

bool const ADD_TEXT                              = true;
bool const ADD_FEE_RANGES                        = true;
bool const ADD_FEE_RECTS                         = true;
bool const MEMPOOL_GRAPH_LOGGING                 = true;
bool const ADD_TOTAL_TEXT                        = true;

const static std::vector<QColor> colors = {
    // Hue ranges from 120 (Green) down to 0 (Red)
    QColor::fromHsv(120, 255, 255), // Bright Green
    QColor::fromHsv(115, 255, 255),
    QColor::fromHsv(110, 255, 255),
    QColor::fromHsv(105, 255, 255),
    QColor::fromHsv(100, 255, 255),
    QColor::fromHsv(95, 255, 255),
    QColor::fromHsv(90, 255, 255),
    QColor::fromHsv(85, 255, 255),
    QColor::fromHsv(80, 255, 255),
    QColor::fromHsv(75, 255, 255), // Lime/Yellow-Green
    QColor::fromHsv(70, 255, 255),
    QColor::fromHsv(65, 255, 255),
    QColor::fromHsv(60, 255, 255), // Yellow
    QColor::fromHsv(55, 255, 255),
    QColor::fromHsv(50, 255, 255),
    QColor::fromHsv(45, 255, 255),
    QColor::fromHsv(40, 255, 255), // Yellow-Orange
    QColor::fromHsv(35, 255, 255),
    QColor::fromHsv(30, 255, 255),
    QColor::fromHsv(25, 255, 255),
    QColor::fromHsv(20, 255, 255), // Orange
    QColor::fromHsv(15, 255, 255),
    QColor::fromHsv(10, 255, 255),
    QColor::fromHsv(5, 255, 255),
    QColor::fromHsv(0, 255, 255),  // Red
    QColor::fromHsv(0, 255, 200),  // Darker Red
    QColor::fromHsv(0, 255, 150),  // Even Darker Red
    QColor(70, 70, 70, 255)        // Final dark gray/black for extreme values
};
