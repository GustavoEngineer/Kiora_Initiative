import { useState, useEffect } from 'react'
import { createBloc, getBlocs } from '../services/api'
import '../styles/TaskManager.css'

function TaskManager() {
  const [blocs, setBlocs] = useState([])
  const [blocName, setBlocName] = useState('')
  const [loading, setLoading] = useState(false)

  // Cargar todos los blocs al entrar a la app
  useEffect(() => {
    const fetchBlocs = async () => {
      try {
        setLoading(true)
        const allBlocs = await getBlocs()
        setBlocs(allBlocs)
      } catch (error) {
        console.error('Error al cargar los blocs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlocs()
  }, [])

  const handleCreateBloc = async (e) => {
    e.preventDefault()

    if (!blocName.trim()) {
      alert('Por favor escribe un nombre para el bloc')
      return
    }

    try {
      setLoading(true)
      await createBloc({ name: blocName })
      setBlocName('')
      // Cargar los blocs actualizados
      const updatedBlocs = await getBlocs()
      setBlocs(updatedBlocs)
    } catch (error) {
      console.error('Error al crear el bloc:', error)
      alert('Error al crear el bloc')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="task-manager">
      <h1>Kiora Initiative</h1>

      <div className="create-bloc-section">
        <h2>Crear un nuevo Bloc</h2>
        <form onSubmit={handleCreateBloc} className="bloc-form">
          <input
            type="text"
            value={blocName}
            onChange={(e) => setBlocName(e.target.value)}
            placeholder="Nombre del bloc"
            className="bloc-input"
          />
          <button type="submit" className="bloc-button" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Bloc'}
          </button>
        </form>
      </div>

      <div className="blocs-grid-container">
        <h2>Mis Blocs</h2>
        <div className="blocs-grid">
          {blocs.length > 0 ? (
            blocs.map((bloc, index) => (
              <div key={bloc.id} className="bloc-card">
                <div className="bloc-card-inner">
                  <div className="bloc-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {/* Different icons based on index for variety */}
                      {index % 5 === 0 && (
                        // Chart icon
                        <path d="M3 3v18h18M7 16l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                      {index % 5 === 1 && (
                        // Rocket icon
                        <path d="M12 2L4 12h8v10l8-10h-8V2z" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                      {index % 5 === 2 && (
                        // Hexagon icon
                        <path d="M12 2l9 5v10l-9 5-9-5V7z" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                      {index % 5 === 3 && (
                        // Notebook icon
                        <path d="M4 4h16v16H4V4zM8 2v20M12 6h6M12 10h6M12 14h6" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                      {index % 5 === 4 && (
                        // Lightning icon
                        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </svg>
                  </div>
                  <div className="bloc-name">{bloc.name}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-blocs-message">
              <p>No hay blocs todavía. ¡Crea tu primer bloc arriba!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskManager
