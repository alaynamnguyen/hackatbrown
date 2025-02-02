"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { TaskStatusContext } from "../TaskStatusContext"; // adjust path

export default function BrunoChatPage() {
    const router = useRouter();
    const { setCheckInComplete } = useContext(TaskStatusContext);
    const [messages, setMessages] = useState([
        {
            text: "Hello! I'm Bruno the Bear 🐻. How are you feeling today?",
            sender: "bruno",
        },
    ]);
    const [input, setInput] = useState("");
    const [messageSent, setMessageSent] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setInput("");
        setMessageSent(true);

        try {
            const response = await fetch("/api/gemini-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            setMessages([
                ...messages,
                userMessage,
                { text: data.reply, sender: "bruno" },
            ]);
        } catch (error) {
            console.error("Error chatting with Bruno:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.welcomeText}>Chat with Bruno the Bear 🐻</h1>
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
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className={styles.chatInput}
            />
            <button onClick={sendMessage} className={styles.sendButton}>
                Send
            </button>

            {/* "Finish" Button appears only if a message was sent */}
            {messageSent && (
                <button
                    onClick={() => {
                        setCheckInComplete(true);
                        router.push("/home");
                    }}
                    className={styles.finishButton}
                >
                    ✅ Finish
                </button>
            )}

            {/* "Cancel" Button is always available */}
            <button
                onClick={() => {
                    setCheckInComplete(false);
                    router.push("/home");
                }}
                className={styles.cancelButton}
            >
                ❌ Cancel
            </button>
        </div>
    );
}
