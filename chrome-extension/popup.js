document.addEventListener('DOMContentLoaded', () => {
  const tasksContainer = document.getElementById('tasks');
  const taskCount = document.getElementById('taskCount');
  const refreshBtn = document.getElementById('refreshBtn');
  const syncBtn = document.getElementById('syncBtn');
  const clearBtn = document.getElementById('clearBtn');
  const selectionControls = document.getElementById('selectionControls');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const selectNoneBtn = document.getElementById('selectNoneBtn');
  const selectedCount = document.getElementById('selectedCount');

  function updateSelectedCount() {
    const selectedCheckboxes = document.querySelectorAll('.task-select:checked:not(:disabled)');
    const totalCheckboxes = document.querySelectorAll('.task-select:not(:disabled)');
    
    selectedCount.textContent = `${selectedCheckboxes.length} of ${totalCheckboxes.length} selected`;
    
    // Update sync button text
    if (selectedCheckboxes.length === 0) {
      syncBtn.textContent = 'Select Tasks to Sync';
      syncBtn.disabled = true;
    } else {
      syncBtn.textContent = `Sync ${selectedCheckboxes.length} Selected`;
      syncBtn.disabled = false;
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function cleanText(text) {
    if (!text) return '';
    return text
      .replace(/[📚📅🔒📝→]/g, '') // Remove common emojis
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

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
    // Ensure tasks is an array and clean
    const cleanTasks = Array.isArray(tasks) ? tasks.filter(task => task && task.title) : [];
    taskCount.textContent = cleanTasks.length;
    
    if (cleanTasks.length === 0) {
      tasksContainer.innerHTML = `
        <div class="no-tasks">
          <p>No tasks found yet.</p>
          <p>Visit canvas.nus.edu.sg to extract tasks automatically.</p>
        </div>
      `;
      selectionControls.style.display = 'none';
      return;
    }

    // Show selection controls if we have tasks
    selectionControls.style.display = 'flex';

    // Sort tasks by due date
    const sortedTasks = cleanTasks.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    tasksContainer.innerHTML = sortedTasks.map((task, index) => {
      // Clean up the title and extract meaningful information
      let cleanTitle = cleanText(task.title || 'Untitled Task');
      let courseInfo = cleanText(task.course || '');
      let dueInfo = cleanText(task.dueDate || '');
      
      // Handle complex title formats from Canvas
      if (cleanTitle.includes('Assignments:')) {
        const parts = cleanTitle.split('Assignments:');
        if (parts.length > 1) {
          courseInfo = parts[1].trim();
          cleanTitle = parts[0].trim();
          // If title is empty after split, use "Assignment" as default
          if (!cleanTitle || cleanTitle === '') {
            cleanTitle = 'Assignment';
          }
        }
      }
      
      // Clean up course info - remove course codes in brackets
      if (courseInfo.includes('[') && courseInfo.includes(']')) {
        courseInfo = courseInfo.split('[')[0].trim();
      }
      
      // Clean up due date info
      if (dueInfo.includes('Available until')) {
        dueInfo = dueInfo.replace('Available until', 'Due:').trim();
      }
      
      // Remove duplicate date strings (e.g., "28 Sep at 23:59 28 Sep at 23:59")
      const datePattern = /(\d{1,2} \w{3} at \d{2}:\d{2})/g;
      const dateMatches = dueInfo.match(datePattern);
      if (dateMatches && dateMatches.length > 1) {
        dueInfo = dateMatches[0]; // Use only the first occurrence
      }
      
      // Determine status
      let statusClass = '';
      let statusText = '';
      let isDisabled = false;
      if (dueInfo.toLowerCase().includes('closed')) {
        statusClass = 'status-closed';
        statusText = 'CLOSED';
        dueInfo = 'Submission Closed';
        isDisabled = true; // Don't allow syncing closed assignments
      } else if (dueInfo && !dueInfo.toLowerCase().includes('closed')) {
        statusClass = 'status-active';
        statusText = 'ACTIVE';
      }
      
      return `
        <div class="task-item ${statusClass}">
          <div class="task-header">
            <div class="task-checkbox">
              <input type="checkbox" id="task-${index}" class="task-select" 
                     data-task-index="${index}" ${isDisabled ? 'disabled' : 'checked'}>
              <label for="task-${index}" class="task-title">${escapeHtml(cleanTitle)}</label>
            </div>
            ${statusText ? `<span class="task-status">${statusText}</span>` : ''}
          </div>
          <div class="task-meta">
            <span class="task-type" style="color: ${getTaskTypeColor(task.type)}; font-weight: 600;">${escapeHtml(task.type || 'Assignment')}</span>
            ${task.courseCode ? `<span class="task-course-code" style="background: #4F46E5; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">${escapeHtml(task.courseCode)}</span>` : ''}
            ${task.courseTitle ? `<span class="task-course-title">${escapeHtml(task.courseTitle)}</span>` : (courseInfo ? `<span class="task-course">${escapeHtml(courseInfo)}</span>` : '')}
            ${task.score ? `<span class="task-score" style="color: ${task.score.percentage ? (task.score.percentage >= 80 ? '#059669' : task.score.percentage >= 60 ? '#f59e0b' : '#dc2626') : '#6b7280'};">${escapeHtml(task.score.display)}</span>` : ''}
            ${task.gradeStatus ? `<span class="task-grade-status" style="color: #6b7280; font-size: 10px;">${escapeHtml(task.gradeStatus)}</span>` : ''}
          </div>
          ${dueInfo ? `<div class="task-due">${escapeHtml(dueInfo)}</div>` : ''}
          ${task.url ? `<div class="task-link"><a href="${escapeHtml(task.url)}" target="_blank">Open in Canvas</a></div>` : ''}
        </div>
      `;
    }).join('');
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.task-select').forEach(checkbox => {
      checkbox.addEventListener('change', updateSelectedCount);
    });
    
    // Initial count update
    setTimeout(updateSelectedCount, 100);
  }

  function loadTasks() {
    tasksContainer.innerHTML = '<div class="loading">Loading tasks...</div>';
    taskCount.textContent = '0'; // Reset count while loading
    
    chrome.storage.local.get(['canvasTasks'], (result) => {
      const tasks = result.canvasTasks || [];
      console.log('[Popup] Loaded tasks from storage:', tasks);
      renderTasks(tasks);
    });
  }

  function refreshTasks() {
    // Trigger content script to re-extract tasks
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('canvas.nus.edu.sg')) {
        console.log('[Popup] Triggering task extraction on Canvas page');
        
        // Execute the simple extractor
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['simple-extractor.js']
        });
        
        setTimeout(loadTasks, 2000); // Reload after extraction
      } else {
        console.log('[Popup] Not on Canvas page, just reloading stored tasks');
        loadTasks(); // Just reload stored tasks
      }
    });
  }

  // Event listeners
  selectAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.task-select:not(:disabled)').forEach(checkbox => {
      checkbox.checked = true;
    });
    updateSelectedCount();
  });
  
  selectNoneBtn.addEventListener('click', () => {
    document.querySelectorAll('.task-select').forEach(checkbox => {
      checkbox.checked = false;
    });
    updateSelectedCount();
  });
  
  refreshBtn.addEventListener('click', refreshTasks);
  
  syncBtn.addEventListener('click', () => {
    // Get selected tasks
    const selectedTasks = [];
    const checkboxes = document.querySelectorAll('.task-select:checked:not(:disabled)');
    
    if (checkboxes.length === 0) {
      alert('Please select at least one task to sync!');
      return;
    }
    
    // Get the current tasks from storage
    chrome.storage.local.get(['canvasTasks'], (result) => {
      const allTasks = result.canvasTasks || [];
      
      checkboxes.forEach(checkbox => {
        const taskIndex = parseInt(checkbox.dataset.taskIndex);
        if (allTasks[taskIndex]) {
          selectedTasks.push(allTasks[taskIndex]);
        }
      });
      
      if (selectedTasks.length === 0) {
        alert('No valid tasks selected!');
        return;
      }
      
      const originalText = syncBtn.textContent;
      syncBtn.textContent = `Syncing ${selectedTasks.length} tasks...`;
      syncBtn.disabled = true;
      
      // Send selected tasks to background script
      chrome.runtime.sendMessage({ 
        action: 'syncToAIMaster',
        selectedTasks: selectedTasks
      }, (response) => {
        syncBtn.disabled = false;
        if (response?.success) {
          syncBtn.textContent = '✅ Synced!';
          setTimeout(() => {
            syncBtn.textContent = originalText;
            updateSelectedCount(); // Restore proper button state
          }, 2000);
          alert(`Successfully synced ${response.synced} selected tasks to AIMaster!`);
        } else {
          syncBtn.textContent = '❌ Failed';
          setTimeout(() => {
            syncBtn.textContent = originalText;
            updateSelectedCount(); // Restore proper button state
          }, 2000);
          alert(`Sync failed: ${response?.error || 'Make sure AIMaster is running at localhost:5173'}`);
        }
      });
    });
  });
  
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all stored tasks?')) {
      chrome.storage.local.clear(() => {
        console.log('[Popup] Cleared all storage');
        loadTasks();
      });
    }
  });

  // Initial load
  loadTasks();

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.canvasTasks) {
      renderTasks(changes.canvasTasks.newValue || []);
    }
  });
});
