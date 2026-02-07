import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ListCheckLine, CloseLine, AddLine } from '@mingcute/react'
import './SubtaskPopover.css'

const SubtaskPopover = ({
    isOpen,
    position,
    subtasks,
    onAddSubtask,
    onRemoveSubtask,
    onClose
}) => {
    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef(null)

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAdd()
        }
    }

    const handleAdd = () => {
        if (inputValue.trim()) {
            onAddSubtask(inputValue.trim())
            setInputValue('')
        }
    }

    return createPortal(
        <div
            className="subtask-popover"
            style={{
                top: position.top,
                left: position.left
            }}
        >
            <div className="subtask-popover-header">
                <ListCheckLine size={16} />
                <span>Subtareas</span>
            </div>

            <div className="subtask-input-container">
                <input
                    ref={inputRef}
                    type="text"
                    className="subtask-input"
                    placeholder="Añadir subtarea..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="add-subtask-btn"
                    onClick={handleAdd}
                    disabled={!inputValue.trim()}
                >
                    <AddLine size={16} />
                </button>
            </div>

            <div className="subtasks-list-column">
                {subtasks.length === 0 ? (
                    <div className="empty-subtasks-message">No hay subtareas</div>
                ) : (
                    subtasks.map((st, index) => (
                        <div key={index} className="subtask-list-item">
                            <span className="subtask-text">{st}</span>
                            <button
                                className="remove-subtask-btn"
                                onClick={() => onRemoveSubtask(index)}
                            >
                                <CloseLine size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>,
        document.body
    )
}

export default SubtaskPopover
