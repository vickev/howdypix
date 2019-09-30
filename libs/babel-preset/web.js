const loadPresets = require("./src/loadPresets");

let presets = loadPresets(["env", "typescript", "react"]);

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
    ]
  };
};
