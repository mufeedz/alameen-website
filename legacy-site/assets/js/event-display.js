/**
 * Enhanced event display functionality for Al-Ameen School website
 * This file contains past event display functionality
 */

// Fix for past events display
function generatePastEventHTML(events) {
  return events.map((event, index) => `
    <div class="col-md-4">
      <div class="card h-100">
        <img src="assets/images/slider-${index+1}.png" class="card-img-top" alt="${event.title}">
        <div class="card-body">
          <h5 class="card-title">${event.title}</h5>
          <p class="small text-muted mb-2"><i class="bi bi-calendar3 me-1"></i> ${window.formatDateLong(event.date)}</p>
          <p class="card-text">${event.description}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Make this function globally available
window.generatePastEventHTML = generatePastEventHTML;
