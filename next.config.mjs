/** @type {import('next').NextConfig} */
const nextConfig = {
    image: {
        remotePatterns : [
            {
                protocol: 'https',
                hostname: '',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
