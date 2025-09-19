import { format, isToday, isTomorrow, isThisWeek, isThisMonth, isThisYear } from 'date-fns'

export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString)
  
  if (isToday(date)) {
    return 'Today'
  } else if (isTomorrow(date)) {
    return 'Tomorrow'
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE') // Monday, Tuesday, etc.
  } else if (isThisMonth(date)) {
    return format(date, 'MMM d') // Jan 15
  } else if (isThisYear(date)) {
    return format(date, 'MMM d') // Jan 15
  } else {
    return format(date, 'MMM d, yyyy') // Jan 15, 2024
  }
}

export const formatDueDate = (dateString, includeTime = false) => {
  const date = new Date(dateString)
  
  if (isToday(date)) {
    return includeTime ? `Today, ${format(date, 'h:mm a')}` : 'Due today'
  } else if (isTomorrow(date)) {
    return includeTime ? `Tomorrow, ${format(date, 'h:mm a')}` : 'Due tomorrow'
  } else if (isThisWeek(date)) {
    return includeTime ? `${format(date, 'EEEE, h:mm a')}` : `Due ${format(date, 'EEEE')}`
  } else {
    return includeTime ? format(date, 'MMM d, h:mm a') : `Due ${format(date, 'MMM d')}`
  }
}

export const isOverdue = (dateString) => {
  return new Date(dateString) < new Date()
}

export const getDaysUntilDue = (dateString) => {
  const dueDate = new Date(dateString)
  const today = new Date()
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const getPriorityWeight = (priority) => {
  const weights = { high: 3, medium: 2, low: 1 }
  return weights[priority] || 0
}

export const sortTasks = (tasks, sortBy) => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
      case 'course':
        return a.course.localeCompare(b.course)
      case 'progress':
        return b.progress - a.progress
      case 'title':
        return a.title.localeCompare(b.title)
      case 'dueDate':
      default:
        return new Date(a.dueDate) - new Date(b.dueDate)
    }
  })
}

export const filterTasks = (tasks, filters, searchQuery) => {
  return tasks.filter(task => {
    // Search filter
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    
    // Course filter
    const matchesCourse = !filters.course || filters.course === 'all' || task.course === filters.course
    
    // Type filter
    const matchesType = !filters.type || filters.type === 'all' || task.type === filters.type
    
    // Priority filter
    const matchesPriority = !filters.priority || filters.priority === 'all' || task.priority === filters.priority
    
    // Status filter
    let matchesStatus = true
    if (filters.status) {
      switch (filters.status) {
        case 'completed':
          matchesStatus = task.completed
          break
        case 'pending':
          matchesStatus = !task.completed
          break
        case 'overdue':
          matchesStatus = !task.completed && isOverdue(task.dueDate)
          break
        default:
          matchesStatus = true
      }
    }
    
    return matchesSearch && matchesCourse && matchesType && matchesPriority && matchesStatus
  })
}