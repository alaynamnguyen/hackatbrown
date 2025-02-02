"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import styles from "../page.module.css";

export default function HomePage() {
    const [avatar, setAvatar] = useState("");

    const scrollContainer = useRef(null);
    const { scrollXProgress } = useScroll({ container: scrollContainer });

    // Checkpoints (sections)
    const checkpoints = [
        "START",
        "ITINERARY",
        "STARTER-PACKS",
        "FAQ",
        "SPONSORS",
    ];

    // Load avatar from sessionStorage
    useEffect(() => {
        const selectedAvatar = sessionStorage.getItem("selectedAvatar");
        setAvatar(selectedAvatar || "a1"); // Default avatar
    }, []);

    return (
        <div className={styles.pageWrapper}>
            {/* Progress Bar */}
            <div className={styles.progressContainer}>
                <motion.div
                    className={styles.progressBar}
                    style={{ scaleX: scrollXProgress }}
                />
                <div className={styles.checkpoints}>
                    {checkpoints.map((label, index) => (
                        <span key={index} className={styles.checkpoint}>
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Horizontal Scroll Section */}
            <div ref={scrollContainer} className={styles.scrollContainer}>
                {checkpoints.map((label, index) => (
                    <section key={index} className={styles.section}>
                        <h1>{label}</h1>
                        <p>Content for {label}...</p>
                    </section>
                ))}
            </div>

            {/* Avatar in Bottom-Left Corner */}
            {avatar && (
                <div className={styles.avatarContainer}>
                    <img
                        src={`/avatars/a${avatar}.png`}
                        alt="Avatar"
                        className={styles.avatarHome}
                    />
                </div>
            )}
        </div>
    );
}
