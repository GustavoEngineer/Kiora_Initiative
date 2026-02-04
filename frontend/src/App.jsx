import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TaskManager from './components/blocmanager/BlocManager'
import BlocTaskView from './components/taskmanager/TaskManager'
import './App.css'

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaskManager />} />
          <Route path="/bloc/:blocId" element={<BlocTaskView />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
