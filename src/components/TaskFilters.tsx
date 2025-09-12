import { useState } from 'react';
import type { FilterOptions, TaskType, TaskPriority, TaskStatus } from '../types';

interface TaskFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  taskCount: number;
}

const taskTypes: { value: TaskType; label: string; icon: string }[] = [
  { value: 'assignment', label: 'Assignments', icon: '📝' },
  { value: 'exam', label: 'Exams', icon: '📚' },
  { value: 'meeting', label: 'Meetings', icon: '👥' },
  { value: 'deadline', label: 'Deadlines', icon: '⏰' },
  { value: 'other', label: 'Other', icon: '📋' },
];

const priorities: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' },
];

const statuses: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

export default function TaskFilters({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
  taskCount,
}: TaskFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({});
    onSearchChange('');
  };

  const hasActiveFilters = searchQuery || activeFilterCount > 0;

  return (
    <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
      {/* Search Bar */}
      <div style={{ padding: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ 
            position: 'absolute', 
            left: '0.75rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            fontSize: '1.25rem',
            color: '#9ca3af'
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search tasks, courses, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
            }}
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{ padding: '0 1rem 1rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid',
                backgroundColor: showFilters || activeFilterCount > 0 ? '#dbeafe' : 'white',
                borderColor: showFilters || activeFilterCount > 0 ? '#93c5fd' : '#d1d5db',
                color: showFilters || activeFilterCount > 0 ? '#1d4ed8' : '#374151',
                cursor: 'pointer',
                transition: 'colors 0.2s',
              }}
            >
              <span>🔽</span>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span style={{
                  background: '#2563eb',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <span>❌</span>
                <span>Clear all</span>
              </button>
            )}
          </div>

          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div style={{
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '0.5rem',
          }}>
            {/* Task Type Filter */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Task Type
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    type: e.target.value ? (e.target.value as TaskType) : undefined,
                  })
                }
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                }}
              >
                <option value="">All Types</option>
                {taskTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Priority
              </label>
              <select
                value={filters.priority || ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    priority: e.target.value ? (e.target.value as TaskPriority) : undefined,
                  })
                }
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                }}
              >
                <option value="">All Priorities</option>
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    status: e.target.value ? (e.target.value as TaskStatus) : undefined,
                  })
                }
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                }}
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
