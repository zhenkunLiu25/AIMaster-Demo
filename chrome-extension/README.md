# NUS Canvas Task Extractor Chrome Extension

A Chrome extension that automatically extracts assignments, quizzes, and exams from canvas.nus.edu.sg for better task management.

## Features

- 🎯 **Automatic Task Extraction**: Extracts tasks from Canvas dashboard, course pages, and calendar views
- 📅 **Due Date Detection**: Captures due dates and course information
- 💾 **Local Storage**: Stores extracted tasks locally in Chrome storage
- 🔄 **Real-time Updates**: Monitors page changes for new tasks
- 📱 **Clean UI**: Simple popup interface to view all extracted tasks

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" 
4. Select the `chrome-extension` folder from this project
5. The extension should now appear in your Chrome toolbar

## Usage

1. Navigate to `canvas.nus.edu.sg` and log in
2. Visit your dashboard, course pages, or calendar
3. The extension automatically extracts tasks in the background
4. Click the extension icon to view extracted tasks
5. Use the refresh button to manually re-extract tasks

## Files Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── contentScript.js       # Extracts tasks from Canvas pages
├── background.js          # Handles storage and messaging
├── popup.html            # Extension popup interface
├── popup.js              # Popup logic and UI handling
├── icon16.svg            # Extension icon (16x16)
├── icon48.svg            # Extension icon (48x48)
└── icon128.svg           # Extension icon (128x128)
```

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon for "NUS Canvas Task Extractor"
4. Test your changes on canvas.nus.edu.sg

## Troubleshooting

- **No tasks showing**: Make sure you're on canvas.nus.edu.sg and refresh the page
- **Extension not loading**: Check for console errors in `chrome://extensions/`
- **Tasks not updating**: Click the refresh button in the popup

## Privacy

This extension only works on canvas.nus.edu.sg and stores data locally in your browser. No data is sent to external servers.