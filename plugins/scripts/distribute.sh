yarn version --no-git-tag-version
cp package.json dist/

pushd `pwd` # store current dir
cd dist

yarn publish --non-interactive --no-git-tag-version --access public
rm package.json

popd # return to original dir
