import React, { useState, useEffect, useRef } from 'react'
import { CloseLine, TimeLine, CalendarLine, TagLine, PlayLine, Delete2Line, AddLine, CheckLine, Edit2Line } from '@mingcute/react'
import { updateTask, deleteTask, getSubtasks, createSubtask, updateSubtask, deleteSubtask, getTags, createTag } from '../../services/api'
import TaskClock from './TaskClock'
import TitleEditPopover from './Popovers/TitleEditPopover'
import TagPopover from './Popovers/TagPopover'
import DateEditPopover from './Popovers/DateEditPopover'
import SubtaskPopover from './Popovers/SubtaskPopover'
import TimeEditPopover from './Popovers/TimeEditPopover'
import './TaskContentCard.css'

const TaskContentCard = ({ task, onClose, onTaskUpdate, onTaskDelete }) => {
    const [isTaskStarted, setIsTaskStarted] = useState(false)

    // Subtasks State
    const [subtasks, setSubtasks] = useState([])
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

    // Title Popover State
    const [showTitlePopover, setShowTitlePopover] = useState(false)
    const [titlePopoverPos, setTitlePopoverPos] = useState({ top: 0, left: 0 })
    const [tempTitle, setTempTitle] = useState('')

    // Tag Popover State
    const [showTagPopover, setShowTagPopover] = useState(false)
    const [tagPopoverPos, setTagPopoverPos] = useState({ top: 0, left: 0 })
    const [allTags, setAllTags] = useState([])
    const [selectedTag, setSelectedTag] = useState(null)

    // Date Popover State
    const [showDatePopover, setShowDatePopover] = useState(false)
    const [datePopoverPos, setDatePopoverPos] = useState({ top: 0, left: 0 })
    const [tempDate, setTempDate] = useState('')

    // Subtask Popover State
    const [showSubtaskPopover, setShowSubtaskPopover] = useState(false)
    const [subtaskPopoverPos, setSubtaskPopoverPos] = useState({ top: 0, left: 0 })

    // Time Popover State
    const [showTimePopover, setShowTimePopover] = useState(false)
    const [timePopoverPos, setTimePopoverPos] = useState({ top: 0, left: 0 })

    const editBtnRef = useRef(null)
    const cardRef = useRef(null)

    // Reset loop
    useEffect(() => {
        setIsTaskStarted(false)
        if (task) {
            fetchSubtasks(task.id)
        }
    }, [task])

    const fetchSubtasks = async (taskId) => {
        try {
            const data = await getSubtasks(taskId)
            setSubtasks(data)
        } catch (error) {
            console.error('Error fetching subtasks:', error)
        }
    }

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

    const handleDeleteClick = async () => {
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

    // Subtask Handlers
    const handleToggleSubtask = async (subtask) => {
        try {
            const updated = await updateSubtask(subtask.id, { completed: !subtask.completed })
            setSubtasks(prev => prev.map(s => s.id === subtask.id ? updated : s))
            if (onTaskUpdate) {
                // Trigger refresh to update card counts maybe?
                // For now just local update is fine, but parent might need to know
                onTaskUpdate({ ...task })
            }
        } catch (error) {
            console.error('Error toggling subtask:', error)
        }
    }

    const handleAddSubtask = async (e) => {
        e.preventDefault()
        if (!newSubtaskTitle.trim()) return

        try {
            const newSubtask = await createSubtask({
                task_id: task.id,
                title: newSubtaskTitle
            })
            setSubtasks([...subtasks, newSubtask])
            setNewSubtaskTitle('')
            if (onTaskUpdate) onTaskUpdate({ ...task })
        } catch (error) {
            console.error('Error adding subtask:', error)
        }
    }

    const handleDeleteSubtask = async (subtaskId) => {
        try {
            await deleteSubtask(subtaskId)
            setSubtasks(prev => prev.filter(s => s.id !== subtaskId))
            if (onTaskUpdate) onTaskUpdate({ ...task })
        } catch (error) {
            console.error('Error deleting subtask:', error)
        }
    }

    const handleUpdateSubtaskTitle = async (subtaskId, newTitle) => {
        try {
            const updated = await updateSubtask(subtaskId, { title: newTitle })
            setSubtasks(prev => prev.map(s => s.id === subtaskId ? updated : s))
        } catch (error) {
            console.error('Error updating subtask:', error)
        }
    }

    const handleEditClick = () => {
        if (editBtnRef.current && cardRef.current) {
            const btnRect = editBtnRef.current.getBoundingClientRect()
            const cardRect = cardRef.current.getBoundingClientRect()

            // Fallback to button rect if card rect is somehow failing/missing
            // But main logic: LEFT of the CARD with a 20px gap
            const leftPos = cardRect ? (cardRect.left - 20) : (btnRect.left - 320);

            setTitlePopoverPos({
                top: btnRect.top,
                left: leftPos
            })
            setTempTitle(task.title)
            setShowTitlePopover(true)
        }
    }

    // Tag Logic
    const fetchTags = async () => {
        try {
            const tags = await getTags()
            setAllTags(tags)
            const currentTag = tags.find(t => t.id === task.tag_id)
            setSelectedTag(currentTag)
        } catch (error) {
            console.error('Error fetching tags:', error)
        }
    }

    const handleEditTagClick = () => {
        fetchTags()
        // Position same as title popover for now, or maybe centered?
        setTagPopoverPos(titlePopoverPos)
        setShowTagPopover(true)
    }

    const handleTagSelect = async (tag) => {
        try {
            const updatedTask = await updateTask(task.id, { tag_id: tag.id })
            setSelectedTag(tag)
            if (onTaskUpdate) onTaskUpdate({ ...task, tag_id: tag.id, tag_name: tag.name })
            setShowTagPopover(false)
        } catch (error) {
            console.error('Error updating tag:', error)
        }
    }

    const handleCreateTag = async (newTagData) => {
        try {
            const newTag = await createTag(newTagData)
            setAllTags(prev => [...prev, newTag])
            handleTagSelect(newTag)
        } catch (e) {
            console.error(e)
        }
    }

    // Date Logic
    const handleEditDateClick = () => {
        setTempDate(task.due_date || new Date().toISOString())
        setDatePopoverPos(titlePopoverPos)
        setShowDatePopover(true)
    }

    const handleDateSave = async () => {
        if (!tempDate) {
            setShowDatePopover(false)
            return
        }

        try {
            // Ensure we have a valid ISO string. tempDate from input type='date' is YYYY-MM-DD
            // We might want to keep time if it exists, but type='date' strips it.
            // For now, let's just save the date.
            const dateObj = new Date(tempDate)
            const isoDate = dateObj.toISOString()

            const updatedTask = await updateTask(task.id, { due_date: isoDate })
            if (onTaskUpdate) onTaskUpdate({ ...task, due_date: isoDate })
            setShowDatePopover(false)
        } catch (error) {
            console.error('Error updating date:', error)
            alert('Error al actualizar fecha')
        }
    }

    const handleTitleSave = async () => {
        if (!tempTitle.trim() || tempTitle === task.title) {
            setShowTitlePopover(false)
            return
        }

        try {
            const updatedTask = await updateTask(task.id, { title: tempTitle })
            if (onTaskUpdate) {
                onTaskUpdate({ ...task, title: tempTitle })
            }
            setShowTitlePopover(false)
        } catch (error) {
            console.error('Error updating title:', error)
            alert('Error al actualizar título')
        }
    }

    // Subtask Popover Handlers
    const handleEditSubtasksClick = () => {
        setSubtaskPopoverPos(titlePopoverPos)
        setShowSubtaskPopover(true)
    }

    const handleAddSubtaskFromPopover = async (title) => {
        try {
            const newSubtask = await createSubtask({
                task_id: task.id,
                title: title
            })
            setSubtasks(prev => [...prev, newSubtask])
            if (onTaskUpdate) onTaskUpdate({ ...task })
        } catch (error) {
            console.error('Error adding subtask:', error)
        }
    }

    const handleRemoveSubtaskFromPopover = async (index) => {
        const subtaskToRemove = subtasks[index]
        if (subtaskToRemove) {
            await handleDeleteSubtask(subtaskToRemove.id)
        }
    }

    // Time Popover Handlers
    const handleEditTimeClick = () => {
        setTimePopoverPos(titlePopoverPos)
        setShowTimePopover(true)
    }

    const handleTimeSave = async (hours, minutes) => {
        try {
            const totalHours = hours + (minutes / 60)
            const updatedTask = await updateTask(task.id, { estimated_hours: totalHours })
            if (onTaskUpdate) onTaskUpdate({ ...task, estimated_hours: totalHours })
            setShowTimePopover(false)
        } catch (error) {
            console.error('Error updating time:', error)
        }
    }

    return (
        <div className={`task-content-card ${isTaskStarted ? 'started' : ''}`} ref={cardRef}>
            <div className="task-card-inner">
                <div className="task-card-front">
                    <div className="task-content-header">
                        <button
                            ref={editBtnRef}
                            className="task-content-action-btn task-edit-btn-hover"
                            title="Editar"
                            onClick={handleEditClick}
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

                        {task.description && (
                            <div className="task-description-section">
                                <p>{task.description}</p>
                            </div>
                        )}

                        {/* Subtasks View */}
                        {subtasks.length > 0 && (
                            <div className="task-subtasks-section">
                                <h3>Subtareas</h3>
                                <div className="subtasks-list">
                                    {subtasks.map(st => (
                                        <div key={st.id} className={`subtask-item ${st.completed ? 'completed' : ''}`}>
                                            <div
                                                className="subtask-checkbox"
                                                onClick={() => handleToggleSubtask(st)}
                                            >
                                                {st.completed && <CheckLine size={14} />}
                                            </div>
                                            <span className="subtask-title">{st.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
            </div>

            <TaskClock
                isRunning={isTaskStarted}
                initialSeconds={(task.estimated_hours || 0) * 3600}
                key={task.id}
            />

            {showTitlePopover && (
                <TitleEditPopover
                    isOpen={showTitlePopover}
                    position={titlePopoverPos}
                    value={tempTitle}
                    onChange={setTempTitle}
                    onSave={handleTitleSave}
                    onClose={() => setShowTitlePopover(false)}
                    onDelete={handleDeleteClick}
                    onEditTag={handleEditTagClick}
                    onEditDate={handleEditDateClick}
                    onEditSubtasks={handleEditSubtasksClick}
                    onEditTime={handleEditTimeClick}
                />
            )}

            {showTagPopover && (
                <TagPopover
                    isOpen={showTagPopover}
                    position={tagPopoverPos}
                    tags={allTags}
                    selectedTag={selectedTag}
                    onSelectTag={handleTagSelect}
                    onCreateTag={handleCreateTag}
                    onClose={() => setShowTagPopover(false)}
                    style={{ transform: 'translate(-100%, 0)' }}
                />
            )}

            {showDatePopover && (
                <DateEditPopover
                    isOpen={showDatePopover}
                    position={datePopoverPos}
                    value={tempDate}
                    onChange={setTempDate}
                    onSave={handleDateSave}
                    onClose={() => setShowDatePopover(false)}
                />
            )}

            {showSubtaskPopover && (
                <SubtaskPopover
                    isOpen={showSubtaskPopover}
                    position={subtaskPopoverPos}
                    subtasks={subtasks.map(s => s.title)} // Pass titles string array if popover expects strings, or modify popover? 
                    // SubtaskPopover expects strings array based on previous view_file. 
                    // Wait, view_file showed: 
                    // subtasks.map((st, index) => ( ... <span className="subtask-text">{st}</span> ... ))
                    // So it expects an array of strings. 
                    // But my subtasks are objects {id, title, completed}.
                    // I should map to strings here, OR update SubtaskPopover to handle objects. 
                    // Since it's reused from TaskListPanel (creation mode), it likely uses strings.
                    // For editing existing tasks, it's better if SubtaskPopover handles objects or I map them.
                    // If I map to strings, I lose IDs for deletion in the popover if it relies on index. 
                    // handleRemoveSubtaskFromPopover receives index. 
                    // It will work if the array order is preserved.
                    onAddSubtask={handleAddSubtaskFromPopover}
                    onRemoveSubtask={handleRemoveSubtaskFromPopover}
                    onClose={() => setShowSubtaskPopover(false)}
                    style={{ transform: 'translate(-100%, 0)' }}
                />
            )}

            {showTimePopover && (
                <TimeEditPopover
                    isOpen={showTimePopover}
                    position={timePopoverPos}
                    hours={Math.floor(task.estimated_hours || 0)}
                    minutes={Math.round(((task.estimated_hours || 0) % 1) * 60)}
                    onSave={handleTimeSave}
                    onClose={() => setShowTimePopover(false)}
                    style={{ transform: 'translate(-100%, 0)' }}
                />
            )}
        </div>
    )
}

export default TaskContentCard
