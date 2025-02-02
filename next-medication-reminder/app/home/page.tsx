"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function HomePage() {
    const router = useRouter();
    const [avatar, setAvatar] = useState("1"); // Default avatar
    const [name, setName] = useState("");
    const [currentDay, setCurrentDay] = useState(1);
    const [avatarName, setAvatarName] = useState("Bruno Bear");

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

    const [tasks, setTasks] = useState<Task[]>([
        { text: "💊 Take 1 pill of ibuprofen", completed: false },
        { text: "💧 Drink 1 glass of water", completed: false },
        { text: "❤️ Log how you're feeling", completed: false },
        { text: `😊 Check in with ${avatarName}`, completed: false },
    ]);

    // Typing effect states
    const [messageIndex, setMessageIndex] = useState(0);
    const [typedMessage, setTypedMessage] = useState("");
    const [showChoices, setShowChoices] = useState(false);

    // Ensure messages load after name is set
    const messages = [
        `Hi ${name || "friend"}, it's good to see you today!`,
        "Let's both get better soon! Which of these do you want to do?",
    ];

    useEffect(() => {
        // Load stored progress
        const selectedAvatar = sessionStorage.getItem("selectedAvatar") || "1";
        const userName = sessionStorage.getItem("userName") || "";
        const savedDay = sessionStorage.getItem("currentDay");

        // Ensure valid avatar selection
        const avatarIndex = parseInt(selectedAvatar) - 1;
        const resolvedAvatarName = avatarNames[avatarIndex] || "Bruno Bear";

        setAvatar(selectedAvatar);
        setName(userName);
        setCurrentDay(savedDay ? parseInt(savedDay) : 1);
        setAvatarName(resolvedAvatarName);

        // Update To-Do list with correct avatar name
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

    // Typing effect handler
    useEffect(() => {
        if (messageIndex >= messages.length) {
            setShowChoices(true);
            return;
        }

        setTypedMessage(""); // Reset message
        let charIndex = 0;
        const interval = setInterval(() => {
            setTypedMessage((prev) => prev + messages[messageIndex][charIndex]);
            charIndex++;

            if (charIndex === messages[messageIndex].length) {
                clearInterval(interval);
                setTimeout(() => {
                    if (messageIndex < messages.length - 1) {
                        setMessageIndex((prev) => prev + 1);
                    } else {
                        setShowChoices(true);
                    }
                }, 1000);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [messageIndex, name]);

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

                {/* Speech Bubble (Positioned Upper-Right) */}
                <div className={styles.speechBubble}>
                    <p>{typedMessage}</p>
                </div>

                {/* Task Choices (Emoji Only) */}
                {showChoices && (
                    <div className={styles.choiceContainer}>
                        {tasks.map((task, index) => (
                            <button
                                key={index}
                                className={styles.choiceButton}
                                onClick={() => toggleTask(index)}
                            >
                                {task.text.split(" ")[0]}{" "}
                                {/* Extracts only the emoji */}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* To-Do List (Remains Visible) */}
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
