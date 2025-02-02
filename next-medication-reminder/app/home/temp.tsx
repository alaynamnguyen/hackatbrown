"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function HomePage() {
    const router = useRouter();
    const [avatar, setAvatar] = useState("1");
    const [name, setName] = useState("Player"); // Default name to prevent undefined
    const [currentDay, setCurrentDay] = useState(1);
    const [avatarName, setAvatarName] = useState("Bruno Bear");

    // Hardcoded stats
    const EXP = 120;
    const money = 50;
    const totalTasks = 4;

    // Avatar options
    const avatarNames = ["Peppa", "Bluey", "Patrick"];

    // Task list state
    interface Task {
        text: string;
        completed: boolean;
        praise: string;
    }

    const [tasks, setTasks] = useState<Task[]>([]);

    // Track completed tasks
    const currentTaskCount = tasks.filter((task) => task.completed).length;

    // Typing effect states
    const [messageIndex, setMessageIndex] = useState(0);
    const [typedMessage, setTypedMessage] = useState("Loading...");
    const [showChoices, setShowChoices] = useState(false);
    const [resetMessage, setResetMessage] = useState(false);

    // Ensure messages load after name is set
    const messages = [
        `Hi ${name}, it's good to see you today!`,
        "Let's both get better soon! Which of these do you want to do?",
    ];

    useEffect(() => {
        // Load stored progress
        const selectedAvatar = sessionStorage.getItem("selectedAvatar") || "1";
        const userName = sessionStorage.getItem("userName") || "Player"; // Default to "Player"
        const savedDay = sessionStorage.getItem("currentDay") || "1";

        // Ensure valid avatar selection
        const avatarIndex = parseInt(selectedAvatar) - 1;
        const resolvedAvatarName = avatarNames[avatarIndex] || "Bruno Bear";

        setAvatar(selectedAvatar);
        setName(userName);
        setCurrentDay(parseInt(savedDay));
        setAvatarName(resolvedAvatarName);

        // Set default tasks to prevent undefined behavior
        const defaultTasks = [
            {
                text: "💊 Take 1 pill of ibuprofen",
                completed: false,
                praise: "Great job taking your medication safely!",
            },
            {
                text: "💧 Drink 1 glass of water",
                completed: false,
                praise: "Great job staying hydrated!",
            },
            {
                text: "❤️ Log how you're feeling",
                completed: false,
                praise: "Great job letting me know how you feel!",
            },
            {
                text: `😊 Check in with ${resolvedAvatarName}`,
                completed: false,
                praise: "Great job checking in!",
            },
        ];

        const savedTasks = sessionStorage.getItem("tasks");
        setTasks(savedTasks ? JSON.parse(savedTasks) : defaultTasks);
        setTypedMessage(messages[0]); // Ensure proper first message
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
    }, [messageIndex]);

    // Handle task completion with praise message
    const toggleTask = (index: number): void => {
        if (!tasks[index].completed) {
            const updatedTasks = [...tasks];
            updatedTasks[index].completed = true;
            setTasks(updatedTasks);
            sessionStorage.setItem("tasks", JSON.stringify(updatedTasks));

            // Set praise message for completed task
            setTypedMessage(tasks[index].praise);

            // Check if all tasks are complete, then reset for the next day
            if (updatedTasks.every((task) => task.completed)) {
                setTimeout(() => {
                    setResetMessage(true);
                    setTypedMessage(
                        `You've completed all of your tasks for today, ${name}! I'll see you again tomorrow. 🎉`
                    );

                    setTimeout(() => {
                        setCurrentDay((prevDay) => {
                            const newDay = prevDay + 1;
                            sessionStorage.setItem(
                                "currentDay",
                                newDay.toString()
                            );
                            return newDay;
                        });

                        resetTasks();
                        setResetMessage(false);
                        setTypedMessage(messages[0]); // Reset message to start
                    }, 3000);
                }, 2000);
            }
        }
    };

    // Debug button to reset all tasks manually
    const resetTasks = () => {
        const resetTasks = tasks.map((task) => ({
            ...task,
            completed: false,
        }));
        setTasks(resetTasks);
        sessionStorage.setItem("tasks", JSON.stringify(resetTasks));
    };

    return (
        <div className={styles.container}>
            {/* Progress Bar */}
            <div className={styles.progressContainer}>
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressBar}
                        style={{
                            width: `${(currentTaskCount / totalTasks) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Debug Button for Resetting Tasks */}
            <div className={styles.debugContainer}>
                <button className={styles.debugButton} onClick={resetTasks}>
                    🔄 Reset Tasks (Debug)
                </button>
            </div>

            {/* Speech Bubble */}
            <div className={styles.speechBubble}>
                <p>{typedMessage || "Loading..."}</p>
            </div>

            {/* Task Choices (Emoji Only) */}
            {showChoices && !resetMessage && (
                <div className={styles.choiceContainer}>
                    {tasks.map((task, index) => (
                        <button
                            key={index}
                            className={`${styles.choiceButton} ${
                                task.completed ? styles.disabledButton : ""
                            }`}
                            onClick={() => toggleTask(index)}
                            disabled={task.completed}
                        >
                            {task.text.split(" ")[0]}
                        </button>
                    ))}
                </div>
            )}

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
