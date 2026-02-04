import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTasks, getBlocById, createTask, updateTask, deleteTask, getTags } from '../../services/api'
import TaskItemCard from './TaskCard'
import AddTask from './AddTask'
import TaskInfo from './TaskInfo'
import './TaskManager.css'
import { LayoutGroup } from 'framer-motion'

function TaskManager() {
    const { blocId } = useParams()
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    const [bloc, setBloc] = useState(null)
    const [loading, setLoading] = useState(true)
    const [tagsMap, setTagsMap] = useState({})

    // View state for creating new task
    const [isAddingTask, setIsAddingTask] = useState(false)

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

    const [selectedTask, setSelectedTask] = useState(null)

    const handleTaskAdded = async (newTaskData) => {
        try {
            await createTask(newTaskData)
            fetchData() // Refresh list
            setIsAddingTask(false) // Show list again
        } catch (error) {
            console.error('Error creating task:', error)
        }
    }

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('¿Eliminar esta tarea?')) {
            try {
                await deleteTask(taskId)
                setTasks(tasks.filter(t => t.id !== taskId))
                if (selectedTask && selectedTask.id === taskId) {
                    setSelectedTask(null)
                }
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
            if (selectedTask && selectedTask.id === task.id) {
                setSelectedTask(updatedTask)
            }
        } catch (error) {
            console.error('Error updating task title:', error)
        }
    }

    const handleSelectTask = (task) => {
        setSelectedTask(task)
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
            <LayoutGroup>
                <div className="app-container">
                    <h1 className="blocs-header">{bloc.name}</h1>

                    <button
                        className="back-button-absolute"
                        onClick={() => navigate('/')}
                    >
                        ← Volver
                    </button>

                    {/* Task Info Panel (Left Side) */}
                    <div className="task-info-wrapper">
                        <TaskInfo
                            task={selectedTask}
                            tagName={selectedTask ? tagsMap[selectedTask.tag_id] : null}
                            onClose={() => setSelectedTask(null)}
                        />
                    </div>

                    <div className="tasks-scroll-container">
                        {/* Add Task Component */}
                        <AddTask
                            blocId={blocId}
                            tagsMap={tagsMap}
                            onStartTyping={() => setIsAddingTask(true)}
                            onClear={() => setIsAddingTask(false)}
                            onTaskAdded={handleTaskAdded}
                        />

                        {/* Task List - Hidden when adding task */}
                        <div className={`task-list-wrapper ${isAddingTask ? 'hidden' : ''}`}>
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
                                        onClick={() => handleSelectTask(task)}
                                        isSelected={selectedTask?.id === task.id}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </LayoutGroup>
        </div>
    )
}

export default TaskManager
