#!/bin/bash

echo "Provisioning submodules"
git submodule update --init --recursive

echo "Installing contracts package"
cd ./lib/mStable-contracts
yarn install

echo "Compiling contracts and generating typings"
yarn test-prep
