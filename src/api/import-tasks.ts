// API endpoint to receive tasks from Chrome extension
import { Task } from '../types';

// Simple in-memory store (replace with actual database/Redux in production)
let receivedTasks: Task[] = [];

export default function handler(req: any, res: any) {
  // Enable CORS for Chrome extension
  res.setHeader('Access-Control-Allow-Origin', 'chrome-extension://*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { tasks, source } = req.body;
      
      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: 'Invalid tasks data' });
      }

      // Transform Canvas tasks to AIMaster format
      const transformedTasks = tasks.map((canvasTask: any) => {
        // Build description with enhanced course and score info
        let description = `${canvasTask.type}`;
        
        // Add course information
        if (canvasTask.courseCode && canvasTask.courseTitle) {
          description += ` from ${canvasTask.courseCode}: ${canvasTask.courseTitle}`;
        } else if (canvasTask.course) {
          description += ` from ${canvasTask.course}`;
        }
        
        // Add score information
        if (canvasTask.score) {
          description += ` | Score: ${canvasTask.score.display}`;
          if (canvasTask.score.percentage !== null && canvasTask.score.percentage !== undefined) {
            description += ` (${canvasTask.score.percentage}%)`;
          }
        }
        
        // Add grade status
        if (canvasTask.gradeStatus) {
          description += ` | Status: ${canvasTask.gradeStatus}`;
        }
        
        return {
          id: `canvas-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: canvasTask.title,
          description: description,
          dueDate: canvasTask.dueDate,
          priority: getPriorityFromType(canvasTask.type),
          course: canvasTask.courseCode || canvasTask.course || 'Unknown Course',
          type: canvasTask.type.toLowerCase(),
          status: canvasTask.gradeStatus?.toLowerCase().includes('graded') ? 'completed' : 'pending',
          source: 'manual' as const,
          tags: canvasTask.courseCode ? [canvasTask.courseCode] : [],
          createdAt: new Date(),
          updatedAt: new Date(),
          // Include enhanced Canvas data for reference  
          canvasData: {
            score: canvasTask.score,
            gradeStatus: canvasTask.gradeStatus,
            courseCode: canvasTask.courseCode,
            courseTitle: canvasTask.courseTitle,
            originalUrl: canvasTask.url,
            extractedAt: canvasTask.extractedAt
          }
        } as Task;
      });

      // Store tasks (in production, save to database)
      receivedTasks.push(...transformedTasks);
      
      res.status(200).json({ 
        success: true, 
        message: `Imported ${transformedTasks.length} tasks`,
        tasks: transformedTasks
      });
      
    } catch (error) {
      console.error('Error importing tasks:', error);
      res.status(500).json({ error: 'Failed to import tasks' });
    }
  } 
  else if (req.method === 'GET') {
    // Return imported tasks
    res.status(200).json({ tasks: receivedTasks });
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

function getPriorityFromType(type: string): 'low' | 'medium' | 'high' | 'urgent' {
  const typeMap: { [key: string]: 'low' | 'medium' | 'high' | 'urgent' } = {
    'midterm': 'urgent',
    'final exam': 'urgent',
    'exam': 'high',
    'quiz': 'medium',
    'project': 'high',
    'assignment': 'medium',
    'lab': 'low',
    'discussion': 'low'
  };
  
  return typeMap[type.toLowerCase()] || 'medium';
}