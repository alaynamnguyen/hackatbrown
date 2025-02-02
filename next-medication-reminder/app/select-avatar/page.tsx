"use client";

import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function SelectAvatar() {
    const router = useRouter();

    interface HandleSelect {
        (avatar: string): void;
    }

    const handleSelect: HandleSelect = (avatar) => {
        sessionStorage.setItem("selectedAvatar", avatar);
        router.push("/home");
    };

    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <h1 className={styles.welcomeText}>Select Your Avatar</h1>
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
