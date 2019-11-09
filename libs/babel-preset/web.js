const { loadPresets, loadPlugins } = require("./src/loadPresets");

let presets = loadPresets(["env", "typescript", "react"]);
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
      presets.react,
      presets.typescript
    ],
    plugins: [
      plugins["proposal-nullish-coalescing-operator"],
      plugins["proposal-optional-chaining"]
    ]
  };
};
