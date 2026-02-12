import React from 'react'
import { Delete2Line } from '@mingcute/react'
import './DeleteConfirmPopover.css'

const DeleteConfirmPopover = ({ onConfirm, onCancel }) => {
    return (
        <div className="delete-confirm-popover">
            <div className="delete-confirm-icon">
                <Delete2Line size={24} />
            </div>
            <div className="delete-confirm-content">
                <h3>¿Eliminar tarea?</h3>
                <p>Esta acción no se puede deshacer.</p>
            </div>
            <div className="delete-confirm-actions">
                <button className="delete-confirm-cancel" onClick={onCancel}>
                    Cancelar
                </button>
                <button className="delete-confirm-btn" onClick={onConfirm}>
                    Eliminar
                </button>
            </div>
        </div>
    )
}

export default DeleteConfirmPopover
