import { useState } from 'react'

const CreateBlocPanel = ({ isOpen, onClose, onCreate }) => {
    const [newBlocName, setNewBlocName] = useState('')
    const [creatingBloc, setCreatingBloc] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newBlocName.trim()) {
            alert('Por favor escribe un nombre para el bloc')
            return
        }

        try {
            setCreatingBloc(true)
            await onCreate(newBlocName)
            setNewBlocName('')
        } finally {
            setCreatingBloc(false)
        }
    }

    return (
        <>
            <div
                className={`side-panel-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            ></div>
            <div className={`side-panel ${isOpen ? 'open' : ''}`}>
                <div className="side-panel-header">
                    <h2>Nuevo Bloc</h2>
                    <button className="close-panel-button" onClick={onClose}>X</button>
                </div>
                <form onSubmit={handleSubmit} className="side-panel-form">
                    <div className="form-group">
                        <label htmlFor="blocName">Nombre del Bloc</label>
                        <input
                            id="blocName"
                            type="text"
                            value={newBlocName}
                            onChange={(e) => setNewBlocName(e.target.value)}
                            placeholder="Ej. Universidad"
                            className="task-input"
                            autoFocus={isOpen}
                        />
                    </div>
                    <button type="submit" className="task-button" disabled={creatingBloc}>
                        {creatingBloc ? 'Creando...' : 'Crear Bloc'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default CreateBlocPanel
