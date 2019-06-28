module.exports = (baseConfig, env, config) => {

  config.module.rules = [
    {
      test: /\.(ts|tsx)$/,
      loader: require.resolve('awesome-typescript-loader'),
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: "css-loader",
          options: {
            modules: true
          }
        },
        "sass-loader"
      ]
    },
    {
      test: /\.(jpg|png|gif|svg|pdf|ico)$/,
      use: [
          { loader: 'url-loader' }
      ]
    }
  ];
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
