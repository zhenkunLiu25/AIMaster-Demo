# 🚀 AIMaster x Canvas Extension - Automation Guide

## 🎯 **Automated Data Flow Overview**

Your Chrome extension now automatically extracts tasks from Canvas and syncs them to your AIMaster web app!

## 📋 **How It Works**

### **1. Automatic Extraction**
- Extension monitors canvas.nus.edu.sg for tasks
- Captures assignments, exams, quizzes, projects with due dates
- Intelligently identifies task types and course names

### **2. Automated Sync Options**

#### **Option A: Direct API Sync (Real-time)**
```mermaid
Canvas Page → Extension → HTTP POST → AIMaster API → Redux Store
```

#### **Option B: Manual Export/Import**
```mermaid
Canvas Page → Extension → JSON Export → File Download → Manual Import → AIMaster
```

## 🛠 **Setup Instructions**

### **Step 1: Install & Configure Extension**
1. Load extension in Chrome: `chrome://extensions/` → "Load unpacked"
2. Select the `chrome-extension` folder
3. Visit canvas.nus.edu.sg to start extracting tasks

### **Step 2: Configure AIMaster Web App**
1. Start your development server: `npm run dev`
2. The extension will auto-sync to `http://localhost:5173`
3. For production, update `WEB_APP_URL` in `aimaster-sync.js`

### **Step 3: Test the Automation**
1. Visit Canvas and navigate through courses
2. Check extension popup for extracted tasks
3. Click "Sync to AIMaster" button for manual sync
4. Automatic sync happens every 5 minutes

## 🔧 **Configuration**

### **Extension Settings** (`aimaster-sync.js`)
```javascript
const AIMASTER_CONFIG = {
  WEB_APP_URL: 'http://localhost:5173',  // Change for production
  AUTO_SYNC: true,                       // Enable/disable auto-sync
  SYNC_INTERVAL: 5 * 60 * 1000          // 5 minutes
};
```

### **API Endpoint** (`/src/api/import-tasks.ts`)
- Receives POST requests with Canvas task data
- Transforms to AIMaster format
- Maps task types to priorities
- Handles CORS for Chrome extension

## 📊 **Data Transformation**

### **Canvas Task Format**
```json
{
  "title": "Assignment 1: Data Structures",
  "dueDate": "2025-09-25T23:59:00.000Z",
  "course": "CS2040S Data Structures",
  "type": "Assignment",
  "url": "https://canvas.nus.edu.sg/...",
  "extractedAt": "2025-09-18T..."
}
```

### **AIMaster Task Format**
```json
{
  "id": "canvas-1726681234-abc123",
  "title": "Assignment 1: Data Structures", 
  "description": "Assignment from CS2040S Data Structures",
  "dueDate": "2025-09-25T23:59:00.000Z",
  "priority": "medium",
  "course": "CS2040S Data Structures",
  "status": "pending",
  "tags": ["imported", "canvas"],
  "source": "canvas-extension"
}
```

## 🎨 **Priority Mapping**
- **Urgent**: Midterms, Final Exams
- **High**: Exams, Projects  
- **Medium**: Assignments, Quizzes
- **Low**: Labs, Discussions

## 🔍 **Visual Indicators**
- **✓ Green Badge**: Successful sync
- **✗ Red Badge**: Sync error
- **! Orange Badge**: Connection issue

## 🚨 **Troubleshooting**

### **Common Issues**
1. **CORS Error**: Make sure AIMaster web app is running on `localhost:5173`
2. **No Tasks Found**: Check Canvas page has assignments/tasks visible
3. **Sync Failed**: Verify network connection and API endpoint

### **Debug Steps**
1. Open Chrome DevTools → Console
2. Look for `[AIMaster Sync]` messages
3. Check Network tab for API calls
4. Verify extension permissions

## 🎉 **Success!**
Once set up, your workflow becomes:
1. Visit Canvas courses → Tasks automatically extracted
2. Extension syncs to AIMaster → Tasks appear in your dashboard
3. Manage everything in one place → AIMaster web app

No more manual copying of assignments and due dates! 🚀