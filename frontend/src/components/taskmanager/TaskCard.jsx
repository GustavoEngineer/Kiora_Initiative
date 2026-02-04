
function TaskCard({ task, tagName, onUpdateTitle, onDelete }) {
    // Format date if exists (Date only)
    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
            // Removed time format
        })
    }

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>

            <div className="task-main-body">
                <div className="task-vertical-bar"></div>
                <div className="task-info-column">
                    <input
                        type="text"
                        className="task-item-title-input bold-title"
                        defaultValue={task.title}
                        onBlur={(e) => onUpdateTitle(task, e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.target.blur()
                            }
                        }}
                    />
                    <div className="task-category">
                        {tagName ? tagName : 'Work'} {/* Default to Work if empty like image, or just tag */}
                    </div>
                </div>
            </div>

            <div className="task-right-side">
                {task.due_date && (
                    <div className="task-date">
                        {formatDate(task.due_date)}
                    </div>
                )}
                {/* Time could be separate if needed, but user asked to remove it */}

                <button
                    className="delete-task-btn"
                    onClick={() => onDelete(task.id)}
                >
                    🗑️
                </button>
            </div>
        </div>
    )
}

export default TaskCard
