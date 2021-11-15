const { withFederatedSidecar } = require("@module-federation/nextjs-mf");

const withExposingComponents = withFederatedSidecar({
  name: "cards",
  filename: "static/chunks/remoteEntry.js",
  exposes: {
    "./CardsPage": "./pages/index.tsx",
  },
  shared: {
    react: {
      requiredVersion: false,
      singleton: true,
    },
  },
})

/** @type {import('next').NextConfig} */
module.exports = withExposingComponents({
  reactStrictMode: true,

  // Module Federation support
  webpack(config, options) {
    const { webpack, isServer } = options;
    config.experiments = { topLevelAwait: true };

    config.module.rules.push({
      test: /_app.js/,
      loader: "@module-federation/nextjs-mf/lib/federation-loader.js",
    });
    config.output.publicPath = "auto";
    config.plugins.push(
      new webpack.container.ModuleFederationPlugin({
        remoteType: "var",
        remotes: {
          plasmic_components: "plasmic_components",
        },
        shared: {
          "@module-federation/nextjs-mf/lib/noop": {
            eager: false,
          },
          react: {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
        },
      })
    );
    return config;
  },
})
