import './TaskInfo.css'
import { motion } from 'framer-motion'

function TaskInfo({ task, tagName, onClose }) {
    if (!task) return (
        <div className="task-info-placeholder">
            <p>Selecciona una tarea para ver los detalles</p>
        </div>
    )

    // Format date if exists
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

    return (
        <motion.div
            layoutId={`task-${task.id}`}
            className="task-info-container"
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        >
            <button className="close-task-info" onClick={onClose}>
                ✕
            </button>

            <div className="task-info-header">
                <span className="task-info-tag">{tagName || 'General'}</span>
                <span className={`task-info-status ${task.completed ? 'completed' : 'pending'}`}>
                    {task.completed ? 'Completada' : 'Pendiente'}
                </span>
            </div>

            <motion.h1 layout="position" className="task-info-title">{task.title}</motion.h1>

            <div className="task-info-body">
                <div className="task-info-row">
                    <span className="info-label">📅 Fecha límite</span>
                    <span className="info-value">{formatDate(task.due_date)}</span>
                </div>

                {task.description && (
                    <div className="task-info-description section">
                        <h3 className="section-title">Descripción</h3>
                        <p>{task.description}</p>
                    </div>
                )}

                {/* Extended details can go here */}
            </div>
        </motion.div>
    )
}

export default TaskInfo
