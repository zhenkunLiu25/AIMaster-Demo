// Simple Canvas task extractor
(function() {
  console.log('🚀 [Canvas Extractor] Starting on:', window.location.href);
  
  function extractSimpleTasks() {
    const tasks = [];
    
    // Method 1: Look for any links containing "assignment" or "quiz" but exclude navigation
    const links = document.querySelectorAll('a[href*="assignment"], a[href*="quiz"], a[href*="discussion"]');
    console.log('📝 [Canvas Extractor] Found', links.length, 'potential task links');
    
    links.forEach((link, index) => {
      const rawTitle = link.textContent.trim();
      if (rawTitle && rawTitle.length > 3) {
        
        // Skip navigation items and generic links
        const isNavigation = (
          // Skip if it's in the side navigation
          link.closest('.ic-app-nav-menu, .course-nav, .ic-app-course-nav, nav, .navigation') ||
          // Skip if it's just the word "Assignments", "Discussions", "Quizzes" etc.
          /^(assignments?|discussions?|quizzes?|modules?|grades?|people|files|pages|syllabus|home)$/i.test(rawTitle) ||
          // Skip if it's in a breadcrumb
          link.closest('.breadcrumbs, .ic-app-nav-toggle-and-crumbs') ||
          // Skip if it's a tab or menu item
          link.closest('.ic-app-nav-tab, .ui-tabs-nav, .menu, .tabs') ||
          // Skip if the link doesn't have a specific ID (generic navigation usually doesn't)
          !link.href.match(/\/(assignments|quizzes|discussion_topics)\/\d+/)
        );
        
        if (isNavigation) {
          console.log('🚫 [Canvas Extractor] Skipping navigation item:', rawTitle);
          return;
        }
        
        // Clean the title - remove extra whitespace and special characters
        let cleanTitle = rawTitle.replace(/\s+/g, ' ').trim();
        
        // Try to find due date and score nearby
        let dueDate = null;
        let score = null;
        let gradeStatus = null;
        
        const parent = link.closest('tr, .assignment, .todo-item, .fc-event, .assignment-list-item') || link.parentElement;
        
        // Look for due date
        const dueDateEl = parent ? parent.querySelector('[class*="due"], [class*="date"], .datetime_field') : null;
        if (dueDateEl) {
          dueDate = dueDateEl.textContent.trim().replace(/\s+/g, ' ');
        }
        
        // Look for score/grade information with enhanced patterns
        if (parent) {
          // Enhanced score patterns to capture more variations
          const scorePatterns = [
            // Standard patterns: "-/10 pts", "8/10 pts", "95/100"
            /(-|\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\s*(?:pts?|points?)/i,
            /(-|\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)/,
            // Percentage patterns: "85%", "95.5%"
            /(\d+(?:\.\d+)?)%/,
            // Point patterns: "10 pts", "15.5 points"
            /(\d+(?:\.\d+)?)\s*(?:pts?|points?)/i
          ];
          
          const parentText = parent.textContent;
          let foundScore = false;
          
          // Try fraction patterns first (most common in Canvas)
          for (let i = 0; i < 2 && !foundScore; i++) {
            const pattern = scorePatterns[i];
            const match = parentText.match(pattern);
            if (match) {
              const earned = match[1] === '-' ? 0 : parseFloat(match[1]);
              const total = parseFloat(match[2]);
              if (!isNaN(total) && total > 0) {
                score = {
                  earned: earned,
                  total: total,
                  percentage: earned === 0 && match[1] === '-' ? null : Math.round((earned / total) * 100),
                  display: `${match[1]}/${total} pts`,
                  raw: match[0],
                  type: 'fraction'
                };
                foundScore = true;
              }
            }
          }
          
          // Try percentage pattern if no fraction found
          if (!foundScore) {
            const percentMatch = parentText.match(scorePatterns[2]);
            if (percentMatch) {
              const percentage = parseFloat(percentMatch[1]);
              if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
                score = {
                  earned: null,
                  total: null,
                  percentage: Math.round(percentage),
                  display: `${percentage}%`,
                  raw: percentMatch[0],
                  type: 'percentage'
                };
                foundScore = true;
              }
            }
          }
          
          // Try standalone points pattern if no other score found
          if (!foundScore) {
            const pointsMatch = parentText.match(scorePatterns[3]);
            if (pointsMatch) {
              const points = parseFloat(pointsMatch[1]);
              if (!isNaN(points) && points >= 0) {
                score = {
                  earned: points,
                  total: null,
                  percentage: null,
                  display: `${points} pts`,
                  raw: pointsMatch[0],
                  type: 'points'
                };
                foundScore = true;
              }
            }
          }
          
          // Method 2: Look for grade status
          const gradeElements = parent.querySelectorAll('.grade, .score, [class*="grade"], [class*="score"]');
          gradeElements.forEach(el => {
            const text = el.textContent.trim();
            if (text.match(/not\s+yet\s+graded|ungraded|pending|submitted|graded/i)) {
              gradeStatus = text;
            }
          });
          
          // Method 3: Look for specific grade status text
          if (!gradeStatus && parentText.includes('Not Yet Graded')) {
            gradeStatus = 'Not Yet Graded';
          } else if (!gradeStatus && parentText.includes('Graded')) {
            gradeStatus = 'Graded';
          } else if (!gradeStatus && parentText.includes('Submitted')) {
            gradeStatus = 'Submitted';
          }
        }
        
        // Extract course from page title or breadcrumb with better parsing
        let courseName = '';
        let courseCode = '';
        let courseTitle = '';
        
        const breadcrumb = document.querySelector('.ic-app-nav-toggle-and-crumbs, .breadcrumbs');
        if (breadcrumb) {
          const courseLink = breadcrumb.querySelector('a[href*="/courses/"]');
          if (courseLink) {
            const fullCourseName = courseLink.textContent.trim();
            
            // Try to extract course code and title
            // Pattern: "CS5242: Neural Networks and Deep Learning" or "CS5242 Neural Networks and Deep Learning"
            const coursePattern = /^([A-Z]{2,4}\d{4}[A-Z]?)\s*[:\-]?\s*(.+)$/i;
            const match = fullCourseName.match(coursePattern);
            
            if (match) {
              courseCode = match[1].toUpperCase();
              courseTitle = match[2].trim();
              courseName = fullCourseName;
            } else {
              // Fallback: if no pattern match, check if it contains a course code
              const codeOnlyPattern = /([A-Z]{2,4}\d{4}[A-Z]?)/i;
              const codeMatch = fullCourseName.match(codeOnlyPattern);
              if (codeMatch) {
                courseCode = codeMatch[1].toUpperCase();
                courseTitle = fullCourseName.replace(codeMatch[0], '').replace(/^[\s:\-]+|[\s:\-]+$/g, '');
                courseName = fullCourseName;
              } else {
                courseName = fullCourseName;
                courseTitle = fullCourseName;
              }
            }
          }
        }
        
        // Fallback to document title
        if (!courseName) {
          const titleParts = document.title.split(' - ');
          const titleCourseName = titleParts.length > 1 ? titleParts[0] : 'Canvas Course';
          
          // Try to extract from document title too
          const coursePattern = /^([A-Z]{2,4}\d{4}[A-Z]?)\s*[:\-]?\s*(.+)$/i;
          const match = titleCourseName.match(coursePattern);
          
          if (match) {
            courseCode = match[1].toUpperCase();
            courseTitle = match[2].trim();
            courseName = titleCourseName;
          } else {
            courseName = titleCourseName;
            courseTitle = titleCourseName;
          }
        }
        
        // Determine task type from URL and title
        let type = 'Assignment';
        if (link.href.includes('quiz') || cleanTitle.toLowerCase().includes('quiz')) {
          type = 'Quiz';
        } else if (link.href.includes('discussion') || cleanTitle.toLowerCase().includes('discussion')) {
          type = 'Discussion';
        } else if (cleanTitle.toLowerCase().includes('exam') || cleanTitle.toLowerCase().includes('test')) {
          type = 'Exam';
        } else if (cleanTitle.toLowerCase().includes('project')) {
          type = 'Project';
        }
        
        tasks.push({
          title: cleanTitle,
          dueDate: dueDate,
          course: courseName,
          courseCode: courseCode,
          courseTitle: courseTitle,
          type: type,
          url: link.href,
          score: score,
          gradeStatus: gradeStatus,
          extractedAt: new Date().toISOString()
        });
        
        console.log(`✅ [Canvas Extractor] Task ${tasks.length}:`, cleanTitle, '|', type, '|', courseCode, '|', courseTitle, '|', dueDate, '|', score ? score.display : 'No score', '|', gradeStatus || 'No grade status');
      }
    });
    
    // Method 2: Look for calendar events (but not navigation)
    const calendarEvents = document.querySelectorAll('.fc-event, .calendar-event, [class*="event"]');
    console.log('📅 [Canvas Extractor] Found', calendarEvents.length, 'calendar events');
    
    calendarEvents.forEach((event, index) => {
      // Skip if it's in navigation
      if (event.closest('nav, .navigation, .menu, .ic-app-nav-menu')) {
        return;
      }
      
      const titleEl = event.querySelector('.fc-title, .fc-event-title') || event;
      const title = titleEl.textContent.trim();
      
      if (title && title.length > 3 && !/^(assignments?|discussions?|quizzes?)$/i.test(title)) {
        const timeEl = event.querySelector('.fc-time, .event-time');
        const dueDate = timeEl ? timeEl.textContent.trim() : event.getAttribute('data-date');
        
        tasks.push({
          title: title,
          dueDate: dueDate,
          course: document.title.split(' - ')[0] || 'Canvas Course',
          type: 'Event',
          url: window.location.href,
          extractedAt: new Date().toISOString()
        });
        
        console.log(`📅 [Canvas Extractor] Event ${index + 1}:`, title);
      }
    });
    
    // Method 3: Look for table rows that might contain assignments (but not navigation tables)
    const tableRows = document.querySelectorAll('tr');
    console.log('📊 [Canvas Extractor] Scanning', tableRows.length, 'table rows');
    
    tableRows.forEach((row, index) => {
      // Skip if it's in navigation or menu tables
      if (row.closest('nav, .navigation, .menu, .ic-app-nav-menu, .course-nav')) {
        return;
      }
      
      const link = row.querySelector('a[href*="assignment"], a[href*="quiz"]');
      if (link) {
        const title = link.textContent.trim();
        
        // Skip navigation items
        if (/^(assignments?|discussions?|quizzes?|modules?|grades?)$/i.test(title)) {
          return;
        }
        
        const dueDateCell = row.querySelector('td[data-label*="due"], td[data-label*="Due"], .due-date');
        const dueDate = dueDateCell ? dueDateCell.textContent.trim() : null;
        
        if (title && title.length > 3) {
          let type = 'Assignment';
          if (link.href.includes('quiz')) type = 'Quiz';
          
          tasks.push({
            title: title,
            dueDate: dueDate,
            course: document.title.split(' - ')[0] || 'Canvas Course',
            type: type,
            url: link.href,
            extractedAt: new Date().toISOString()
          });
          
          console.log(`📊 [Canvas Extractor] Table task ${index + 1}:`, title);
        }
      }
    });
    
    // Remove duplicates based on title and URL
    const uniqueTasks = tasks.filter((task, index, arr) => 
      arr.findIndex(t => t.title === task.title && t.url === task.url) === index
    );
    
    console.log('🎯 [Canvas Extractor] Extracted', uniqueTasks.length, 'unique tasks');
    return uniqueTasks;
  }
  
  function sendToExtension(tasks) {
    if (chrome.runtime) {
      chrome.runtime.sendMessage({
        action: 'storeTasks',
        tasks: tasks,
        url: window.location.href
      }, (response) => {
        if (response?.success) {
          console.log('✅ [Canvas Extractor] Successfully stored', response.count, 'tasks');
        } else {
          console.log('❌ [Canvas Extractor] Failed to store tasks');
        }
      });
    }
  }
  
  // Extract tasks immediately
  const tasks = extractSimpleTasks();
  sendToExtension(tasks);
  
  // Also extract after page changes (for dynamic content)
  setTimeout(() => {
    const moreTasks = extractSimpleTasks();
    if (moreTasks.length > tasks.length) {
      console.log('🔄 [Canvas Extractor] Found additional tasks after delay');
      sendToExtension(moreTasks);
    }
  }, 3000);
  
  console.log('✨ [Canvas Extractor] Extraction complete');
})();