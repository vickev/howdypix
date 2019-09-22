module.exports = function() {
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current"
          }
        }
      ],
      "@babel/preset-typescript"
    ]
  };
};
