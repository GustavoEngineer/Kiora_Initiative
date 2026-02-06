import React, { useState, useEffect } from 'react'
import './TaskClock.css'
import { TimeLine, PauseCircleLine, PlayCircleLine, StopCircleLine } from '@mingcute/react'

const TaskClock = ({ isRunning, initialSeconds = 0, onStop }) => {
    const [seconds, setSeconds] = useState(initialSeconds)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        setSeconds(initialSeconds)
    }, [initialSeconds])

    useEffect(() => {
        let interval = null
        if (isRunning && !isPaused && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(prev => Math.max(0, prev - 1))
            }, 1000)
        } else if (!isRunning) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [isRunning, isPaused, seconds])

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600)
        const m = Math.floor((totalSeconds % 3600) / 60)
        const s = totalSeconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    return (
        <div className={`task-clock-card ${isRunning ? 'visible' : ''}`}>
            <div className="clock-display">
                <TimeLine size={24} className="clock-icon" />
                <span className="clock-time">{formatTime(seconds)}</span>
            </div>
            {/* Optional controls could go here if requested later */}
        </div>
    )
}

export default TaskClock
