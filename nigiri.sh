#!/usr/bin/env bash

set -e
set -u
set -o pipefail

function remove_images() {
  repo=vulpemventures
  images=(
    #old images on Docker HUB
    $repo/bitcoin:latest
    $repo/electrs:latest
    $repo/esplora:latest
    $repo/nigiri-chopsticks:latest
    $repo/liquid:latest
    $repo/electrs-liquid:latest
    $repo/esplora-liquid:latest
    # new images on GH container registry
    ghcr.io/$repo/bitcoin:latest
    ghcr.io/$repo/electrs:latest
    ghcr.io/$repo/esplora:latest
    ghcr.io/$repo/nigiri-chopsticks:latest
    ghcr.io/$repo/liquid:latest
    ghcr.io/$repo/electrs-liquid:latest
    ghcr.io/$repo/esplora-liquid:latest
  )
  for image in ${images[*]}; do
    if [ "$(docker images -q $image)" != "" ]; then
      docker rmi $image 1>/dev/null
      echo "successfully deleted $image"
    fi
  done
}

##/=====================================\
##|      DETECT PLATFORM      |
##\=====================================/
case $OSTYPE in
darwin*) OS="darwin" ;;
linux-gnu*) OS="linux" ;;
*)
  echo "OS $OSTYPE not supported by the installation script"
  exit 1
  ;;
esac

case $(uname -m) in
amd64) ARCH="amd64" ;;
arm64) ARCH="arm64" ;;
x86_64) ARCH="amd64" ;;
*)
  echo "Architecture $ARCH not supported by the installation script"
  exit 1
  ;;
esac

OLD_BIN="$HOME/bin"
BIN="/usr/local/bin"

##/=====================================\
##|     CLEAN OLD INSTALLATION |
##\=====================================/

if [ "$(command -v nigiri)" != "" ]; then
  echo "Nigiri is already installed and will be deleted."
  # check if Docker is running
  if [ -z "$(docker info 2>&1 >/dev/null)" ]; then
    :
  else
    echo
    echo "Info: when uninstalling an old Nigiri version Docker must be running."
    echo
    echo "Be sure to start the Docker daemon before launching this installation script."
    echo
    #exit 1
  fi

  echo "Stopping Nigiri..."
  if [ -z "$(nigiri stop --delete &>/dev/null)" ]; then
    :
  fi

  echo "Removing Nigiri..."
  sudo rm -f $BIN/nigiri
  sudo rm -f $OLD_BIN/nigiri
  sudo rm -rf ~/.nigiri

  echo "Removing local images..."
  remove_images
fi

##/=====================================\
##|     FETCH LATEST RELEASE      |
##\=====================================/
NIGIRI_URL="https://github.com/vulpemventures/nigiri/releases"
LATEST_RELEASE_URL="$NIGIRI_URL/latest"

echo "Fetching $LATEST_RELEASE_URL..."

TAG=$(curl -sL -H 'Accept: application/json' $LATEST_RELEASE_URL | sed -e 's/.*"tag_name":"\([^"]*\)".*/\1/')

echo "Latest release tag = $TAG"

RELEASE_URL="$NIGIRI_URL/download/$TAG/nigiri-$OS-$ARCH"

echo "Fetching $RELEASE_URL..."

curl -sL $RELEASE_URL >nigiri

echo "Moving binary to $BIN..."
sudo mv nigiri $BIN

echo "Setting binary permissions..."
sudo chmod +x $BIN/nigiri

echo "Checking for Docker and Docker compose..."
if [ "$(command -v docker)" == "" ]; then
  echo "Warning: Nigiri uses Docker and it seems not to be installed, check the official documentation for downloading it."
  if [ "$OS" = "darwin" ]; then
    echo "https://docs.docker.com/v17.12/docker-for-mac/install/#download-docker-for-mac"
  else
    echo "https://docs.docker.com/v17.12/install/linux/docker-ce/ubuntu/"
  fi
fi

echo ""
echo "🍣 Nigiri Bitcoin installed!"
