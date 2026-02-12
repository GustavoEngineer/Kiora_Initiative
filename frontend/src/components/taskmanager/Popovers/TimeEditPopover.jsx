import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { TimeLine, CheckLine } from '@mingcute/react'
import './TimeEditPopover.css'

const TimeEditPopover = ({
    isOpen,
    position,
    hours,
    minutes,
    onSave,
    onClose,
    style = {}
}) => {
    const [tempHours, setTempHours] = useState(hours || 0)
    const [tempMinutes, setTempMinutes] = useState(minutes || 0)
    const containerRef = useRef(null)

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setTempHours(hours || 0)
            setTempMinutes(minutes || 0)
        }
    }, [isOpen, hours, minutes])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.time-edit-popover') && !event.target.closest('.time-trigger')) {
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

    const handleSave = () => {
        onSave(parseInt(tempHours) || 0, parseInt(tempMinutes) || 0)
    }

    return createPortal(
        <div
            className="time-edit-popover"
            style={{
                top: position.top,
                left: position.left,
                ...style
            }}
        >
            <div className="time-popover-header">
                <TimeLine size={16} />
                <span>Tiempo Estimado</span>
            </div>

            <div className="time-inputs-container">
                <div className="time-input-group">
                    <input
                        type="number"
                        min="0"
                        value={tempHours}
                        onChange={(e) => setTempHours(e.target.value)}
                        className="time-input"
                        placeholder="0"
                    />
                    <span className="time-label">h</span>
                </div>
                <div className="time-input-group">
                    <input
                        type="number"
                        min="0"
                        max="59"
                        value={tempMinutes}
                        onChange={(e) => setTempMinutes(e.target.value)}
                        className="time-input"
                        placeholder="00"
                    />
                    <span className="time-label">m</span>
                </div>
            </div>

            <div className="popover-actions">
                <button className="popover-save-btn" onClick={handleSave}>
                    Guardar
                </button>
            </div>
        </div>,
        document.body
    )
}

export default TimeEditPopover
