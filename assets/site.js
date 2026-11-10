// Acute By — progressive enhancements, UI interactions & multilingual URL routing.
(function () {
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Language URL Subpath Routing ----------
  var currentPath = window.location.pathname;
  var pathLangMatch = currentPath.match(/^\/(fr|es|de|ar|ur)(\/|$)/);
  var currentUrlLang = pathLangMatch ? pathLangMatch[1] : 'en';

  var messages = {"en":{"select":"Select language","top":"Back to top","close":"Close image preview","zoom":"Click to zoom screenshot","shot":"Game screenshot","copied":"Copied!","menu":"Menu","theme":"Theme","themes":["Daylight","Plum","Midnight","Ocean"]},"fr":{"select":"Choisir la langue","top":"Retour en haut","close":"Fermer l'aperçu de l'image","zoom":"Cliquer pour agrandir la capture d'écran","shot":"Capture d'écran du jeu","copied":"Copié !","menu":"Menu","theme":"Thème","themes":["Jour","Prune","Minuit","Océan"]},"es":{"select":"Elegir idioma","top":"Volver arriba","close":"Cerrar la vista previa","zoom":"Haz clic para ampliar la captura","shot":"Captura del juego","copied":"¡Copiado!","menu":"Menú","theme":"Tema","themes":["Día","Ciruela","Medianoche","Océano"]},"de":{"select":"Sprache wählen","top":"Nach oben","close":"Bildvorschau schließen","zoom":"Zum Vergrößern klicken","shot":"Screenshot des Spiels","copied":"Kopiert!","menu":"Menü","theme":"Farbthema","themes":["Tageslicht","Pflaume","Mitternacht","Ozean"]},"ar":{"select":"اختر اللغة","top":"العودة إلى الأعلى","close":"إغلاق معاينة الصورة","zoom":"انقر لتكبير لقطة الشاشة","shot":"لقطة شاشة من اللعبة","copied":"تم النسخ!","menu":"القائمة","theme":"المظهر","themes":["نهار","برقوقي","منتصف الليل","محيط"]},"ur":{"select":"زبان منتخب کریں","top":"اوپر جائیں","close":"تصویر کا پیش نظارہ بند کریں","zoom":"اسکرین شاٹ بڑا کرنے کے لیے کلک کریں","shot":"گیم کا اسکرین شاٹ","copied":"کاپی ہو گیا!","menu":"مینو","theme":"تھیم","themes":["دن","آلوچہ","آدھی رات","سمندر"]}}[currentUrlLang];

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

  // Pages that exist in every language. Game privacy policies are English only, so other languages open
  // the translated list of policies at that game; anything else goes to that language's home page.
  var translatedPages = ['/', '/games.html', '/websites.html', '/about.html', '/contact.html', '/privacy.html', '/terms.html', '/jarlings/', '/mahjong-sunroom/', '/paint-parade/', '/one-touch-survivor/', '/chrono-detective/', '/file-icu-app/', '/health-icu-app/'];

  function navigateToLanguage(targetLang) {
    if (targetLang === currentUrlLang) return;

    var cleanPath = currentPath.replace(/^\/(fr|es|de|ar|ur)(\/|$)/, '/');
    if (cleanPath === '/index.html') cleanPath = '/';
    if (cleanPath === '/' || translatedPages.indexOf(cleanPath) !== -1) { /* already a page address */ }
    else if (translatedPages.indexOf(cleanPath + '/') !== -1) cleanPath += '/';
    else if (!/\.html$/.test(cleanPath)) cleanPath = cleanPath.replace(/\/$/, '') + '.html';

    var hash = window.location.hash;
    if (translatedPages.indexOf(cleanPath) === -1) {
      var game = cleanPath.match(/^\/([a-z-]+)\/privacy/);
      cleanPath = game ? '/privacy.html' : '/';
      hash = game ? '#' + game[1] : '';
    }

    try { localStorage.setItem('acute_lang', targetLang); } catch (error) { /* the language still changes */ }
    window.location.href = (targetLang === 'en' ? '' : '/' + targetLang) + cleanPath + hash;
  }

  // Language picker, placed before the Contact button.
  var navUl = document.querySelector('.nav .wrap ul');
  if (navUl && !document.querySelector('.lang-picker')) {
    var li = document.createElement('li');
    li.className = 'lang-picker';
    li.innerHTML = '<select class="lang-select" aria-label="' + messages.select + '">' +
      '<option value="en">EN · English</option>' +
      '<option value="fr">FR · Français</option>' +
      '<option value="es">ES · Español</option>' +
      '<option value="de">DE · Deutsch</option>' +
      '<option value="ar">AR · العربية</option>' +
      '<option value="ur">UR · اردو</option>' +
      '</select>';
    var cta = navUl.querySelector('a.cta');
    navUl.insertBefore(li, cta ? cta.parentNode : null);

    var select = li.querySelector('.lang-select');
    select.value = currentUrlLang;
    // Show the short code once chosen, the full name in the open list.
    [].forEach.call(select.options, function (o) { o.dataset.full = o.textContent; });
    function compact() { [].forEach.call(select.options, function (o) { o.textContent = o.selected ? o.value.toUpperCase() : o.dataset.full; }); }
    compact();
    select.addEventListener('focus', function () { [].forEach.call(select.options, function (o) { o.textContent = o.dataset.full; }); });
    select.addEventListener('blur', compact);
    select.addEventListener('change', function () { navigateToLanguage(this.value); });
  }

  // Colour themes. No choice yet means Daylight, or the dark Plum theme when the device is in dark mode.
  var themes = [['daylight', '#FFF1E6', '#FF6B8B'], ['plum', '#170E33', '#E352DA'], ['midnight', '#0B0B0D', '#FF9F5A'], ['ocean', '#06182B', '#2BB8F0']];
  if (navUl) {
    var tli = document.createElement('li');
    tli.className = 'theme-picker';
    var tbtn = document.createElement('button');
    tbtn.type = 'button';
    tbtn.className = 'theme-btn';
    tbtn.setAttribute('aria-label', messages.theme);
    tbtn.setAttribute('aria-haspopup', 'true');
    tbtn.setAttribute('aria-expanded', 'false');
    tbtn.innerHTML = '<i></i>';
    var tmenu = document.createElement('div');
    tmenu.className = 'theme-menu';
    tmenu.setAttribute('role', 'group');
    tmenu.setAttribute('aria-label', messages.theme);
    themes.forEach(function (t, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.theme = t[0];
      b.innerHTML = '<i style="background:linear-gradient(135deg,' + t[1] + ' 48%,' + t[2] + ')"></i><span></span>';
      b.querySelector('span').textContent = messages.themes[i];
      tmenu.appendChild(b);
    });
    tli.appendChild(tbtn);
    tli.appendChild(tmenu);
    var langLi = navUl.querySelector('.lang-picker');
    navUl.insertBefore(tli, langLi || null);

    var themeMeta = document.querySelector('meta[name="theme-color"]');
    function current() {
      var t = root.getAttribute('data-theme');
      if (t) return t;
      return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'plum' : 'daylight';
    }
    function paint() {
      var t = current();
      themes.forEach(function (x) { if (x[0] === t) { tbtn.firstChild.style.background = 'linear-gradient(135deg,' + x[1] + ' 48%,' + x[2] + ')'; if (themeMeta) themeMeta.content = x[1]; } });
      [].forEach.call(tmenu.children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.theme === t)); });
    }
    function openMenu(open) {
      tli.classList.toggle('open', open);
      tbtn.setAttribute('aria-expanded', String(open));
    }
    paint();
    tbtn.addEventListener('click', function () { openMenu(!tli.classList.contains('open')); });
    tmenu.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      root.setAttribute('data-theme', b.dataset.theme);
      try { localStorage.setItem('acute_theme', b.dataset.theme); } catch (error) { /* the theme still changes for this page */ }
      paint();
      openMenu(false);
      tbtn.focus();
    });
    document.addEventListener('click', function (e) { if (tli.classList.contains('open') && !tli.contains(e.target)) openMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && tli.classList.contains('open')) { openMenu(false); tbtn.focus(); } });
  }

  // Mobile menu: the nav links move into a panel behind a button.
  var nav = document.querySelector('.nav');
  if (nav && navUl) {
    var panel = document.createElement('div');
    panel.className = 'nav-panel';
    panel.id = 'nav-panel';
    navUl.querySelectorAll('li:not(.lang-picker):not(.theme-picker) > a').forEach(function (a) {
      var copy = a.cloneNode(true);
      copy.classList.remove('cta');
      panel.appendChild(copy);
    });
    var menu = document.createElement('button');
    menu.type = 'button';
    menu.className = 'menu-btn';
    menu.setAttribute('aria-label', messages.menu);
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-controls', 'nav-panel');
    menu.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    nav.querySelector('.wrap').appendChild(menu);
    nav.appendChild(panel);
    function setMenu(open) {
      nav.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
    }
    menu.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menu.focus(); } });
    document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target)) setMenu(false); });
  }

  // Solid nav once the page scrolls.
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
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Game tabs on the home page (WAI-ARIA tabs). Without script every game is shown.
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        var p = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (p) p.classList.toggle('on', on);
      });
      if (focus) tab.focus();
      var box = list.getBoundingClientRect(), r = tab.getBoundingClientRect();
      if (r.left < box.left || r.right > box.right) list.scrollLeft += r.left - box.left - 24;
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var rtl = root.dir === 'rtl', next = null;
        if (e.key === 'ArrowDown' || e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowUp' || e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
    // In-game share links such as /#jarlings open that game.
    function fromHash() {
      var id = location.hash.slice(1);
      var tab = id && tabs.filter(function (t) { return t.getAttribute('aria-controls') === id; })[0];
      if (tab) { select(tab); var panel = document.getElementById(id); if (panel) panel.classList.add('in'); }
    }
    fromHash();
    window.addEventListener('hashchange', fromHash);
  });

  // Contact form: opens the visitor's email app with the topic and message filled in. Nothing is sent from the page.
  document.querySelectorAll('form.mail-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var topic = form.querySelector('select');
      var text = form.querySelector('textarea');
      var subject = topic.options[topic.selectedIndex].text + ' \u00b7 Acute By';
      window.location.href = form.getAttribute('action') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text.value);
    });
  });

  // Copy the support email address.
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var label = btn.querySelector('span');
      function done() {
        if (!label) return;
        var old = label.textContent;
        label.textContent = messages.copied;
        setTimeout(function () { label.textContent = old; }, 1600);
      }
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });

  // Screenshot lightbox.
  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = '<button type="button" class="lightbox-close" aria-label="' + messages.close + '">&times;</button><img src="" alt="">';
  document.body.appendChild(lightbox);
  var lbImg = lightbox.querySelector('img');
  var lbClose = lightbox.querySelector('.lightbox-close');
  var lbFrom = null;
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lbFrom) lbFrom.focus();
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });
  document.querySelectorAll('.shots img').forEach(function (img) {
    img.title = messages.zoom;
    img.tabIndex = 0;
    function open() {
      lbFrom = img;
      lbImg.src = img.src;
      lbImg.alt = img.alt || messages.shot;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      lbClose.focus();
    }
    img.addEventListener('click', open);
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  // Back to top, once the visitor has scrolled a screen or so.
  var top = document.createElement('button');
  top.type = 'button';
  top.className = 'to-top';
  top.setAttribute('aria-label', messages.top);
  top.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(top);
  function onScrollTop() { top.classList.toggle('show', window.scrollY > 700); }
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
