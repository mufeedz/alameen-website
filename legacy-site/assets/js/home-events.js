/**
 * Home page events display for Al-Ameen School website
 * Displays upcoming events on the homepage from events.json
 */

document.addEventListener('DOMContentLoaded', function() {
  // Load events data from JSON file
  fetch('assets/data/events.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Events data loaded successfully:', data);
      displayHomeEvents(data);
    })
    .catch(error => {
      console.error('Error loading events data:', error);
      const errorMessage = '<div class="alert alert-warning small">Unable to load events at this time. Please check back later.</div>';
      const container = document.getElementById('home-events-display');
      
      if (container) container.innerHTML = errorMessage;
    });
  
  function displayHomeEvents(data) {
    console.log('Displaying home events...');
    
    // Parse events using shared utility
    const events = window.parseEventsData(data);
    console.log('Total events:', events.length);
    
    // Get upcoming events (limit to 4 for home page)
    const upcomingEvents = window.getUpcomingEvents(events, 4);
    console.log('Upcoming events to display:', upcomingEvents.length);
    
    // Display events in unified container
    const eventsContainer = document.getElementById('home-events-display');
    
    if (!eventsContainer) {
      console.error('Events container not found in DOM');
      return;
    }
    
    // Remove loading indicators
    const loadingElements = document.querySelectorAll('#home-events-display .loading');
    loadingElements.forEach(el => el.remove());
    
    // Generate HTML for the events with popup buttons
    if (upcomingEvents.length > 0) {
      // Create a grid layout for better display of 4 events
      const eventsGrid = `
        <div class="row g-3">
          ${upcomingEvents.map((event, index) => `
            <div class="col-md-6">
              ${window.generateEventsHTML([event], true, 'btn--primary')}
            </div>
          `).join('')}
        </div>
      `;
      
      eventsContainer.innerHTML = eventsGrid;
      
      // Create modals for events
      window.createEventModals(upcomingEvents, 'home-event-modals');
      
      // Setup modal handlers
      window.setupModalHandlers();
    } else {
      eventsContainer.innerHTML = '<div class="text-center py-4"><div class="alert alert-info">No upcoming events scheduled at this time.</div></div>';
    }
  }
});
