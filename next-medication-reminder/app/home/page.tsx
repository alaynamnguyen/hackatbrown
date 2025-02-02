"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function HomePage() {
    const router = useRouter();
    const [avatar, setAvatar] = useState("");
    const [name, setName] = useState("");
    const [currentDay, setCurrentDay] = useState(1);
    const [avatarName, setAvatarName] = useState(""); // Avatar name state

    // Hardcoded stats
    const EXP = 120;
    const money = 50;
    const totalDays = 5;

    // Avatar options
    const avatarNames = ["Peppa", "Bluey", "Patrick"];

    // Task list state
    interface Task {
        text: string;
        completed: boolean;
    }

    const [tasks, setTasks] = useState<Task[]>([]);

    // Load stored progress
    useEffect(() => {
        const selectedAvatar = sessionStorage.getItem("selectedAvatar");
        const userName = sessionStorage.getItem("userName");
        const savedDay = sessionStorage.getItem("currentDay");

        // Ensure valid avatar selection
        const avatarIndex = selectedAvatar ? parseInt(selectedAvatar) - 1 : 0;
        const resolvedAvatarName = avatarNames[avatarIndex] || "Bruno Bear";

        setAvatar(selectedAvatar || "1"); // Default to "1" if none is selected
        setName(userName || "");
        setCurrentDay(savedDay ? parseInt(savedDay) : 1);
        setAvatarName(resolvedAvatarName);

        // Load tasks with correct avatar name
        const savedTasks = sessionStorage.getItem("tasks");
        setTasks(
            savedTasks
                ? JSON.parse(savedTasks)
                : [
                      { text: "💊 Take 1 pill of ibuprofen", completed: false },
                      { text: "💧 Drink 1 glass of water", completed: false },
                      { text: "❤️ Log how you're feeling", completed: false },
                      {
                          text: `😊 Check in with ${resolvedAvatarName}`,
                          completed: false,
                      },
                  ]
        );
    }, []);

    // Handle checkbox toggle
    const toggleTask = (index: number): void => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
        sessionStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };

    return (
        <div className={styles.container}>
            {/* Progress Bar */}
            <div className={styles.progressContainer}>
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressBar}
                        style={{ width: `${(currentDay / totalDays) * 100}%` }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.overlay}>
                <h1 className={styles.welcomeText}>Welcome, {name}!</h1>
                <p className={styles.avatarText}>Current Day: {currentDay}</p>

                {/* Display Avatar Image */}
                <img
                    src={`/avatars/a${avatar}.png`}
                    alt="Selected Avatar"
                    className={styles.avatarImage}
                />
            </div>

            {/* To-Do List */}
            <div className={styles.todoContainer}>
                <h2 className={styles.todoTitle}>To-Do List</h2>
                <ul className={styles.todoList}>
                    {tasks.map((task, index) => (
                        <li key={index} className={styles.todoItem}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(index)}
                                className={styles.checkbox}
                            />
                            <span
                                className={
                                    task.completed ? styles.completedTask : ""
                                }
                            >
                                {task.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bottom Right Section (Stats Box + Shop Button) */}
            <div className={styles.bottomRightContainer}>
                <div className={styles.statsBox}>
                    <p>⭐ EXP: {EXP}</p>
                    <p>💰 Money: ${money}</p>
                    <p>📅 Recovery Day: {currentDay}</p>
                </div>
                <button
                    className={styles.shopButton}
                    onClick={() => router.push("/shop")}
                >
                    🏪 Open Shop
                </button>
            </div>
        </div>
    );
}
