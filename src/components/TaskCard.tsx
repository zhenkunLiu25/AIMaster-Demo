import { format, differenceInDays, differenceInHours } from 'date-fns';
import { useState } from 'react';
import type { Task } from '../types';
import { getTaskUrgency, calculatePriority } from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onPriorityChange: (taskId: string, priority: Task['priority']) => void;
  onDueDateChange?: (taskId: string, dueDate: Date) => void;
  onEstimatedHoursChange?: (taskId: string, hours: number | undefined) => void;
  onTitleChange?: (taskId: string, title: string) => void;
  onDescriptionChange?: (taskId: string, description: string) => void;
  onCourseChange?: (taskId: string, courseCode: string, courseName: string) => void;
  onTypeChange?: (taskId: string, type: Task['type']) => void;
  onTagsChange?: (taskId: string, tags: string[]) => void;
  onClick?: () => void;
}

const priorityColors = {
  high: { background: '#fef2f2', color: '#991b1b', border: '#fecaca' },
  medium: { background: '#fffbeb', color: '#92400e', border: '#fed7aa' },
  low: { background: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
};

const typeIcons = {
  assignment: '📝',
  exam: '📚',
  meeting: '👥',
  deadline: '⏰',
  other: '📋',
};

const sourceInfo = {
  email: { 
    icon: '📧', 
    label: 'Auto-imported from email',
    background: '#eff6ff',
    color: '#1d4ed8',
    border: '#bfdbfe'
  },
  calendar: { 
    icon: '�', 
    label: 'Synced from calendar',
    background: '#f0fdf4',
    color: '#166534',
    border: '#bbf7d0'
  },
  manual: { 
    icon: '✍️', 
    label: 'Created manually',
    background: '#fef7ff',
    color: '#7c2d12',
    border: '#e7c3ff'
  },
};

const statusColors = {
  pending: { background: '#f3f4f6', color: '#374151', border: '#dc2626' },
  'in-progress': { background: '#dbeafe', color: '#1d4ed8', border: '#1d4ed8' },
  completed: { background: '#dcfce7', color: '#166534', border: '#166534' },
  overdue: { background: '#fef2f2', color: '#dc2626', border: '#dc2626' },
};

export default function TaskCard({ 
  task, 
  onStatusChange, 
  onPriorityChange, 
  onDueDateChange,
  onEstimatedHoursChange,
  onTitleChange,
  onDescriptionChange,
  onCourseChange,
  onTypeChange,
  onTagsChange,
  onClick 
}: TaskCardProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  
  const urgency = getTaskUrgency(task);
  const calculatedPriority = calculatePriority(task);
  const daysUntilDue = differenceInDays(task.dueDate, new Date());
  const hoursUntilDue = differenceInHours(task.dueDate, new Date());

  const getTimeUntilDue = () => {
    if (daysUntilDue > 0) {
      return `${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`;
    } else if (hoursUntilDue > 0) {
      return `${hoursUntilDue} hour${hoursUntilDue > 1 ? 's' : ''}`;
    } else {
      return 'Overdue';
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    borderLeft: `4px solid ${statusColors[task.status].border}`,
    padding: '1rem',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'box-shadow 0.2s',
    overflow: 'hidden',
    wordWrap: 'break-word',
    maxWidth: '100%',
  };

  const priorityStyle = priorityColors[calculatedPriority];

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* First Row: Priority (left), Type (center), Source Badge (right) - Evenly Distributed */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        {/* Priority indicator - left */}
        <div style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '500',
          border: `1px solid ${priorityStyle.border}`,
          background: priorityStyle.background,
          color: priorityStyle.color,
          flex: '0 0 auto',
        }}>
          {calculatedPriority.toUpperCase()}
        </div>
        
        {/* Task Type - center */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1' }}>
          {onTypeChange ? (
            <select
              value={task.type}
              onChange={(e) => onTypeChange(task.id, e.target.value as Task['type'])}
              onClick={(e) => e.stopPropagation()}
              style={{
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                color: '#6b7280',
                fontSize: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer',
                outline: 'none',
                borderRadius: '0.25rem',
                padding: '0.125rem 0.375rem',
              }}
            >
              <option value="assignment">📝 Assignment</option>
              <option value="exam">📚 Exam</option>
              <option value="meeting">👥 Meeting</option>
              <option value="deadline">⏰ Deadline</option>
              <option value="other">📋 Other</option>
            </select>
          ) : (
            <span style={{ 
              color: '#6b7280',
              fontSize: '0.75rem',
              fontWeight: '500',
              padding: '0.125rem 0.375rem',
              background: '#f9fafb',
              borderRadius: '0.25rem',
              border: '1px solid #e5e7eb',
            }}>
              {typeIcons[task.type]} {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
            </span>
          )}
        </div>
        
        {/* Source indicator badge - right */}
        <div 
          style={{
            padding: '0.125rem 0.375rem',
            borderRadius: '0.25rem',
            fontSize: '0.625rem',
            fontWeight: '500',
            border: `1px solid ${sourceInfo[task.source].border}`,
            background: sourceInfo[task.source].background,
            color: sourceInfo[task.source].color,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flex: '0 0 auto',
          }}
          title={sourceInfo[task.source].label}
        >
          <span>{sourceInfo[task.source].icon}</span>
          {task.source === 'email' ? 'AUTO' : task.source === 'calendar' ? 'SYNC' : 'MANUAL'}
        </div>
      </div>

      {/* Second Row: Task Title - Left Aligned */}
      <div style={{ marginBottom: '0.5rem' }}>
        {editingField === 'title' ? (
          <input
            type="text"
            value={task.title}
            onChange={(e) => onTitleChange?.(task.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setEditingField(null);
              }
              if (e.key === 'Escape') {
                setEditingField(null);
              }
            }}
            autoFocus
            style={{
              width: '100%',
              border: '1px solid #3b82f6',
              background: 'white',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              outline: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
              textAlign: 'left',
            }}
          />
        ) : (
          <h3 
            onClick={(e) => {
              e.stopPropagation();
              setEditingField('title');
            }}
            style={{ 
              fontWeight: '600', 
              color: '#111827', 
              fontSize: '1.125rem', 
              lineHeight: '1.25', 
              margin: 0,
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid transparent',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            title="Click to edit title"
          >
            {task.title}
          </h3>
        )}
      </div>

      {/* Third Row: Course Information - Left Aligned with Title */}
      {task.courseCode && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start',
          gap: '0.5rem', 
          marginBottom: '0.5rem',
          marginLeft: '0.5rem', // Align with title padding
          fontSize: '0.875rem',
          width: 'calc(100% - 1rem)', // Account for left margin
          overflow: 'hidden'
        }}>
          {onCourseChange ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-start',
              gap: '0.25rem',
              width: '100%',
              minWidth: '0'
            }}>
              <input
                type="text"
                value={task.courseCode}
                onChange={(e) => onCourseChange(task.id, e.target.value, task.courseName || '')}
                onClick={(e) => e.stopPropagation()}
                placeholder="Course Code"
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  width: '80px',
                  outline: 'none',
                  minWidth: '60px',
                  flexShrink: 0,
                  textAlign: 'left',
                }}
              />
              <span style={{ color: '#d1d5db', flexShrink: 0 }}>-</span>
              <input
                type="text"
                value={task.courseName || ''}
                onChange={(e) => onCourseChange(task.id, task.courseCode || '', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Course Name"
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  outline: 'none',
                  minWidth: '0',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                }}
              />
            </div>
          ) : (
            <span style={{ 
              color: '#6b7280',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              textAlign: 'left',
            }}>
              {task.courseCode} - {task.courseName}
            </span>
          )}
        </div>
      )}

      {/* Description - Click to edit */}
      {(task.description || editingField === 'description') && (
        <div style={{ marginBottom: '0.75rem' }}>
          {editingField === 'description' ? (
            <textarea
              value={task.description || ''}
              onChange={(e) => onDescriptionChange?.(task.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setEditingField(null);
                }
              }}
              placeholder="Add description..."
              rows={3}
              autoFocus
              style={{
                width: '100%',
                border: '1px solid #3b82f6',
                background: 'white',
                color: '#374151',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
                padding: '0.5rem',
                borderRadius: '4px',
                minHeight: '60px',
                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
              }}
            />
          ) : task.description ? (
            <p 
              onClick={(e) => {
                e.stopPropagation();
                setEditingField('description');
              }}
              style={{ 
                color: '#374151', 
                fontSize: '0.875rem',
                margin: 0,
                lineHeight: '1.5',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid transparent',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              title="Click to edit description"
            >
              {task.description}
            </p>
          ) : (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setEditingField('description');
              }}
              style={{
                color: '#9ca3af',
                fontSize: '0.875rem',
                fontStyle: 'italic',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              title="Click to add description"
            >
              Click to add description...
            </div>
          )}
        </div>
      )}

      {/* Fourth Row: Due Date and Time - One Line */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '1rem',
        fontSize: '0.875rem', 
        color: '#6b7280',
        marginBottom: '0.25rem',
        flexWrap: 'nowrap',
        overflow: 'hidden'
      }}>
        {/* Due Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          <span>📅</span>
          {onDueDateChange ? (
            <input
              type="date"
              value={format(task.dueDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                if (e.target.value) {
                  const newDate = new Date(task.dueDate);
                  const inputDate = new Date(e.target.value);
                  newDate.setFullYear(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
                  onDueDateChange(task.id, newDate);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none',
                width: '100px',
              }}
            />
          ) : (
            <span style={{ whiteSpace: 'nowrap' }}>{format(task.dueDate, 'MMM d')}</span>
          )}
        </div>
        
        {/* Due Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          <span>🕐</span>
          {onDueDateChange ? (
            <input
              type="time"
              value={format(task.dueDate, 'HH:mm')}
              onChange={(e) => {
                if (e.target.value) {
                  const newDate = new Date(task.dueDate);
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  newDate.setHours(hours, minutes);
                  onDueDateChange(task.id, newDate);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none',
                width: '70px',
                fontFamily: 'inherit',
              }}
            />
          ) : (
            <span style={{ whiteSpace: 'nowrap', minWidth: '70px' }}>{format(task.dueDate, 'h:mm a')}</span>
          )}
        </div>
      </div>

      {/* Fifth Row: Due In/Countdown - Next Line */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '0.25rem',
        fontSize: '0.875rem', 
        color: '#6b7280',
        marginBottom: '0.5rem'
      }}>
        {urgency === 'overdue' || urgency === 'urgent' ? (
          <>
            <span>⚠️</span>
            <span style={{ 
              fontWeight: '500', 
              color: '#dc2626'
            }}>
              {getTimeUntilDue()}
            </span>
          </>
        ) : (
          <span>Due in {getTimeUntilDue()}</span>
        )}
      </div>

      {/* Required Time - Left Aligned */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '0.25rem',
        fontSize: '0.875rem', 
        color: '#6b7280',
        marginBottom: '0.75rem'
      }}>
        <span>⏱️</span>
        {onEstimatedHoursChange ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <input
              type="number"
              value={task.estimatedHours || ''}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                onEstimatedHoursChange(task.id, value);
              }}
              onClick={(e) => e.stopPropagation()}
              placeholder="0"
              min="0"
              step="0.5"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                fontSize: '0.875rem',
                width: '50px',
                outline: 'none',
                textAlign: 'left',
              }}
            />
            <span>hours estimated</span>
          </div>
        ) : (
          <span>
            {task.estimatedHours ? `${task.estimatedHours} hours estimated` : 'No time estimate'}
          </span>
        )}
      </div>

      {/* Tags - Individual Button Style with # and Default Tags */}
      <div style={{ marginBottom: '0.75rem' }}>
        {onTagsChange ? (
          <div>
            {/* Default Tags Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
              {['registration', 'administrative'].map((defaultTag) => (
                <button
                  key={defaultTag}
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentTags = task.tags || [];
                    if (currentTags.includes(defaultTag)) {
                      // Remove tag if already exists
                      onTagsChange(task.id, currentTags.filter(tag => tag !== defaultTag));
                    } else {
                      // Add tag if doesn't exist
                      onTagsChange(task.id, [...currentTags, defaultTag]);
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.125rem 0.375rem',
                    background: task.tags.includes(defaultTag) 
                      ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' 
                      : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    color: task.tags.includes(defaultTag) ? '#1d4ed8' : '#6b7280',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    borderRadius: '12px',
                    border: task.tags.includes(defaultTag) 
                      ? '1px solid #3b82f6' 
                      : '1px solid #d1d5db',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  }}
                  onMouseEnter={(e) => {
                    if (task.tags.includes(defaultTag)) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)';
                    } else {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
                    }
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (task.tags.includes(defaultTag)) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
                    } else {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                    }
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  #{defaultTag}
                </button>
              ))}
            </div>
            
            {/* Custom Tags Input */}
            <input
              type="text"
              value={task.tags.filter(tag => !['registration', 'administrative'].includes(tag)).join(', ')}
              onChange={(e) => {
                const customTags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                const defaultTags = task.tags.filter(tag => ['registration', 'administrative'].includes(tag));
                onTagsChange(task.id, [...defaultTags, ...customTags]);
              }}
              onClick={(e) => e.stopPropagation()}
              placeholder="Add custom tags separated by commas..."
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                color: '#6b7280',
                fontSize: '0.75rem',
                outline: 'none',
                padding: '0.25rem 0',
                borderBottom: '1px solid transparent',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderBottom = '1px solid #d1d5db'}
              onMouseLeave={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}
              onFocus={(e) => e.currentTarget.style.borderBottom = '1px solid #3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}
            />
          </div>
        ) : (
          task.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.125rem 0.375rem',
                    background: ['registration', 'administrative'].includes(tag)
                      ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                      : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    color: ['registration', 'administrative'].includes(tag) ? '#1d4ed8' : '#6b7280',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    borderRadius: '12px',
                    border: ['registration', 'administrative'].includes(tag)
                      ? '1px solid #3b82f6'
                      : '1px solid #d1d5db',
                    cursor: 'default',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  }}
                  onMouseEnter={(e) => {
                    if (['registration', 'administrative'].includes(tag)) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)';
                    } else {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
                    }
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (['registration', 'administrative'].includes(tag)) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
                    } else {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                    }
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )
        )}
      </div>

      {/* Actions - Status (Bottom Left) and Priority (Bottom Right) - Fixed Height Container */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingTop: '0.75rem',
        paddingBottom: '0.5rem', 
        borderTop: '1px solid #f3f4f6',
        height: '56px', // Fixed height for the entire bottom section
        minHeight: '56px', // Ensure minimum height
        boxSizing: 'border-box', // Include padding in height calculation
      }}>
        {/* Status - Bottom Left */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          style={{
            fontSize: '0.75rem',
            padding: '0.375rem 0.5rem', // Slightly more padding for better touch targets
            borderRadius: '0.25rem',
            border: 'none',
            background: statusColors[task.status].background,
            color: statusColors[task.status].color,
            height: '36px', // Fixed height for dropdowns
            minWidth: '90px', // Minimum width to accommodate text
            boxSizing: 'border-box',
            cursor: 'pointer',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority - Bottom Right */}
        <select
          value={task.priority}
          onChange={(e) => onPriorityChange(task.id, e.target.value as Task['priority'])}
          style={{
            fontSize: '0.75rem',
            padding: '0.375rem 0.5rem', // Slightly more padding for better touch targets
            borderRadius: '0.25rem',
            border: '1px solid #d1d5db',
            background: 'white',
            color: '#374151',
            height: '36px', // Fixed height for dropdowns
            minWidth: '110px', // Minimum width to accommodate text
            boxSizing: 'border-box',
            cursor: 'pointer',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
    </div>
  );
}
