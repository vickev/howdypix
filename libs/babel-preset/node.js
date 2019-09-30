const loadPresets = require("./src/loadPresets");

let presets = loadPresets(["env", "typescript"]);

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
    ]
  };
};
