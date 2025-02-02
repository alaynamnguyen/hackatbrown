import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { TaskStatusContext } from "../TaskStatusContext"; // adjust the path as needed
import { motion } from "framer-motion";

// Define the Task interface
interface Task {
    text: string;
    completed: boolean;
    praise: string;
}

export default function HomePage() {
    const router = useRouter();
    const {
        pillDetected,
        setPillDetected,
        checkInComplete,
        setCheckInComplete,
        waterTaskComplete,
        setWaterTaskComplete,
    } = useContext(TaskStatusContext);

    // Default tasks array
    const defaultTasks: Task[] = [
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
            text: "😊 Check in with Bruno Bear",
            completed: false,
            praise: "Great job checking in!",
        },
    ];

    // Lazy initialize tasks from sessionStorage or defaultTasks
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = sessionStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : defaultTasks;
    });

    // Always save tasks changes into sessionStorage.
    useEffect(() => {
        sessionStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    // When pillDetected is true, update the pill task.
    useEffect(() => {
        if (pillDetected === true) {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.text.includes("💊")
                        ? { ...task, completed: true }
                        : task
                )
            );
            setPillDetected(null);
        }
    }, [pillDetected, setPillDetected]);

    // When checkInComplete is true, update the check‑in task.
    useEffect(() => {
        if (checkInComplete === true) {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.text.includes("Check in")
                        ? { ...task, completed: true }
                        : task
                )
            );
            setCheckInComplete(null);
        }
    }, [checkInComplete, setCheckInComplete]);

    // When waterTaskComplete is true, update the "Log how you're feeling" task.
    useEffect(() => {
        if (waterTaskComplete === true) {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.text.includes("❤️")
                        ? { ...task, completed: true }
                        : task
                )
            );
            setWaterTaskComplete(null);
        }
    }, [waterTaskComplete, setWaterTaskComplete]);

    // Other state values
    const [avatar, setAvatar] = useState("1");
    const [name, setName] = useState("");
    const [currentDay, setCurrentDay] = useState(1);
    const [avatarName, setAvatarName] = useState("Bruno Bear");
    const [exp, setExp] = useState(120);
    const [money, setMoney] = useState(50);

    const earnedExp = 120;
    const earnedMoney = 50;
    const totalTasks = 4;
    const avatarNames = ["Peppa", "Bluey", "Patrick"];

    // ─ Typing effect state ─
    const [messageIndex, setMessageIndex] = useState(0);
    const [typedMessage, setTypedMessage] = useState("");
    const [showChoices, setShowChoices] = useState(false);
    const [resetMessage, setResetMessage] = useState(false);
    const [praiseMessage, setPraiseMessage] = useState<string | null>(null);

    // Memoize messages so they remain stable during typing.
    const computedMessages = useMemo(() => {
        return [
            `Hi ${name || "friend"}, it's good to see you today!`,
            "Let's both get better soon! Which of these do you want to do?",
        ];
    }, [name]);

    // Load stored data (avatar, name, etc.)
    useEffect(() => {
        const selectedAvatar = sessionStorage.getItem("selectedAvatar") || "1";
        const userName = sessionStorage.getItem("userName") || "";
        const savedDay = sessionStorage.getItem("currentDay");
        const savedExp = sessionStorage.getItem("exp") || "120";
        const savedMoney = sessionStorage.getItem("money") || "50";

        const avatarIndex = parseInt(selectedAvatar) - 1;
        const resolvedAvatarName = avatarNames[avatarIndex] || "Bruno Bear";

        setAvatar(selectedAvatar);
        setName(userName);
        setCurrentDay(savedDay ? parseInt(savedDay) : 1);
        setAvatarName(resolvedAvatarName);
        setExp(parseInt(savedExp));
        setMoney(parseInt(savedMoney));
    }, []);

    // ─ Typing effect for the speech bubble ─
    useEffect(() => {
        if (messageIndex >= computedMessages.length) {
            setShowChoices(true);
            return;
        }
        setTypedMessage(""); // Reset the message before typing the new one.
        let charIndex = 0;
        const interval = setInterval(() => {
            setTypedMessage(
                (prev) =>
                    prev + computedMessages[messageIndex].charAt(charIndex)
            );
            charIndex++;
            if (charIndex === computedMessages[messageIndex].length) {
                clearInterval(interval);
                setTimeout(() => {
                    if (messageIndex < computedMessages.length - 1) {
                        setMessageIndex((prev) => prev + 1);
                    } else {
                        setShowChoices(true);
                    }
                }, 1000);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [messageIndex, computedMessages]);

    // ─ Finishing Process ─
    useEffect(() => {
        if (
            !resetMessage &&
            tasks.length > 0 &&
            tasks.every((task) => task.completed)
        ) {
            setResetMessage(true);
            setTypedMessage(
                `You've completed all of your tasks for today, ${name}! I'll see you again tomorrow. 🎉`
            );
            setTimeout(() => {
                alert("🎉 Congrats! You earned $50 and 120 EXP! 🎉");
                setExp((prevExp) => {
                    const newExp = prevExp + earnedExp;
                    sessionStorage.setItem("exp", newExp.toString());
                    return newExp;
                });
                setMoney((prevMoney) => {
                    const newMoney = prevMoney + earnedMoney;
                    sessionStorage.setItem("money", newMoney.toString());
                    return newMoney;
                });
                setCurrentDay((prevDay) => {
                    const newDay = prevDay + 1;
                    sessionStorage.setItem("currentDay", newDay.toString());
                    return newDay;
                });
                setTasks(defaultTasks);
                setResetMessage(false);
                setTypedMessage(computedMessages[0]);
            }, 3000);
        }
    }, [
        tasks,
        resetMessage,
        name,
        earnedExp,
        earnedMoney,
        defaultTasks,
        computedMessages,
    ]);

    // ─ Handler Functions for Each Task ─
    const handlePillTask = () => {
        router.push("/takePill");
    };

    const handleWaterTask = () => {
        toggleTask(1);
    };

    const handleMoodTask = () => {
        router.push("/feelings");
    };

    const handleCheckInTask = () => {
        router.push("/brunoCheckIn");
    };

    const toggleTask = (index: number): void => {
        if (!tasks[index].completed) {
            setTasks((prevTasks) =>
                prevTasks.map((task, i) =>
                    i === index ? { ...task, completed: true } : task
                )
            );
        }
    };

    const taskHandlers = [
        handlePillTask,
        handleWaterTask,
        handleMoodTask,
        handleCheckInTask,
    ];
    const currentTaskCount = tasks.filter((task) => task.completed).length;

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

            {/* Main Content */}
            <div className={styles.overlay}>
                <h1 className={styles.welcomeText}>Welcome, {name}!</h1>
                <p className={styles.avatarText}>Recovery Day: {currentDay}</p>

                <motion.img
                    src={`/avatars/a${avatar}.png`}
                    alt="Avatar"
                    className={styles.avatarImage}
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

                {/* Speech Bubble */}
                <div className={styles.speechBubble}>
                    <p>{typedMessage}</p>
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
                                onClick={() => taskHandlers[index]()}
                                disabled={task.completed}
                            >
                                {task.text.split(" ")[0]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Debug Button for Resetting Tasks */}
            <div className={styles.debugContainer}>
                <button
                    className={styles.debugButton}
                    onClick={() => setTasks(defaultTasks)}
                >
                    🔄 Reset Tasks (Debug)
                </button>
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
                                readOnly
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
                    <p>⭐ EXP: {exp}</p>
                    <p>💰 Money: ${money}</p>
                    <p>📅 Recovery Day: {currentDay}</p>
                </div>
                <button
                    className={styles.shopButton}
                    onClick={() => router.push(`/shop?money=${money}`)}
                >
                    🏪 Open Shop
                </button>
            </div>
        </div>
    );
}
