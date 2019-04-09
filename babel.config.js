module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        target: "node"
      },
      "@babel/preset-es2015"
    ]
  ],
  plugins: [],
  retainLines: true,
  comments: true
};
