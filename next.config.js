/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config, { dev, isServer }) => {
        config.cache = false;
        return config;
    },
}

module.exports = nextConfig
