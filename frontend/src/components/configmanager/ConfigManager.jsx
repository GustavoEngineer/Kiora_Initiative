import React from 'react'
import './ConfigManager.css'

const ConfigManager = () => {
    return (
        <div className="config-manager-card">
            <h3>Configuración</h3>
            <div className="config-content">
                {/* Future configurations will go here */}
                <p style={{ color: '#888', fontSize: '0.9rem' }}>No hay configuraciones disponibles por el momento.</p>
            </div>
        </div>
    )
}

export default ConfigManager
