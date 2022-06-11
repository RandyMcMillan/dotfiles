# Copyright (c) 2022 The Bitcoin Core developers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

# See:
#  - https://cmake.org/cmake/help/latest/manual/cmake-qt.7.html
#  - https://doc.qt.io/qt-5/cmake-manual.html

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOUIC_SEARCH_PATHS "${CMAKE_CURRENT_SOURCE_DIR}/forms")

find_package(Qt5 5.11.3 REQUIRED COMPONENTS Widgets Network LinguistTools)
message(STATUS "Found Qt 5, version ${Qt5Core_VERSION_STRING}")

file(GLOB TS_FILES RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} "locale/*.ts")
set_source_files_properties(${TS_FILES} PROPERTIES OUTPUT_LOCATION "${CMAKE_CURRENT_SOURCE_DIR}/locale")
qt5_add_translation(QM_FILES ${TS_FILES})

add_library(bitcoinqt STATIC EXCLUDE_FROM_ALL)
target_sources(bitcoinqt
  PRIVATE
    bantablemodel.cpp
    bitcoin.cpp
    bitcoin.qrc
    bitcoin_locale.qrc
    bitcoinaddressvalidator.cpp
    bitcoinamountfield.cpp
    bitcoingui.cpp
    bitcoinunits.cpp
    clientmodel.cpp
    csvmodelwriter.cpp
    guiutil.cpp
    initexecutor.cpp
    intro.cpp
    modaloverlay.cpp
    networkstyle.cpp
    notificator.cpp
    optionsdialog.cpp
    optionsmodel.cpp
    peertablemodel.cpp
    peertablesortproxy.cpp
    platformstyle.cpp
    qvalidatedlineedit.cpp
    qvaluecombobox.cpp
    rpcconsole.cpp
    splashscreen.cpp
    trafficgraphwidget.cpp
    utilitydialog.cpp
)
if(CMAKE_SYSTEM_NAME STREQUAL Windows)
  target_sources(bitcoinqt PRIVATE winshutdownmonitor.cpp)
endif()
if(CMAKE_SYSTEM_NAME STREQUAL Darwin)
  target_sources(bitcoinqt
    PRIVATE
      macdockiconhandler.mm
      macnotificationhandler.mm
      macos_appnap.mm
)
endif()
# TODO: Rename `node/ui_interface.h`, and drop `SKIP_AUTOUIC ON`.
set_property(
  SOURCE
    bitcoin.cpp
    bitcoingui.cpp
  PROPERTY
    SKIP_AUTOUIC ON
)
target_include_directories(bitcoinqt
  PUBLIC
    $<BUILD_INTERFACE:${CMAKE_SOURCE_DIR}>/src
)
target_link_libraries(bitcoinqt
  PUBLIC
    Qt5::Widgets
  PRIVATE
    rpc_client
    leveldb
)

if(ENABLE_WALLET)
  target_sources(bitcoinqt
    PRIVATE
      addressbookpage.cpp
      addresstablemodel.cpp
      askpassphrasedialog.cpp
      coincontroldialog.cpp
      coincontroltreewidget.cpp
      createwalletdialog.cpp
      editaddressdialog.cpp
      openuridialog.cpp
      overviewpage.cpp
      paymentserver.cpp
      psbtoperationsdialog.cpp
      qrimagewidget.cpp
      receivecoinsdialog.cpp
      receiverequestdialog.cpp
      recentrequeststablemodel.cpp
      sendcoinsdialog.cpp
      sendcoinsentry.cpp
      signverifymessagedialog.cpp
      transactiondesc.cpp
      transactiondescdialog.cpp
      transactionfilterproxy.cpp
      transactionrecord.cpp
      transactiontablemodel.cpp
      transactionview.cpp
      walletcontroller.cpp
      walletframe.cpp
      walletmodel.cpp
      walletmodeltransaction.cpp
      walletview.cpp
  )
  set_property(
    SOURCE
      paymentserver.cpp
      # sendcoinsdialog.cpp
      transactionview.cpp
      walletframe.cpp
      walletmodel.cpp
      walletview.cpp
      node/ui_interface.h
      ../node/ui_interface.h
    PROPERTY
      SKIP_AUTOUIC ON
  )
  target_link_libraries(bitcoinqt PUBLIC Qt5::Network)
endif()

if(CMAKE_CROSSCOMPILING)
  target_compile_definitions(bitcoinqt PRIVATE QT_STATICPLUGIN)
  target_link_libraries(Qt5::Core
    INTERFACE
      ${CMAKE_PREFIX_PATH}/lib/libqtpcre2.a
      ${CMAKE_PREFIX_PATH}/lib/libqtlibpng.a
      ${CMAKE_PREFIX_PATH}/lib/libqtharfbuzz.a
  )
  if(CMAKE_SYSTEM_NAME STREQUAL Linux AND TARGET Qt5::QXcbIntegrationPlugin)
    target_compile_definitions(bitcoinqt PRIVATE QT_QPA_PLATFORM_XCB)
    target_link_libraries(Qt5::Core
      INTERFACE
        -L${CMAKE_PREFIX_PATH}/lib
        freetype
        fontconfig
        xcb
        xcb-icccm
        xcb-image
        xcb-keysyms
        xcb-randr
        xcb-render
        xcb-render-util
        xcb-shape
        xcb-shm
        xcb-sync
        xcb-xfixes
        xcb-xinerama
        xcb-xkb
        xkbcommon
        xkbcommon-x11
    )
  elseif(CMAKE_SYSTEM_NAME STREQUAL Windows AND TARGET Qt5::QWindowsIntegrationPlugin AND TARGET Qt5::QWindowsVistaStylePlugin)
    target_compile_definitions(bitcoinqt PRIVATE QT_QPA_PLATFORM_WINDOWS)
    target_link_libraries(Qt5::Core
      INTERFACE
        dwmapi
        imm32
        netapi32
        shlwapi
        userenv
        uxtheme
        version
        winmm
        wtsapi32
    )
  elseif(CMAKE_SYSTEM_NAME STREQUAL Darwin AND TARGET Qt5::QCocoaIntegrationPlugin AND TARGET Qt5::QMacStylePlugin)
    target_compile_definitions(bitcoinqt PRIVATE QT_QPA_PLATFORM_COCOA)
    target_link_libraries(Qt5::Core
      INTERFACE
        "-framework AppKit"
        "-framework Carbon"
        "-framework CoreVideo"
        "-framework IOKit"
        "-framework IOSurface"
        "-framework Metal"
        "-framework QuartzCore"
        "-framework Security"
    )
  elseif(CMAKE_SYSTEM_NAME STREQUAL Android AND TARGET Qt5::QAndroidPlatformIntegrationPlugin)
    target_compile_definitions(bitcoinqt PRIVATE QT_QPA_PLATFORM_ANDROID)
  endif()
endif()

add_executable(bitcoin-qt)
target_sources(bitcoin-qt
  PRIVATE
    main.cpp
    ../init/bitcoin-qt.cpp
)
target_link_libraries(bitcoin-qt
  PRIVATE
    bitcoinqt
    bitcoin_node
    bitcoin_consensus
    bitcoin_common
    bitcoin_util
    bitcoin_crypto
)
if(CMAKE_SYSTEM_NAME STREQUAL Windows)
  target_link_options(bitcoin-qt PRIVATE -static)
endif()
