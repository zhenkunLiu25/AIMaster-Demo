# AIMaster

A modern, comprehensive AI-powered task management application. This application helps users organize their work, track assignments, manage deadlines, and stay on top of their responsibilities with intelligent automation and insights.

## Features

### 📊 Dashboard
- **Overview Statistics**: Track pending tasks, due this week, completed tasks, and projects
- **Priority Task Management**: View and manage tasks by priority with visual indicators
- **Advanced Filtering**: Filter by project, type, priority, and sort by different criteria
- **Search Functionality**: Quickly find tasks with real-time search
- **Upcoming Deadlines**: Visual calendar preview of upcoming due dates

### 📅 Calendar View
- **Monthly Calendar**: Visual representation of all tasks and deadlines
- **Daily Task Overview**: See today's tasks at a glance
- **Color-coded Priority**: Tasks displayed with priority-based colors
- **Interactive Navigation**: Easy month-to-month navigation

### ✉️ Inbox
- **Notifications Hub**: Centralized location for all important notifications
- **Project Announcements**: Stay updated with project-specific information
- **Task Notifications**: Get notified when tasks are updated or completed
- **Deadline Reminders**: Automatic reminders for approaching deadlines

### ⚙️ Settings
- **Profile Management**: Update personal information and avatar
- **Notification Preferences**: Customize email and push notifications
- **Appearance Settings**: Dark mode and compact view options
- **Privacy Controls**: Manage data sharing and profile visibility
- **Data Export**: Export your data or delete your account

### 🎯 Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Progress Tracking**: Visual progress bars for each task
- **Priority Levels**: High, medium, and low priority assignments
- **Project Organization**: Organize tasks by project with color coding
- **Tag System**: Add custom tags for better organization
- **Due Date Management**: Set and track due dates with smart formatting

## Technology Stack

- **Frontend**: React 18 with Hooks
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **State Management**: React Context API
- **Data Persistence**: Local Storage

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.jsx       # Top navigation bar
│   ├── Layout.jsx       # Main layout wrapper
│   ├── Sidebar.jsx      # Navigation sidebar
│   ├── TaskCard.jsx     # Individual task display
│   └── TaskModal.jsx    # Task creation/editing modal
├── context/             # React context providers
│   └── TaskContext.jsx  # Global state management
├── pages/               # Main application pages
│   ├── Calendar.jsx     # Calendar view
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Inbox.jsx        # Notifications inbox
│   └── Settings.jsx     # User settings
├── styles/              # CSS and styling
│   └── index.css        # Global styles and Tailwind
├── utils/               # Utility functions
│   ├── colors.js        # Color utilities
│   └── dateUtils.js     # Date formatting utilities
├── App.jsx              # Main application component
└── main.jsx             # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository** (or navigate to your project directory)
   ```bash
   cd DeepSite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features Explained

### State Management
The application uses React Context API for global state management, providing:
- Task CRUD operations
- Filter and search functionality
- User preferences
- Course management
- Persistent data storage

### Responsive Design
Built with mobile-first approach using Tailwind CSS:
- Responsive sidebar that collapses on mobile
- Adaptive grid layouts
- Touch-friendly interactions
- Optimized for various screen sizes

### Data Persistence
- Automatic saving to browser localStorage
- Data persistence across sessions
- Export functionality for backup
- Clean data structure for easy migration

### Performance Optimizations
- Lazy loading of components
- Memoized calculations for filtered data
- Efficient re-rendering with React hooks
- Optimized bundle size with Vite

## Customization

### Adding New Projects
Projects can be added through the TaskContext or via the UI. Each project has:
- Unique ID
- Display name
- Color for visual identification

### Extending Task Types
The application supports various task types:
- Assignments
- Exams
- Projects
- Quizzes
- Reading tasks

New types can be added by updating the TaskModal component.

### Theme Customization
Colors and styling can be customized through:
- `tailwind.config.js` for global theme settings
- `src/utils/colors.js` for component-specific colors
- `src/styles/index.css` for custom CSS classes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- **Backend Integration**: Connect to a real backend API
- **Real-time Sync**: Multi-device synchronization
- **Collaboration Features**: Team project management
- **Advanced Analytics**: Study pattern analysis
- **Mobile App**: React Native companion app
- **Integration**: Canvas/LMS integration
- **AI Features**: Smart deadline suggestions
- **Offline Support**: PWA capabilities

## Support

For questions, issues, or suggestions, please create an issue in the repository or contact the development team.

---

Built with ❤️ for productivity enthusiasts by the AIMaster team.