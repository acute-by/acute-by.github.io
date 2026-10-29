// Acute By — small progressive enhancements. The site works fully without this file.
(function () {
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('ready'); // switches off the CSS safety net that reveals content when JS is missing

  // Solid nav once the page scrolls.
  var nav = document.querySelector('.nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Fade sections in as they enter the viewport.
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Copy the support address.
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var label = btn.querySelector('span');
      function done() {
        if (!label) return;
        var old = label.textContent;
        label.textContent = 'Copied!';
        setTimeout(function () { label.textContent = old; }, 1600);
      }
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });

  // Gentle 3D tilt on the hero logo (mouse/pen only).
  var stage = document.querySelector('.stage');
  var tile = document.querySelector('.tile');
  if (stage && tile && !still) {
    stage.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tile.style.transform = 'perspective(700px) rotateY(' + (x * 18) + 'deg) rotateX(' + (-y * 18) + 'deg)';
    });
    stage.addEventListener('pointerleave', function () { tile.style.transform = ''; });
  }

  // Back to top: appears once the visitor has scrolled a screen or so.
  var top = document.createElement('button');
  top.type = 'button';
  top.className = 'to-top';
  top.setAttribute('aria-label', 'Back to top');
  top.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(top);
  function onScrollTop() { top.classList.toggle('show', window.scrollY > 600); }
  onScrollTop();
  window.addEventListener('scroll', onScrollTop, { passive: true });
  top.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
    // Keyboard users continue from the top of the page.
    var home = document.querySelector('.nav .brand');
    if (home) home.focus({ preventScroll: true });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
