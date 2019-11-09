const packageName = require("../package").name;

const load = (type, names) => {
  const ret = {};

  names.forEach(name => {
    ret[name];

    try {
      ret[name] = require.resolve(`@babel/${type}-${name}`);
    } catch (e) {
      // Because we use Lerna, the package might be in this location in development...
      ret[
        name
      ] = `./node_modules/${packageName}/node_modules/@babel/${type}-${name}`;
    }
  });

  return ret;
};

module.exports.loadPresets = presets => load("preset", presets);
module.exports.loadPlugins = plugins => load("plugin", plugins);
