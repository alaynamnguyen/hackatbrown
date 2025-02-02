import { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/detect_pill",
                destination: "http://localhost:5001/detect_pill", // Proxy to backend
            },
        ];
    },
};

export default nextConfig;
