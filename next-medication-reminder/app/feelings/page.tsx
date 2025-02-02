"use client";

import { useState } from "react";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";

export default function FeelingsPage() {
    const [selectedFeeling, setSelectedFeeling] = useState("");
    const router = useRouter();

    const handleSelectFeeling = (feeling) => {
        setSelectedFeeling(feeling);
    };

    const handleSubmit = () => {
        alert(
            "Thanks for sharing! We'll keep this so that your parents and doctor will be able to help you."
        );
        router.push("/home");
    };

    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <h1 className={styles.furnitureTitle}>
                    How are you feeling today?
                </h1>

                {/* Display Feelings Icons */}
                <div className={styles.row}>
                    <div className={styles.rowItems}>
                        {["😡", "😢", "😐", "😊", "😁", "😴"].map(
                            (feeling, index) => (
                                <div
                                    key={index}
                                    className={styles.furnitureItem}
                                    onClick={() => handleSelectFeeling(feeling)}
                                >
                                    <span className={styles.feelingEmoji}>
                                        {feeling}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Display Selected Feeling Information */}
                {selectedFeeling && (
                    <div className={styles.selectedItemInfo}>
                        <h3>Selected Feeling: {selectedFeeling}</h3>
                        <button
                            className={styles.purchaseButton}
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
