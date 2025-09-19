import React from 'react'
import { Inbox as InboxIcon, Filter, MoreHorizontal } from 'lucide-react'

function Inbox() {
  // Mock inbox items
  const inboxItems = [
    {
      id: 1,
      type: 'announcement',
      title: 'CS1010S - New Assignment Released',
      message: 'Programming Assignment 2 has been released. Due in 2 weeks.',
      course: 'CS1010S',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Upcoming Quiz Reminder',
      message: 'CS2030S Weekly Quiz 4 is scheduled for Friday at 9:00 AM.',
      course: 'CS2030S',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'grade',
      title: 'Grade Released',
      message: 'Your grade for CS2040S Problem Set 2 is now available.',
      course: 'CS2040S',
      time: '3 days ago',
      read: true
    },
    {
      id: 4,
      type: 'announcement',
      title: 'CS2103T - Team Project Update',
      message: 'Project Phase 2 deadline has been extended to next Friday.',
      course: 'CS2103T',
      time: '1 week ago',
      read: true
    }
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'announcement':
        return '📢'
      case 'reminder':
        return '⏰'
      case 'grade':
        return '📊'
      default:
        return '📝'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800'
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800'
      case 'grade':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="card">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <InboxIcon className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>
              <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                {inboxItems.filter(item => !item.read).length} new
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Inbox Items */}
        <div className="divide-y divide-gray-200">
          {inboxItems.map(item => (
            <div
              key={item.id}
              className={`
                p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200
                ${!item.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
              `}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-4">
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${!item.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.message}</p>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.course}
                    </span>
                  </div>
                </div>
                {!item.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-3 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no items) */}
        {inboxItems.length === 0 && (
          <div className="p-12 text-center">
            <InboxIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your inbox is empty</h3>
            <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inbox