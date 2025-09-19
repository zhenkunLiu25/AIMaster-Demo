export const priorityColors = {
  high: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-800',
    progress: 'bg-red-500'
  },
  medium: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-800',
    progress: 'bg-yellow-500'
  },
  low: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-800',
    progress: 'bg-green-500'
  }
}

export const courseColors = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  yellow: 'bg-yellow-500',
  indigo: 'bg-indigo-500',
  pink: 'bg-pink-500',
  gray: 'bg-gray-500'
}

export const typeColors = {
  Assignment: 'bg-blue-100 text-blue-800',
  Exam: 'bg-red-100 text-red-800',
  Project: 'bg-green-100 text-green-800',
  Quiz: 'bg-yellow-100 text-yellow-800',
  Reading: 'bg-purple-100 text-purple-800'
}

export const getRandomColor = () => {
  const colors = Object.keys(courseColors)
  return colors[Math.floor(Math.random() * colors.length)]
}

export const getPriorityColor = (priority) => {
  return priorityColors[priority] || priorityColors.medium
}

export const getCourseColor = (color) => {
  return courseColors[color] || courseColors.gray
}

export const getTypeColor = (type) => {
  return typeColors[type] || 'bg-gray-100 text-gray-800'
}