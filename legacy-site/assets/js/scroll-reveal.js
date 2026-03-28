// Reveal animations when scrolling
document.addEventListener('DOMContentLoaded', function() {
  // Add reveal classes to elements
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.add('reveal-section');
  });
  
  const titles = document.querySelectorAll('.section__title');
  titles.forEach(title => {
    title.classList.add('reveal-title');
  });
  
  const cards = document.querySelectorAll('.card, .event-card, .feature-card, .icon-box');
  cards.forEach((card, index) => {
    card.classList.add('reveal-item');
    card.style.transitionDelay = `${index % 4 * 0.1}s`; // Staggered reveal
  });
  
  // Utility function to check if element is in viewport
  function isInViewport(element, offset = 100) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset || document.documentElement.clientHeight - offset) &&
      rect.left >= 0 &&
      rect.bottom >= offset &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Function to add reveal class when element is in viewport
  function revealElements() {
    const revealSections = document.querySelectorAll('.reveal-section:not(.revealed)');
    const revealTitles = document.querySelectorAll('.reveal-title:not(.revealed)');
    const revealItems = document.querySelectorAll('.reveal-item:not(.revealed)');
    
    // Reveal sections
    revealSections.forEach(element => {
      if (isInViewport(element, 50)) {
        element.classList.add('revealed');
      }
    });
    
    // Reveal titles
    revealTitles.forEach(element => {
      if (isInViewport(element, 150)) {
        element.classList.add('revealed');
      }
    });
    
    // Reveal items
    revealItems.forEach(element => {
      if (isInViewport(element, 150)) {
        element.classList.add('revealed');
      }
    });
  }
  
  // Run on scroll and initially
  window.addEventListener('scroll', revealElements);
  
  // Initial check after a short delay to allow page to settle
  setTimeout(revealElements, 300);
});
