import { useState, useEffect } from 'react'
import { createBloc, getBlocs, getTasks, createTask, getTags, createTag } from '../services/api'
import '../styles/TaskManager.css'
import '../styles/BlocDetail.css' // Import styles for task details

function TaskManager() {
  const [blocs, setBlocs] = useState([])
  const [blocName, setBlocName] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('blocs') // 'blocs' or 'tasks'
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Selected Bloc State
  const [selectedBloc, setSelectedBloc] = useState(null)
  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(false)

  // Task Form Fields
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskEstimatedHours, setTaskEstimatedHours] = useState('')
  const [selectedTagId, setSelectedTagId] = useState('')
  const [showNewTagInput, setShowNewTagInput] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [creatingTag, setCreatingTag] = useState(false)

  const [creatingTask, setCreatingTask] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)

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

  // Fetch tasks when a bloc is selected
  useEffect(() => {
    const fetchBlocData = async () => {
      if (!selectedBloc) return

      try {
        setLoadingTasks(true)
        // Load tasks
        const allTasks = await getTasks()
        const blocTasks = allTasks.filter(task => task.bloc_id === selectedBloc.id)
        setTasks(blocTasks)

        // Load tags
        const allTags = await getTags()
        setTags(allTags)
      } catch (error) {
        console.error('Error al cargar datos del bloc:', error)
      } finally {
        setLoadingTasks(false)
      }
    }

    fetchBlocData()
  }, [selectedBloc])

  const handleBlocClick = (bloc) => {
    setSelectedBloc(bloc)
  }

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
      setIsPanelOpen(false) // Close panel after creating
    } catch (error) {
      console.error('Error al crear el bloc:', error)
      alert('Error al crear el bloc')
    } finally {
      setLoading(false)
    }
  }

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
      setCreatingTask(true)
      await createTask({
        title: taskTitle,
        due_date: taskDueDate || null,
        completed: false,
        estimated_hours: taskEstimatedHours ? parseFloat(taskEstimatedHours) : null,
        bloc_id: selectedBloc.id,
        tag_id: selectedTagId ? parseInt(selectedTagId) : null
      })

      // Limpiar formulario
      setTaskTitle('')
      setTaskDueDate('')
      setTaskEstimatedHours('')
      setSelectedTagId('')

      // Recargar tareas
      const allTasks = await getTasks()
      const blocTasks = allTasks.filter(task => task.bloc_id === selectedBloc.id)
      setTasks(blocTasks)
    } catch (error) {
      console.error('Error al crear la tarea:', error)
      alert('Error al crear la tarea')
    } finally {
      setCreatingTask(false)
      setShowTaskForm(false) // Close form on success
    }
  }

  // Helper for icons (reused)
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
    <div className="task-manager">


      {/* Main Container with Sidebar and Content */}
      <div className="app-container">

        {/* Left Sidebar (Blocs List) */}
        <div className="blocs-sidebar">
          <div className="blocs-grid">
            {/* Add Bloc Card or Form */}
            {isPanelOpen ? (
              <div className="add-bloc-form-container">
                <form onSubmit={handleCreateBloc} className="inline-bloc-form">
                  <input
                    type="text"
                    value={blocName}
                    onChange={(e) => setBlocName(e.target.value)}
                    placeholder="Nombre del bloc"
                    className="inline-bloc-input"
                    autoFocus
                  />
                  <div className="inline-form-actions">
                    <button
                      type="submit"
                      className="inline-confirm-button"
                      disabled={loading}
                    >
                      {loading ? '...' : 'Crear'}
                    </button>
                    <button
                      type="button"
                      className="inline-cancel-button"
                      onClick={() => {
                        setIsPanelOpen(false);
                        setBlocName('');
                      }}
                    >
                      X
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div
                className="bloc-card add-bloc-card"
                onClick={() => setIsPanelOpen(true)}
              >
                <div className="bloc-card-inner">
                  <div className="bloc-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="bloc-name">Agregar Bloc</div>
                </div>
              </div>
            )}

            {/* Existing Blocs */}
            {blocs.length > 0 ? (
              blocs.map((bloc, index) => (
                <div
                  key={bloc.id}
                  className={`bloc-card ${selectedBloc?.id === bloc.id ? 'active' : ''}`}
                  onClick={() => handleBlocClick(bloc)}
                >
                  <div className="bloc-card-inner">
                    <div className="bloc-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        {getIconByBlocId(bloc.id)}
                      </svg>
                    </div>
                    <div className="bloc-name">{bloc.name}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-blocs-message-sidebar">
                <p>Crea tu primer bloc</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area (Tasks) */}
        <div className="main-content-area">
          {selectedBloc ? (
            <div className="bloc-details-container">


              <div className="content-grid">
                {/* Create Task Form */}
                <div className="create-task-section">
                  {!showTaskForm ? (
                    <button
                      className="add-task-trigger-button"
                      onClick={() => setShowTaskForm(true)}
                    >
                      + Agregar tarea
                    </button>
                  ) : (
                    <div className="task-form-container">
                      <div className="task-form-header">
                        <h2>Crear Nueva Tarea</h2>
                        <button
                          className="close-task-form"
                          onClick={() => setShowTaskForm(false)}
                        >X</button>
                      </div>
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
                                  {creatingTag ? '...' : 'Crear'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowNewTagInput(false)
                                    setNewTagName('')
                                  }}
                                  className="tag-cancel-button"
                                >
                                  X
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <button type="submit" className="task-button" disabled={creatingTask}>
                          {creatingTask ? 'Creando...' : 'Crear Tarea'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Tasks List */}
                <div className="tasks-section">
                  <h2>Tareas ({tasks.length})</h2>
                  {loadingTasks ? (
                    <p>Cargando tareas...</p>
                  ) : tasks.length > 0 ? (
                    <div className="tasks-list">
                      {tasks.map((task) => (
                        <div key={task.id} className="task-card">
                          <h3>{task.title}</h3>
                          <div className="task-meta">
                            {task.due_date && (
                              <p className="task-due-date">
                                📅 {new Date(task.due_date).toLocaleDateString('es-ES')}
                              </p>
                            )}
                            {task.estimated_hours && (
                              <p className="task-hours">
                                ⏱️ {task.estimated_hours} h
                              </p>
                            )}
                          </div>
                          <span className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
                            {task.completed ? 'Completada' : 'Pendiente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-tasks-message">
                      <p>No hay tareas en este bloc.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state-selection">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>Selecciona un Bloc</h2>
              <p>Elige un bloc de la izquierda para ver y gestionar sus tareas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskManager
