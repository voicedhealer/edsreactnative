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
            '@providers': './src/providers',
            '@assets': './assets',
          },
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
          // Charger toutes les variables du fichier .env
          blocklist: null,
          allowlist: null,
        },
      ],
      'react-native-reanimated/plugin', // Doit être en dernier
    ],
  };
};
