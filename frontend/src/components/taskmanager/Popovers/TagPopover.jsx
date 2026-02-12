import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { TagLine, CheckLine, PlusLine } from '@mingcute/react'
import './TagPopover.css'

const TagPopover = ({
    isOpen,
    position,
    tags,
    selectedTag,
    onSelectTag,
    onCreateTag,
    onClose,
    style = {}
}) => {
    const [search, setSearch] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [newTagImportance, setNewTagImportance] = useState(5)
    const inputRef = useRef(null)

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setSearch('')
            setIsCreating(false)
            setNewTagImportance(5)
            // Focus input after render
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isOpen])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.tag-popover') && !event.target.closest('.tag-trigger')) {
                onClose()
            }
        }

        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside)
        }, 100)

        return () => {
            clearTimeout(timer)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleCreateClick = () => {
        if (search.trim()) {
            setIsCreating(true)
        }
    }

    const handleConfirmCreate = () => {
        if (search.trim()) {
            onCreateTag({ name: search, importance_level: newTagImportance })
            setSearch('')
            setIsCreating(false)
            onClose()
        }
    }

    return createPortal(
        <div
            className="tag-popover"
            style={{
                top: position.top,
                left: position.left,
                ...style
            }}
        >
            <div className="tag-popover-header">
                <TagLine size={16} />
                <span>Etiquetas</span>
            </div>

            <div className="tag-search-container">
                <input
                    ref={inputRef}
                    type="text"
                    className="tag-search-input"
                    placeholder="Buscar o crear..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isCreating ? (
                <div className="tag-creation-panel">
                    <div className="creation-header">
                        <span>Crear "{search}"</span>
                    </div>
                    <div className="importance-control">
                        <label>Importancia: {newTagImportance}</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={newTagImportance}
                            onChange={(e) => setNewTagImportance(parseInt(e.target.value))}
                            className="importance-slider"
                        />
                    </div>
                    <button className="confirm-create-btn" onClick={handleConfirmCreate}>
                        <CheckLine size={16} /> Crear Etiqueta
                    </button>
                    <button className="cancel-create-btn" onClick={() => setIsCreating(false)}>
                        Cancelar
                    </button>
                </div>
            ) : (
                <div className="tags-list-column">
                    {filteredTags.map(tag => (
                        <div
                            key={tag.id}
                            className={`tag-list-item ${selectedTag?.id === tag.id ? 'selected' : ''}`}
                            onClick={() => {
                                onSelectTag(tag)
                                onClose()
                            }}
                        >
                            <span className="tag-name">{tag.name}</span>
                            {selectedTag?.id === tag.id && <CheckLine size={14} className="check-icon" />}
                        </div>
                    ))}

                    {search && !filteredTags.find(t => t.name.toLowerCase() === search.toLowerCase()) && (
                        <div className="create-tag-option" onClick={handleCreateClick}>
                            <PlusLine size={14} />
                            <span>Crear "{search}"</span>
                        </div>
                    )}

                    {tags.length === 0 && !search && (
                        <div className="empty-tags-message">No hay etiquetas</div>
                    )}
                </div>
            )}
        </div>,
        document.body
    )
}

export default TagPopover
