"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "../page.module.css";

export default function SelectAvatar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const name = searchParams.get("name");

    interface HandleSelect {
        (avatar: string): void;
    }

    const handleSelect: HandleSelect = (avatar) => {
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
                    <img
                        src="/avatars/a1.png"
                        alt="Avatar 1"
                        className={styles.avatar}
                        onClick={() => handleSelect("1")}
                    />
                    <img
                        src="/avatars/a2.png"
                        alt="Avatar 2"
                        className={styles.avatar}
                        onClick={() => handleSelect("2")}
                    />
                    <img
                        src="/avatars/a3.png"
                        alt="Avatar 3"
                        className={styles.avatar}
                        onClick={() => handleSelect("3")}
                    />
                </div>
            </div>
        </div>
    );
}
