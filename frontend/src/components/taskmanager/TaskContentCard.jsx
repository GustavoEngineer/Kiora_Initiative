import './TaskContentCard.css'
import { CloseLine, TimeLine, CalendarLine, TagLine, PlayLine, Edit2Line, Delete2Line } from '@mingcute/react'
import { useState, useEffect } from 'react'
import { updateTask, deleteTask } from '../../services/api'

const TaskContentCard = ({ task, onClose, onTaskUpdate, onTaskDelete }) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        tag_name: '',
        estimated_hours: '',
        due_date: '',
        description: ''
    })

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                tag_name: task.tag_name || '',
                estimated_hours: task.estimated_hours || '',
                due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
                description: task.description || ''
            })
        }
    }, [task])

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

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUpdate = async () => {
        try {
            // Prepare data for update. Ideally backend handles partials or we send full object.
            // Adjusting tag_name is tricky if backend expects tag_id. 
            // For now assuming backend might handle it or ignore it if not mapped.
            // If tag needs update by name, we might need logic to find/create tag.
            // Assuming for simplicity we send what we have.

            // NOTE: The backend likely expects tag_id, not tag_name for updates unless handled specifically.
            // If the user changes tag_name text, we ideally search for a tag. 
            // For this iteration, we'll send the updated fields. 
            // Assuming simplified update for title, description, time, date.

            const updatedTask = await updateTask(task.id, {
                ...task, // Keep existing fields
                title: formData.title,
                // tag_id? We don't have logic here to map name to ID yet on edit.
                // Ignoring tag update via text input for now to avoid breaking ID link, 
                // OR we send it if backend supports it.
                // Providing minimal update:
                estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
                due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
                // description: formData.description no longer in input so not updating here, kept from state if it existed but removed from UI.
            })

            if (onTaskUpdate) {
                onTaskUpdate(updatedTask)
            }
        } catch (error) {
            console.error('Error updating task:', error)
            alert('Error al actualizar tarea')
        }
    }

    const handleDelete = async () => {
        try {
            await deleteTask(task.id)
            if (onTaskDelete) {
                onTaskDelete()
            }
        } catch (error) {
            console.error('Error deleting task:', error)
            alert('Error al eliminar tarea')
        }
    }

    return (
        <div className="task-content-card" onMouseLeave={() => setIsFlipped(false)}>
            <div className={`task-card-inner ${isFlipped ? 'flipped' : ''}`}>
                <div className="task-card-front">
                    <div className="task-content-header">
                        <button
                            className="task-content-action-btn"
                            title="Editar"
                            onMouseEnter={() => setIsFlipped(true)}
                        >
                            <Edit2Line size={24} />
                        </button>
                        <div style={{ flex: 1 }}></div>
                        <button
                            className="task-content-close"
                            onClick={onClose}
                            onMouseEnter={onClose}
                            aria-label="Cerrar"
                        >
                            <CloseLine size={24} />
                        </button>
                    </div>

                    <div className="task-content-body">
                        <h1 className="task-title-large">{task.title}</h1>

                        <div className="task-meta-container">
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

                <div className="task-card-back">
                    <div className="task-back-content">
                        <div className="task-back-header">
                            <span className="task-back-title">Editar Tarea</span>
                        </div>

                        <div className="task-edit-form">
                            <input
                                type="text"
                                name="title"
                                className="task-edit-input title-input"
                                value={formData.title}
                                onChange={handleChange}
                                onBlur={handleUpdate}
                                placeholder="Título de la tarea"
                            />

                            <div className="task-edit-grid">
                                <div className="input-group">
                                    <TagLine size={16} className="input-icon" />
                                    <input
                                        type="text"
                                        name="tag_name"
                                        className="task-edit-input"
                                        value={formData.tag_name}
                                        onChange={handleChange}
                                        // Tag updating is complex, might verify logic later
                                        placeholder="Etiqueta"
                                        readOnly
                                        title="Edición de etiqueta no disponible por ahora"
                                    />
                                </div>
                                <div className="input-group">
                                    <TimeLine size={16} className="input-icon" />
                                    <input
                                        type="number"
                                        name="estimated_hours"
                                        className="task-edit-input"
                                        value={formData.estimated_hours}
                                        onChange={handleChange}
                                        onBlur={handleUpdate}
                                        placeholder="Horas est."
                                    />
                                </div>
                                <div className="input-group full-width">
                                    <CalendarLine size={16} className="input-icon" />
                                    <input
                                        type="date"
                                        name="due_date"
                                        className="task-edit-input"
                                        value={formData.due_date}
                                        onChange={handleChange}
                                        onBlur={handleUpdate}
                                    />
                                </div>
                            </div>

                            {/* Description input removed as requested */}
                        </div>

                        <div className="task-actions">
                            <button className="task-delete-btn" onClick={handleDelete}>
                                <Delete2Line size={20} />
                                <span>Eliminar tarea</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskContentCard
