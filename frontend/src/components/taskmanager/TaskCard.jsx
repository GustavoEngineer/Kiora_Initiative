import './TaskCard.css'
import { motion } from 'framer-motion'

function TaskCard({ task, tagName, onUpdateTitle, onDelete, onClick, isSelected }) {
    // Format date if exists (Date only)
    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        })
    }

    return (
        <motion.div
            layoutId={`task-${task.id}`}
            layout
            transition={{ type: 'spring', stiffness: 700, damping: 35 }}
            className={`task-item ${task.completed ? 'completed' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >

            <div className="task-main-body">
                <div className="task-vertical-bar"></div>
                <div className="task-info-column">
                    <div className="task-item-title bold-title">
                        {task.title}
                    </div>
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
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(task.id)
                    }}
                >
                    🗑️
                </button>
            </div>
        </motion.div>
    )
}

export default TaskCard
