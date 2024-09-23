export default {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
        // This tells Babel to preserve ES modules when it compiles
        modules: false,
      },
    ],
  ],
};
