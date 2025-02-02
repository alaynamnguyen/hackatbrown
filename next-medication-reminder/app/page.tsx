"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
    const router = useRouter();
    const [name, setName] = useState("");
    const isNewUser = true; // Hardcoded boolean for now

    const handleStart = () => {
        if (isNewUser) {
            router.push(`/select-avatar?name=${name}`);
        } else {
            sessionStorage.setItem("userName", name);
            router.push("/home");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <h1 className={styles.welcomeText}>Welcome to HealQuest!</h1>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.nameInput}
                />
                <p className={styles.startText}>Press start to begin...</p>
                <button className={styles.startButton} onClick={handleStart}>
                    Start
                </button>
            </div>
        </div>
    );
}
