module.exports = function() {
  return {
    presets: [
      [
        "./node_modules/@howdypix/babel-preset/node_modules/@babel/preset-env",
        {
          targets: {
            node: "current"
          }
        }
      ],
      "./node_modules/@howdypix/babel-preset/node_modules/@babel/preset-typescript"
    ]
  };
};
