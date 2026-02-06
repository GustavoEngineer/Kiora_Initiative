import React, { useState, useEffect, useRef } from 'react'
import { CloseLine, TimeLine, CalendarLine, TagLine, PlayLine, Edit2Line, Delete2Line } from '@mingcute/react'
import { updateTask, deleteTask, getTags } from '../../services/api'
import TaskClock from './TaskClock'
import './TaskContentCard.css'

const TaskContentCard = ({ task, onClose, onTaskUpdate, onTaskDelete }) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const [isTaskStarted, setIsTaskStarted] = useState(false)

    // Split time estimation state
    const [estHours, setEstHours] = useState('')
    const [estMinutes, setEstMinutes] = useState('')

    // Tag State
    const [allTags, setAllTags] = useState([])
    const [showTagDropdown, setShowTagDropdown] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        tag_name: '',
        tag_id: null,
        due_date: '',
        description: ''
    })

    // Fetch tags on mount
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tags = await getTags()
                setAllTags(tags)
            } catch (error) {
                console.error('Error fetching tags:', error)
            }
        }
        fetchTags()
    }, [])

    // Reset loop
    useEffect(() => {
        setIsTaskStarted(false)
        if (task) {
            let initialTagName = task.tag_name
            // If tag_name is missing but we have the ID and the tags list, find it
            if (!initialTagName && task.tag_id && allTags.length > 0) {
                const foundTag = allTags.find(t => t.id === task.tag_id)
                if (foundTag) initialTagName = foundTag.name
            }

            setFormData({
                title: task.title,
                tag_name: initialTagName,
                tag_id: task.tag_id,
                due_date: task.due_date ? task.due_date.split('T')[0] : '', // Format for date input
                description: task.description || ''
            })

            // Init time
            if (task.estimated_hours) {
                const h = Math.floor(task.estimated_hours)
                const m = Math.round((task.estimated_hours - h) * 60)
                setEstHours(h.toString())
                setEstMinutes(m.toString())
            } else {
                setEstHours('')
                setEstMinutes('')
            }
        }
    }, [task, allTags])

    const handleStartTask = () => {
        setIsTaskStarted(!isTaskStarted)
    }

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

    // Tag Handlers
    const handleTagChange = (e) => {
        setFormData(prev => ({ ...prev, tag_name: e.target.value }))
        setShowTagDropdown(true)
    }

    const handleSelectTag = async (tag) => {
        const newTagId = tag.id
        const newTagName = tag.name

        // Optimistic UI Update
        setFormData(prev => ({
            ...prev,
            tag_name: newTagName,
            tag_id: newTagId
        }))
        setShowTagDropdown(false)

        // Trigger Save immediately
        try {
            // Re-calculate hours from current state
            const h = parseInt(estHours) || 0
            const m = parseInt(estMinutes) || 0
            const totalHours = h + (m / 60)

            const payload = {
                title: formData.title || task.title,
                estimated_hours: totalHours > 0 ? totalHours : null,
                due_date: formData.due_date ? new Date(formData.due_date).toISOString() : (task.due_date || null),
                completed: task.completed !== undefined ? task.completed : false,
                bloc_id: task.bloc_id,
                tag_id: newTagId, // Use the new ID directly
                description: task.description
            }

            const updatedTask = await updateTask(task.id, payload)

            if (onTaskUpdate) {
                const taskWithTag = { ...updatedTask, tag_name: newTagName }
                onTaskUpdate(taskWithTag)
            }
        } catch (error) {
            console.error('Error updating tag:', error)
            alert('Error al actualizar etiqueta')
        }
    }

    // New handlers for time
    const handleTimeChange = (type, value) => {
        if (type === 'hours') setEstHours(value)
        if (type === 'minutes') setEstMinutes(value)
    }

    const handleUpdate = async () => {
        try {
            // Calculate total hours
            const h = parseInt(estHours) || 0
            const m = parseInt(estMinutes) || 0
            const totalHours = h + (m / 60)

            const payload = {
                title: formData.title || task.title,
                estimated_hours: totalHours > 0 ? totalHours : null,
                due_date: formData.due_date ? new Date(formData.due_date).toISOString() : (task.due_date || null),
                completed: task.completed !== undefined ? task.completed : false,
                bloc_id: task.bloc_id,
                tag_id: formData.tag_id, // Use the updated tag_id
                description: task.description
            }

            const updatedTask = await updateTask(task.id, payload)

            if (onTaskUpdate) {
                // Ensure we pass back the tag_name for UI update if not returned by backend fully populated
                const taskWithTag = { ...updatedTask, tag_name: formData.tag_name }
                onTaskUpdate(taskWithTag)
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
        <div className={`task-content-card ${isTaskStarted ? 'started' : ''}`} onMouseLeave={() => {
            setIsFlipped(false)
            setShowTagDropdown(false)
        }}>
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
                                    <span>{formData.tag_name || task.tag_name || "Tarea"}</span>
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
                            <button
                                className={`task-start-btn ${isTaskStarted ? 'active' : ''}`}
                                onClick={() => setIsTaskStarted(!isTaskStarted)}
                            >
                                <PlayLine size={20} />
                                <span>{isTaskStarted ? 'Detener tarea' : 'Iniciar tarea'}</span>
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
                            {/* 1. Title Input */}
                            <input
                                type="text"
                                name="title"
                                className="edit-title-input"
                                value={formData.title}
                                onChange={handleChange}
                                onBlur={handleUpdate}
                                placeholder="Título de la tarea"
                            />

                            {/* 2. Time Estimation */}
                            <div className="form-row time-estimation-row">
                                <label className="form-label"><TimeLine size={14} /> Estimado:</label>
                                <div className="time-inputs">
                                    <input
                                        type="number"
                                        placeholder="HH"
                                        className="time-input"
                                        min="0"
                                        value={estHours}
                                        onChange={(e) => handleTimeChange('hours', e.target.value)}
                                        onBlur={handleUpdate}
                                    />
                                    <span className="time-separator">:</span>
                                    <input
                                        type="number"
                                        placeholder="MM"
                                        className="time-input"
                                        min="0"
                                        max="59"
                                        value={estMinutes}
                                        onChange={(e) => handleTimeChange('minutes', e.target.value)}
                                        onBlur={handleUpdate}
                                    />
                                </div>
                            </div>

                            {/* 3. Tag Input (Editable with dropdown) */}
                            <div className="form-row" style={{ position: 'relative' }}>
                                <label className="form-label"><TagLine size={14} /> Etiqueta:</label>
                                <div style={{ width: '100%' }}>
                                    <input
                                        type="text"
                                        name="tag_name"
                                        className="secondary-input"
                                        value={formData.tag_name}
                                        onChange={handleTagChange}
                                        onFocus={() => setShowTagDropdown(true)}
                                        placeholder="Buscar etiqueta..."
                                    />
                                    {showTagDropdown && (
                                        <div className="tag-dropdown-list" style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: '90px', // Offset for label width
                                            right: 0,
                                            background: 'white',
                                            border: '1px solid #eee',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            zIndex: 10,
                                            maxHeight: '150px',
                                            overflowY: 'auto'
                                        }}>
                                            {allTags
                                                .filter(t => t.name.toLowerCase().includes((formData.tag_name || '').toLowerCase()))
                                                .map(tag => (
                                                    <div
                                                        key={tag.id}
                                                        style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9' }}
                                                        onClick={() => handleSelectTag(tag)}
                                                    >
                                                        {tag.name}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 4. Date Input */}
                            <div className="form-row">
                                <label className="form-label"><CalendarLine size={14} /> Fecha:</label>
                                <input
                                    type="date"
                                    name="due_date"
                                    className="secondary-input"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                    onBlur={handleUpdate}
                                />
                            </div>
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

            <TaskClock
                isRunning={isTaskStarted}
                initialSeconds={(task.estimated_hours || 0) * 3600}
                key={task.id}
            />
        </div>
    )
}

export default TaskContentCard
