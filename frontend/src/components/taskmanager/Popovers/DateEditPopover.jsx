import React, { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarLine } from '@mingcute/react'
import './DateEditPopover.css'

const DateEditPopover = ({ isOpen, position, value, onChange, onSave, onClose }) => {
    const inputRef = useRef(null)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.date-edit-popover') && !event.target.closest('.task-content-action-btn')) {
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

    if (!isOpen) return null

    return createPortal(
        <div
            className="date-edit-popover"
            style={{
                top: position.top,
                left: position.left,
                transform: 'translate(-100%, 0)'
            }}
        >
            <div className="date-popover-header">
                <CalendarLine size={18} />
                <span>Editar Fecha</span>
            </div>

            <input
                ref={inputRef}
                type="date"
                className="date-edit-input-popover"
                value={value ? value.substring(0, 10) : ''}
                onChange={(e) => onChange(e.target.value)}
            />

            <div className="popover-actions">
                <button className="popover-save-btn" onClick={onSave}>Guardar</button>
            </div>
        </div>,
        document.body
    )
}

export default DateEditPopover
