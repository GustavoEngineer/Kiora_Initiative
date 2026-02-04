
function TaskCard({ task, onToggle, onUpdateTitle, onDelete }) {
    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                className="task-checkbox"
                checked={task.completed || false}
                onChange={() => onToggle(task)}
            />
            <input
                type="text"
                className="task-item-title-input"
                defaultValue={task.title}
                onBlur={(e) => onUpdateTitle(task, e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.target.blur()
                    }
                }}
            />
            <button
                className="delete-task-btn"
                onClick={() => onDelete(task.id)}
            >
                🗑️
            </button>
        </div>
    )
}

export default TaskCard
