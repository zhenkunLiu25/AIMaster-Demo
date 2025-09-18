// Extension configuration for AIMaster integration
const AIMASTER_CONFIG = {
  // Change this to your actual AIMaster web app URL
  WEB_APP_URL: 'http://localhost:5173',  // Development URL
  // WEB_APP_URL: 'https://your-aimaster-app.vercel.app',  // Production URL
  
  API_ENDPOINT: '/api/import-tasks',
  AUTO_SYNC: true,  // Set to false for manual sync only
  SYNC_INTERVAL: 5 * 60 * 1000  // 5 minutes
};

// Function to send tasks to AIMaster web app
async function syncToAIMaster(tasks) {
  if (!AIMASTER_CONFIG.AUTO_SYNC || tasks.length === 0) {
    return;
  }

  try {
    const response = await fetch(`${AIMASTER_CONFIG.WEB_APP_URL}${AIMASTER_CONFIG.API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tasks: tasks,
        source: 'canvas-extension',
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('[AIMaster Sync] Successfully synced tasks:', result.message);
      
      // Update extension badge with sync status
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#059669' });
      
      // Clear badge after 3 seconds
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 3000);
      
    } else {
      console.error('[AIMaster Sync] Failed to sync tasks:', response.statusText);
      chrome.action.setBadgeText({ text: '✗' });
      chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
    }
  } catch (error) {
    console.error('[AIMaster Sync] Error syncing to AIMaster:', error);
    chrome.action.setBadgeText({ text: '✗' });
    chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
  }
}

// Export for use in other extension files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIMASTER_CONFIG, syncToAIMaster };
}