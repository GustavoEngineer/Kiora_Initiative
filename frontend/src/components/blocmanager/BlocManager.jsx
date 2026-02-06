import { useState, useEffect } from 'react'
import { getBlocs, createBloc, updateBloc, deleteBloc, getTags } from '../../services/api'
import BlocCard from './BlocCard'
import CreateBlocPanel from './CreateBlocPanel'
import TaskListPanel from '../taskmanager/TaskListPanel'
import TaskContentCard from '../taskmanager/TaskContentCard'
import './BlocManager.css'
import { motion, AnimatePresence } from 'framer-motion'

function BlocManager() {
    const [loading, setLoading] = useState(false)
    const [blocs, setBlocs] = useState([])
    const [showBlocPanel, setShowBlocPanel] = useState(false)
    const [selectedBlocId, setSelectedBlocId] = useState(null)
    const [selectedTask, setSelectedTask] = useState(null)

    // Task Expansion State (Lifted from TaskListPanel)
    const [allTags, setAllTags] = useState([])
    const [tasksRefreshTrigger, setTasksRefreshTrigger] = useState(0)

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
        fetchTags()
    }, [])

    const fetchTags = async () => {
        try {
            const tags = await getTags()
            setAllTags(tags)
        } catch (error) {
            console.error('Error fetching tags:', error)
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

    // Reset task selection when closing/switching blocs
    const handleCloseBloc = () => {
        setSelectedBlocId(null)
        setSelectedTask(null)
    }

    const handleTaskUpdate = (updatedTask) => {
        setSelectedTask(updatedTask)
        setTasksRefreshTrigger(prev => prev + 1)
    }

    const handleTaskDelete = () => {
        setSelectedTask(null)
        setTasksRefreshTrigger(prev => prev + 1)
    }

    return (
        <>
            <div className="width-wrapper">
                <AnimatePresence mode="popLayout">
                    {selectedTask && (
                        <motion.div
                            key="task-content"
                            initial={{ opacity: 0, x: 20, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: 'auto' }}
                            exit={{ opacity: 0, x: 20, width: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TaskContentCard
                                task={selectedTask}
                                onClose={() => setSelectedTask(null)}
                                onTaskUpdate={handleTaskUpdate}
                                onTaskDelete={handleTaskDelete}
                            />
                        </motion.div>
                    )}
                    {selectedBlocId && (
                        <TaskListPanel
                            key="task-list"
                            blocId={selectedBlocId}
                            onClose={handleCloseBloc}
                            refreshTrigger={tasksRefreshTrigger}
                            externalTags={allTags}
                            selectedTask={selectedTask}
                            onSelectTask={setSelectedTask}
                        />
                    )}
                </AnimatePresence >

                <div className="right-sidebar-container">
                    {/* Sidebar Header Removed per request */}
                    <div style={{ marginTop: '1rem' }}></div>

                    <motion.div
                        className="blocs-vertical-list"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {blocs.map(bloc => (
                            <BlocCard
                                key={bloc.id}
                                bloc={bloc}
                                onUpdate={handleUpdateBloc}
                                onDelete={handleDeleteBloc}
                                onSelect={() => {
                                    if (selectedBlocId === bloc.id) {
                                        handleCloseBloc()
                                    } else {
                                        setSelectedBlocId(bloc.id)
                                        setSelectedTask(null)
                                    }
                                }}
                                isSelected={selectedBlocId === bloc.id}
                            />
                        ))}
                        <BlocCard
                            key="all-bloc"
                            bloc={{ id: 'all', name: 'Todos' }}
                            onUpdate={() => { }} // No-op
                            onDelete={() => { }} // No-op
                            editable={false}
                            onSelect={() => {
                                if (selectedBlocId === 'all') {
                                    handleCloseBloc()
                                } else {
                                    setSelectedBlocId('all')
                                    setSelectedTask(null)
                                }
                            }}
                            isSelected={selectedBlocId === 'all'}
                        />
                    </motion.div>
                </div>
            </div >

            <CreateBlocPanel
                isOpen={showBlocPanel}
                onClose={() => setShowBlocPanel(false)}
                onCreate={handleCreateBloc}
            />
        </>
    )
}

export default BlocManager
