const withTM = require('next-transpile-modules')([])

/** @type {import('next').NextConfig} */
module.exports = withTM({
  output: "standalone",
  reactStrictMode: true,
  webpack5: true,
  images: {
    loader: 'custom',
  },
  experimental: { esmExternals: false, /*outputStandalone: true*/ },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules = config.module.rules.map((rule) => {
      if (rule.oneOf instanceof Array) {
        rule.oneOf[rule.oneOf.length - 1].exclude = [
          /\.(js|mjs|jsx|cjs|ts|tsx)$/,
          /\.html$/,
          /\.json$/,
        ]
      }
      return rule
    })
    return config
  },
})
