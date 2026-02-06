
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Settings3Line } from '@mingcute/react'
import BlocManager from './components/blocmanager/BlocManager'
import ConfigManager from './components/configmanager/ConfigManager'
import './App.css'

function App() {
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  return (
    <div className="app">
      <div className="user-greeting">
        Hola Gustav
        <span
          className="config-trigger-container"
          onMouseEnter={() => setIsConfigOpen(prev => !prev)}
        >
          {/* Letter 'o' - hidden on mode active */}
          <span className={`trigger-letter ${isConfigOpen ? 'hidden' : ''}`}>o</span>

          {/* Icon - shown on mode active */}
          <span className={`trigger-icon ${isConfigOpen ? 'visible' : ''}`}>
            <Settings3Line size={40} /> {/* Configurable size to match text */}
          </span>
        </span>

        {/* Config Card - Moved outside to prevent re-triggering mouseenter on the container */}
        {isConfigOpen && <ConfigManager />}
      </div>

      <div className={`main-content ${isConfigOpen ? 'faded-out' : ''}`}>
        <BrowserRouter>
          {/* Persistent Bloc Sidebar */}
          <BlocManager />

          <Routes>
            {/* Main Content Areas can go here, e.g. Task Lists */}
            {/* For now, just a placeholder or empty route since user wanted "Only Blocs" visible on the right */}
            <Route path="/" element={null} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
