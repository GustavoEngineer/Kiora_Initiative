import { useNavigate } from 'react-router-dom'
import './BlocCard.css'

const BlocCard = ({ bloc, onSelect, isSelected }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        if (onSelect) {
            onSelect()
        } else {
            navigate(`/bloc/${bloc.id}`)
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
            className={`bloc-card-simple ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
            title={bloc.name}
        >
            <div className="bloc-icon-simple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {getIconByBlocId(bloc.id)}
                </svg>
            </div>
            <div className="bloc-name-simple">{bloc.name}</div>
        </div>
    )
}

export default BlocCard
