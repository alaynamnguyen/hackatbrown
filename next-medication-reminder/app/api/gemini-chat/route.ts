import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${API_KEY}`;

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: { text: message },
            }),
        });

        const data = await response.json();
        await console.log("DATA");
        console.log(data);
        return NextResponse.json({
            reply: data.candidates?.[0]?.output || "No response from Gemini.",
        });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
