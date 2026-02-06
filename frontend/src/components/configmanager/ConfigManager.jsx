import React, { useState, useEffect } from 'react'
import { getTags, updateTag, deleteTag, getBlocs, updateBloc, deleteBloc } from '../../services/api'
import { DeleteLine, TagLine, GridLine } from '@mingcute/react'
import './ConfigManager.css'

const ConfigManager = () => {
    const [activeTab, setActiveTab] = useState('tags')
    const [tags, setTags] = useState([])
    const [blocs, setBlocs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchData()
    }, [activeTab])

    const fetchData = async () => {
        setLoading(true)
        try {
            if (activeTab === 'tags') {
                const data = await getTags()
                setTags(data)
            } else {
                const data = await getBlocs()
                setBlocs(data)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
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

    return (
        <div className="config-manager-card">
            <h3 className="config-title">Configuración</h3>

            <div className="config-dock">
                <button
                    className={`dock-btn ${activeTab === 'tags' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tags')}
                    title="Etiquetas"
                >
                    <TagLine size={24} />
                </button>
                <div className="dock-separator"></div>
                <button
                    className={`dock-btn ${activeTab === 'blocs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blocs')}
                    title="Blocs"
                >
                    <GridLine size={24} />
                </button>
            </div>

            <div className="config-section">
                <div className="config-list-container">
                    {loading ? (
                        <p className="loading-text">Cargando...</p>
                    ) : activeTab === 'tags' ? (
                        // TAGS LIST
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
                        ) : (
                            <p className="empty-text">No hay etiquetas.</p>
                        )
                    ) : (
                        // BLOCS LIST
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
                        ) : (
                            <p className="empty-text">No hay blocs.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default ConfigManager
