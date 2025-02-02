"use client";

import { useState } from "react";
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

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        speechSynthesis.speak(utterance);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input, voice: useVoice }),
            });

            const data = await response.json();
            setMessages([
                ...messages,
                userMessage,
                { text: data.reply, sender: "bruno" },
            ]);
            if (useVoice) speak(data.reply);
        } catch (error) {
            console.error("Error chatting with Bruno:", error);
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.welcomeText}>Chat with Bruno the Bear 🐻</h1>

            {/* Animated Cute Bear Character */}
            <motion.div
                className={styles.bearContainer}
                animate={{ y: [0, -5, 0], rotate: [-2, 2, -2, 2, 0] }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                }}
            >
                <Image
                    src="./bear.png"
                    alt="Bruno the Bear"
                    width={200}
                    height={200}
                    className={styles.bearImage}
                />
                <motion.p
                    className={styles.bearSpeech}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                    }}
                >
                    {messages[messages.length - 1].text}
                </motion.p>
            </motion.div>

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
            <div className={styles.voiceToggleContainer}>
                <label>
                    <input
                        type="checkbox"
                        checked={useVoice}
                        onChange={() => setUseVoice(!useVoice)}
                    />{" "}
                    Talk Mode 🎤
                </label>
            </div>
        </div>
    );
}
