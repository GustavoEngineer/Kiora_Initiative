import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Edit2Line } from '@mingcute/react'
import './BlocCard.css'

const BlocCard = ({ bloc, onSelect, isSelected, onUpdate }) => {
    const navigate = useNavigate()
    const [isFlipped, setIsFlipped] = useState(false)
    const [editName, setEditName] = useState(bloc.name)

    useEffect(() => {
        setEditName(bloc.name)
    }, [bloc.name])

    const handleClick = () => {
        if (!isFlipped) {
            if (onSelect) {
                onSelect()
            } else {
                navigate(`/bloc/${bloc.id}`)
            }
        }
    }

    const handleSave = () => {
        if (editName.trim() !== bloc.name) {
            onUpdate(bloc.id, { ...bloc, name: editName })
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave()
            e.target.blur() // Trigger blur to ensure only one save or just close behavior if needed
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
        <div
            className="bloc-card-container"
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div className={`bloc-card-inner ${isFlipped ? 'flipped' : ''}`}>
                {/* Front Face */}
                <div
                    className={`bloc-card-front ${isSelected ? 'selected' : ''}`}
                    onClick={handleClick}
                    title={bloc.name}
                >
                    <button
                        className="bloc-edit-btn"
                        onMouseEnter={() => setIsFlipped(true)}
                        onClick={(e) => {
                            e.stopPropagation() // Prevent navigation
                            setIsFlipped(true)
                        }}
                    >
                        <Edit2Line size={16} />
                    </button>

                    <div className="bloc-icon-simple">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            {getIconByBlocId(bloc.id)}
                        </svg>
                    </div>
                    <div className="bloc-name-simple">{bloc.name}</div>
                </div>

                {/* Back Face */}
                <div className="bloc-card-back">
                    <input
                        type="text"
                        className="bloc-edit-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        autoFocus={isFlipped}
                        placeholder="Nombre del bloc"
                    />
                </div>
            </div>
        </div>
    )
}

export default BlocCard
