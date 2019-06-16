const {
  override,
  removeModuleScopePlugin,
  babelInclude,
} = require("customize-cra");
const path = require("path");

module.exports = override(
  removeModuleScopePlugin(),
  babelInclude([
    path.resolve("src"),
    path.resolve("../exchange"),
  ]),
);
