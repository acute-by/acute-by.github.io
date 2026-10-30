// Acute By — progressive enhancements, UI interactions & multilingual URL routing.
(function () {
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('ready');

  // ---------- Language URL Subpath Routing ----------
  var currentPath = window.location.pathname;
  var pathLangMatch = currentPath.match(/^\/(fr|es|de|ar|ur)(\/|$)/);
  var currentUrlLang = pathLangMatch ? pathLangMatch[1] : 'en';

  root.lang = currentUrlLang;
  root.dir = (currentUrlLang === 'ar' || currentUrlLang === 'ur') ? 'rtl' : 'ltr';

  // Ensure all brand logos point to the correct language home
  document.querySelectorAll('.nav .brand, footer .brand').forEach(function (brand) {
    if (currentUrlLang === 'en') {
      brand.setAttribute('href', '/');
    } else {
      brand.setAttribute('href', '/' + currentUrlLang + '/');
    }
  });

  function navigateToLanguage(targetLang) {
    if (targetLang === currentUrlLang) return;

    // Strip existing language subpath if present
    var cleanPath = currentPath.replace(/^\/(fr|es|de|ar|ur)(\/|$)/, '/');
    if (!cleanPath || cleanPath === '/') cleanPath = '/index.html';

    var targetUrl = '/';
    if (targetLang !== 'en') {
      targetUrl = '/' + targetLang + (cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath);
    } else {
      targetUrl = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;
    }

    localStorage.setItem('acute_lang', targetLang);
    window.location.href = targetUrl;
  }

  // Inject Language Selector Dropdown into Nav
  var navUl = document.querySelector('.nav .wrap ul');
  if (navUl && !document.querySelector('.lang-picker')) {
    var li = document.createElement('li');
    li.className = 'lang-picker';
    li.innerHTML = '<select class="lang-select" aria-label="Select language">' +
      '<option value="en">🇬🇧 EN</option>' +
      '<option value="fr">🇫🇷 FR</option>' +
      '<option value="es">🇪🇸 ES</option>' +
      '<option value="de">🇩🇪 DE</option>' +
      '<option value="ar">🇸🇦 العربية</option>' +
      '<option value="ur">🇵🇰 اردو</option>' +
      '</select>';
    navUl.appendChild(li);

    var select = li.querySelector('.lang-select');
    select.value = currentUrlLang;
    select.addEventListener('change', function () {
      navigateToLanguage(this.value);
    });
  }

  // Solid nav & active link highlight on scroll.
  var nav = document.querySelector('.nav');
  var navLinks = document.querySelectorAll('.nav ul a[href^="#"]');
  var sections = document.querySelectorAll('section[id], article[id]');

  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);

    var scrollPos = window.scrollY + 120;
    sections.forEach(function (sec) {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        var id = sec.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }
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

  // Copy support email address.
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var label = btn.querySelector('span');
      function done() {
        if (!label) return;
        var old = label.textContent;
        label.textContent = (currentUrlLang === 'fr') ? 'Copié !' :
          (currentUrlLang === 'es') ? '¡Copiado!' :
          (currentUrlLang === 'de') ? 'Kopiert!' :
          (currentUrlLang === 'ar') ? 'تم النسخ!' :
          (currentUrlLang === 'ur') ? 'کاپی ہو گیا!' : 'Copied!';
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

  // Screenshot Lightbox Modal
  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close image preview">&times;</button><img src="" alt="Game screenshot preview">';
  document.body.appendChild(lightbox);

  var lbImg = lightbox.querySelector('img');
  var lbClose = lightbox.querySelector('.lightbox-close');

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  document.querySelectorAll('.shots img').forEach(function (img) {
    img.title = 'Click to zoom screenshot';
    img.addEventListener('click', function () {
      lbImg.src = img.src;
      lbImg.alt = img.alt || 'Game screenshot';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

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
    var home = document.querySelector('.nav .brand');
    if (home) home.focus({ preventScroll: true });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
