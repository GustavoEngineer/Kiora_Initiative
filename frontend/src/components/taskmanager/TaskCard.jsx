import './TaskCard.css'

const TaskCard = ({ task, tagName, onClick }) => {
    // Tag passed from parent or fallback
    const tag = tagName || "Personal"

    // Date formatting logic
    // Assuming task has a date field, if not using current date or random for demo
    // In real app, use task.due_date or task.created_at
    const dateObj = task.created_at ? new Date(task.created_at) : new Date()

    const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' })
    const dateNum = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' })

    // Capitalize first letter of day name
    const dayNameCap = dayName.charAt(0).toUpperCase() + dayName.slice(1)

    return (
        <div className="task-card-container" onClick={onClick}>
            {/* Left Indicator Bar */}
            <div className="task-card-bar"></div>

            {/* Main Content: Title and Tag */}
            <div className="task-card-content">
                <div className="task-card-title">{task.title}</div>
                <div className="task-card-tag">{tag}</div>
            </div>

            {/* Right Side: Day/Date */}
            <div className="task-card-time">
                <span className="task-card-dayname">{dayNameCap}</span>
                <span className="task-card-date">{dateNum}</span>
            </div>
        </div>
    )
}

export default TaskCard
