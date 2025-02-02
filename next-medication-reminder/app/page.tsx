"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
    const router = useRouter();

    const handleStart = () => {
        router.push("/select-avatar");
    };

    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <h1 className={styles.welcomeText}>Welcome</h1>
                <p className={styles.startText}>Press start to begin</p>
                <button className={styles.startButton} onClick={handleStart}>
                    Start
                </button>
            </div>
        </div>
    );
}
