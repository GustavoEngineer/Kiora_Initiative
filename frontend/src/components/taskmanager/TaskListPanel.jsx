import { useState, useEffect, useRef } from 'react'
import { getTasks, createTask, updateTask, deleteTask, getTags, createTag, createSubtask } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { AddLine, CloseLine, TimeLine, TagLine, CheckLine } from '@mingcute/react'
import TaskCard from './TaskCard'
import './TaskListPanel.css'

const TaskListPanel = ({ blocId, onClose, selectedTask, onSelectTask, refreshTrigger, externalTags }) => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [newTaskName, setNewTaskName] = useState('')
    const [newTaskDescription, setNewTaskDescription] = useState('')

    // Creation Mode State
    const [isCreating, setIsCreating] = useState(false)
    const [newDate, setNewDate] = useState('')

    // Time Estimation State
    const [estHours, setEstHours] = useState('')
    const [estMinutes, setEstMinutes] = useState('')

    // Subtasks State
    const [subtasks, setSubtasks] = useState([])
    const [currentSubtask, setCurrentSubtask] = useState('')

    // Smart Tag State
    const [allTags, setAllTags] = useState([])
    const [tagSearch, setTagSearch] = useState('')
    const [showTagDropdown, setShowTagDropdown] = useState(false)
    const [selectedTag, setSelectedTag] = useState(null)
    const [isCreatingTag, setIsCreatingTag] = useState(false)
    const [newTagImportance, setNewTagImportance] = useState(5) // Default importance

    const tagInputRef = useRef(null)

    // Sync tags from parent if provided, otherwise fetch
    useEffect(() => {
        if (externalTags && externalTags.length > 0) {
            setAllTags(externalTags)
        } else {
            fetchTags()
        }
    }, [externalTags])

    useEffect(() => {
        if (blocId) {
            fetchTasks()
        }
    }, [blocId, refreshTrigger]) // Added refreshTrigger dependency

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const allTasks = await getTasks()
            // If blocId is 'all', show all tasks. Otherwise, filter by blocId.
            const blocTasks = blocId === 'all' ? allTasks : allTasks.filter(task => task.bloc_id === blocId)
            setTasks(blocTasks)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTags = async () => {
        try {
            const tags = await getTags()
            setAllTags(tags)
        } catch (error) {
            console.error('Error fetching tags:', error)
        }
    }

    const handleCreateTask = async (e) => {
        e.preventDefault()
        // Prevent creation if in 'all' view or empty name
        if (blocId === 'all' || !newTaskName.trim()) return

        // Calculate Estimated Hours (decimal)
        const hours = parseInt(estHours) || 0
        const minutes = parseInt(estMinutes) || 0
        const totalEstimatedHours = hours + (minutes / 60)

        try {
            let finalTagId = selectedTag?.id || null

            // Auto-create tag if pending
            if (isCreatingTag && tagSearch.trim()) {
                try {
                    const newTag = await createTag({
                        name: tagSearch,
                        importance_level: newTagImportance
                    })
                    // Update local tags state so it appears immediately
                    setAllTags(prev => [...prev, newTag])
                    finalTagId = newTag.id
                } catch (tagError) {
                    console.error('Error auto-creating tag:', tagError)
                }
            }

            const createdTask = await createTask({
                title: newTaskName,
                bloc_id: blocId,
                completed: false,
                tag_id: finalTagId,
                estimated_hours: totalEstimatedHours > 0 ? totalEstimatedHours : null,
                due_date: newDate ? new Date(newDate).toISOString() : null,
                description: newTaskDescription
            })

            // Create subtasks if any
            if (subtasks.length > 0) {
                await Promise.all(subtasks.map(st => createSubtask({
                    task_id: createdTask.id,
                    title: st
                })))
            }

            resetForm()
            fetchTasks()
        } catch (error) {
            console.error('Error creating task:', error)
        }
    }

    const resetForm = () => {
        setNewTaskName('')
        setNewTaskDescription('')
        setNewDate('')
        setEstHours('')
        setEstMinutes('')
        setTagSearch('')
        setSelectedTag(null)
        setIsCreatingTag(false)
        setShowTagDropdown(false)
        setIsCreating(false)
        setSubtasks([])
        setCurrentSubtask('')
    }

    // Tag Handling
    const handleTagSearchChange = (e) => {
        setTagSearch(e.target.value)
        setShowTagDropdown(true)
        setSelectedTag(null) // Reset selection on type
    }

    const handleSelectTag = (tag) => {
        setSelectedTag(tag)
        setTagSearch(tag.name)
        setShowTagDropdown(false)
    }

    const initCreateTag = () => {
        setIsCreatingTag(true)
        setShowTagDropdown(false)
    }

    const confirmCreateTag = async () => {
        try {
            const newTag = await createTag({
                name: tagSearch, // The current search text is the new name
                importance_level: newTagImportance
            })
            setAllTags([...allTags, newTag])
            setSelectedTag(newTag) // Select the newly created tag
            setIsCreatingTag(false) // Exit tag creation mode
        } catch (error) {
            console.error('Error creating tag:', error)
        }
    }

    // Subtask Handlers
    const handleAddSubtask = (e) => {
        e.preventDefault() // Prevent form submission
        if (currentSubtask.trim()) {
            setSubtasks([...subtasks, currentSubtask.trim()])
            setCurrentSubtask('')
        }
    }

    const handleRemoveSubtask = (index) => {
        setSubtasks(subtasks.filter((_, i) => i !== index))
    }

    return (
        <motion.div
            className={`task-list-panel ${isCreating ? 'creating-mode' : ''} ${isCreatingTag ? 'tag-creating-mode' : ''}`}
            // Static width, but allow Framer Motion entrance/exit
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="panel-list-section">
                <motion.div layout className="task-panel-header">
                    <h3>
                        {isCreating ? 'Nueva Tarea' : ''}
                    </h3>

                </motion.div>

                {/* Only show creation form if NOT in 'all' view */}
                {blocId !== 'all' && (
                    <form onSubmit={handleCreateTask} className="add-task-form">
                        <motion.div layout className="input-group-main">
                            <input
                                type="text"
                                placeholder="Nueva tarea..."
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                onFocus={() => {
                                    setIsCreating(true)
                                    // Only call if provided
                                    if (onSelectTask) onSelectTask(null)
                                }}
                                className="add-task-input"
                                autoFocus={isCreating}
                            />

                        </motion.div>

                        <AnimatePresence>
                            {isCreating && (
                                <motion.div
                                    layout
                                    className="expanded-form-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <textarea
                                        placeholder="Descripción (opcional)..."
                                        value={newTaskDescription}
                                        onChange={(e) => setNewTaskDescription(e.target.value)}
                                        className="task-description-input"
                                        rows={2}
                                    />
                                    {/* Time Estimation */}
                                    <div className="form-row time-estimation-row">
                                        <label className="form-label"><TimeLine size={14} /> Estimado:</label>
                                        <div className="time-inputs">
                                            <input
                                                type="number"
                                                placeholder="HH"
                                                className="time-input"
                                                min="0"
                                                value={estHours}
                                                onChange={(e) => setEstHours(e.target.value)}
                                            />
                                            <span className="time-separator">:</span>
                                            <input
                                                type="number"
                                                placeholder="MM"
                                                className="time-input"
                                                min="0"
                                                max="59"
                                                value={estMinutes}
                                                onChange={(e) => setEstMinutes(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Tag Selection */}
                                    <div className="tag-section-block" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '0.8rem' }}>
                                        {/* Top Row: Label + Input */}
                                        <div className="form-row">
                                            <label className="form-label"><TagLine size={14} /> Etiqueta:</label>

                                            {isCreatingTag ? (
                                                <div className="tag-creation-ui">
                                                    <span className="new-tag-name">{tagSearch}</span>
                                                    <div className="importance-selector">
                                                        <span>Imp: {newTagImportance}</span>
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="10"
                                                            value={newTagImportance}
                                                            onChange={(e) => setNewTagImportance(parseInt(e.target.value))}
                                                            className="importance-slider"
                                                        />
                                                    </div>
                                                    <button type="button" onClick={confirmCreateTag} className="confirm-tag-btn">
                                                        <CheckLine size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder="Buscar o crear..."
                                                    value={tagSearch}
                                                    onChange={(e) => {
                                                        setTagSearch(e.target.value)
                                                        if (selectedTag && selectedTag.name !== e.target.value) {
                                                            setSelectedTag(null)
                                                        }
                                                    }}
                                                    className="secondary-input tag-input-compact"
                                                    ref={tagInputRef}
                                                />
                                            )}
                                        </div>

                                        {/* Bottom Row: Horizontal List (Full Width) */}
                                        {!isCreatingTag && (
                                            <div className="tags-horizontal-list">
                                                {allTags
                                                    .filter(tag => tag.name.toLowerCase().includes(tagSearch.toLowerCase()))
                                                    .map(tag => (
                                                        <div
                                                            key={tag.id}
                                                            className={`tag-chip ${selectedTag?.id === tag.id ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                setSelectedTag(tag)
                                                                setTagSearch(tag.name)
                                                            }}
                                                        >
                                                            {tag.name}
                                                        </div>
                                                    ))
                                                }
                                                {tagSearch && !allTags.some(t => t.name.toLowerCase() === tagSearch.toLowerCase()) && (
                                                    <div className="tag-chip create-chip" onClick={initCreateTag}>
                                                        + Crear "{tagSearch}"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Date Input */}
                                    <div className="form-row">
                                        <label className="form-label">Fecha:</label>
                                        <input
                                            type="date"
                                            value={newDate}
                                            onChange={(e) => setNewDate(e.target.value)}
                                            className="secondary-input"
                                        />
                                    </div>

                                    {/* Subtasks Section */}
                                    <div className="subtasks-section">
                                        <div className="form-row">
                                            <label className="form-label">Subtareas:</label>
                                            <div className="subtask-input-container" style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                                <input
                                                    type="text"
                                                    className="secondary-input"
                                                    placeholder="Añadir subtarea..."
                                                    value={currentSubtask}
                                                    onChange={(e) => setCurrentSubtask(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault()
                                                            handleAddSubtask(e)
                                                        }
                                                    }}
                                                />
                                                <button type="button" onClick={handleAddSubtask} className="add-subtask-btn">
                                                    <AddLine size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        {subtasks.length > 0 && (
                                            <ul className="subtasks-list-preview">
                                                {subtasks.map((st, index) => (
                                                    <li key={index} className="subtask-preview-item">
                                                        <span>{st}</span>
                                                        <button type="button" onClick={() => handleRemoveSubtask(index)} className="remove-subtask-btn">
                                                            <CloseLine size={14} />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" onClick={resetForm} className="cancel-btn">
                                            Cancelar
                                        </button>
                                        <button type="submit" className="save-btn">
                                            Guardar
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                )}

                <AnimatePresence>
                    {!isCreating && (
                        <motion.div
                            layout
                            className="tasks-list-container"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {loading ? (
                                <div className="loading-tasks">Cargando...</div>
                            ) : tasks.length === 0 ? (
                                <div className="empty-tasks">No hay tareas</div>
                            ) : (
                                tasks
                                    .filter(task => !selectedTask || task.id !== selectedTask.id) // Filter out selected task
                                    .map(task => {
                                        const tag = allTags.find(t => t.id === task.tag_id)
                                        return (
                                            <motion.div
                                                key={task.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <TaskCard
                                                    task={task}
                                                    tagName={tag ? tag.name : "Personal"} // Default or empty
                                                    onClick={() => onSelectTask && onSelectTask(task)} // Select task on click
                                                />
                                            </motion.div>
                                        )
                                    })
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default TaskListPanel
