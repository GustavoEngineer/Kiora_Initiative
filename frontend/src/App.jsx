import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BlocManager from './components/blocmanager/BlocManager'
import './App.css'

function App() {
  return (
    <div className="app">
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
  )
}

export default App
