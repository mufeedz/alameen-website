// Main JS for Al-Ameen School

// Load header and footer partials
function loadPartial(id, url) {
  fetch(url)
    .then(res => res.text())
    .then(html => { 
      document.getElementById(id).innerHTML = html; 
      
      // Initialize components after header is loaded
      if (id === 'header-include') {
        initializeBackToTop();
      }
    });
}

// Initialize back-to-top button with accessibility improvements
function initializeBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    // Make sure button is initially hidden and properly labeled
    backToTopButton.classList.remove('show');
    
    // Ensure button has proper attributes for accessibility
    if (!backToTopButton.hasAttribute('tabindex')) {
      backToTopButton.setAttribute('tabindex', '0');
    }
    
    // Function to check scroll position and update button state
    const checkScroll = () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
        backToTopButton.setAttribute('tabindex', '0');
        backToTopButton.setAttribute('aria-hidden', 'false');
      } else {
        backToTopButton.classList.remove('show');
        backToTopButton.setAttribute('tabindex', '-1');
        backToTopButton.setAttribute('aria-hidden', 'true');
      }
    };
    
    // Run immediately and after a short delay (for Live Server)
    checkScroll();
    setTimeout(checkScroll, 100);
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Handle both click and keyboard events
    backToTopButton.addEventListener('click', handleBackToTop);
    backToTopButton.addEventListener('keydown', function(e) {
      // Respond to Enter or Space key
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleBackToTop(e);
      }
    });
  }
  
  // Function to handle back to top action
  function handleBackToTop(e) {
    e.preventDefault();
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // After scrolling, move focus to the main content area for better user experience
    setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        const firstFocusableElement = mainContent.querySelector('h1, [tabindex="0"]');
        if (firstFocusableElement) {
          firstFocusableElement.focus();
        }
      }
    }, 500); // Allow time for the scroll to complete
  }
}

// Initialize gallery features if on gallery page with accessibility improvements
function initializeGallery() {
  // Check if we're on the gallery page
  if (document.querySelector('.gallery-grid')) {
    // Wait for images to load for better layout
    window.addEventListener('load', function() {
      // Add keyboard navigation to filter buttons
      const filterButtonGroup = document.querySelector('.filter-button-group');
      if (filterButtonGroup) {
        // Set ARIA attributes for the filter button group
        filterButtonGroup.setAttribute('role', 'tablist');
        filterButtonGroup.setAttribute('aria-label', 'Gallery category filters');

        // Set up each filter button with proper ARIA attributes
        const filterButtons = filterButtonGroup.querySelectorAll('button');
        filterButtons.forEach((btn, index) => {
          // Set appropriate ARIA attributes
          btn.setAttribute('role', 'tab');
          btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
          btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
          
          // Add keyboard event listeners
          btn.addEventListener('keydown', function(e) {
            // Left/Right arrows to navigate between filter buttons
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.preventDefault();
              
              // Calculate next button index (with wrapping)
              const direction = e.key === 'ArrowLeft' ? -1 : 1;
              const nextIndex = (index + direction + filterButtons.length) % filterButtons.length;
              
              // Move focus to next button
              filterButtons[nextIndex].focus();
            }
            // Space or Enter to activate the filter
            else if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              btn.click();
            }
          });
        });
      }
      
      // Initialize Isotope if it exists with accessibility improvements
      if (typeof Isotope !== 'undefined') {
        const grid = document.querySelector('.gallery-grid');
        const iso = new Isotope(grid, {
          itemSelector: '.gallery-item',
          layoutMode: 'fitRows',
          percentPosition: true
        });
        
        // Make gallery container accessible
        grid.setAttribute('role', 'region');
        grid.setAttribute('aria-label', 'Gallery images');
        
        // Filter items on button click or keyboard activation
        document.querySelector('.filter-button-group').addEventListener('click', function(event) {
          if (!event.target.matches('button')) return;
          
          const filterValue = event.target.getAttribute('data-filter');
          iso.arrange({ filter: filterValue === '*' ? '' : filterValue });
          
          // Update active button state and ARIA attributes
          document.querySelectorAll('.filter-button-group .btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
          });
          
          // Set new active button
          event.target.classList.add('active');
          event.target.setAttribute('aria-selected', 'true');
          event.target.setAttribute('tabindex', '0');
          
          // Announce filter change to screen readers
          const filterName = event.target.textContent.trim();
          announceForScreenReaders(`Showing ${filterName} images`);
        });
        
        // Make gallery items keyboard navigable
        document.querySelectorAll('.gallery-item a').forEach((link, index, links) => {
          // Add appropriate ARIA attributes
          link.setAttribute('role', 'link');
          link.setAttribute('aria-label', link.getAttribute('data-title') || `Gallery image ${index + 1}`);
          
          // Add keyboard navigation between gallery items
          link.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
              
              let nextIndex;
              const filteredLinks = Array.from(links).filter(l => {
                const item = l.closest('.gallery-item');
                return window.getComputedStyle(item).display !== 'none';
              });
              
              const currentFilteredIndex = filteredLinks.indexOf(link);
              
              // Determine next focus target based on arrow key
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                nextIndex = (currentFilteredIndex + 1) % filteredLinks.length;
              } else {
                nextIndex = (currentFilteredIndex - 1 + filteredLinks.length) % filteredLinks.length;
              }
              
              filteredLinks[nextIndex].focus();
            }
          });
        });
      }
      
      // Initialize Lightbox if it exists with accessibility improvements
      if (typeof lightbox !== 'undefined') {
        lightbox.option({
          'resizeDuration': 200,
          'wrapAround': true,
          'albumLabel': "Image %1 of %2",
          'fadeDuration': 300,
          'alwaysShowNavOnTouchDevices': true
        });
        
        // Add keyboard listener to document to handle Escape key properly
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && document.querySelector('.lb-container')) {
            lightbox.end();
            // Return focus to the gallery item that was clicked
            const activeItem = document.querySelector('.gallery-item a[data-lightbox="school-gallery"].active');
            if (activeItem) activeItem.focus();
          }
        });
      }
    });
  }
}

// Helper function to announce changes to screen readers
function announceForScreenReaders(message) {
  const announcer = document.getElementById('screen-reader-announcer') || 
    (() => {
      const el = document.createElement('div');
      el.id = 'screen-reader-announcer';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      el.classList.add('visually-hidden');
      document.body.appendChild(el);
      return el;
    })();
  
  announcer.textContent = message;
}

// Swiper initialization for pages with hero sliders
function initializeHeroSwiper() {
  const heroSwiper = document.querySelector('.hero-swiper');
  
  if (heroSwiper) {
    new Swiper('.hero-swiper', {
      // Enable keyboard control for accessibility
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      // Add proper ARIA labels
      a11y: {
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        firstSlideMessage: 'This is the first slide',
        lastSlideMessage: 'This is the last slide',
        paginationBulletMessage: 'Go to slide {{index}}',
        notificationClass: 'swiper-notification',
      },
      // Configure autoplay with accessibility considerations
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      // Add elegant fade effect
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      // Configure pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      // Configure navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      // Enable infinite loop for the hero slider
      loop: true,
      // Ensure proper loading before animation
      preloadImages: true,
      lazy: {
        loadPrevNext: true,
      },
    });
    
    // Update ARIA attributes for better accessibility
    const sliderContainer = document.querySelector('.hero-swiper');
    if (sliderContainer) {
      sliderContainer.setAttribute('aria-label', 'School highlights slideshow');
      
      // Set focus trap for keyboard navigation
      const slides = sliderContainer.querySelectorAll('.swiper-slide');
      slides.forEach((slide, index) => {
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        slide.setAttribute('role', 'group');
      });
    }
  }
}

// Optimization for performance
function optimizePagePerformance() {
  // Defer non-critical images using IntersectionObserver
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Find all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
  }
    // Optimize event handlers by using event delegation where possible
  document.addEventListener('click', function(e) {
    // Handle back-to-top button
    if (e.target.closest('.back-to-top')) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}

// Enhanced UI Interactions
function initializeEnhancedUI() {
  // Add hover-lift class to buttons that don't have it yet
  const buttons = document.querySelectorAll('.btn:not(.hover-lift)');
  buttons.forEach(btn => {
    btn.classList.add('hover-lift');
  });
  
  // Add gradient text to section titles that don't have it
  const sectionTitles = document.querySelectorAll('.section__title:not(:has(.gradient-text))');
  sectionTitles.forEach(title => {
    // Don't apply to titles that already have children
    if (title.childElementCount === 0) {
      const text = title.textContent;
      const words = text.split(' ');
      
      // Only apply gradient to the last word if there are multiple words
      if (words.length > 1) {
        const lastWord = words.pop();
        title.innerHTML = words.join(' ') + ' <span class="gradient-text">' + lastWord + '</span>';
      }
    }
  });
  
  // Add smooth transition to all links
  const links = document.querySelectorAll('a:not(.transition-all)');
  links.forEach(link => {
    link.classList.add('transition-all');
  });
  
  // Add floating animation to selected elements
  const floatElements = document.querySelectorAll('.card:nth-child(odd), .event-date');
  floatElements.forEach(element => {
    element.classList.add('float-animation');
  });
  
  // Make navbar items highlight current page
  highlightCurrentPageInNav();
}

// Function to highlight current page in navigation
function highlightCurrentPageInNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check if this link corresponds to the current page
    if (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === '')) {
      link.classList.add('active');
    } else if (href !== 'index.html' && currentPath.includes(href)) {
      link.classList.add('active');
    }
  });
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load header and footer
  if (document.getElementById('header-include')) {
    loadPartial('header-include', 'partials/header.html');
  }
  
  if (document.getElementById('footer-include')) {
    loadPartial('footer-include', 'partials/footer.html');
  }
  
  // Enable lazy loading for all images
  enableLazyLoading();
  
  // Initialize performance optimizations
  optimizePagePerformance();
  
  // Initialize Swiper
  initializeHeroSwiper();
  
  // Initialize Islamic pattern backgrounds
  initializePatternBackgrounds();
  
  // Initialize Gallery features if on gallery page
  initializeGallery();
  
  // Additional initialization for back-to-top when using Live Server
  window.addEventListener('load', function() {
    // Double-check back-to-top button after everything is loaded
    setTimeout(function() {
      if (document.querySelector('.back-to-top')) {
        initializeBackToTop();
      }
    }, 500);
  });
  
  // Initialize enhanced UI features
  setTimeout(initializeEnhancedUI, 500); // Delay to ensure DOM is fully loaded
});

// Function to add lazy loading attribute to all images that don't have
function enableLazyLoading() {
  // Skip the first few images (above the fold) for better performance
  const allImages = document.querySelectorAll('img:not([loading])');
  
  // Add lazy loading to all images except for the first few visible ones
  allImages.forEach((img, index) => {
    // Don't lazy load the first 2-3 images (likely above the fold)
    if (index > 2) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Ensure all images have proper alt text for accessibility
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      
      // Mark decorative images appropriately
      if (img.closest('[aria-hidden="true"]') || 
          img.classList.contains('banner-accent') || 
          img.classList.contains('decoration')) {
        img.setAttribute('aria-hidden', 'true');
      }
    }
  });
}

// Function to handle Islamic pattern background sizing
function initializePatternBackgrounds() {
  const patternElements = document.querySelectorAll('.pattern-star-bg, .pattern-rosette-bg, .pattern-girih-bg, .islamic-motif');
  
  // Set initial sizes
  patternElements.forEach(element => {
    // Make sure parent has position relative for proper containment
    if (element.parentElement.style.position !== 'relative') {
      element.parentElement.style.position = 'relative';
    }
    
    // For hero sections, adjust opacity slightly
    if (element.closest('.hero')) {
      element.style.opacity = '0.1';
      element.style.mixBlendMode = 'overlay';
    }
  });
  
  // Adjust pattern sizes on window resize for responsiveness
  window.addEventListener('resize', () => {
    patternElements.forEach(element => {
      // Responsive adjustments can be made here if needed
      if (window.innerWidth < 768) {
        element.style.backgroundSize = 'auto 100%';
      } else {
        // Reset to default background size
        element.style.backgroundSize = '';
      }
    });
  });
}
