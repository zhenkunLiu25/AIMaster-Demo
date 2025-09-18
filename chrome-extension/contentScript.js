// Content script to extract assignments, quizzes, and exams from Canvas
(function() {
  console.log('[NUS Canvas Task Extractor] Content script loaded on:', window.location.href);

  function extractTasks() {
    const tasks = [];
    
    // Helper function to determine task type from title and context
    function determineTaskType(title, context) {
      const titleLower = title.toLowerCase();
      const contextLower = (context || '').toLowerCase();
      
      // Check for midterm variations
      if (titleLower.includes('midterm') || titleLower.includes('mid-term') || 
          titleLower.includes('mid term') || titleLower.includes('mt ') ||
          titleLower.includes(' mt') || titleLower.includes('midtest')) {
        return 'Midterm';
      }
      
      // Check for final exam variations
      if ((titleLower.includes('final') && (titleLower.includes('exam') || titleLower.includes('test'))) ||
          titleLower.includes('finals')) {
        return 'Final Exam';
      }
      
      // Check for general exam variations
      if (titleLower.includes('exam') || titleLower.includes('test') || 
          titleLower.includes('examination') || titleLower.match(/\bca\d+/)) { // CA1, CA2, etc.
        return 'Exam';
      }
      
      // Check for quiz variations
      if (titleLower.includes('quiz') || titleLower.includes('pop quiz') ||
          titleLower.includes('mini test') || titleLower.includes('short test')) {
        return 'Quiz';
      }
      
      // Check for project variations
      if (titleLower.includes('project') || titleLower.includes('presentation') ||
          titleLower.includes('group work') || titleLower.includes('team work') ||
          titleLower.includes('final submission') || titleLower.includes('capstone') ||
          titleLower.includes('portfolio') || titleLower.includes('report')) {
        return 'Project';
      }
      
      // Check for assignment variations
      if (titleLower.includes('assignment') || titleLower.includes('homework') || 
          titleLower.includes('hw') || titleLower.includes('exercise') ||
          titleLower.includes('task') || titleLower.includes('problem set') ||
          titleLower.includes('ps') || titleLower.match(/\ba\d+/) || // A1, A2, etc.
          titleLower.match(/assignment\s*\d+/) || titleLower.match(/hw\s*\d+/)) {
        return 'Assignment';
      }
      
      // Check for lab variations
      if (titleLower.includes('lab') || titleLower.includes('laboratory') ||
          titleLower.includes('practical') || titleLower.match(/lab\s*\d+/)) {
        return 'Lab';
      }
      
      // Check for discussion/tutorial variations
      if (titleLower.includes('discussion') || titleLower.includes('tutorial') ||
          titleLower.includes('seminar') || titleLower.includes('workshop')) {
        return 'Discussion';
      }
      
      // Check context if title doesn't give clear indication
      if (contextLower.includes('quiz')) {
        return 'Quiz';
      }
      if (contextLower.includes('assignment') || contextLower.includes('homework')) {
        return 'Assignment';
      }
      if (contextLower.includes('exam') || contextLower.includes('test')) {
        return 'Exam';
      }
      if (contextLower.includes('project')) {
        return 'Project';
      }
      
      // Default based on common patterns
      if (titleLower.match(/\d+/) && titleLower.length < 20) {
        return 'Assignment'; // Short titles with numbers are likely assignments
      }
      
      return 'Assignment'; // Default fallback
    }

    // Helper function to extract course name from various sources
    function extractCourseName() {
      // Try to get course name from page title
      let courseName = null;
      
      // Method 1: From URL path (e.g., /courses/12345)
      const urlMatch = window.location.pathname.match(/\/courses\/(\d+)/);
      if (urlMatch) {
        // Look for course name in breadcrumbs or page title
        const breadcrumb = document.querySelector('.ic-app-course-nav .course-title, .course-title, .course-name');
        if (breadcrumb) {
          courseName = breadcrumb.textContent.trim();
        }
      }
      
      // Method 2: From page title
      if (!courseName && document.title) {
        const titleMatch = document.title.match(/^([^:]+):/);
        if (titleMatch && !titleMatch[1].includes('Canvas')) {
          courseName = titleMatch[1].trim();
        }
      }
      
      // Method 3: From course navigation
      if (!courseName) {
        const courseNav = document.querySelector('#course_home_content h1, .course-title, .context-name');
        if (courseNav) {
          courseName = courseNav.textContent.trim();
        }
      }
      
      // Method 4: From course code in navigation
      if (!courseName) {
        const courseCode = document.querySelector('.course-code, [data-course-id]');
        if (courseCode) {
          courseName = courseCode.textContent.trim();
        }
      }
      
      // Clean up course name
      if (courseName) {
        courseName = courseName.replace(/^Course:\s*/, '').replace(/\s*-\s*Canvas$/, '').trim();
      }
      
      return courseName;
    }

    // Helper function to extract and parse due dates
    function extractDueDate(element) {
      if (!element) return null;
      
      let dateText = element.textContent.trim();
      
      // Look for datetime attributes first
      const dateTimeAttr = element.getAttribute('datetime') || 
                          element.querySelector('[datetime]')?.getAttribute('datetime');
      if (dateTimeAttr) {
        return new Date(dateTimeAttr).toISOString();
      }
      
      // Clean up date text
      dateText = dateText.replace(/^(due|Due|DUE)[\s:]*/, '');
      dateText = dateText.replace(/at\s+\d+:\d+\s*(am|pm|AM|PM)/, ''); // Remove time
      
      // Try to parse the date
      try {
        const date = new Date(dateText);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      } catch (e) {
        // If parsing fails, return the original text
      }
      
      return dateText;
    }

  function extractTasks() {
    const tasks = [];
    const currentCourse = extractCourseName(); // Get course name for this page
    
    // Extract from dashboard/assignments page
    const assignmentItems = document.querySelectorAll(
      '.assignment, .assignment-list-item, .ig-title, .submission-item, ' +
      '.todo-item, .assignment-group-item, .context_module_item'
    );
    
    assignmentItems.forEach(item => {
      const titleEl = item.querySelector('.assignment-title, .ig-title, .title, h3, a, .item_name') || item;
      const dueDateEl = item.querySelector(
        '.due-date, .date, .due, .assignment-date-due, .due_date_display, ' +
        '.datetime_field, [class*="due"], .assignment-due-date'
      );
      const courseEl = item.querySelector('.course-name, .context-name, .course-code, .context');
      const typeEl = item.querySelector('.assignment-type, .quiz-type, .type, .ig-type');
      
      if (titleEl && titleEl.textContent.trim()) {
        const title = titleEl.textContent.trim();
        const taskType = determineTaskType(title, typeEl?.textContent);
        const extractedCourse = courseEl ? courseEl.textContent.trim() : currentCourse;
        
        tasks.push({
          title: title,
          dueDate: extractDueDate(dueDateEl),
          course: extractedCourse || 'Unknown Course',
          type: taskType,
          url: titleEl.href || window.location.href,
          extractedAt: new Date().toISOString()
        });
      }
    });

    // Extract from calendar view
    const calendarItems = document.querySelectorAll('.fc-event, .calendar-event, .planner-item');
    calendarItems.forEach(item => {
      const titleEl = item.querySelector('.fc-title, .fc-event-title, .event-title, .planner-item-title') || item;
      const timeEl = item.querySelector('.fc-time, .event-time, .fc-date');
      
      if (titleEl && titleEl.textContent.trim()) {
        const title = titleEl.textContent.trim();
        const taskType = determineTaskType(title);
        
        tasks.push({
          title: title,
          dueDate: extractDueDate(timeEl) || item.getAttribute('data-date'),
          course: currentCourse || 'Calendar Event',
          type: taskType,
          url: window.location.href,
          extractedAt: new Date().toISOString()
        });
      }
    });

    // Extract from course pages and assignment lists
    const courseAssignments = document.querySelectorAll(
      '.assignment-list tr, .quiz-list-item, .assignment_list .assignment, ' +
      '.content .assignment, table.assignment_list tr'
    );
    
    courseAssignments.forEach(item => {
      const titleEl = item.querySelector('a, .title, .assignment_title, .quiz_title');
      const dueDateEl = item.querySelector(
        '.due-date, .lock-at, .due_at, .assignment_due_at, ' +
        'td[data-label="Due"], .sort_key'
      );
      const typeEl = item.querySelector('.assignment-type, .quiz-type, .type');
      
      if (titleEl && titleEl.textContent.trim()) {
        const title = titleEl.textContent.trim();
        const taskType = determineTaskType(title, typeEl?.textContent);
        
        tasks.push({
          title: title,
          dueDate: extractDueDate(dueDateEl),
          course: currentCourse || 'Unknown Course',
          type: taskType,
          url: titleEl.href || window.location.href,
          extractedAt: new Date().toISOString()
        });
      }
    });

    // Extract from upcoming assignments widget
    const upcomingItems = document.querySelectorAll('.right-side .coming_up, .upcoming_events .event');
    upcomingItems.forEach(item => {
      const titleEl = item.querySelector('.title, a');
      const dueDateEl = item.querySelector('.date, .datetime');
      const contextEl = item.querySelector('.context');
      
      if (titleEl && titleEl.textContent.trim()) {
        const title = titleEl.textContent.trim();
        const taskType = determineTaskType(title, contextEl?.textContent);
        const extractedCourse = contextEl ? contextEl.textContent.trim() : currentCourse;
        
        tasks.push({
          title: title,
          dueDate: extractDueDate(dueDateEl),
          course: extractedCourse || 'Unknown Course',
          type: taskType,
          url: titleEl.href || window.location.href,
          extractedAt: new Date().toISOString()
        });
      }
    });

    return tasks.filter(task => task.title && task.title.length > 0);
  }

  function sendTasksToExtension(tasks) {
    if (tasks.length > 0) {
      console.log('[NUS Canvas Task Extractor] Found tasks:', tasks);
      
      // Store in Chrome storage
      chrome.runtime.sendMessage({
        action: 'storeTasks',
        tasks: tasks,
        url: window.location.href
      });
    }
  }

  // Initial extraction
  const initialTasks = extractTasks();
  sendTasksToExtension(initialTasks);

  // Re-extract when page content changes (for dynamic loading)
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      const newTasks = extractTasks();
      if (newTasks.length > 0) {
        sendTasksToExtension(newTasks);
      }
    }, 1000);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('[NUS Canvas Task Extractor] Monitoring for new tasks...');
})();
