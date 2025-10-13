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
QColor(100, 149, 237, 255), // Cornflower Blue (very low fee)
QColor(65, 105, 225, 255),  // Royal Blue
QColor(0, 0, 205, 255),     // Medium Blue
QColor(0, 191, 255, 255),   // Deep Sky Blue
QColor(0, 128, 128, 255),   // Teal
QColor(0, 139, 139, 255),   // Dark Cyan
QColor(0, 255, 127, 255),   // Spring Green
QColor(50, 205, 50, 255),   // Lime Green
QColor(34, 139, 34, 255),   // Forest Green
QColor(124, 252, 0, 255),   // Lawn Green
QColor(173, 255, 47, 255),  // Green Yellow
QColor(255, 255, 0, 255),   // Yellow
QColor(255, 215, 0, 255),   // Gold
QColor(255, 165, 0, 255),   // Orange
QColor(255, 140, 0, 255),   // Dark Orange
QColor(255, 99, 71, 255),   // Tomato
QColor(255, 69, 0, 255),    // Orange Red
QColor(255, 0, 0, 255),     // Red
QColor(220, 20, 60, 255),   // Crimson
QColor(178, 34, 34, 255),   // Firebrick
QColor(139, 0, 0, 255),     // Dark Red
QColor(128, 0, 0, 255),     // Maroon
QColor(160, 82, 45, 255),   // Sienna
QColor(139, 69, 19, 255),   // Saddle Brown
QColor(105, 105, 105, 255), // Dim Gray
QColor(70, 130, 180, 255),  // Steel Blue
QColor(112, 128, 144, 255), // Slate Gray
QColor(47, 79, 79, 255)     // Dark Slate Gray (very high fee, almost black)
};
