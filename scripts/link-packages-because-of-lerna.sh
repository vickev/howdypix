#!/usr/bin/env bash

rm -rf node_modules/@typescript-eslint node_modules/typescript node_modules/eslint-plugin-*

ln -s ../libs/eslint-config/node_modules/@typescript-eslint/ node_modules/
ln -s ../libs/eslint-config/node_modules/typescript node_modules/

for i in libs/eslint-config/node_modules/eslint-plugin-* ; do
  ln -s ../$i node_modules/
done
