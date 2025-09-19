import React, { useState, useMemo } from 'react'
import { 
  List, 
  AlertCircle, 
  CheckCircle, 
  Book,
  Plus,
  ChevronDown,
  AlertTriangle,
  Calendar as CalendarIcon,
  Users
} from 'lucide-react'
import { useTask } from '../context/TaskContext'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { format, isThisWeek, isToday, isTomorrow } from 'date-fns'

function Dashboard() {
  const { 
    tasks, 
    courses, 
    filters, 
    setFilter, 
    searchQuery 
  } = useTask()
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.course.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCourse = filters.course === 'all' || task.course === filters.course
      const matchesType = filters.type === 'all' || task.type === filters.type
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority
      
      return matchesSearch && matchesCourse && matchesType && matchesPriority
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'course':
          return a.course.localeCompare(b.course)
        case 'dueDate':
        default:
          return new Date(a.dueDate) - new Date(b.dueDate)
      }
    })
  }, [tasks, filters, searchQuery])

  // Calculate statistics
  const stats = useMemo(() => {
    const pendingTasks = tasks.filter(task => !task.completed).length
    const dueThisWeek = tasks.filter(task => 
      !task.completed && isThisWeek(new Date(task.dueDate))
    ).length
    const completed = tasks.filter(task => task.completed).length
    const totalCourses = courses.length

    return { pendingTasks, dueThisWeek, completed, totalCourses }
  }, [tasks, courses])

  // Get upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter(task => !task.completed && isThisWeek(new Date(task.dueDate)))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5)
  }, [tasks])

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }

  const handleAddTask = () => {
    setSelectedTask(null)
    setIsTaskModalOpen(true)
  }

  const getDeadlineIcon = (task) => {
    if (task.type === 'Midterm Exam' || task.type === 'Final Exam') return Book
    if (task.type === 'Group Project') return Users
    return AlertTriangle
  }

  const getDeadlineColor = (dueDate) => {
    if (isToday(new Date(dueDate))) return 'bg-red-100 text-red-500'
    if (isTomorrow(new Date(dueDate))) return 'bg-orange-100 text-orange-500'
    return 'bg-blue-100 text-blue-500'
  }

  const formatDeadlineDate = (dateString) => {
    const date = new Date(dateString)
    if (isToday(date)) return 'Today, 11:59 PM'
    if (isTomorrow(date)) return 'Tomorrow, 11:59 PM'
    return format(date, 'EEEE, h:mm a')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Tasks</p>
              <h3 className="text-2xl font-bold mt-1">{stats.pendingTasks}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-nusblue">
              <List className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Due This Week</p>
              <h3 className="text-2xl font-bold mt-1">{stats.dueThisWeek}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-50 text-red-500">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <h3 className="text-2xl font-bold mt-1">{stats.completed}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-500">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Courses</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalCourses}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-50 text-purple-500">
              <Book className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="card animate-slide-up">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Priority Tasks</h3>
          <button 
            onClick={handleAddTask}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
          <div className="relative">
            <select 
              value={filters.course}
              onChange={(e) => setFilter('course', e.target.value)}
              className="appearance-none bg-gray-100 border-0 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-nusblue focus:outline-none"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={filters.type}
              onChange={(e) => setFilter('type', e.target.value)}
              className="appearance-none bg-gray-100 border-0 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-nusblue focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Documentation">Documentation</option>
              <option value="Research">Research</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={filters.priority}
              onChange={(e) => setFilter('priority', e.target.value)}
              className="appearance-none bg-gray-100 border-0 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-nusblue focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative ml-auto">
            <select 
              value={filters.sortBy}
              onChange={(e) => setFilter('sortBy', e.target.value)}
              className="appearance-none bg-gray-100 border-0 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-nusblue focus:outline-none"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="course">Sort by Course</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Task Items */}
        <div className="divide-y divide-gray-200">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onClick={() => handleTaskClick(task)}
                style={{ animationDelay: `${index * 0.05}s` }}
                className="animate-slide-up"
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <List className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tasks found. Try adjusting your filters or add a new task.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <div className="lg:col-span-2 card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Upcoming Deadlines</h3>
          </div>
          <div className="p-4">
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeadlines.map((task) => {
                  const Icon = getDeadlineIcon(task)
                  return (
                    <div key={task.id} className="flex items-start">
                      <div className={`flex-shrink-0 rounded-lg p-2 ${getDeadlineColor(task.dueDate)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {task.course} - {task.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDeadlineDate(task.dueDate)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming deadlines this week!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-3">
            <button 
              onClick={handleAddTask}
              className="btn-primary w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </button>
            <button className="btn-secondary w-full">
              <CalendarIcon className="w-4 h-4 mr-2" />
              View Calendar
            </button>
            <button className="btn-secondary w-full">
              <Book className="w-4 h-4 mr-2" />
              Study Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Dashboard