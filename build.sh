#!/bin/sh
export BUILD_PATH="./build-$(date +"%d-%m-%Y")"

echo "- Build"
npm run build

echo " - Symlink"
ln -fs $BUILD_PATH build
# ln -fs $BUILD_PATH newBuild
# mv -T newBuild build
