import React from 'react'
import { createPortal } from 'react-dom'
import './DescriptionPopover.css'

const DescriptionPopover = ({ isOpen, position, value, onChange }) => {
    if (!isOpen) return null

    return createPortal(
        <div
            className="description-popover"
            style={{
                top: position.top,
                left: position.left
            }}
        >
            <textarea
                className="description-popover-input"
                placeholder="Escribe la descripción completa..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus
                rows={6}
            />
        </div>,
        document.body
    )
}

export default DescriptionPopover
