cmake_minimum_required(VERSION 3.18.0)

include_directories(
        ../cpp
        ../node_modules/react-native/ReactCommon/jsi
)

add_definitions(
        -DFOLLY_USE_LIBCPP=1
        -DFOLLY_NO_CONFIG=1
        -DFOLLY_HAVE_MEMRCHR=1
)

add_library(openpgp_bridge SHARED IMPORTED )

set_target_properties(openpgp_bridge
        PROPERTIES
        IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/src/main/jniLibs/${ANDROID_ABI}/libopenpgp_bridge.so
        )

add_library(fast-openpgp
        SHARED
        ../node_modules/react-native/ReactCommon/jsi/jsi/jsi.cpp
        ../cpp/react-native-fast-openpgp.cpp
        ../cpp/react-native-fast-openpgp.h
        fast-openpgp-adapter.cpp
)

find_library(
        log-lib
        log )

target_link_libraries(fast-openpgp
        openpgp_bridge
        android
        ${log-lib})
