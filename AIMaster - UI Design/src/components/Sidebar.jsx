import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  Inbox, 
  Settings, 
  X 
} from 'lucide-react'
import { useTask } from '../context/TaskContext'

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { courses, user } = useTask()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Inbox', href: '/inbox', icon: Inbox },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const tags = [
    { name: 'Assignment', color: 'blue' },
    { name: 'Quiz', color: 'green' },
    { name: 'Group Project', color: 'purple' },
    { name: 'Midterm Exam', color: 'yellow' },
    { name: 'Final Exam', color: 'red' }
  ]

  const getColorClasses = (color) => {
    const colorMap = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500'
    }
    return colorMap[color] || 'bg-gray-500'
  }

  const getTagColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      red: 'bg-red-100 text-red-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800'
    }
    return colorMap[color] || 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <img 
              src="http://static.photos/education/200x200/1" 
              alt="NUS Logo" 
              className="w-10 h-10 rounded-full"
            />
            <h1 className="text-xl font-bold text-nusblue ml-3">AIMaster</h1>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h2 className="text-xs uppercase font-semibold text-gray-500 mb-2">Navigation</h2>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center p-2 rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'text-nusblue bg-blue-50' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Courses */}
          <div className="mb-6">
            <h2 className="text-xs uppercase font-semibold text-gray-500 mb-2">Courses</h2>
            <div className="space-y-1">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <span className={`w-2 h-2 ${getColorClasses(course.color)} rounded-full mr-3`} />
                  <span>{course.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-xs uppercase font-semibold text-gray-500 mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.name}
                  className={`px-2 py-1 text-xs rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-200 ${getTagColorClasses(tag.color)}`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img 
              src={user.avatar} 
              alt="User" 
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar