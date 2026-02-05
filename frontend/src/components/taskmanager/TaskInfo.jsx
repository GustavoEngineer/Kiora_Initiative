import './TaskInfo.css'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

function TaskInfo({ task, tagName, onClose }) {
    // --------------------------------------------------------------------------
    // State
    // --------------------------------------------------------------------------
    const [isTimerActive, setIsTimerActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)

    // --------------------------------------------------------------------------
    // Effects
    // --------------------------------------------------------------------------
    // Initialize timer when task changes
    useEffect(() => {
        if (task?.estimated_hours) {
            // estimated_hours is assumed to be in hours (e.g., 1.5 = 1h 30m)
            const seconds = Math.floor(task.estimated_hours * 3600)
            setTimeLeft(seconds)
        } else {
            setTimeLeft(0)
        }
        setIsTimerActive(false)
    }, [task])

    // Timer countdown interval
    useEffect(() => {
        let interval = null
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsTimerActive(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } else if (timeLeft === 0) {
            setIsTimerActive(false)
        }

        return () => clearInterval(interval)
    }, [isTimerActive, timeLeft])

    // --------------------------------------------------------------------------
    // Helpers
    // --------------------------------------------------------------------------
    if (!task) return (
        <div className="task-info-placeholder">
            <p>Selecciona una tarea para ver los detalles</p>
        </div>
    )

    const formatDate = (dateString) => {
        if (!dateString) return 'Sin fecha'
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const handleStartTimer = (e) => {
        e.stopPropagation()
        // If 0, maybe set a default or just don't start? 
        // For now, if 0, we can't really "countdown", but let's assume valid estimated_hours
        if (timeLeft > 0) {
            setIsTimerActive(true)
        }
    }

    const handlePauseTimer = (e) => {
        e.stopPropagation()
        setIsTimerActive(false)
    }

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------
    return (
        <motion.div
            layoutId={`task-${task.id}`}
            className="task-info-container"
            transition={{ type: 'spring', stiffness: 1000, damping: 40, mass: 0.5 }}
            onClick={(e) => e.stopPropagation()}
        >
            <button className="close-task-info" onClick={onClose}>
                ✕
            </button>

            {/* Date Top Right */}
            {task.due_date && (
                <div className="task-info-date-badge">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{formatDate(task.due_date)}</span>
                </div>
            )}

            <div className="task-info-header-content">
                <h1 className="task-info-title">{task.title}</h1>
                <span className="task-info-tag">{tagName || 'General'}</span>
            </div>

            <div className="task-info-body">
                {task.description && (
                    <div className="task-info-description section">
                        <p>{task.description}</p>
                    </div>
                )}
            </div>

            <div className="task-info-footer">
                {isTimerActive ? (
                    <div className="timer-display-container">
                        <div className="timer-value">{formatTime(timeLeft)}</div>
                        <button className="stop-task-btn" onClick={handlePauseTimer}>
                            Pausar
                        </button>
                    </div>
                ) : (
                    <button className="start-task-btn" onClick={handleStartTimer}>
                        {timeLeft < (task.estimated_hours * 3600) && timeLeft > 0 ? "Reanudar Tarea" : "Empezar Tarea"}
                    </button>
                )}
            </div>
        </motion.div>
    )
}

export default TaskInfo
