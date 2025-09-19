import React, { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useTask } from '../context/TaskContext'

function Calendar() {
  const { tasks } = useTask()
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const tasksForDate = useMemo(() => {
    const taskMap = new Map()
    
    tasks.forEach(task => {
      const taskDate = format(new Date(task.dueDate), 'yyyy-MM-dd')
      if (!taskMap.has(taskDate)) {
        taskMap.set(taskDate, [])
      }
      taskMap.get(taskDate).push(task)
    })
    
    return taskMap
  }, [tasks])

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    }
    return colorMap[priority] || 'bg-gray-500'
  }

  return (
    <div className="p-6">
      <div className="card">
        {/* Calendar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={previousMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const dayTasks = tasksForDate.get(dateKey) || []
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isCurrentDay = isToday(day)

            return (
              <div
                key={day.toString()}
                className={`
                  min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${isCurrentDay ? 'bg-blue-50' : ''}
                `}
              >
                <div className={`
                  text-sm font-medium mb-2
                  ${isCurrentDay ? 'text-nusblue' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                `}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className={`
                        text-xs p-1 rounded truncate cursor-pointer
                        ${getPriorityColor(task.priority)} text-white
                        hover:opacity-80 transition-opacity duration-200
                      `}
                      title={`${task.title} - ${task.course}`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="mt-6 card">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Today's Tasks</h3>
        </div>
        <div className="p-4">
          {tasks.filter(task => isSameDay(new Date(task.dueDate), new Date())).length > 0 ? (
            <div className="space-y-3">
              {tasks
                .filter(task => isSameDay(new Date(task.dueDate), new Date()))
                .map(task => (
                  <div key={task.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.course} - {task.type}</p>
                    </div>
                    <span className={`
                      px-2 py-1 text-xs rounded-full font-medium
                      ${task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                      ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${task.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {task.priority}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No tasks due today!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calendar