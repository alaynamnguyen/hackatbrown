"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "../page.module.css";
import { motion } from "framer-motion";

export default function SelectAvatar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const name = searchParams.get("name");

    const handleSelect = (avatar: string) => {
        sessionStorage.setItem("selectedAvatar", avatar);
        sessionStorage.setItem("userName", name || "");
        router.push("/home");
    };

    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <h1 className={styles.welcomeText}>
                    Hi {name}! Select an avatar
                </h1>
                <div className={styles.avatarContainer}>
                    {/* Avatar 1 */}
                    <motion.img
                        src="/avatars/a1.png"
                        alt="Avatar 1"
                        className={styles.avatar}
                        onClick={() => handleSelect("1")}
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.1 }}
                    />

                    {/* Avatar 2 */}
                    <motion.img
                        src="/avatars/a2.png"
                        alt="Avatar 2"
                        className={styles.avatar}
                        onClick={() => handleSelect("2")}
                        animate={{
                            y: [0, -12, 0],
                            rotate: [0, -5, 5, 0],
                            scale: [1, 1.08, 1],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.2,
                            ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.1 }}
                    />

                    {/* Avatar 3 */}
                    <motion.img
                        src="/avatars/a3.png"
                        alt="Avatar 3"
                        className={styles.avatar}
                        onClick={() => handleSelect("3")}
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 6, -6, 0],
                            scale: [1, 1.07, 1],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.3,
                            ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.1 }}
                    />
                </div>
            </div>
        </div>
    );
}
