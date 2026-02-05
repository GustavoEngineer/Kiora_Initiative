import { useState, useEffect } from 'react'
import { getBlocs, createBloc, updateBloc, deleteBloc } from '../../services/api'
import BlocCard from './BlocCard'
import CreateBlocPanel from './CreateBlocPanel'
import TaskListPanel from '../taskmanager/TaskListPanel'
import './BlocManager.css'
import { motion, AnimatePresence } from 'framer-motion'
import { AddLine } from '@mingcute/react'

function BlocManager() {
    const [loading, setLoading] = useState(false)
    const [blocs, setBlocs] = useState([])
    const [showBlocPanel, setShowBlocPanel] = useState(false)
    const [selectedBlocId, setSelectedBlocId] = useState(null)

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
        <>
            <div className="width-wrapper">
                <AnimatePresence>
                    {selectedBlocId && (
                        <TaskListPanel
                            blocId={selectedBlocId}
                            onClose={() => setSelectedBlocId(null)}
                        />
                    )}
                </AnimatePresence>

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
                                onUpdate={handleUpdateBloc} // Kept but unused by BlocCard now
                                onDelete={handleDeleteBloc} // Kept but unused by BlocCard now
                                onSelect={() => setSelectedBlocId(selectedBlocId === bloc.id ? null : bloc.id)}
                                isSelected={selectedBlocId === bloc.id}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            <CreateBlocPanel
                isOpen={showBlocPanel}
                onClose={() => setShowBlocPanel(false)}
                onCreate={handleCreateBloc}
            />
        </>
    )
}

export default BlocManager
