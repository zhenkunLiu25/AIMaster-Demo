// Popup script for NUS Canvas Task Extractor
document.addEventListener('DOMContentLoaded', () => {
  const tasksContainer = document.getElementById('tasks');
  const taskCount = document.getElementById('taskCount');
  const refreshBtn = document.getElementById('refreshBtn');

  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      // Try parsing as ISO date first
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          return `${Math.abs(diffDays)} days overdue`;
        } else if (diffDays === 0) {
          return 'Due today!';
        } else if (diffDays === 1) {
          return 'Due tomorrow';
        } else if (diffDays <= 7) {
          return `Due in ${diffDays} days`;
        } else {
          return date.toLocaleDateString();
        }
      }
    } catch {
      // If parsing fails, return the original string
    }
    return dateString;
  }

  function getTaskTypeColor(type) {
    const colors = {
      'Midterm': '#dc2626',        // Red - high priority
      'Final Exam': '#dc2626',     // Red - high priority
      'Exam': '#dc2626',           // Red - high priority
      'Quiz': '#f59e0b',           // Orange - medium priority
      'Project': '#059669',        // Green - ongoing work
      'Assignment': '#4f46e5',     // Blue - regular work
      'Lab': '#7c3aed',            // Purple - practical work
      'Discussion': '#6b7280'      // Gray - participation
    };
    return colors[type] || '#6b7280';
  }

  function renderTasks(tasks) {
    taskCount.textContent = tasks.length;
    
    if (tasks.length === 0) {
      tasksContainer.innerHTML = `
        <div class="no-tasks">
          <p>No tasks found yet.</p>
          <p>Visit canvas.nus.edu.sg to extract tasks automatically.</p>
        </div>
      `;
      return;
    }

    // Sort tasks by due date
    const sortedTasks = tasks.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    tasksContainer.innerHTML = sortedTasks.map(task => `
      <div class="task-item">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">
          <span class="task-type" style="color: ${getTaskTypeColor(task.type)}; font-weight: 600;">${task.type}</span>
          ${task.course ? `<span class="task-course">📚 ${task.course}</span>` : ''}
          ${task.dueDate ? `<span class="task-due">📅 ${formatDate(task.dueDate)}</span>` : ''}
        </div>
      </div>
    `).join('');
  }

  function loadTasks() {
    tasksContainer.innerHTML = '<div class="loading">Loading tasks...</div>';
    
    chrome.storage.local.get(['canvasTasks'], (result) => {
      const tasks = result.canvasTasks || [];
      renderTasks(tasks);
    });
  }

  function refreshTasks() {
    // Trigger content script to re-extract tasks
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('canvas.nus.edu.sg')) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['contentScript.js']
        });
        
        setTimeout(loadTasks, 1000); // Reload after extraction
      } else {
        loadTasks(); // Just reload stored tasks
      }
    });
  }

  // Event listeners
  refreshBtn.addEventListener('click', refreshTasks);

  // Add sync button functionality
  const syncBtn = document.createElement('button');
  syncBtn.textContent = 'Sync to AIMaster';
  syncBtn.className = 'refresh-btn';
  syncBtn.style.marginLeft = '4px';
  syncBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'syncToAIMaster' }, (response) => {
      if (response?.success) {
        alert(`Synced ${response.synced} tasks to AIMaster!`);
      }
    });
  });
  
  refreshBtn.parentNode.insertBefore(syncBtn, refreshBtn.nextSibling);

  // Initial load
  loadTasks();

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.canvasTasks) {
      renderTasks(changes.canvasTasks.newValue || []);
    }
  });
});
