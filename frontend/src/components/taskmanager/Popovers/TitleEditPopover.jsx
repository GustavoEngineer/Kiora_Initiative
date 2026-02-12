import React, { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Edit2Line, Delete2Line, TagLine, CalendarLine, ListCheckLine, TimeLine } from '@mingcute/react'
import './TitleEditPopover.css'

const TitleEditPopover = ({ isOpen, position, value, onChange, onSave, onClose, onDelete, onEditTag, onEditDate, onEditSubtasks, onEditTime }) => {
    const inputRef = useRef(null)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (isOpen && isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isOpen, isEditing])

    // Reset editing state when popover closes/opens
    useEffect(() => {
        if (isOpen) setIsEditing(false)
    }, [isOpen])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.title-edit-popover') && !event.target.closest('.task-content-action-btn')) {
                onClose()
            }
        }

        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside)
        }, 100)

        return () => {
            clearTimeout(timer)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            onSave()
        }
        if (e.key === 'Escape') {
            if (isEditing) {
                setIsEditing(false)
            } else {
                onClose()
            }
        }
    }

    if (!isOpen) return null

    return createPortal(
        <div
            className="title-edit-popover"
            style={{
                top: position.top,
                left: position.left,
                transform: 'translate(-100%, 0)'
            }}
        >
            {!isEditing ? (
                <>
                    <button
                        className="popover-menu-item"
                        onClick={() => setIsEditing(true)}
                        title="Cambiar nombre"
                    >
                        <Edit2Line size={20} />
                        <span>Cambiar nombre</span>
                    </button>
                    <button
                        className="popover-menu-item"
                        onClick={() => {
                            onClose()
                            if (onEditTag) onEditTag()
                        }}
                        title="Editar tag"
                    >
                        <TagLine size={20} />
                        <span>Editar tag</span>
                    </button>
                    <button
                        className="popover-menu-item"
                        onClick={() => {
                            onClose()
                            if (onEditDate) onEditDate()
                        }}
                        title="Editar fecha"
                    >
                        <CalendarLine size={20} />
                        <span>Editar fecha</span>
                    </button>
                    <button
                        className="popover-menu-item"
                        onClick={() => {
                            onClose()
                            if (onEditSubtasks) onEditSubtasks()
                        }}
                        title="Editar subtareas"
                    >
                        <ListCheckLine size={20} />
                        <span>Editar subtareas</span>
                    </button>
                    <button
                        className="popover-menu-item"
                        onClick={() => {
                            onClose()
                            if (onEditTime) onEditTime()
                        }}
                        title="Editar tiempo"
                    >
                        <TimeLine size={20} />
                        <span>Editar tiempo</span>
                    </button>
                    <button
                        className="popover-menu-item delete-item"
                        onClick={() => {
                            onClose()
                            if (onDelete) onDelete()
                        }}
                        title="Eliminar tarea"
                    >
                        <Delete2Line size={20} />
                        <span>Eliminar tarea</span>
                    </button>
                </>
            ) : (
                <>
                    <input
                        ref={inputRef}
                        type="text"
                        className="title-edit-input-popover"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Título de la tarea"
                    />
                    <div className="popover-actions">
                        <button className="popover-save-btn" onClick={onSave}>Guardar</button>
                    </div>
                </>
            )
            }
        </div >,
        document.body
    )
}

export default TitleEditPopover
