const { loadPresets, loadPlugins } = require("./src/loadPresets");

let presets = loadPresets(["env", "typescript"]);
let plugins = loadPlugins([
  "proposal-nullish-coalescing-operator",
  "proposal-optional-chaining"
]);

module.exports = function() {
  return {
    presets: [
      [
        presets.env,
        {
          targets: {
            node: "current"
          }
        }
      ],
      presets.typescript
    ],
    plugins: [
      plugins["proposal-nullish-coalescing-operator"],
      plugins["proposal-optional-chaining"]
    ]
  };
};
