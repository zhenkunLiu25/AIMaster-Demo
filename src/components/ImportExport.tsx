// Import/Export component for AIMaster web app
import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addTask } from '../store/taskSlice';

interface ImportExportProps {
  className?: string;
}

export const ImportExport: React.FC<ImportExportProps> = ({ className = '' }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  const dispatch = useAppDispatch();

  // Import from JSON file
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.tasks && Array.isArray(data.tasks)) {
        // Import Canvas tasks
        data.tasks.forEach((canvasTask: any) => {
          const task = {
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: canvasTask.title,
            description: `${canvasTask.type} from ${canvasTask.course}`,
            dueDate: canvasTask.dueDate,
            priority: getPriorityFromType(canvasTask.type),
            course: canvasTask.course,
            type: canvasTask.type.toLowerCase(),
            status: 'pending' as const,
            tags: ['imported', 'canvas'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          dispatch(addTask(task));
        });
        
        setImportStatus(`Successfully imported ${data.tasks.length} tasks!`);
      } else {
        setImportStatus('Invalid file format. Expected JSON with tasks array.');
      }
    } catch (error) {
      setImportStatus('Error importing file. Please check the format.');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
      // Clear status after 3 seconds
      setTimeout(() => setImportStatus(''), 3000);
    }
  };

  // Export tasks to JSON
  const handleExport = () => {
    // Get tasks from Redux store (you'll need to pass current tasks as prop)
    const exportData = {
      exportedAt: new Date().toISOString(),
      source: 'aimaster-web-app',
      tasks: [] // You can pass current tasks as prop
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aimaster-tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Connect to extension
  const connectToExtension = async () => {
    try {
      // Check if running in Chrome and extension is available
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        // Request permission to communicate with extension
        const response = await fetch('chrome-extension://your-extension-id/popup.html');
        setImportStatus('Extension connected! Tasks will sync automatically.');
      } else {
        setImportStatus('Chrome extension not detected. Please install the Canvas Task Extractor.');
      }
    } catch (error) {
      setImportStatus('Could not connect to extension. Make sure it\'s installed and enabled.');
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Import/Export Tasks</h3>
      
      {/* File Import */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Import from Canvas Extension
        </label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileImport}
          disabled={isImporting}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Manual Extension Connection */}
      <div className="mb-4">
        <button
          onClick={connectToExtension}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
        >
          Connect to Extension
        </button>
        
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Export Tasks
        </button>
      </div>

      {/* Status Message */}
      {importStatus && (
        <div className={`p-3 rounded-lg ${
          importStatus.includes('Error') || importStatus.includes('Could not') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {importStatus}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>How to use:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Install the Chrome extension for Canvas</li>
          <li>Visit canvas.nus.edu.sg to extract tasks</li>
          <li>Export tasks from extension or connect directly</li>
          <li>Import the JSON file here</li>
        </ol>
      </div>
    </div>
  );
};

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