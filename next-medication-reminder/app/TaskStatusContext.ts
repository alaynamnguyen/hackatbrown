"use client";
import React from "react";
import { createContext, ReactNode, useState } from "react";

export const TaskStatusContext = createContext<TaskStatusContextType>({
    pillDetected: null,
    setPillDetected: () => {},
    checkInComplete: null,
    setCheckInComplete: () => {},
    waterTaskComplete: null,
    setWaterTaskComplete: () => {},
});

export const TaskStatusProvider = ({ children }: { children: ReactNode }) => {
    const [pillDetected, setPillDetected] = useState<boolean | null>(null);
    const [checkInComplete, setCheckInComplete] = useState<boolean | null>(
        null
    );
    const [waterTaskComplete, setWaterTaskComplete] = useState<boolean | null>(
        null
    );

    return React.createElement(
        TaskStatusContext.Provider,
        {
            value: {
                pillDetected,
                setPillDetected,
                checkInComplete,
                setCheckInComplete,
                waterTaskComplete,
                setWaterTaskComplete,
            },
        },
        children
    );
};
