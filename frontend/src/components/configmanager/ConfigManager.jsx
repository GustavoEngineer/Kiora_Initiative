import React, { useState, useEffect } from 'react'
import {
    getTags, updateTag, deleteTag,
    getBlocs, updateBloc, deleteBloc,
    getWorkDays, createWorkDay, updateWorkDay, deleteWorkDay
} from '../../services/api'
import { DeleteLine, TagLine, LayoutLine, TimeLine } from '@mingcute/react'
import { FloatingDock } from '../ui/floating-dock'
import { motion, AnimatePresence } from 'framer-motion'
import './ConfigManager.css'

const ConfigManager = () => {
    const [activeTab, setActiveTab] = useState('tags')
    const [tags, setTags] = useState([])
    const [blocs, setBlocs] = useState([])
    const [workDays, setWorkDays] = useState([])
    const [editingWorkDayId, setEditingWorkDayId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        setLoading(true)
        try {
            const [tagsData, blocsData, workDaysData] = await Promise.all([
                getTags(),
                getBlocs(),
                getWorkDays()
            ])
            setTags(tagsData)
            setBlocs(blocsData)
            setWorkDays(workDaysData)
        } catch (error) {
            console.error('Error fetching config data:', error)
        } finally {
            setLoading(false)
        }
    }

    // --- Tags Handlers ---
    const handleUpdateTag = async (id, newName) => {
        if (!newName.trim()) return
        try {
            await updateTag(id, { name: newName })
            setTags(tags.map(tag => tag.id === id ? { ...tag, name: newName } : tag))
        } catch (error) {
            console.error('Error updating tag:', error)
        }
    }

    const handleDeleteTag = async (id) => {
        try {
            await deleteTag(id)
            setTags(tags.filter(tag => tag.id !== id))
        } catch (error) {
            console.error('Error deleting tag:', error)
        }
    }

    // --- Blocs Handlers ---
    const handleUpdateBloc = async (id, newName) => {
        if (!newName.trim()) return
        try {
            await updateBloc(id, { name: newName })
            setBlocs(blocs.map(bloc => bloc.id === id ? { ...bloc, name: newName } : bloc))
        } catch (error) {
            console.error('Error updating bloc:', error)
        }
    }

    const handleDeleteBloc = async (id) => {
        try {
            await deleteBloc(id)
            setBlocs(blocs.filter(bloc => bloc.id !== id))
        } catch (error) {
            console.error('Error deleting bloc:', error)
        }
    }

    // --- WorkDays Handlers (Time) ---
    const handleUpdateWorkDay = async (id, newHours) => {
        const hours = parseFloat(newHours)
        if (isNaN(hours) || hours < 0) return
        try {
            // Assuming API expects { available_hours: hours }
            await updateWorkDay(id, { available_hours: hours })
            setWorkDays(workDays.map(wd => wd.id === id ? { ...wd, available_hours: hours } : wd))
        } catch (error) {
            console.error('Error updating work day:', error)
        }
    }

    const handleCreateWorkDay = async (hoursStr) => {
        const hours = parseFloat(hoursStr)
        if (isNaN(hours) || hours <= 0) return
        try {
            const newWorkDay = await createWorkDay({ available_hours: hours })
            setWorkDays([...workDays, newWorkDay])
        } catch (error) {
            console.error('Error creating work day:', error)
        }
    }

    const handleDeleteWorkDay = async (id) => {
        try {
            await deleteWorkDay(id)
            setWorkDays(workDays.filter(wd => wd.id !== id))
        } catch (error) {
            console.error('Error deleting work day:', error)
        }
    }

    const dockItems = [
        {
            title: 'Etiquetas',
            icon: <TagLine />,
            onClick: () => setActiveTab('tags'),
            isActive: activeTab === 'tags'
        },
        {
            title: 'Blocs',
            icon: <LayoutLine />,
            onClick: () => setActiveTab('blocs'),
            isActive: activeTab === 'blocs'
        },
        {
            title: 'Horarios',
            icon: <TimeLine />,
            onClick: () => setActiveTab('workdays'),
            isActive: activeTab === 'workdays'
        }
    ]

    const renderContent = () => {
        if (loading) return <p className="loading-text">Cargando configuración...</p>

        switch (activeTab) {
            case 'tags':
                return (
                    tags.length > 0 ? (
                        tags.map(tag => (
                            <div key={tag.id} className="config-item-card">
                                <div className="item-inner">
                                    <div className="item-front">
                                        {tag.name}
                                        <span className="tag-importance-dot" style={{ opacity: tag.importance_level / 10 }}></span>
                                    </div>
                                    <div className="item-back">
                                        <input
                                            type="text"
                                            defaultValue={tag.name}
                                            className="item-edit-input"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUpdateTag(tag.id, e.target.value)
                                                    e.target.blur()
                                                }
                                            }}
                                            onBlur={(e) => handleUpdateTag(tag.id, e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <button
                                            className="item-delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteTag(tag.id)
                                            }}
                                        >
                                            <DeleteLine size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : <p className="empty-text">No hay etiquetas.</p>
                )
            case 'blocs':
                return (
                    blocs.length > 0 ? (
                        blocs.map(bloc => (
                            <div key={bloc.id} className="config-item-card">
                                <div className="item-inner">
                                    <div className="item-front">
                                        {bloc.name}
                                    </div>
                                    <div className="item-back">
                                        <input
                                            type="text"
                                            defaultValue={bloc.name}
                                            className="item-edit-input"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUpdateBloc(bloc.id, e.target.value)
                                                    e.target.blur()
                                                }
                                            }}
                                            onBlur={(e) => handleUpdateBloc(bloc.id, e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <button
                                            className="item-delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteBloc(bloc.id)
                                            }}
                                        >
                                            <DeleteLine size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : <p className="empty-text">No hay blocs.</p>
                )
            case 'workdays':
                return (
                    workDays.length > 0 ? (
                        workDays.map(wd => {
                            const isEditing = editingWorkDayId === wd.id
                            return (
                                <div key={wd.id} className="workday-large-container">
                                    {isEditing ? (
                                        <input
                                            autoFocus
                                            type="number"
                                            defaultValue={wd.available_hours}
                                            className="workday-large-input"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUpdateWorkDay(wd.id, e.target.value)
                                                    setEditingWorkDayId(null)
                                                }
                                            }}
                                            onBlur={(e) => {
                                                handleUpdateWorkDay(wd.id, e.target.value)
                                                setEditingWorkDayId(null)
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="workday-large-display"
                                            onClick={() => setEditingWorkDayId(wd.id)}
                                            title="Clic para editar"
                                        >
                                            {wd.available_hours}
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <div className="workday-large-container">
                            {editingWorkDayId === 'new' ? (
                                <input
                                    autoFocus
                                    type="number"
                                    defaultValue={0}
                                    className="workday-large-input"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateWorkDay(e.target.value)
                                            setEditingWorkDayId(null)
                                        }
                                    }}
                                    onBlur={(e) => {
                                        handleCreateWorkDay(e.target.value)
                                        setEditingWorkDayId(null)
                                    }}
                                />
                            ) : (
                                <div
                                    className="workday-large-display"
                                    onClick={() => setEditingWorkDayId('new')}
                                    title="Clic para definir horario"
                                    style={{ opacity: 0.5 }}
                                >
                                    0
                                </div>
                            )}
                        </div>
                    )
                )
            default:
                return null
        }
    }

    return (
        <div className="config-manager-card">
            <h3 className="config-title">Configuración</h3>

            <FloatingDock items={dockItems} />

            <div className="config-section">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="config-list-container"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ConfigManager
