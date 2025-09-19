import React from 'react'
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns'
import { 
  Calendar, 
  MoreVertical,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { useTask } from '../context/TaskContext'

function TaskCard({ task, onClick }) {
  const { toggleTaskCompletion } = useTask()

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'border-red-500 bg-red-50',
      medium: 'border-yellow-500 bg-yellow-50',
      low: 'border-green-500 bg-green-50'
    }
    return colorMap[priority] || 'border-gray-500 bg-gray-50'
  }

  const getPriorityBadgeColor = (priority) => {
    const colorMap = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colorMap[priority] || 'bg-gray-100 text-gray-800'
  }

  const getProgressColor = (priority) => {
    const colorMap = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    }
    return colorMap[priority] || 'bg-gray-500'
  }

  const formatDueDate = (dateString) => {
    const date = new Date(dateString)
    
    if (isToday(date)) {
      return 'Due today'
    } else if (isTomorrow(date)) {
      return 'Due tomorrow'
    } else if (isThisWeek(date)) {
      return `Due ${format(date, 'EEEE')}`
    } else {
      return `Due ${format(date, 'MMM d')}`
    }
  }

  const isOverdue = () => {
    return new Date(task.dueDate) < new Date() && !task.completed
  }

  const getDueDateColor = () => {
    if (isOverdue()) return 'text-red-600'
    if (isToday(new Date(task.dueDate)) || isTomorrow(new Date(task.dueDate))) return 'text-orange-600'
    return 'text-gray-500'
  }

  const handleCheckboxChange = (e) => {
    e.stopPropagation()
    toggleTaskCompletion(task.id)
  }

  return (
    <div 
      className={`
        task-card bg-white p-4 border-l-4 cursor-pointer group
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
        ${getPriorityColor(task.priority)}
        ${task.completed ? 'opacity-60' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start">
        {/* Checkbox */}
        <div className="flex items-center h-5 mr-3 mt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-nusblue border-gray-300 rounded focus:ring-nusblue transition-colors duration-200"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-medium text-gray-900 truncate ${task.completed ? 'line-through' : ''}`}>
              {task.title} - {task.course}
            </h4>
            <div className="flex items-center space-x-2">
              {isOverdue() && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2">{task.description}</p>

          {/* Due date */}
          <div className={`flex items-center text-sm mb-3 ${getDueDateColor()}`}>
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDueDate(task.dueDate)}</span>
          </div>

          {/* Progress */}
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(task.priority)}`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{task.progress}% completed</p>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="ml-4 flex-shrink-0 flex">
          <button 
            className="text-gray-400 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard