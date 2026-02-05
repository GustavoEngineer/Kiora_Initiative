import './TaskContentCard.css'
import { CloseLine, TimeLine, CalendarLine, TagLine, PlayLine } from '@mingcute/react'

const TaskContentCard = ({ task, onClose }) => {
    if (!task) return null

    // Format Date
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

    // Format Time (Est. Hours)
    const formatTime = (hours) => {
        if (!hours) return 'Sin estimación'
        const h = Math.floor(hours)
        const m = Math.round((hours - h) * 60)

        let validTime = ''
        if (h > 0) validTime += `${h}h `
        if (m > 0) validTime += `${m}m`

        return validTime.trim() || '0m'
    }

    return (
        <div className="task-content-card">
            <div className="task-content-header">
                {/* Close button only, tag moved below title */}
                <div style={{ flex: 1 }}></div>
                <button className="task-content-close" onClick={onClose}>
                    <CloseLine size={24} />
                </button>
            </div>

            <div className="task-content-body">
                <h1 className="task-title-large">{task.title}</h1>

                <div className="task-header-meta">
                    <div className="header-meta-item">
                        <TagLine size={18} />
                        <span>{task.tag_name || "Tarea"}</span>
                    </div>
                    <div className="header-meta-item">
                        <TimeLine size={18} />
                        <span>{formatTime(task.estimated_hours)}</span>
                    </div>
                </div>

                <div className="task-header-meta-secondary">
                    <div className="header-meta-item">
                        <CalendarLine size={18} />
                        <span>{formatDate(task.due_date || task.created_at)}</span>
                    </div>
                </div>

                <div className="task-description-section">
                    <p>{task.description}</p>
                </div>

                <div className="task-actions">
                    <button className="task-start-btn">
                        <PlayLine size={20} />
                        <span>Iniciar tarea</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TaskContentCard
