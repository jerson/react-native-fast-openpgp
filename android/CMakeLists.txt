cmake_minimum_required(VERSION 3.9.0)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 14)
set (BUILD_DIR ${CMAKE_SOURCE_DIR}/build)

add_library(openpgp_bridge SHARED IMPORTED)


file(TO_CMAKE_PATH ${NODE_MODULES_DIR} NODE_MODULES_DIR)


set_target_properties(openpgp_bridge
        PROPERTIES
        IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/src/main/jniLibs/${ANDROID_ABI}/libopenpgp_bridge.so
        )

add_library(fast-openpgp
        SHARED
        "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi/jsi.cpp"
        ../cpp/react-native-fast-openpgp.cpp
        ../cpp/react-native-fast-openpgp.h
        fast-openpgp-adapter.cpp
)

include_directories(
        fast-openpgp
        PRIVATE
        "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
        ../cpp
)

target_link_libraries(fast-openpgp
        openpgp_bridge
        android
        log)