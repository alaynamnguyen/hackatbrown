"use client";

import { useState, useRef } from "react";
import styles from "../page.module.css";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BrunoChatPage() {
    const [messages, setMessages] = useState([
        {
            text: "Hello! I'm Bruno the Bear 🐻. How are you feeling today?",
            sender: "bruno",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [useVoice, setUseVoice] = useState(false);
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]);

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        speechSynthesis.speak(utterance);
    };

    const startRecording = async () => {
        setRecording(true);
        recordedChunks.current = [];

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.current.push(event.data);
            }
        };

        mediaRecorderRef.current.start();
    };

    const stopRecording = async () => {
        setRecording(false);
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.onstop = async () => {
            const blob = new Blob(recordedChunks.current, {
                type: "audio/webm",
            });
            const formData = new FormData();
            formData.append("audio", blob, "voice_message.webm");

            try {
                const response = await fetch("/api/gemini-chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: input }),
                });

                const data = await response.json();
                const reply = data.reply || "Sorry, I didn't understand that.";

                setMessages([...messages, { text: reply, sender: "bruno" }]);
                speak(reply);
            } catch (error) {
                console.error("Error chatting with Gemini:", error);
            }
        };
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/gemini-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            const reply = data.reply || "Sorry, I didn't understand that.";

            setMessages([
                ...messages,
                userMessage,
                { text: reply, sender: "bruno" },
            ]);
            speak(reply);
        } catch (error) {
            console.error("Error chatting with Gemini:", error);
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.welcomeText}>Chat with Bruno the Bear 🐻</h1>
            <Image
                src="/avatars/bear.png"
                alt="Bruno the Bear"
                width={200}
                height={200}
                className={styles.bearImage}
            />
            <div className={styles.chatContainer}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={
                            msg.sender === "bruno"
                                ? styles.brunoMessage
                                : styles.userMessage
                        }
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            {!useVoice ? (
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className={styles.chatInput}
                    />
                    <button
                        onClick={sendMessage}
                        className={styles.sendButton}
                        disabled={loading}
                    >
                        {loading ? "Thinking..." : "Send"}
                    </button>
                </div>
            ) : (
                <div className={styles.voiceControls}>
                    {!recording ? (
                        <button
                            onClick={startRecording}
                            className={styles.startButton}
                        >
                            🎤 Start Talking
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className={styles.stopButton}
                        >
                            🛑 Stop Talking
                        </button>
                    )}
                </div>
            )}
            <div className={styles.voiceToggleContainer}>
                <button
                    onClick={() => setUseVoice(!useVoice)}
                    className={styles.toggleButton}
                >
                    {useVoice
                        ? "Switch to Text Mode"
                        : "Switch to Talk Mode 🎤"}
                </button>
            </div>
        </div>
    );
}
