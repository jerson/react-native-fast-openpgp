#!/usr/bin/env bash
#######################################################
# Usage:                                              #
# ./upgrade_bridge_libs.sh                            #
#                                                     #
# or custom version:                                  #
# VERSION=v0.1.1 ./upgrade_bridge_libs.sh             #
#######################################################

REPO="jerson/openpgp-mobile"
NAME="gomobile_openpgp"
FRAMEWORK="Openpgp"
PLATFORMS=("android_aar" "ios_framework")
OUTPUT_DIRS=("android/libs" "ios")
OUTPUT_SUB_DIRS=("" "")

#######################################################
# you shouldn't edit below this line                  #
#######################################################


echo "Get latest release"
RELEASE_PAYLOAD=$(curl --silent "https://api.github.com/repos/$REPO/releases/latest")

get_version() {
  echo "$RELEASE_PAYLOAD" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/'
}

LATEST_VERSION=$(get_version $REPO)
VERSION=${VERSION:-$LATEST_VERSION}

rm -rf ios/${FRAMEWORK}.framework.zip ios/${FRAMEWORK}.framework

echo "Using: $VERSION"
echo "--------------------------------------------"

INDEX=0
for PLATFORM in "${PLATFORMS[@]}"
do
   :
  OUTPUT_DIR=${OUTPUT_DIRS[$INDEX]}
  OUTPUT_SUB_DIR=${OUTPUT_SUB_DIRS[$INDEX]}
  OUTPUT_STRIP_DIR=${OUTPUT_STRIP_DIRS[$INDEX]}
  echo "Platform: $PLATFORM"
  FILE_URL="https://github.com/${REPO}/releases/download/${VERSION}/${NAME}_${PLATFORM}_${VERSION}.tar.gz"
  echo "Downloading: $FILE_URL to $OUTPUT_DIR"

  mkdir -p "$OUTPUT_DIR"
  wget -c "$FILE_URL" -O - | tar --strip-components=1 -xz -C "$OUTPUT_DIR" "$OUTPUT_SUB_DIR"

  INDEX=${INDEX}+1

  echo "Updated"
  echo "--------------------------------------------"
done

#
echo "All updated"

echo "Compress framework"
cd ios && \
   zip -r ${FRAMEWORK}.framework.zip ${FRAMEWORK}.framework && \
   rm -rf ${FRAMEWORK}.framework

