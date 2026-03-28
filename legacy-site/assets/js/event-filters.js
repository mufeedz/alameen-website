/**
 * Enhanced event filtering functionality for Al-Ameen School website
 * Updated to work with month-based filtering (This Month, Next Month, Holidays)
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait for events to be loaded before setting up filters
  function setupEventFilters() {
    const filterButtons = document.querySelectorAll('.event-filter button');
    console.log('Setting up event filters, found buttons:', filterButtons.length);
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        console.log('Filter clicked:', filter);
        
        // Toggle active class on buttons
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.classList.add('btn--outline-primary');
          btn.classList.remove('btn--primary');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        this.classList.add('btn--primary');
        this.classList.remove('btn--outline-primary');
        
        // Apply filtering logic based on the new filters
        const thisMonthSection = document.getElementById('this-month-events');
        const nextMonthSection = document.getElementById('next-month-events');
        const holidaysSection = document.getElementById('holidays-section');
        
        console.log('Found sections:', {
          thisMonth: !!thisMonthSection,
          nextMonth: !!nextMonthSection,
          holidays: !!holidaysSection
        });
        
        if (filter === 'holidays') {
          // Show only holidays section
          if (thisMonthSection) thisMonthSection.style.display = 'none';
          if (nextMonthSection) nextMonthSection.style.display = 'none';
          if (holidaysSection) holidaysSection.style.display = 'block';
        } else if (filter === 'this-month') {
          // Show only this month's events
          if (thisMonthSection) thisMonthSection.style.display = 'block';
          if (nextMonthSection) nextMonthSection.style.display = 'none';
          if (holidaysSection) holidaysSection.style.display = 'none';
        } else if (filter === 'next-month') {
          // Show only next month's events
          if (thisMonthSection) thisMonthSection.style.display = 'none';
          if (nextMonthSection) nextMonthSection.style.display = 'block';
          if (holidaysSection) holidaysSection.style.display = 'none';
        }
      });
    });
  }

  // Initialize event filters if on events page
  if (document.querySelector('.event-filter')) {
    // Wait a bit to ensure all content is loaded
    setTimeout(setupEventFilters, 200);
  }
});
