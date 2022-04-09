/* eslint-env node */

module.exports = (api) => {
  return {
    target: 'node',
    presets: [
      [
        '@quasar/babel-preset-app',
        api.caller((caller) => caller && caller.target === 'node')
          ? { targets: { node: 'current' } }
          : {},
      ],
    ],
  };
};
