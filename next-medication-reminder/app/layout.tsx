"use client";
import "./globals.css";

import React from "react";
import { TaskStatusProvider } from "./TaskStatusContext"; // adjust the path as needed

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body>
                <TaskStatusProvider>{children}</TaskStatusProvider>
            </body>
        </html>
    );
}
