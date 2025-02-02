"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function HomePage() {
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        const selectedAvatar = sessionStorage.getItem("selectedAvatar");
        setAvatar(selectedAvatar || "NAHhhh");
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <h1 className={styles.welcomeText}>Home</h1>
                <p className={styles.avatarText}>Avatar selected: {avatar}</p>
            </div>
        </div>
    );
}
