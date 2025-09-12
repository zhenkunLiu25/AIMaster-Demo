import { differenceInDays, differenceInHours, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import type { Task, TaskPriority, FilterOptions } from '../types';

// Priority calculation based on due date and task type
export function calculatePriority(task: Task): TaskPriority {
  const now = new Date();
  const daysUntilDue = differenceInDays(task.dueDate, now);
  const hoursUntilDue = differenceInHours(task.dueDate, now);

  // Override logic for exams (always high priority if within 7 days)
  if (task.type === 'exam' && daysUntilDue <= 7) {
    return 'high';
  }

  // High priority: Due within 24 hours or overdue
  if (hoursUntilDue <= 24) {
    return 'high';
  }

  // Medium priority: Due within 3 days
  if (daysUntilDue <= 3) {
    return 'medium';
  }

  // Medium priority for assignments due within a week
  if (task.type === 'assignment' && daysUntilDue <= 7) {
    return 'medium';
  }

  return 'low';
}

// Smart task sorting algorithm
export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  
  return [...tasks].sort((a, b) => {
    // First sort by status (pending/in-progress first)
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (b.status === 'completed' && a.status !== 'completed') return -1;
    
    // Then by calculated priority
    const aPriority = priorityWeight[calculatePriority(a)];
    const bPriority = priorityWeight[calculatePriority(b)];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Finally by due date
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
}

// Filter tasks based on criteria
export function filterTasks(tasks: Task[], filters: FilterOptions, searchQuery: string): Task[] {
  let filtered = [...tasks];

  // Search query filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.courseCode?.toLowerCase().includes(query) ||
      task.courseName?.toLowerCase().includes(query) ||
      task.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Course filter
  if (filters.course) {
    filtered = filtered.filter(task => 
      task.courseCode === filters.course || task.courseName === filters.course
    );
  }

  // Type filter
  if (filters.type) {
    filtered = filtered.filter(task => task.type === filters.type);
  }

  // Priority filter
  if (filters.priority) {
    filtered = filtered.filter(task => calculatePriority(task) === filters.priority);
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter(task => task.status === filters.status);
  }

  // Date range filter
  if (filters.dateRange) {
    filtered = filtered.filter(task => {
      const taskDate = startOfDay(task.dueDate);
      const startDate = startOfDay(filters.dateRange!.start);
      const endDate = endOfDay(filters.dateRange!.end);
      
      return !isBefore(taskDate, startDate) && !isAfter(taskDate, endDate);
    });
  }

  return filtered;
}

// Get tasks due soon for reminders
export function getTasksDueSoon(tasks: Task[], daysAhead: number = 2): Task[] {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + daysAhead);

  return tasks.filter(task => {
    const dueDate = task.dueDate;
    return task.status !== 'completed' && 
           !isBefore(dueDate, now) && 
           !isAfter(dueDate, endDate);
  });
}

// Check if task is overdue
export function isTaskOverdue(task: Task): boolean {
  return task.status !== 'completed' && isBefore(task.dueDate, new Date());
}

// Get task urgency indicator
export function getTaskUrgency(task: Task): 'overdue' | 'urgent' | 'upcoming' | 'normal' {
  if (isTaskOverdue(task)) return 'overdue';
  
  const hoursUntilDue = differenceInHours(task.dueDate, new Date());
  
  if (hoursUntilDue <= 24) return 'urgent';
  if (hoursUntilDue <= 72) return 'upcoming';
  
  return 'normal';
}

// Generate sample tasks for demo
export function generateSampleTasks(): Task[] {
  const now = new Date();
  const tasks: Task[] = [
    {
      id: '1',
      title: 'CS5011 Assignment 2 - Neural Networks',
      description: 'Implement a convolutional neural network for image classification',
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      priority: 'high',
      type: 'assignment',
      status: 'in-progress',
      courseCode: 'CS5011',
      courseName: 'Introduction to Machine Learning',
      estimatedHours: 15,
      tags: ['machine-learning', 'python', 'tensorflow'],
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      source: 'email',
    },
    {
      id: '2',
      title: 'IT5007 Midterm Exam',
      description: 'Software Engineering midterm covering requirements analysis and design patterns',
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      priority: 'high',
      type: 'exam',
      status: 'pending',
      courseCode: 'IT5007',
      courseName: 'Software Engineering on Modern Application Platforms',
      estimatedHours: 3,
      tags: ['exam', 'software-engineering'],
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      source: 'calendar',
    },
    {
      id: '3',
      title: 'CS5224 Group Project Presentation',
      description: 'Present our cloud computing project to the class',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      priority: 'medium',
      type: 'assignment',
      status: 'in-progress',
      courseCode: 'CS5224',
      courseName: 'Cloud Computing',
      estimatedHours: 8,
      tags: ['presentation', 'group-work', 'cloud'],
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      source: 'manual',
    },
    {
      id: '4',
      title: 'Register for Next Semester Courses',
      description: 'Course registration opens at 9 AM',
      dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      priority: 'high',
      type: 'deadline',
      status: 'pending',
      estimatedHours: 1,
      tags: ['registration', 'administrative'],
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'email',
    },
    {
      id: '5',
      title: 'CS5346 Lab Report 3',
      description: 'Information Retrieval lab on search algorithms',
      dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      priority: 'low',
      type: 'assignment',
      status: 'pending',
      courseCode: 'CS5346',
      courseName: 'Information Retrieval',
      estimatedHours: 6,
      tags: ['lab', 'algorithms', 'search'],
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      source: 'manual',
    },
  ];

  return tasks;
}
