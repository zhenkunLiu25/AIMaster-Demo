// Core types for the NUS Task Assistant
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskType = 'assignment' | 'exam' | 'meeting' | 'deadline' | 'other';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: TaskPriority;
  type: TaskType;
  status: TaskStatus;
  courseCode?: string;
  courseName?: string;
  estimatedHours?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  source: 'email' | 'calendar' | 'manual';
  reminderSettings?: ReminderSettings;
}

export interface ReminderSettings {
  enabled: boolean;
  advanceDays: number;
  advanceHours: number;
  reminderType: 'push' | 'email' | 'both';
}

export interface Course {
  id: string;
  code: string;
  name: string;
  color: string;
  professor?: string;
  credits?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  nusnetId: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultReminderDays: number;
  defaultReminderHours: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface EmailIntegrationSettings {
  connected: boolean;
  accessToken?: string;
  refreshToken?: string;
  lastSync?: Date;
}

export interface CalendarIntegrationSettings {
  google: {
    connected: boolean;
    accessToken?: string;
    refreshToken?: string;
  };
  outlook: {
    connected: boolean;
    accessToken?: string;
    refreshToken?: string;
  };
  lastSync?: Date;
}

export interface FilterOptions {
  course?: string;
  type?: TaskType;
  priority?: TaskPriority;
  status?: TaskStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}
