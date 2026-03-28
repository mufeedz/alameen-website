// Scroll reveal using IntersectionObserver — no scroll event listener needed
document.addEventListener('DOMContentLoaded', function () {
  // Tag elements for reveal animation
  document.querySelectorAll('section').forEach(function (el) {
    el.classList.add('reveal-section');
  });
  document.querySelectorAll('.section__title').forEach(function (el) {
    el.classList.add('reveal-title');
  });
  document.querySelectorAll('.card, .event-card, .feature-card, .icon-box').forEach(function (el, i) {
    el.classList.add('reveal-item');
    el.style.transitionDelay = (i % 4 * 0.1) + 's';
  });

  // Bail out gracefully if IntersectionObserver not supported — reveal everything
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-section, .reveal-title, .reveal-item')
      .forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  function makeObserver(threshold) {
    return new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target); // fire once, then stop watching
        }
      });
    }, { threshold: threshold, rootMargin: '0px 0px -40px 0px' });
  }

  var sectionObs = makeObserver(0.05);
  var itemObs    = makeObserver(0.10);

  document.querySelectorAll('.reveal-section').forEach(function (el) { sectionObs.observe(el); });
  document.querySelectorAll('.reveal-title, .reveal-item').forEach(function (el) { itemObs.observe(el); });
});
