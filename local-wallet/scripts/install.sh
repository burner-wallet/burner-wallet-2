#!/bin/bash

yarn install

pushd ../burner-ui
yarn install

cd ../exchange
yarn install

cd ../plugins
yarn install

popd
