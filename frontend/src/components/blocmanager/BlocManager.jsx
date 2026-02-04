import { useState, useEffect } from 'react'
import { getBlocs, getTasks, createTask, getTags, createTag, createBloc, updateBloc, deleteBloc } from '../../services/api'
import BlocCard from './BlocCard'
import CreateBlocPanel from './CreateBlocPanel'
import '../../styles/TaskManager.css'
import '../../styles/BlocDetail.css'

function TaskManager() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('tasks')

  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [blocs, setBlocs] = useState([])

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

  // Bloc Creation State
  const [showBlocPanel, setShowBlocPanel] = useState(false)

  // Load tasks and tags on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingTasks(true)
        // Load tasks
        const allTasks = await getTasks()
        setTasks(allTasks)

        // Load tags
        const allTags = await getTags()
        setTags(allTags)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoadingTasks(false)
      }
    }

    fetchData()
  }, [])

  // Load Blocs on mount
  useEffect(() => {
    const fetchBlocs = async () => {
      try {
        setLoading(true)
        const allBlocs = await getBlocs()
        setBlocs(allBlocs.sort((a, b) => a.id - b.id))
      } catch (error) {
        console.error('Error al cargar los blocs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlocs()
  }, [])

  const handleCreateNewTag = async () => {
    if (!newTagName.trim()) {
      alert('Por favor escribe un nombre para el tag')
      return
    }

    try {
      setCreatingTag(true)
      const newTag = await createTag({
        name: newTagName,
        importance_level: 1
      })

      const allTags = await getTags()
      setTags(allTags)

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
        tag_id: selectedTagId ? parseInt(selectedTagId) : null
      })

      setTaskTitle('')
      setTaskDueDate('')
      setTaskEstimatedHours('')
      setSelectedTagId('')

      const allTasks = await getTasks()
      setTasks(allTasks)
    } catch (error) {
      console.error('Error al crear la tarea:', error)
      alert('Error al crear la tarea')
    } finally {
      setCreatingTask(false)
      setShowTaskForm(false)
    }
  }

  const handleCreateBloc = async (name) => {
    await createBloc({ name })
    const updatedBlocs = await getBlocs()
    setBlocs(updatedBlocs.sort((a, b) => a.id - b.id))
    setShowBlocPanel(false)
  }

  const handleUpdateBloc = async (id, data) => {
    try {
      await updateBloc(id, data)
      const updatedBlocs = await getBlocs()
      setBlocs(updatedBlocs.sort((a, b) => a.id - b.id))
    } catch (error) {
      console.error('Error al actualizar:', error)
      alert('Error al actualizar el bloc')
    }
  }

  const handleDeleteBloc = async (id) => {
    try {
      await deleteBloc(id)
      const updatedBlocs = await getBlocs()
      setBlocs(updatedBlocs.sort((a, b) => a.id - b.id))
    } catch (error) {
      console.error('Error al eliminar:', error)
      alert('Error al eliminar el bloc')
    }
  }

  return (
    <div className="task-manager">
      <div className="app-container">
        {/* Add Bloc Button */}
        <button
          className="add-bloc-button"
          onClick={() => setShowBlocPanel(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <CreateBlocPanel
          isOpen={showBlocPanel}
          onClose={() => setShowBlocPanel(false)}
          onCreate={handleCreateBloc}
        />

        <h1 className="blocs-header">Blocs</h1>
        <div className="blocs-grid-centered">
          {blocs.map((bloc) => (
            <BlocCard
              key={bloc.id}
              bloc={bloc}
              onUpdate={handleUpdateBloc}
              onDelete={handleDeleteBloc}
            />
          ))}
        </div>

        {/* Hidden for now: Task List */}
        <div style={{ display: 'none' }}>
          {/* ... tasks ... */}
        </div>
      </div>
    </div>
  )
}

export default TaskManager
