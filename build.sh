#!/bin/sh
export BUILD_PATH="./build-$(date +"%d-%m-%Y-t-%H-%M")"

echo "- Build"
npm run build

echo " - Symlink"
ln -s $BUILD_PATH build-new
mv -T build-new build

echo " - Finished!"
