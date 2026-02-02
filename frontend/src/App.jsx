import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TaskManager from './components/TaskManager'
import BlocDetail from './components/BlocDetail'
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
