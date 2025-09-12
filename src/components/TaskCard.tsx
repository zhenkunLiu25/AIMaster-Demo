import { format, differenceInDays, differenceInHours } from 'date-fns';
import type { Task } from '../types';
import { getTaskUrgency, calculatePriority } from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onPriorityChange: (taskId: string, priority: Task['priority']) => void;
  onDueDateChange?: (taskId: string, dueDate: Date) => void;
  onEstimatedHoursChange?: (taskId: string, hours: number | undefined) => void;
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
      {/* Header */}
      <div style={{ marginBottom: '0.75rem' }}>
        {/* Top row: Icon, Title, Priority */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
            <span style={{ fontSize: '2rem' }}>{typeIcons[task.type]}</span>
            <h3 style={{ 
              fontWeight: '600', 
              color: '#111827', 
              fontSize: '1.125rem', 
              lineHeight: '1.25', 
              margin: 0,
              flex: 1
            }}>
              {task.title}
            </h3>
          </div>
          
          {/* Priority indicator */}
          <div style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
            border: `1px solid ${priorityStyle.border}`,
            background: priorityStyle.background,
            color: priorityStyle.color,
          }}>
            {calculatedPriority}
          </div>
        </div>
        
        {/* Second row: Course info and Source badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '3.25rem' }}>
          {task.courseCode && (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              {task.courseCode} - {task.courseName}
            </p>
          )}
          
          {/* Source indicator badge */}
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
              flexShrink: 0
            }}
            title={sourceInfo[task.source].label}
          >
            <span>{sourceInfo[task.source].icon}</span>
            {task.source === 'email' ? 'AUTO' : task.source === 'calendar' ? 'SYNC' : 'MANUAL'}
          </div>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{ 
          color: '#374151', 
          fontSize: '0.875rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: '0 0 0.75rem 0'
        }}>
          {task.description}
        </p>
      )}

      {/* Metadata - Editable Fields */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '0.75rem',
        fontSize: '0.875rem', 
        color: '#6b7280',
        marginBottom: '0.75rem'
      }}>
        {/* Editable Due Date */}
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
                padding: '0.125rem 0.25rem',
                borderRadius: '0.25rem',
                outline: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            />
          ) : (
            <span>{format(task.dueDate, 'MMM d, yyyy')}</span>
          )}
        </div>
        
        {/* Editable Due Time */}
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
                padding: '0.125rem 0.25rem',
                borderRadius: '0.25rem',
                outline: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            />
          ) : (
            <span>{format(task.dueDate, 'h:mm a')}</span>
          )}
        </div>
        
        {/* Editable Estimated Hours */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span>⏱️</span>
          {onEstimatedHoursChange ? (
            <input
              type="number"
              value={task.estimatedHours || ''}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                onEstimatedHoursChange(task.id, value);
              }}
              onClick={(e) => e.stopPropagation()}
              placeholder="Hours"
              min="0"
              step="0.5"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                fontSize: '0.875rem',
                cursor: 'pointer',
                padding: '0.125rem 0.25rem',
                borderRadius: '0.25rem',
                outline: 'none',
                width: '60px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            />
          ) : (
            task.estimatedHours && (
              <span style={{ 
                fontSize: '0.75rem', 
                padding: '0.25rem 0.5rem', 
                background: '#f3f4f6', 
                borderRadius: '0.25rem' 
              }}>
                ~{task.estimatedHours}h
              </span>
            )
          )}
        </div>
        
        {/* Urgency Indicator */}
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

      {/* Tags */}
      {task.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
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
      )}

      {/* Actions */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
