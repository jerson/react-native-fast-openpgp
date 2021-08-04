#!/usr/bin/env bash
#######################################################
# Usage:                                              #
# ./upgrade_bridge_libs.sh                            #
#                                                     #
# or custom version:                                  #
# VERSION=v0.1.1 ./upgrade_bridge_libs.sh             #
#######################################################

REPO="jerson/openpgp-mobile"
NAME="libopenpgp_bridge"
PLATFORMS=("android" "ios" )
OUTPUT_DIRS=("android/src/main" "ios")
OUTPUT_SUB_DIRS=("" "")
OUTPUT_STRIP_DIRS=(1 1)

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

echo "Using: $VERSION"
echo "--------------------------------------------"

INDEX=0
TMP_DIR=$(dirname $(mktemp -u))
for PLATFORM in "${PLATFORMS[@]}"
do
   :

  OUTPUT_DIR=${OUTPUT_DIRS[$INDEX]}
  OUTPUT_SUB_DIR=${OUTPUT_SUB_DIRS[$INDEX]}
  OUTPUT_STRIP_DIR=${OUTPUT_STRIP_DIRS[$INDEX]}

  FILE_NAME="${NAME}_${PLATFORM}_${VERSION}.tar.gz"
  TMP_FILE="$TMP_DIR/$FILE_NAME" 
  FILE_URL="https://github.com/${REPO}/releases/download/${VERSION}/${FILE_NAME}"

  echo "Platform: $PLATFORM"
  echo "Downloading: $FILE_URL to $TMP_FILE"
  curl -L -o $TMP_FILE "$FILE_URL" 

  echo "Extracting: $TMP_FILE to $OUTPUT_DIR"
  mkdir -p "$OUTPUT_DIR" 
  tar -xz --strip-components=$OUTPUT_STRIP_DIR --directory=$OUTPUT_DIR --file=$TMP_FILE $OUTPUT_SUB_DIR

  INDEX=${INDEX}+1

  echo "Updated"
  echo "--------------------------------------------"
done
#
echo "All updated"
rm ios/libopenpgp_bridge.h || echo "."
