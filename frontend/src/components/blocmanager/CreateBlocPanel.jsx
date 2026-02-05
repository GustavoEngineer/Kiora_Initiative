import { useState } from 'react'
import { CloseLine } from '@mingcute/react'
import { motion, AnimatePresence } from 'framer-motion'
import './CreateBlocPanel.css'

const CreateBlocPanel = ({ isOpen, onClose, onCreate }) => {
    const [blocName, setBlocName] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!blocName.trim()) return
        onCreate(blocName)
        setBlocName('')
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="panel-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="create-bloc-panel-centered"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    >
                        <div className="panel-header">
                            <h3>Nuevo Bloc</h3>
                            <button className="close-btn" onClick={onClose}>
                                <CloseLine size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="panel-form">
                            <div className="form-group">
                                <label>Nombre del Bloc</label>
                                <input
                                    type="text"
                                    value={blocName}
                                    onChange={(e) => setBlocName(e.target.value)}
                                    placeholder="Ej. Personal, Trabajo..."
                                    autoFocus
                                />
                            </div>

                            <button type="submit" className="create-btn" disabled={!blocName.trim()}>
                                Crear Bloc
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default CreateBlocPanel
