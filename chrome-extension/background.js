// Background script for NUS Canvas Task Extractor
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'storeTasks') {
    // Store tasks in Chrome storage
    chrome.storage.local.get(['canvasTasks'], (result) => {
      const existingTasks = result.canvasTasks || [];
      const newTasks = message.tasks;
      
      // Merge tasks, avoiding duplicates
      const mergedTasks = [...existingTasks];
      newTasks.forEach(newTask => {
        const exists = existingTasks.some(existing => 
          existing.title === newTask.title && 
          existing.url === newTask.url
        );
        if (!exists) {
          mergedTasks.push(newTask);
        }
      });
      
      chrome.storage.local.set({ canvasTasks: mergedTasks }, () => {
        console.log('[Background] Stored tasks:', mergedTasks.length);
        
        // Auto-sync to AIMaster if enabled
        if (message.autoSync !== false) {
          syncToAIMaster(newTasks);
        }
        
        sendResponse({ success: true, count: mergedTasks.length });
      });
    });
    
    return true; // Keep message channel open for async response
  }
  
  if (message.action === 'syncToAIMaster') {
    // Manual sync request
    chrome.storage.local.get(['canvasTasks'], (result) => {
      const tasks = result.canvasTasks || [];
      syncToAIMaster(tasks);
      sendResponse({ success: true, synced: tasks.length });
    });
    
    return true;
  }
});

// Auto-sync function (defined here to be accessible)
async function syncToAIMaster(tasks) {
  const AIMASTER_CONFIG = {
    WEB_APP_URL: 'http://localhost:5173',
    API_ENDPOINT: '/api/import-tasks'
  };

  if (tasks.length === 0) return;

  try {
    const response = await fetch(`${AIMASTER_CONFIG.WEB_APP_URL}${AIMASTER_CONFIG.API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tasks: tasks,
        source: 'canvas-extension'
      })
    });

    if (response.ok) {
      console.log('[Background] Successfully synced to AIMaster');
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#059669' });
      
      setTimeout(() => chrome.action.setBadgeText({ text: '' }), 3000);
    }
  } catch (error) {
    console.error('[Background] Sync error:', error);
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
  }
}

// Optional: Clear old tasks periodically
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Background] NUS Canvas Task Extractor installed');
});
