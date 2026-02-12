import { useState, useEffect, useRef } from 'react'
import { getTasks, createTask, updateTask, deleteTask, getTags, createTag, createSubtask } from '../../../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { AddLine, CloseLine, TimeLine, TagLine, CheckLine, ListCheckLine } from '@mingcute/react'
import TaskCard from '../TaskCard'
import DescriptionPopover from '../Popovers/DescriptionPopover'
import TagPopover from '../Popovers/TagPopover'
import SubtaskPopover from '../Popovers/SubtaskPopover'
import './TaskListPanel.css'

const TaskListPanel = ({ blocId, onClose, selectedTask, onSelectTask, refreshTrigger, externalTags }) => {
    // ... existing state ...
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [newTaskName, setNewTaskName] = useState('')
    const [newTaskDescription, setNewTaskDescription] = useState('')

    // Description Popover State
    const [showDescPopover, setShowDescPopover] = useState(false)
    const [descPopoverPos, setDescPopoverPos] = useState({ top: 0, left: 0 })
    const descInputRef = useRef(null)
    const panelRef = useRef(null)

    // ... existing useEffects ...

    // Handle Description Click
    const handleDescClick = () => {
        if (descInputRef.current && panelRef.current) {
            const inputRect = descInputRef.current.getBoundingClientRect()
            const panelRect = panelRef.current.getBoundingClientRect()

            // Dynamic positioning: Left of the PANEL if space permits
            const spaceLeft = panelRect.left
            const popoverWidth = 320 // Width + gap

            let leftPos = panelRect.left - 310 // Default: Left of panel

            // If not enough space left, fallback to right of panel (rare for this layout) 
            // or maybe just align with panel left edge but shifted?
            // User requested "to the side", likely left.

            setDescPopoverPos({
                top: inputRect.top, // Align top with input
                left: leftPos
            })
            setShowDescPopover(true)
        }
    }

    // Tag Popover State
    const [showTagPopover, setShowTagPopover] = useState(false)
    const [tagPopoverPos, setTagPopoverPos] = useState({ top: 0, left: 0 })
    const tagTriggerRef = useRef(null)

    // Handle Tag Trigger Click
    const handleTagClick = () => {
        if (tagTriggerRef.current && panelRef.current) {
            const triggerRect = tagTriggerRef.current.getBoundingClientRect()
            const panelRect = panelRef.current.getBoundingClientRect()

            // Position: Left of panel
            const leftPos = panelRect.left - 260 // 250px width + 10px gap

            setTagPopoverPos({
                top: triggerRect.top,
                left: leftPos
            })
            setShowTagPopover(true)
        }
    }

    // Subtask Popover State
    const [showSubtaskPopover, setShowSubtaskPopover] = useState(false)
    const [subtaskPopoverPos, setSubtaskPopoverPos] = useState({ top: 0, left: 0 })
    const subtaskTriggerRef = useRef(null)

    // Handle Subtask Trigger Click
    const handleSubtaskClick = () => {
        if (subtaskTriggerRef.current && panelRef.current) {
            const triggerRect = subtaskTriggerRef.current.getBoundingClientRect()
            const panelRect = panelRef.current.getBoundingClientRect()

            // Position: Left of panel
            const leftPos = panelRect.left - 290 // 280px width + 10px gap

            setSubtaskPopoverPos({
                top: triggerRect.top,
                left: leftPos
            })
            setShowSubtaskPopover(true)
        }
    }

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close description popover
            if (showDescPopover && !event.target.closest('.description-popover') && !event.target.closest('.description-trigger')) {
                setShowDescPopover(false)
            }
            // Close tag popover
            if (showTagPopover && !event.target.closest('.tag-popover') && !event.target.closest('.tag-trigger')) {
                setShowTagPopover(false)
            }
            // Close subtask popover
            if (showSubtaskPopover && !event.target.closest('.subtask-popover') && !event.target.closest('.subtask-trigger')) {
                setShowSubtaskPopover(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showDescPopover, showTagPopover, showSubtaskPopover])

    // ... render ...



    // ... existing functions ...

    // ... render ...


    // Creation Mode State
    const [isCreating, setIsCreating] = useState(false)
    const [newDate, setNewDate] = useState('')

    // Time Estimation State
    const [estHours, setEstHours] = useState('')
    const [estMinutes, setEstMinutes] = useState('')

    // Subtasks State
    const [subtasks, setSubtasks] = useState([])

    // Smart Tag State
    const [allTags, setAllTags] = useState([])
    const [selectedTag, setSelectedTag] = useState(null)

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
        setSelectedTag(null)
        setIsCreating(false)
        setSubtasks([])
    }





    return (
        <motion.div
            ref={panelRef}
            className={`task-list-panel ${isCreating ? 'creating-mode' : ''}`}
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
                                    exit={{ opacity: 0, height: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.16, 1, 0.3, 1],
                                        opacity: { duration: 0.3, delay: 0.3 },
                                        height: { delay: 0.3 }
                                    }}
                                >
                                    {/* Description Field (Trigger) */}
                                    <div
                                        ref={descInputRef}
                                        className="description-trigger"
                                        onClick={handleDescClick}
                                    >
                                        {newTaskDescription ? (
                                            <span className="desc-preview-text">{newTaskDescription}</span>
                                        ) : (
                                            <span className="desc-placeholder">Descripción (opcional)...</span>
                                        )}
                                    </div>

                                    {/* Description Popover */}
                                    <DescriptionPopover
                                        isOpen={showDescPopover}
                                        position={descPopoverPos}
                                        value={newTaskDescription}
                                        onChange={setNewTaskDescription}
                                    />
                                    {/* Time Estimation */}
                                    {/* Date & Time Row */}
                                    <div className="date-time-group">
                                        {/* Date Input Box */}
                                        <div className="date-time-box">
                                            <span className="box-label">Fecha</span>
                                            <div className="box-input-wrapper">
                                                <input
                                                    type="date"
                                                    value={newDate}
                                                    onChange={(e) => setNewDate(e.target.value)}
                                                    className="box-native-input"
                                                />
                                            </div>
                                        </div>

                                        {/* Time Estimation Box */}
                                        <div className="date-time-box">
                                            <span className="box-label"><TimeLine size={12} /> Estimado</span>
                                            <div className="box-input-wrapper">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    className="time-input-styled"
                                                    min="0"
                                                    value={estHours}
                                                    onChange={(e) => setEstHours(e.target.value)}
                                                />
                                                <span className="time-unit">h</span>
                                                <input
                                                    type="number"
                                                    placeholder="00"
                                                    className="time-input-styled"
                                                    min="0"
                                                    max="59"
                                                    value={estMinutes}
                                                    onChange={(e) => setEstMinutes(e.target.value)}
                                                />
                                                <span className="time-unit">m</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Tag Selection */}
                                    <div
                                        ref={tagTriggerRef}
                                        className="tag-trigger"
                                        onClick={handleTagClick}
                                    >
                                        <TagLine size={16} />
                                        <span className="current-tag-name">
                                            {selectedTag ? selectedTag.name : "Etiqueta (opcional)"}
                                        </span>
                                    </div>

                                    <TagPopover
                                        isOpen={showTagPopover}
                                        position={tagPopoverPos}
                                        tags={allTags}
                                        selectedTag={selectedTag}
                                        onSelectTag={(tag) => setSelectedTag(tag)}
                                        onCreateTag={async (newTagData) => {
                                            try {
                                                const newTag = await createTag(newTagData)
                                                setAllTags(prev => [...prev, newTag])
                                                setSelectedTag(newTag)
                                            } catch (e) {
                                                console.error(e)
                                            }
                                        }}
                                        onClose={() => setShowTagPopover(false)}
                                    />

                                    {/* Subtasks Section */}
                                    <div
                                        ref={subtaskTriggerRef}
                                        className="subtask-trigger"
                                        onClick={handleSubtaskClick}
                                    >
                                        <ListCheckLine size={16} />
                                        <span className="subtask-count">
                                            {subtasks.length > 0 ? `${subtasks.length} Subtareas` : "Subtareas (opcional)"}
                                        </span>
                                    </div>

                                    {showSubtaskPopover && (
                                        <SubtaskPopover
                                            isOpen={showSubtaskPopover}
                                            position={subtaskPopoverPos}
                                            subtasks={subtasks}
                                            onAddSubtask={(newSubtask) => setSubtasks([...subtasks, newSubtask])}
                                            onRemoveSubtask={(index) => setSubtasks(subtasks.filter((_, i) => i !== index))}
                                            onClose={() => setShowSubtaskPopover(false)}
                                        />
                                    )}

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
                            transition={{
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                                opacity: { duration: 0.3, delay: 0.6 },
                                height: { delay: 0.6 }
                            }}
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
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10, height: 0, marginBottom: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: [0.16, 1, 0.3, 1]
                                                }}
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
