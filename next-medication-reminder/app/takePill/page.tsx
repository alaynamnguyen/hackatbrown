"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function PillDetectionPage() {
    const [recording, setRecording] = useState(false);
    // pillTaken is either null, true, or false based on the API result
    const [pillTaken, setPillTaken] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunks = useRef<BlobPart[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const router = useRouter();

    useEffect(() => {
        const setupCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                alert("Error accessing camera: " + err);
            }
        };
        setupCamera();
    }, []);

    const startRecording = () => {
        setPillTaken(null);
        setRecording(true);
        recordedChunks.current = [];

        if (!streamRef.current) {
            alert("No video stream available");
            return;
        }

        mediaRecorderRef.current = new MediaRecorder(streamRef.current);

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.current.push(event.data);
            }
        };

        mediaRecorderRef.current.start();
    };

    const stopRecording = async () => {
        setRecording(false);
        if (!mediaRecorderRef.current) return;
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.onstop = async () => {
            const blob = new Blob(recordedChunks.current, {
                type: "video/webm",
            });
            const formData = new FormData();
            formData.append("video", blob, "pill_video.webm");

            try {
                const response = await fetch("/detect_pill", {
                    method: "POST",
                    body: formData,
                });
                const result = await response.json();
                // result.detected is expected to be true or false
                setPillTaken(result.detected);
            } catch (err) {
                console.error("Error:", err);
            }

            // Stop the video stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            }
        };
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.welcomeText}>Pill Taking Detection</h1>
            <p className={styles.description}>
                Click "Start Recording" to begin video recording and detect
                pill-taking action.
            </p>
            <div className={styles.videoContainer}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={styles.videoFeed}
                />
            </div>
            <div className={styles.controls}>
                {!recording ? (
                    <button
                        className={styles.startButton}
                        onClick={startRecording}
                    >
                        Start Recording
                    </button>
                ) : (
                    <button
                        className={styles.stopButton}
                        onClick={stopRecording}
                    >
                        Stop Recording
                    </button>
                )}
            </div>
            {pillTaken !== null && (
                <p
                    className={styles.resultText}
                    style={{ color: pillTaken ? "green" : "red" }}
                >
                    Pill Taking Detected: {pillTaken ? "YES" : "NO"}
                </p>
            )}
            {/* When a result is available, show Finish (if positive) and Cancel buttons */}
            {pillTaken !== null && (
                <div className={styles.resultButtons}>
                    {pillTaken && (
                        <button
                            className={styles.finishButton}
                            onClick={() =>
                                router.push(
                                    `/home?taskIndex=0&pillDetected=true`
                                )
                            }
                        >
                            ✅ Finish
                        </button>
                    )}
                    <button
                        className={styles.cancelButton}
                        onClick={() =>
                            router.push(`/home?taskIndex=0&pillDetected=false`)
                        }
                    >
                        ❌ Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
