import React, { useState, useEffect } from 'react'
import { X, Calendar, Save, Trash2 } from 'lucide-react'
import { useTask } from '../context/TaskContext'

function TaskModal({ task, isOpen, onClose }) {
  const { addTask, updateTask, deleteTask, courses } = useTask()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    type: 'Assignment',
    priority: 'medium',
    dueDate: '',
    progress: 0,
    tags: []
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
        tags: task.tags || []
      })
    } else {
      setFormData({
        title: '',
        description: '',
        course: courses[0]?.id || '',
        type: 'Assignment',
        priority: 'medium',
        dueDate: '',
        progress: 0,
        tags: []
      })
    }
  }, [task, courses, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString(),
      progress: Number(formData.progress)
    }

    if (task) {
      updateTask(taskData)
    } else {
      addTask(taskData)
    }
    
    onClose()
  }

  const handleDelete = () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id)
      onClose()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }))
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Enter task description"
            />
          </div>

          {/* Course and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <select
                id="course"
                name="course"
                required
                value={formData.course}
                onChange={handleChange}
                className="input-field"
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Assignment">Assignment</option>
                <option value="Quiz">Quiz</option>
                <option value="Group Project">Group Project</option>
                <option value="Midterm Exam">Midterm Exam</option>
                <option value="Final Exam">Final Exam</option>
              </select>
            </div>
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                required
                value={formData.priority}
                onChange={handleChange}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                required
                value={formData.dueDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Progress */}
          <div>
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
              Progress: {formData.progress}%
            </label>
            <input
              type="range"
              id="progress"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="input-field"
              placeholder="Type a tag and press Enter"
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              {task && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {task ? 'Update' : 'Create'} Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal