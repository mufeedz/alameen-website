// Campuses page — Swiper galleries, smooth scroll, and stats counter
document.addEventListener('DOMContentLoaded', function() {
  // Karungalpalayam Campus Swiper
  const mainCampusSwiper = new Swiper('.campus-swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 5000,
    },
  });

  // Ellapalayam Campus Swiper
  const annexCampusSwiper = new Swiper('.annex-swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 5000,
    },
  });

  // Smooth scroll for navigation
  document.querySelectorAll('.campus-nav-item').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });

  // Stats Counter Animation with Intersection Observer
  const statsCounters = document.querySelectorAll('.stats-counter[data-target]');

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        counter.classList.add('animated');
        counter.closest('.stats-counter-wrapper').classList.add('stats-animating');

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
            counter.style.transform = 'scale(1.05)';
            setTimeout(() => {
              counter.style.transform = 'scale(1)';
              counter.closest('.stats-counter-wrapper').classList.remove('stats-animating');
            }, 200);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 16);
      }
    });
  }, observerOptions);

  statsCounters.forEach(counter => {
    observer.observe(counter);
  });
});
