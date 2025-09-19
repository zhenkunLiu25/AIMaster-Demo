import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TaskProvider } from './context/TaskContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Inbox from './pages/Inbox'
import Settings from './pages/Settings'

function App() {
  return (
    <TaskProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </TaskProvider>
  )
}

export default App