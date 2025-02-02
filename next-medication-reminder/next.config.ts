import { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    env: {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
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
