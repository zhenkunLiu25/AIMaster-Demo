import { format, differenceInDays, differenceInHours } from 'date-fns';
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
      {/* Top Row: Priority (left) and Source Badge (right) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        {/* Priority indicator - top left */}
        <div style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '500',
          border: `1px solid ${priorityStyle.border}`,
          background: priorityStyle.background,
          color: priorityStyle.color,
        }}>
          {calculatedPriority.toUpperCase()}
        </div>
        
        {/* Source indicator badge - top right */}
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
          }}
          title={sourceInfo[task.source].label}
        >
          <span>{sourceInfo[task.source].icon}</span>
          {task.source === 'email' ? 'AUTO' : task.source === 'calendar' ? 'SYNC' : 'MANUAL'}
        </div>
      </div>

      {/* Task Title - Editable */}
      <div style={{ marginBottom: '0.5rem' }}>
        {onTitleChange ? (
          <input
            type="text"
            value={task.title}
            onChange={(e) => onTitleChange(task.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              outline: 'none',
              padding: '0.25rem 0',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderBottom = '1px solid #d1d5db'}
            onMouseLeave={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}
            onFocus={(e) => e.currentTarget.style.borderBottom = '1px solid #3b82f6'}
            onBlur={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}
          />
        ) : (
          <h3 style={{ 
            fontWeight: '600', 
            color: '#111827', 
            fontSize: '1.125rem', 
            lineHeight: '1.25', 
            margin: 0
          }}>
            {task.title}
          </h3>
        )}
      </div>

      {/* Task Type and Course - Editable */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        {onTypeChange ? (
          <select
            value={task.type}
            onChange={(e) => onTypeChange(task.id, e.target.value as Task['type'])}
            onClick={(e) => e.stopPropagation()}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              fontSize: '0.875rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="assignment">📝 Assignment</option>
            <option value="exam">📚 Exam</option>
            <option value="meeting">👥 Meeting</option>
            <option value="deadline">⏰ Deadline</option>
            <option value="other">📋 Other</option>
          </select>
        ) : (
          <span style={{ color: '#6b7280' }}>
            {typeIcons[task.type]} {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
          </span>
        )}
        
        {task.courseCode && (
          <>
            <span style={{ color: '#d1d5db' }}>•</span>
            {onCourseChange ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
                  }}
                />
                <span style={{ color: '#d1d5db' }}>-</span>
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
                    flex: 1,
                    outline: 'none',
                  }}
                />
              </div>
            ) : (
              <span style={{ color: '#6b7280' }}>
                {task.courseCode} - {task.courseName}
              </span>
            )}
          </>
        )}
      </div>

      {/* Description - Editable */}
      {(task.description || onDescriptionChange) && (
        <div style={{ marginBottom: '0.75rem' }}>
          {onDescriptionChange ? (
            <textarea
              value={task.description || ''}
              onChange={(e) => onDescriptionChange(task.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Add description..."
              rows={2}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                color: '#374151',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
                padding: '0.25rem 0',
                borderBottom: '1px solid transparent',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderBottom = '1px solid #d1d5db'}
              onMouseLeave={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}
              onFocus={(e) => e.currentTarget.style.borderBottom = '1px solid #3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}
            />
          ) : (
            <p style={{ 
              color: '#374151', 
              fontSize: '0.875rem',
              margin: 0,
              lineHeight: '1.4'
            }}>
              {task.description}
            </p>
          )}
        </div>
      )}

      {/* Due Date, Time, and Countdown - One Line */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        fontSize: '0.875rem', 
        color: '#6b7280',
        marginBottom: '0.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Due Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
              }}
            />
          ) : (
            <span>{format(task.dueDate, 'MMM d, yyyy')}</span>
          )}
        </div>
        
        {/* Due Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
              }}
            />
          ) : (
            <span>{format(task.dueDate, 'h:mm a')}</span>
          )}
        </div>
        
        {/* Countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {urgency === 'overdue' || urgency === 'urgent' ? (
            <>
              <span>⚠️</span>
              <span style={{ fontWeight: '500', color: '#dc2626' }}>{getTimeUntilDue()}</span>
            </>
          ) : (
            <span>Due in {getTimeUntilDue()}</span>
          )}
        </div>
      </div>

      {/* Required Time - Next Line */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
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

      {/* Tags - Editable */}
      <div style={{ marginBottom: '0.75rem' }}>
        {onTagsChange ? (
          <input
            type="text"
            value={task.tags.join(', ')}
            onChange={(e) => {
              const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
              onTagsChange(task.id, tags);
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="Add tags separated by commas..."
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
        ) : (
          task.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )
        )}
      </div>

      {/* Actions - Status and Priority */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingTop: '0.75rem', 
        borderTop: '1px solid #f3f4f6' 
      }}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            border: 'none',
            background: statusColors[task.status].background,
            color: statusColors[task.status].color,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={task.priority}
          onChange={(e) => onPriorityChange(task.id, e.target.value as Task['priority'])}
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            border: '1px solid #d1d5db',
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
