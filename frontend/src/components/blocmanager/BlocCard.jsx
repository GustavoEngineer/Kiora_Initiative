import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BlocCard.css'

const BlocCard = ({ bloc, onUpdate, onDelete }) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(bloc.name)

    const navigate = useNavigate()

    const handleClick = () => {
        if (!isFlipped) {
            navigate(`/bloc/${bloc.id}`)
        }
    }

    const handleCornerHover = () => {
        setIsFlipped(true)
    }

    const handleCloseFlip = (e) => {
        e.stopPropagation()
        setIsFlipped(false)
        if (isEditing) setIsEditing(false)
    }

    const handleNameClick = (e) => {
        e.stopPropagation()
        setIsEditing(true)
        setEditName(bloc.name)
    }

    const handleNameSave = () => {
        if (!editName.trim()) return
        onUpdate(bloc.id, { name: editName })
        setIsEditing(false)
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        if (window.confirm('¿Seguro que quieres eliminar este bloc?')) {
            onDelete(bloc.id)
        }
    }

    const getIconByBlocId = (id) => {
        const index = parseInt(id) || 0
        const iconVariant = index % 5
        switch (iconVariant) {
            case 0: return <path d="M3 3v18h18M7 16l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
            case 1: return <path d="M12 2L4 12h8v10l8-10h-8V2z" strokeLinecap="round" strokeLinejoin="round" />
            case 2: return <path d="M12 2l9 5v10l-9 5-9-5V7z" strokeLinecap="round" strokeLinejoin="round" />
            case 3: return <path d="M4 4h16v16H4V4zM8 2v20M12 6h6M12 10h6M12 14h6" strokeLinecap="round" strokeLinejoin="round" />
            case 4: return <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            default: return <path d="M3 3v18h18M7 16l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
        }
    }

    return (
        <div className={`bloc-card-centered ${isFlipped ? 'flipped' : ''}`}>
            <div className="bloc-card-inner">
                {/* Front Face */}
                <div className="bloc-card-front" onClick={handleClick}>
                    {/* Corner Trigger for Flip - Only render if not flipped */}
                    {!isFlipped && (
                        <div
                            className="corner-flip-trigger"
                            onMouseEnter={handleCornerHover}
                            onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                            title="Editar Bloc"
                        >
                            ✎
                        </div>
                    )}

                    <div className="bloc-icon-centered">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            {getIconByBlocId(bloc.id)}
                        </svg>
                    </div>
                    <div className="bloc-name-centered">{bloc.name}</div>
                </div>

                {/* Back Face */}
                <div className="bloc-card-back">
                    {/* Close/Flip Back Button - Only render if flipped */}
                    {isFlipped && (
                        <div
                            className="corner-close-trigger"
                            onMouseEnter={handleCloseFlip}
                            onClick={handleCloseFlip}
                            title="Cerrar edición"
                        >
                            ✕
                        </div>
                    )}

                    <div className="bloc-icon-small">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            {getIconByBlocId(bloc.id)}
                        </svg>
                    </div>

                    {isEditing ? (
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={handleNameSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleNameSave()
                            }}
                            className="bloc-name-edit-input"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <div
                            className="bloc-name-centered bloc-name-editable"
                            onClick={handleNameClick}
                        >
                            {bloc.name}
                            <span className="edit-hint">✎</span>
                        </div>
                    )}

                    <button
                        className="delete-bloc-button"
                        onClick={handleDelete}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BlocCard
