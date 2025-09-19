import React from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Menu, 
  Search, 
  Bell 
} from 'lucide-react'
import { useTask } from '../context/TaskContext'

function Header({ onMenuToggle }) {
  const location = useLocation()
  const { searchQuery, setSearchQuery } = useTask()

  const getPageTitle = () => {
    const titleMap = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/calendar': 'Calendar',
      '/inbox': 'Inbox',
      '/settings': 'Settings'
    }
    return titleMap[location.pathname] || 'Dashboard'
  }

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4">
      <div className="flex items-center">
        <button 
          onClick={onMenuToggle}
          className="md:hidden mr-4 p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nusblue focus:border-transparent text-sm w-64"
          />
        </div>
        
        {/* Notifications */}
        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  )
}

export default Header