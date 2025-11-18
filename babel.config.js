module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@app': './src/app',
            '@navigation': './src/navigation',
            '@utils': './src/utils',
            '@types': './src/types',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@store': './src/store',
            '@constants': './src/constants',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
