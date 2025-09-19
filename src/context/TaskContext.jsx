import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const TaskContext = createContext()

// Sample initial data
const initialTasks = [
  {
    id: '1',
    title: 'Programming Assignment 1',
    description: 'Implement basic functions using recursion and higher-order functions',
    course: 'CS1010S',
    type: 'Assignment',
    priority: 'high',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    progress: 30,
    completed: false,
    tags: ['assignment', 'recursion'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Weekly Quiz 3',
    description: 'Object-oriented programming concepts and inheritance',
    course: 'CS2030S',
    type: 'Quiz',
    priority: 'medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
    progress: 65,
    completed: false,
    tags: ['quiz', 'oop'],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Team Project Phase 1',
    description: 'Design and implement a task management application',
    course: 'CS2103T',
    type: 'Group Project',
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week
    progress: 85,
    completed: false,
    tags: ['group-project', 'software-engineering'],
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Midterm Examination',
    description: 'Covers sorting algorithms, trees, and graph algorithms',
    course: 'CS2040S',
    type: 'Midterm Exam',
    priority: 'high',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
    progress: 45,
    completed: false,
    tags: ['midterm-exam', 'algorithms'],
    createdAt: new Date().toISOString()
  }
]

const initialCourses = [
  { id: 'CS1010S', name: 'Programming Methodology', color: 'blue' },
  { id: 'CS2030S', name: 'Programming Methods II', color: 'green' },
  { id: 'CS2040S', name: 'Data Structures and Algorithms', color: 'purple' },
  { id: 'CS2103T', name: 'Software Engineering', color: 'red' }
]

const initialState = {
  tasks: initialTasks,
  courses: initialCourses,
  filters: {
    course: 'all',
    type: 'all',
    priority: 'all',
    sortBy: 'dueDate'
  },
  searchQuery: '',
  user: {
    name: 'John Doe',
    email: 'john.doe@u.nus.edu',
    avatar: 'http://static.photos/people/200x200/1',
    studentId: 'A0123456X'
  }
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: uuidv4(), createdAt: new Date().toISOString() }]
      }
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      }
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      }
    
    case 'TOGGLE_TASK_COMPLETION':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload ? { ...task, completed: !task.completed, progress: task.completed ? task.progress : 100 } : task
        )
      }
    
    case 'UPDATE_TASK_PROGRESS':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? { ...task, progress: action.payload.progress } : task
        )
      }
    
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.payload.key]: action.payload.value }
      }
    
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      }
    
    case 'ADD_COURSE':
      return {
        ...state,
        courses: [...state.courses, action.payload]
      }
    
    case 'LOAD_FROM_STORAGE':
      return action.payload
    
    default:
      return state
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('taskAppState')
    if (savedState) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: JSON.parse(savedState) })
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('taskAppState', JSON.stringify(state))
  }, [state])

  const actions = {
    addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
    updateTask: (task) => dispatch({ type: 'UPDATE_TASK', payload: task }),
    deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
    toggleTaskCompletion: (id) => dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: id }),
    updateTaskProgress: (id, progress) => dispatch({ type: 'UPDATE_TASK_PROGRESS', payload: { id, progress } }),
    setFilter: (key, value) => dispatch({ type: 'SET_FILTER', payload: { key, value } }),
    setSearchQuery: (query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    addCourse: (course) => dispatch({ type: 'ADD_COURSE', payload: course })
  }

  return (
    <TaskContext.Provider value={{ ...state, ...actions }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}