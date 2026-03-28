/**
 * Shared event utilities for Al-Ameen School website
 * Common functionality for event display and modals across all pages
 */

// Generate HTML for events list with optional popup support
function generateEventsHTML(events, showPopupButton = false, buttonClass = 'btn--primary') {
  return events.map(event => {
    // Parse date for display
    let displayDate = { day: 'TBD', month: '' };
    
    if (event.date) {
      try {
        const eventDate = new Date(event.date);
        if (!isNaN(eventDate.getTime())) {
          displayDate = {
            day: eventDate.getDate().toString().padStart(2, '0'),
            month: eventDate.toLocaleString('en-US', {month: 'short'})
          };
        }
      } catch (e) {
        console.error('Error parsing date:', e);
      }
    }

    const popupButton = showPopupButton ? `
      <div class="d-flex justify-content-end mt-2">
        <button class="btn btn-sm ${buttonClass}" data-bs-toggle="modal" data-bs-target="#eventModal${event.id}">
          More Details
        </button>
      </div>
    ` : '';

    return `
      <div class="event-card mb-3 bg-white shadow-sm rounded p-3 hover-lift" data-campus="${event.campus || 'main'}">
        <div class="row g-0 align-items-center">
          <div class="col-3 col-md-2 text-center">
            <div class="event-date bg-accent text-primary rounded p-2">
              <span class="d-block fs-4 fw-bold">${displayDate.day}</span>
              <span class="small">${displayDate.month}</span>
            </div>
          </div>
          <div class="col-9 col-md-10">
            <div class="ps-3">
              <h4 class="h5 mb-1 text-primary">${event.title}</h4>
              <p class="small text-muted mb-1"><i class="bi bi-clock me-1"></i> ${event.time}</p>
              <p class="small text-muted mb-1"><i class="bi bi-geo-alt me-1"></i> ${event.location}</p>
              <p class="small mb-0">${event.description}</p>
              ${popupButton}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Create modal dialogs for events
function createEventModals(events, modalContainerId = 'event-modals') {
  const existingModalContainer = document.getElementById(modalContainerId);
  if (!existingModalContainer) {
    console.error(`Modal container with ID "${modalContainerId}" not found`);
    return;
  }

  // Clear existing modals
  existingModalContainer.innerHTML = '';

  // Create modals for all events
  const modalHTML = events.map(event => {
    const eventDate = event.dateObj || new Date(event.date);
    const displayDate = {
      day: eventDate.getDate().toString().padStart(2, '0'),
      month: eventDate.toLocaleString('en-US', {month: 'short'})
    };
    
    const fullDate = eventDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `
      <div class="modal fade event-modal" id="eventModal${event.id}" tabindex="-1" aria-labelledby="eventModal${event.id}Label" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="eventModal${event.id}Label">${event.title}</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row mb-3">
                <div class="col-3">
                  <div class="event-date bg-accent text-primary rounded text-center p-2">
                    <span class="d-block fs-4 fw-bold">${displayDate.day}</span>
                    <span class="small">${displayDate.month}</span>
                  </div>
                </div>
                <div class="col-9">
                  <p class="mb-2"><i class="bi bi-calendar3 me-2 text-primary"></i> <strong>${fullDate}</strong></p>
                  <p class="mb-2"><i class="bi bi-clock me-2 text-primary"></i> ${event.time}</p>
                  <p class="mb-2"><i class="bi bi-geo-alt me-2 text-primary"></i> ${event.location}</p>
                  <p class="mb-0"><i class="bi bi-person me-2 text-primary"></i> Organized by ${event.organizer}</p>
                </div>
              </div>
              
              <div class="mb-3">
                <h6 class="text-primary">Event Details:</h6>
                <p>${event.details || event.description}</p>
              </div>
              
              ${event.activities && event.activities.length > 0 ? `
                <div class="mb-3">
                  <h6 class="text-primary">Activities Include:</h6>
                  <ul class="list-unstyled">
                    ${event.activities.map(activity => `<li><i class="bi bi-check-circle me-2 text-success"></i>${activity}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn--primary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  existingModalContainer.innerHTML = modalHTML;
}

// Set up event modal accessibility and handlers
function setupModalHandlers() {
  // Add keyboard support for event details buttons
  document.querySelectorAll('.event-card button[data-bs-toggle="modal"]').forEach(function(button) {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Improve modal accessibility
  document.querySelectorAll('.modal').forEach(function(modal) {
    modal.addEventListener('shown.bs.modal', function() {
      // Focus on the close button when modal opens
      const closeButton = modal.querySelector('.btn-close');
      if (closeButton) closeButton.focus();
    });

    // Return focus to the button that opened the modal when closing
    modal.addEventListener('hidden.bs.modal', function(event) {
      const modalId = modal.getAttribute('id');
      const opener = document.querySelector(`[data-bs-target="#${modalId}"]`);
      if (opener) opener.focus();
    });
  });
}

// Parse and prepare events data
function parseEventsData(eventsData) {
  return eventsData.events.map(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0); // Set to start of day for proper comparison
    return { 
      ...event, 
      dateObj: eventDate
    };
  });
}

// Filter upcoming events
function getUpcomingEvents(events, limit = null) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const upcoming = events
    .filter(event => event.dateObj >= currentDate)
    .sort((a, b) => a.dateObj - b.dateObj);
  
  return limit ? upcoming.slice(0, limit) : upcoming;
}

// Helper function to format dates in long format
function formatDateLong(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Make functions globally available
window.generateEventsHTML = generateEventsHTML;
window.createEventModals = createEventModals;
window.setupModalHandlers = setupModalHandlers;
window.parseEventsData = parseEventsData;
window.getUpcomingEvents = getUpcomingEvents;
window.formatDateLong = formatDateLong;
