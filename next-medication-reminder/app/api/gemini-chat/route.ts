import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text:
                                    "You are a cute and kind Bruno the Bear. Answer this message like you would to a kid, with the utmost kindness and not too long: " +
                                    message,
                            },
                        ],
                    },
                ],
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return NextResponse.json(
                { error: data.error.message },
                { status: data.error.code }
            );
        }

        return NextResponse.json({
            reply:
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "No response from Gemini.",
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
