# NUS Student Task Assistant MVP

A comprehensive web application designed to help NUS students manage their academic tasks, assignments, exams, and deadlines in one unified dashboard with intelligent prioritization and smart reminders.

## 🎯 Problem Statement

NUS students constantly juggle assignments, project deadlines, exams, and admin tasks spread across emails, learning portals, and chat groups. Important dates are buried in messages or scattered across calendars, making it hard to know what to do first. This fragmentation leads to stress, overlooked tasks, and poor prioritization.

## 💡 Solution

Create a single-source-of-truth task assistant that securely connects to NUS email and calendars, automatically extracts and consolidates tasks, and applies smart prioritization. The platform presents all upcoming assignments, exams, and events in one clean dashboard and sends proactive reminders—helping students stay organized and focus on the most urgent work.

## ✨ Features

### 🟢 Core Features (MVP)

1. **Smart Task Extraction**
   - Secure email integration (Microsoft Graph for NUS Outlook)
   - NLP to identify assignments, exams, and key deadlines automatically
   - Manual task creation with rich metadata

2. **Unified Task Dashboard**
   - Central list of tasks from email, calendar, and manual input
   - Categories by course/module and task type (assignment, exam, meeting)
   - Quick search and filtering capabilities
   - Visual urgency indicators with color coding

3. **Intelligent Prioritization**
   - Ranking engine based on due date, workload, and user preferences
   - Automatic priority calculation considering task types and deadlines
   - Smart sorting algorithm for optimal task ordering

4. **Reminders & Notifications**
   - Customizable push/email alerts
   - Smart reminders (e.g., "Start Assignment X two days early based on workload")
   - Proactive deadline warnings

5. **Calendar Integration**
   - Two-way sync with NUS and personal calendars (Google, iCal)
   - Drag-and-drop scheduling
   - Visual timeline view

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Docker (optional, for containerized deployment)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd nus-task-assistant
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - The app will load with sample data for demonstration

### Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Navigate to `http://localhost:3000`

3. **Production deployment:**
   ```bash
   docker build -t nus-task-assistant .
   docker run -p 3000:80 nus-task-assistant
   ```

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety and modern development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, utility-first styling
- **Redux Toolkit** for predictable state management
- **React DnD** for drag-and-drop functionality
- **Heroicons** for consistent iconography
- **date-fns** for date manipulation and formatting

### Infrastructure
- **Docker** for containerization and easy deployment
- **Nginx** for production web serving with optimizations
- **LocalStorage** for MVP data persistence (upgradeable to cloud databases)

## 📱 User Interface

### Dashboard Features
- **Task Cards**: Rich task display with priority indicators, due dates, and course information
- **Smart Filtering**: Search by text, filter by course, type, priority, and status
- **Visual Indicators**: Color-coded priority levels and urgency warnings
- **Quick Actions**: One-click status updates and priority changes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📈 Roadmap

### Phase 1 (Current MVP)
- [x] Basic task management and dashboard
- [x] Smart prioritization algorithm
- [x] Responsive UI with filtering and search
- [x] Docker containerization
- [ ] Email integration setup
- [ ] Calendar integration setup

### Phase 2 (Enhanced Features)
- [ ] Real-time notifications
- [ ] Advanced filtering and analytics
- [ ] Export/import functionality
- [ ] Progressive Web App features
- [ ] Mobile-optimized interface

## 🎓 Academic Context

This project is developed as part of the NUS Master of Computing program, specifically for IT5007 (Software Engineering on Modern Application Platforms). It demonstrates modern web development practices, software engineering principles, and addresses real-world problems faced by NUS students.

---

Made with ❤️ for the NUS student community
