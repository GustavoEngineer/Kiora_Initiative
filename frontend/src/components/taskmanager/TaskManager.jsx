import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTasks, getBlocById, createTask, updateTask, deleteTask, getTags } from '../../services/api'
import TaskItemCard from './TaskCard'
import '../../styles/TaskManager.css' // Reusing main styles or create new ones? Assuming reuse or basic for now.

function TaskManager() {
    const { blocId } = useParams()
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    const [bloc, setBloc] = useState(null)
    const [loading, setLoading] = useState(true)
    const [newTaskTitle, setNewTaskTitle] = useState('')

    const [tagsMap, setTagsMap] = useState({})

    const fetchData = async () => {
        try {
            setLoading(true)
            const blocData = await getBlocById(blocId)
            setBloc(blocData)

            const [allTasks, allTags] = await Promise.all([getTasks(), getTags()])

            // Create tags map
            const tMap = {}
            allTags.forEach(tag => {
                tMap[tag.id] = tag.name
            })
            setTagsMap(tMap)

            // Filter by bloc_id or tag_id
            const filteredTasks = allTasks.filter(t => t.bloc_id == blocId || t.tag_id == blocId)
            setTasks(filteredTasks)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (blocId) {
            fetchData()
        }
    }, [blocId])

    const handleAddTask = async (e) => {
        if (e.key === 'Enter' && newTaskTitle.trim()) {
            try {
                const newTask = {
                    title: newTaskTitle,
                    bloc_id: blocId,

                }
                await createTask(newTask)
                setNewTaskTitle('')
                fetchData() // Refresh list
            } catch (error) {
                console.error('Error creating task:', error)
            }
        }
    }



    const handleDeleteTask = async (taskId) => {
        if (window.confirm('¿Eliminar esta tarea?')) {
            try {
                await deleteTask(taskId)
                setTasks(tasks.filter(t => t.id !== taskId))
            } catch (error) {
                console.error('Error deleting task:', error)
            }
        }
    }

    const handleUpdateTitle = async (task, newTitle) => {
        if (task.title === newTitle) return
        try {
            const updatedTask = { ...task, title: newTitle }
            await updateTask(task.id, updatedTask)
            setTasks(tasks.map(t => t.id === task.id ? updatedTask : t))
        } catch (error) {
            console.error('Error updating task title:', error)
        }
    }

    if (loading) return (
        <div className="task-manager">
            <div className="app-container">
                <p>Cargando...</p>
            </div>
        </div>
    )

    if (!bloc) return (
        <div className="task-manager">
            <div className="app-container">
                <p>Bloc no encontrado</p>
                <button onClick={() => navigate('/')}>Volver</button>
            </div>
        </div>
    )

    return (
        <div className="task-manager">
            <div className="app-container">
                <h1 className="blocs-header">{bloc.name}</h1>

                <button
                    className="back-button-absolute"
                    onClick={() => navigate('/')}
                >
                    ← Volver
                </button>

                <div className="tasks-scroll-container">
                    {/* Add Task Input */}
                    <div className="add-task-container">
                        <input
                            type="text"
                            className="add-task-input"
                            placeholder="+ Añadir nueva tarea"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={handleAddTask}
                        />
                    </div>

                    {tasks.length === 0 ? (
                        <p className="empty-tasks-message">No hay tareas. ¡Añade una!</p>
                    ) : (
                        tasks.map(task => (
                            <TaskItemCard
                                key={task.id}
                                task={task}
                                tagName={tagsMap[task.tag_id]}

                                onUpdateTitle={handleUpdateTitle}
                                onDelete={handleDeleteTask}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskManager
