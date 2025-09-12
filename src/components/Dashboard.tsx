import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchTasks, 
  setFilters, 
  setSearchQuery, 
  updateTaskStatus, 
  updateTaskPriority,
  updateTaskDueDate,
  updateTaskEstimatedHours,
  updateTaskTitle,
  updateTaskDescription,
  updateTaskCourse,
  updateTaskType,
  updateTaskTags
} from '../store/taskSlice';
import { filterTasks, sortTasksByPriority, generateSampleTasks } from '../utils/taskUtils';
import TaskCard from './TaskCard';
import TaskFilters from './TaskFilters';
import TaskForm from './TaskForm';
import EmailIntegration from './EmailIntegration';
import type { Task } from '../types';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { tasks, loading, error, filters, searchQuery } = useAppSelector((state) => state.tasks);
  
  // Modal states
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEmailIntegration, setShowEmailIntegration] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Initialize with sample data if no tasks exist
  useEffect(() => {
    if (tasks.length === 0 && !loading) {
      const sampleTasks = generateSampleTasks();
      localStorage.setItem('nus-tasks', JSON.stringify(sampleTasks));
      dispatch(fetchTasks());
    }
  }, [tasks.length, loading, dispatch]);

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filters, searchQuery);
    return sortTasksByPriority(filtered);
  }, [tasks, filters, searchQuery]);

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    dispatch(updateTaskStatus({ id: taskId, status }));
  };

  const handlePriorityChange = (taskId: string, priority: Task['priority']) => {
    dispatch(updateTaskPriority({ id: taskId, priority }));
  };

  const handleDueDateChange = (taskId: string, dueDate: Date) => {
    dispatch(updateTaskDueDate({ id: taskId, dueDate }));
  };

  const handleEstimatedHoursChange = (taskId: string, estimatedHours: number | undefined) => {
    dispatch(updateTaskEstimatedHours({ id: taskId, estimatedHours }));
  };

  const handleTitleChange = (taskId: string, title: string) => {
    dispatch(updateTaskTitle({ id: taskId, title }));
  };

  const handleDescriptionChange = (taskId: string, description: string) => {
    dispatch(updateTaskDescription({ id: taskId, description }));
  };

  const handleCourseChange = (taskId: string, courseCode: string, courseName: string) => {
    dispatch(updateTaskCourse({ id: taskId, courseCode, courseName }));
  };

  const handleTypeChange = (taskId: string, type: Task['type']) => {
    dispatch(updateTaskType({ id: taskId, type }));
  };

  const handleTagsChange = (taskId: string, tags: string[]) => {
    dispatch(updateTaskTags({ id: taskId, tags }));
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    dispatch(setFilters(newFilters));
  };

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const getTasksByStatus = () => {
    const pending = filteredAndSortedTasks.filter(t => t.status === 'pending');
    const inProgress = filteredAndSortedTasks.filter(t => t.status === 'in-progress');
    const completed = filteredAndSortedTasks.filter(t => t.status === 'completed');
    const overdue = filteredAndSortedTasks.filter(t => t.status === 'overdue');
    
    return { pending, inProgress, completed, overdue };
  };

  const { pending, inProgress, completed, overdue } = getTasksByStatus();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '2px solid #e5e7eb', borderTop: '2px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '2rem' }}>⚠️</div>
          <p style={{ color: '#6b7280' }}>Error loading tasks: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb' }}>
      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Quick Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📋</span>
              <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Pending</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>{pending.length}</p>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🚀</span>
              <span style={{ fontWeight: 'bold', color: '#1f2937' }}>In Progress</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1d4ed8' }}>{inProgress.length}</p>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>✅</span>
              <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Completed</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>{completed.length}</p>
          </div>
          
          {overdue.length > 0 && (
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '2px solid #dc2626' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Overdue</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>{overdue.length}</p>
            </div>
          )}
        </div>
        
        {/* Welcome Message when no tasks */}
        {filteredAndSortedTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎓</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Welcome to AIMaster!</h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Your intelligent task management system for NUS students. Get started by adding your first task or connecting your email.
            </p>
            
            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap' 
            }}>
              <button
                onClick={() => setShowTaskForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#003d7a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#002147'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#003d7a'}
              >
                <span>📝</span>
                Add Your First Task
              </button>
              
              <button
                onClick={() => setShowEmailIntegration(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                <span>📧</span>
                Connect Email
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div style={{ marginBottom: '1.5rem' }}>
              <TaskFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                taskCount={filteredAndSortedTasks.length}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1.5rem',
              flexWrap: 'wrap' 
            }}>
              <button
                onClick={() => setShowTaskForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#003d7a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#002147'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#003d7a'}
              >
                <span>📝</span>
                Add New Task
              </button>
              
              <button
                onClick={() => setShowEmailIntegration(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                <span>📧</span>
                Email Integration
              </button>
            </div>

            {/* Tasks Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {filteredAndSortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onPriorityChange={handlePriorityChange}
                  onDueDateChange={handleDueDateChange}
                  onEstimatedHoursChange={handleEstimatedHoursChange}
                  onTitleChange={handleTitleChange}
                  onDescriptionChange={handleDescriptionChange}
                  onCourseChange={handleCourseChange}
                  onTypeChange={handleTypeChange}
                  onTagsChange={handleTagsChange}
                />
              ))}
            </div>

            {/* Upcoming Deadlines Warning */}
            {(pending.length > 0 || inProgress.length > 0) && (
              <div style={{ 
                marginTop: '2rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '0.5rem', 
                padding: '1rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ color: '#d97706' }}>⚡</div>
                  <div>
                    <h4 style={{ fontWeight: '500', color: '#92400e', margin: '0 0 0.25rem 0' }}>Upcoming Deadlines</h4>
                    <p style={{ fontSize: '0.875rem', color: '#b45309', margin: 0 }}>
                      You have {pending.length + inProgress.length} active tasks. 
                      Consider setting up email notifications for better deadline management.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <TaskForm 
        isOpen={showTaskForm} 
        onClose={() => setShowTaskForm(false)}
      />
      
      <EmailIntegration 
        isOpen={showEmailIntegration} 
        onClose={() => setShowEmailIntegration(false)} 
      />
    </div>
  );
}