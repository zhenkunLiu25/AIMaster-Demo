import { format, differenceInDays, differenceInHours } from 'date-fns';
import type { Task } from '../types';
import { getTaskUrgency, calculatePriority } from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onPriorityChange: (taskId: string, priority: Task['priority']) => void;
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

const statusColors = {
  pending: { background: '#f3f4f6', color: '#374151' },
  'in-progress': { background: '#dbeafe', color: '#1d4ed8' },
  completed: { background: '#dcfce7', color: '#166534' },
  overdue: { background: '#fef2f2', color: '#dc2626' },
};

export default function TaskCard({ task, onStatusChange, onPriorityChange, onClick }: TaskCardProps) {
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
    ...{
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '1rem',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow 0.2s',
    },
    ...(urgency === 'overdue' && { borderLeft: '4px solid #ef4444' }),
    ...(urgency === 'urgent' && { borderLeft: '4px solid #f97316' }),
    ...(urgency === 'upcoming' && { borderLeft: '4px solid #eab308' }),
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
          <span style={{ fontSize: '2rem' }}>{typeIcons[task.type]}</span>
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              fontWeight: '600', 
              color: '#111827', 
              fontSize: '1.125rem', 
              lineHeight: '1.25', 
              margin: 0,
              marginBottom: '0.25rem'
            }}>
              {task.title}
            </h3>
            {task.courseCode && (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                {task.courseCode} - {task.courseName}
              </p>
            )}
          </div>
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

      {/* Metadata */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        fontSize: '0.875rem', 
        color: '#6b7280',
        marginBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>📅</span>
            <span>{format(task.dueDate, 'MMM d, yyyy')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>🕐</span>
            <span>{format(task.dueDate, 'h:mm a')}</span>
          </div>
          {task.estimatedHours && (
            <span style={{ 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem', 
              background: '#f3f4f6', 
              borderRadius: '0.25rem' 
            }}>
              ~{task.estimatedHours}h
            </span>
          )}
        </div>
        
        {urgency === 'overdue' || urgency === 'urgent' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#dc2626' }}>
            <span>⚠️</span>
            <span style={{ fontWeight: '500' }}>{getTimeUntilDue()}</span>
          </div>
        ) : (
          <span>Due in {getTimeUntilDue()}</span>
        )}
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
            border: '0',
            ...statusColors[task.status],
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {task.source === 'email' && '📧'}
            {task.source === 'calendar' && '📅'}
            {task.source === 'manual' && '✍️'}
          </span>
          
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
