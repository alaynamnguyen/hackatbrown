"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function HomePage() {
    const [avatar, setAvatar] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        const selectedAvatar = sessionStorage.getItem("selectedAvatar");
        const userName = sessionStorage.getItem("userName");
        setAvatar(selectedAvatar || "");
        setName(userName || "");
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <h1 className={styles.welcomeText}>Home</h1>
                <p className={styles.avatarText}>Avatar selected: {avatar}</p>
                <p className={styles.avatarText}>Welcome, {name}!</p>
            </div>
        </div>
    );
}
