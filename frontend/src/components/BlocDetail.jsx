import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlocById, getTasks, createTask, getTags, createTag } from '../services/api'
import '../styles/BlocDetail.css'

function BlocDetail() {
    const { blocId } = useParams()
    const navigate = useNavigate()
    const [bloc, setBloc] = useState(null)
    const [tasks, setTasks] = useState([])
    const [tags, setTags] = useState([])

    // Form fields
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDueDate, setTaskDueDate] = useState('')
    const [taskEstimatedHours, setTaskEstimatedHours] = useState('')
    const [selectedTagId, setSelectedTagId] = useState('')
    const [showNewTagInput, setShowNewTagInput] = useState(false)
    const [newTagName, setNewTagName] = useState('')

    const [loading, setLoading] = useState(false)
    const [loadingTasks, setLoadingTasks] = useState(true)
    const [creatingTag, setCreatingTag] = useState(false)

    // Determinar el icono basado en el ID del bloc
    const getIconByBlocId = (id) => {
        const index = parseInt(id) || 0
        const iconVariant = index % 5

        switch (iconVariant) {
            case 0:
                return (
                    <path d="M3 3v18h18M7 16l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
                )
            case 1:
                return (
                    <path d="M12 2L4 12h8v10l8-10h-8V2z" strokeLinecap="round" strokeLinejoin="round" />
                )
            case 2:
                return (
                    <path d="M12 2l9 5v10l-9 5-9-5V7z" strokeLinecap="round" strokeLinejoin="round" />
                )
            case 3:
                return (
                    <path d="M4 4h16v16H4V4zM8 2v20M12 6h6M12 10h6M12 14h6" strokeLinecap="round" strokeLinejoin="round" />
                )
            case 4:
                return (
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                )
            default:
                return (
                    <path d="M3 3v18h18M7 16l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
                )
        }
    }

    useEffect(() => {
        const fetchBlocData = async () => {
            try {
                setLoadingTasks(true)
                const blocData = await getBlocById(blocId)
                setBloc(blocData)

                // Cargar tareas del bloc
                const allTasks = await getTasks()
                const blocTasks = allTasks.filter(task => task.bloc_id === parseInt(blocId))
                setTasks(blocTasks)

                // Cargar tags disponibles
                const allTags = await getTags()
                setTags(allTags)
            } catch (error) {
                console.error('Error al cargar el bloc:', error)
                alert('Error al cargar el bloc')
            } finally {
                setLoadingTasks(false)
            }
        }

        if (blocId) {
            fetchBlocData()
        }
    }, [blocId])

    const handleCreateNewTag = async () => {
        if (!newTagName.trim()) {
            alert('Por favor escribe un nombre para el tag')
            return
        }

        try {
            setCreatingTag(true)
            const newTag = await createTag({
                name: newTagName,
                importance_level: 1 // Default importance level
            })

            // Actualizar lista de tags
            const allTags = await getTags()
            setTags(allTags)

            // Seleccionar el nuevo tag
            setSelectedTagId(newTag.id.toString())
            setNewTagName('')
            setShowNewTagInput(false)
        } catch (error) {
            console.error('Error al crear el tag:', error)
            alert('Error al crear el tag')
        } finally {
            setCreatingTag(false)
        }
    }

    const handleCreateTask = async (e) => {
        e.preventDefault()

        if (!taskTitle.trim()) {
            alert('Por favor escribe un título para la tarea')
            return
        }

        try {
            setLoading(true)
            await createTask({
                title: taskTitle,
                due_date: taskDueDate || null,
                completed: false,
                estimated_hours: taskEstimatedHours ? parseFloat(taskEstimatedHours) : null,
                bloc_id: parseInt(blocId),
                tag_id: selectedTagId ? parseInt(selectedTagId) : null
            })

            // Limpiar formulario
            setTaskTitle('')
            setTaskDueDate('')
            setTaskEstimatedHours('')
            setSelectedTagId('')

            // Recargar tareas
            const allTasks = await getTasks()
            const blocTasks = allTasks.filter(task => task.bloc_id === parseInt(blocId))
            setTasks(blocTasks)
        } catch (error) {
            console.error('Error al crear la tarea:', error)
            alert('Error al crear la tarea')
        } finally {
            setLoading(false)
        }
    }

    if (loadingTasks) {
        return (
            <div className="bloc-detail">
                <div className="loading-message">Cargando bloc...</div>
            </div>
        )
    }

    if (!bloc) {
        return (
            <div className="bloc-detail">
                <div className="error-message">Bloc no encontrado</div>
            </div>
        )
    }

    return (
        <div className="bloc-detail">
            <button className="back-button" onClick={() => navigate('/')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Volver
            </button>

            <div className="bloc-header">
                <div className="bloc-icon-large">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        {getIconByBlocId(blocId)}
                    </svg>
                </div>
                <h1>{bloc.name}</h1>
            </div>

            <div className="create-task-section">
                <h2>Crear Nueva Tarea</h2>
                <form onSubmit={handleCreateTask} className="task-form">
                    <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Título de la tarea *"
                        className="task-input"
                        required
                    />

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dueDate">Fecha límite</label>
                            <input
                                id="dueDate"
                                type="date"
                                value={taskDueDate}
                                onChange={(e) => setTaskDueDate(e.target.value)}
                                className="task-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="estimatedHours">Horas estimadas</label>
                            <input
                                id="estimatedHours"
                                type="number"
                                value={taskEstimatedHours}
                                onChange={(e) => setTaskEstimatedHours(e.target.value)}
                                placeholder="0"
                                min="0"
                                step="0.5"
                                className="task-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tag">Tag</label>
                        <div className="tag-input-group">
                            <select
                                id="tag"
                                value={selectedTagId}
                                onChange={(e) => {
                                    if (e.target.value === 'new') {
                                        setShowNewTagInput(true)
                                        setSelectedTagId('')
                                    } else {
                                        setSelectedTagId(e.target.value)
                                        setShowNewTagInput(false)
                                    }
                                }}
                                className="task-select"
                            >
                                <option value="">Sin tag</option>
                                {tags.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </option>
                                ))}
                                <option value="new">+ Crear nuevo tag</option>
                            </select>

                            {showNewTagInput && (
                                <div className="new-tag-input">
                                    <input
                                        type="text"
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        placeholder="Nombre del nuevo tag"
                                        className="task-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateNewTag}
                                        className="tag-create-button"
                                        disabled={creatingTag}
                                    >
                                        {creatingTag ? 'Creando...' : 'Crear'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowNewTagInput(false)
                                            setNewTagName('')
                                        }}
                                        className="tag-cancel-button"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="task-button" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Tarea'}
                    </button>
                </form>
            </div>

            <div className="tasks-section">
                <h2>Tareas ({tasks.length})</h2>
                {tasks.length > 0 ? (
                    <div className="tasks-list">
                        {tasks.map((task) => (
                            <div key={task.id} className="task-card">
                                <h3>{task.title}</h3>
                                {task.due_date && (
                                    <p className="task-due-date">
                                        Vence: {new Date(task.due_date).toLocaleDateString('es-ES')}
                                    </p>
                                )}
                                {task.estimated_hours && (
                                    <p className="task-hours">
                                        {task.estimated_hours} horas estimadas
                                    </p>
                                )}
                                <span className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
                                    {task.completed ? 'Completada' : 'Pendiente'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-tasks-message">
                        <p>No hay tareas todavía. ¡Crea tu primera tarea arriba!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BlocDetail
