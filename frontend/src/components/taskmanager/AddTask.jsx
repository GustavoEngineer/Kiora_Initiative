import { useState, useRef, useEffect } from 'react'
import { createTag } from '../../services/api'
import '../../styles/TaskManager.css'

function AddTask({ blocId, tagsMap, onStartTyping, onClear, onTaskAdded }) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Form State
    const [title, setTitle] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [workHours, setWorkHours] = useState('')

    // Tag State
    const [selectedTagId, setSelectedTagId] = useState('')
    const [tagSearch, setTagSearch] = useState('')
    const [isCreatingTag, setIsCreatingTag] = useState(false)
    const [newTagImportance, setNewTagImportance] = useState(5)
    // New state for focus
    const [isTagInputFocused, setIsTagInputFocused] = useState(false)

    // Refs
    const titleInputRef = useRef(null)

    // Expand on focus
    const handleTitleFocus = () => {
        if (!isExpanded) {
            setIsExpanded(true)
            onStartTyping()
        }
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const handleCancel = () => {
        resetForm()
        onClear()
    }

    const resetForm = () => {
        setTitle('')
        setDueDate('')
        setWorkHours('')
        setSelectedTagId('')
        setTagSearch('')
        setIsCreatingTag(false)
        setNewTagImportance(5)
        setIsExpanded(false)
        setIsTagInputFocused(false)
    }

    // Tag Logic
    const handleTagSearchChange = (e) => {
        setTagSearch(e.target.value)
        // If user clears search, reset selection
        if (e.target.value === '') {
            setSelectedTagId('')
        }
    }

    const handleTagInputFocus = () => {
        setIsTagInputFocused(true)
    }

    const handleTagInputBlur = () => {
        // Small delay to allow click on option to register
        setTimeout(() => {
            setIsTagInputFocused(false)
        }, 200)
    }

    const selectTag = (id, name) => {
        setSelectedTagId(id)
        setTagSearch(name)
        setIsCreatingTag(false)
        setIsTagInputFocused(false) // Close dropdown
    }

    const startCreateTag = () => {
        setIsCreatingTag(true)
    }

    const confirmCreateTag = async () => {
        if (!tagSearch.trim()) return

        try {
            const newTag = await createTag({
                name: tagSearch,
                importance_level: parseInt(newTagImportance)
            })
            // Select the new tag
            selectTag(newTag.id, newTag.name)
        } catch (error) {
            console.error("Error creating tag", error)
        }
    }

    const handleSubmit = async () => {
        if (!title.trim()) return

        const newTask = {
            title: title,
            due_date: dueDate ? dueDate : null,
            estimated_hours: workHours ? parseFloat(workHours) : null,
            tag_id: selectedTagId ? selectedTagId : null,
            bloc_id: blocId
        }

        await onTaskAdded(newTask)
        resetForm()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
        if (e.key === 'Escape') {
            handleCancel()
        }
    }

    // Filter tags for autocomplete
    const filteredTags = Object.entries(tagsMap || {})
        .filter(([id, name]) => name.toLowerCase().includes(tagSearch.toLowerCase()))

    // Exact match check to show/hide "Create" button
    const exactMatch = filteredTags.some(([id, name]) => name.toLowerCase() === tagSearch.toLowerCase())

    return (
        <div className={`add-task-container-wrapper ${isExpanded ? 'expanded' : ''}`}>
            <div className="add-task-main-input-row">
                <input
                    ref={titleInputRef}
                    type="text"
                    className="add-task-input-lg"
                    placeholder="+ Añadir nueva tarea"
                    value={title}
                    onChange={handleTitleChange}
                    onFocus={handleTitleFocus}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {isExpanded && (
                <div className="add-task-details-form animate-fade-in">

                    <div className="add-task-meta-row">
                        {/* Custom Tag Input */}
                        <div className="tag-input-container">
                            <input
                                type="text"
                                className="add-task-tag-input"
                                placeholder="Etiqueta"
                                value={tagSearch}
                                onChange={handleTagSearchChange}
                                onFocus={handleTagInputFocus}
                                onBlur={handleTagInputBlur}
                                disabled={isCreatingTag}
                            />

                            {/* Dropdown for tags */}
                            {/* Show if creating OR if focused (and not creating) */}
                            {/* Actually, if creating, we show the creation popover below. Dropdown should be hidden or specific?
                                Logic: If NOT creating tag, AND (focused OR we want to persist results?)
                                Usually: !isCreatingTag && isTagInputFocused
                            */}
                            {!isCreatingTag && isTagInputFocused && (
                                <div className="tag-dropdown">
                                    {filteredTags.map(([id, name]) => (
                                        <div
                                            key={id}
                                            className="tag-option"
                                            onClick={() => selectTag(id, name)}
                                        >
                                            {name}
                                        </div>
                                    ))}
                                    {tagSearch && !exactMatch && (
                                        <div
                                            className="tag-option create-option"
                                            onClick={startCreateTag}
                                        >
                                            + Crear "{tagSearch}"
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tag Creation Mini Form */}
                            {isCreatingTag && (
                                <div className="tag-creation-popover">
                                    <span>Importancia (1-10):</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={newTagImportance}
                                        onChange={(e) => setNewTagImportance(e.target.value)}
                                        className="tag-importance-input"
                                    />
                                    <button onClick={confirmCreateTag} className="btn-confirm-tag">✓</button>
                                    <button onClick={() => setIsCreatingTag(false)} className="btn-cancel-tag">✕</button>
                                </div>
                            )}
                        </div>

                        <input
                            type="number"
                            className="add-task-hours"
                            placeholder="Horas"
                            value={workHours}
                            onChange={(e) => setWorkHours(e.target.value)}
                            min="0"
                            step="0.5"
                        />

                        <input
                            type="date"
                            className="add-task-date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="add-task-actions">
                        <button className="btn-cancel" onClick={handleCancel}>
                            Cancelar
                        </button>
                        <button className="btn-save" onClick={handleSubmit}>
                            Guardar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddTask
