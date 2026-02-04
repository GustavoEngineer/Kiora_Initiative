import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TaskManager from './components/blocmanager/BlocManager'
import BlocDetail from './components/blocmanager/BlocDetail'
import './App.css'

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaskManager />} />
          <Route path="/bloc/:blocId" element={<BlocDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
