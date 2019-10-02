const packageName = require("../package").name;

module.exports = function loadPresets(presets) {
  const ret = {};

  presets.forEach(presetName => {
    ret[presetName];

    try {
      ret[presetName] = require.resolve("@babel/preset-" + presetName);
    } catch (e) {
      // Because we use Lerna, the package might be in this location in development...
      ret[presetName] =
        "./node_modules/" +
        packageName +
        "/node_modules/@babel/preset-" +
        presetName;
    }
  });

  return ret;
};
