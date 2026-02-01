import { useState } from 'react'
import { createBloc, getBlocs } from '../services/api'
import '../styles/TaskManager.css'

function TaskManager() {
  const [blocs, setBlocs] = useState([])
  const [blocName, setBlocName] = useState('')
  const [loading, setLoading] = useState(false)

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

      {blocs.length > 0 && (
        <div className="blocs-list">
          <h2>Mis Blocs</h2>
          <ul>
            {blocs.map((bloc) => (
              <li key={bloc.id}>{bloc.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default TaskManager
