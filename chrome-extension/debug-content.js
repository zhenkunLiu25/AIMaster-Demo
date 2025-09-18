// Debug content script for Canvas task extraction
(function() {
  console.log('🔍 [Canvas Debug] Script loaded on:', window.location.href);
  console.log('🔍 [Canvas Debug] Page title:', document.title);
  
  // Wait for page to fully load
  function debugCanvas() {
    console.log('🔍 [Canvas Debug] Starting analysis...');
    
    // Check for common Canvas elements
    const possibleSelectors = [
      '.assignment',
      '.assignment-list-item', 
      '.ig-title',
      '.todo-item',
      '.assignment-group-item',
      '.context_module_item',
      '.submission-item',
      '.fc-event',
      '.calendar-event',
      '.planner-item',
      '.assignment-list tr',
      '.quiz-list-item',
      '.coming_up',
      '.upcoming_events .event',
      '[class*="assignment"]',
      '[class*="due"]',
      '[data-testid*="assignment"]',
      'a[href*="assignment"]',
      'a[href*="quiz"]'
    ];
    
    possibleSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(`✅ [Canvas Debug] Found ${elements.length} elements for: ${selector}`);
        elements.forEach((el, i) => {
          if (i < 3) { // Log first 3 elements
            console.log(`   → Element ${i+1}:`, el.textContent.trim().substring(0, 100));
          }
        });
      }
    });
    
    // Check for any links that might be assignments
    const links = document.querySelectorAll('a');
    const assignmentLinks = Array.from(links).filter(link => 
      link.href && (
        link.href.includes('assignment') || 
        link.href.includes('quiz') ||
        link.href.includes('discussion')
      )
    );
    
    console.log(`🔗 [Canvas Debug] Found ${assignmentLinks.length} potential assignment links`);
    assignmentLinks.slice(0, 5).forEach((link, i) => {
      console.log(`   → Link ${i+1}: ${link.textContent.trim()} (${link.href})`);
    });
    
    // Check page structure
    console.log('📋 [Canvas Debug] Page structure:');
    console.log('   → Body classes:', document.body.className);
    console.log('   → Main content:', document.querySelector('#content, #main, .ic-app-main-content')?.tagName);
    
    // Try to extract something basic
    const titles = document.querySelectorAll('h1, h2, h3, .title, [class*="title"]');
    console.log(`📝 [Canvas Debug] Found ${titles.length} potential titles`);
    titles.slice(0, 5).forEach((title, i) => {
      console.log(`   → Title ${i+1}: ${title.textContent.trim()}`);
    });
  }
  
  // Run debug after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debugCanvas);
  } else {
    debugCanvas();
  }
  
  // Also run after a delay to catch dynamic content
  setTimeout(debugCanvas, 2000);
  
  console.log('🔍 [Canvas Debug] Debug script initialized');
})();