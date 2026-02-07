import { CheckLine } from '@mingcute/react'
import './TaskCard.css'

const TaskCard = ({ task, tagName, onClick }) => {
    // Tag passed from parent or fallback
    const tag = tagName || "Personal"

    // Date formatting logic
    // Assuming task has a date field, if not using current date or random for demo
    // In real app, use task.due_date or task.created_at
    const dateObj = task.created_at ? new Date(task.created_at) : new Date()

    // Date formatting: "Lunes, 7 de Octubre"
    const fullDate = dateObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    })
    // Capitalize
    const fullDateCap = fullDate.charAt(0).toUpperCase() + fullDate.slice(1)

    return (
        <div className="task-card-container" onClick={onClick}>
            {/* Left Indicator Bar */}
            <div className="task-card-bar"></div>

            {/* Main Content: Title and Date */}
            <div className="task-card-content">
                <div className="task-card-title">{task.title}</div>
                <div className="task-card-date-row">
                    <span className="task-card-full-date">{fullDateCap}</span>
                </div>
            </div>

            {/* Right Side: Subtasks Indicator */}
            <div className="task-card-right">
                {task.subtask_count > 0 && (
                    <div className="task-card-subtasks-badge">
                        <CheckLine size={14} />
                        <span>{task.completed_subtask_count}/{task.subtask_count}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TaskCard
