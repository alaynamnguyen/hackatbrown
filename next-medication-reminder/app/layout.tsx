import "./globals.css";

export const metadata = {
    title: "HealQuest",
    description:
        "A game for post-surgery pediatric patients to heal through play!",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
