const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors https://whop.com https://*.whop.com",
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'ALLOWALL',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
