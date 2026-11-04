// Acute By: Google Analytics and the visitor's privacy choice, with the same rules as File ICU and Health ICU.
// Ask first in the EEA, the UK, Switzerland and the strict list; elsewhere it runs until the visitor turns it off.
// Those sites get the country from their Worker. GitHub Pages has no server, so the device's time zone stands in for
// it, and an unknown or borderline zone asks first. The game privacy policies do not load this file: the games
// promise no analytics. Global Privacy Control keeps analytics off unless the visitor allows it.
(function () {
  var MEASUREMENT_ID = 'G-H8K2FVD06Q';
  var STORAGE_KEY = 'acute_analytics';
  var ASK_FIRST = /^(Europe\/|Arctic\/Longyearbyen|Africa\/Ceuta|Atlantic\/(Azores|Canary|Faroe|Madeira|Reykjavik)|Indian\/(Mayotte|Reunion)|America\/(Araguaina|Bahia|Belem|Blanc-Sablon|Boa_Vista|Campo_Grande|Cayenne|Cuiaba|Eirunepe|Fortaleza|Guadeloupe|Maceio|Manaus|Martinique|Montreal|Noronha|Porto_Velho|Recife|Rio_Branco|Santarem|Sao_Paulo|Toronto)|Asia\/(Bangkok|Chongqing|Famagusta|Harbin|Istanbul|Kashgar|Nicosia|Riyadh|Seoul|Shanghai|Urumqi))/;
  var messages = {"en":{"title":"Your cookie choices","text":"We use Google Analytics to see which pages people visit, so we can improve this site. It sets cookies. Choose whether to allow it; you can change this at any time from Privacy choices in the footer.","accept":"Accept All","reject":"Reject All","choices":"Privacy choices","close":"Close cookie preferences","more":"Privacy policies"},"fr":{"title":"Vos choix en matière de cookies","text":"Nous utilisons Google Analytics pour savoir quelles pages sont consultées, afin d'améliorer ce site. Il dépose des cookies. Choisissez si vous l'autorisez ; vous pouvez changer d'avis à tout moment via Choix de confidentialité, en bas de page.","accept":"Tout accepter","reject":"Tout refuser","choices":"Choix de confidentialité","close":"Fermer les préférences de cookies","more":"Politiques de confidentialité"},"es":{"title":"Tus preferencias de cookies","text":"Usamos Google Analytics para saber qué páginas se visitan y mejorar este sitio. Instala cookies. Elige si lo permites; puedes cambiarlo cuando quieras en Opciones de privacidad, al pie de la página.","accept":"Aceptar todo","reject":"Rechazar todo","choices":"Opciones de privacidad","close":"Cerrar preferencias de cookies","more":"Políticas de privacidad"},"de":{"title":"Ihre Cookie-Auswahl","text":"Wir verwenden Google Analytics, um zu sehen, welche Seiten besucht werden, und diese Website zu verbessern. Es setzt Cookies. Entscheiden Sie, ob Sie das erlauben; Sie können es jederzeit unter Datenschutzoptionen in der Fußzeile ändern.","accept":"Alle akzeptieren","reject":"Alle ablehnen","choices":"Datenschutzoptionen","close":"Cookie-Einstellungen schließen","more":"Datenschutzerklärungen"},"ar":{"title":"خياراتك بشأن ملفات تعريف الارتباط","text":"نستخدم Google Analytics لمعرفة الصفحات التي تُزار من أجل تحسين هذا الموقع. وهو يضع ملفات تعريف ارتباط. اختر ما إذا كنت تسمح به، ويمكنك تغيير ذلك في أي وقت من «خيارات الخصوصية» في تذييل الصفحة.","accept":"قبول الكل","reject":"رفض الكل","choices":"خيارات الخصوصية","close":"إغلاق تفضيلات ملفات تعريف الارتباط","more":"سياسات الخصوصية"},"ur":{"title":"کوکیز کے بارے میں آپ کا انتخاب","text":"ہم Google Analytics استعمال کرتے ہیں تاکہ جان سکیں کون سے صفحات دیکھے جاتے ہیں اور اس سائٹ کو بہتر بنا سکیں۔ یہ کوکیز لگاتا ہے۔ منتخب کریں کہ آپ اس کی اجازت دیتے ہیں یا نہیں؛ آپ فوٹر میں \"رازداری کے انتخاب\" سے اسے کسی بھی وقت بدل سکتے ہیں۔","accept":"سب قبول کریں","reject":"سب مسترد کریں","choices":"رازداری کے انتخاب","close":"کوکی ترجیحات بند کریں","more":"رازداری کی پالیسیاں"}};

  var match = window.location.pathname.match(/^\/(fr|es|de|ar|ur)(\/|$)/);
  var language = match ? match[1] : 'en';
  var text = messages[language];
  var privacyPage = (language === 'en' ? '' : '/' + language) + '/privacy.html#this-website';
  var loaded = false;
  var banner = null;
  var opener = null;

  function stored() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (error) { return null; }
  }
  function remember(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (error) { /* the choice lasts for this page only */ }
  }
  function timeZone() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (error) { return ''; }
  }

  function startAnalytics() {
    window['ga-disable-' + MEASUREMENT_ID] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // Analytics only measures site use: Google signals and ad personalization stay off, as on the other two sites.
    window.gtag('config', MEASUREMENT_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  function stopAnalytics() {
    window['ga-disable-' + MEASUREMENT_ID] = true;
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      ['', '; domain=' + window.location.hostname, '; domain=.' + window.location.hostname].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + domain;
      });
    });
  }

  function closeBanner() {
    if (banner) banner.remove();
    banner = null;
    if (opener) opener.focus();
    opener = null;
  }

  function choose(value) {
    remember(value);
    if (value === 'granted') startAnalytics();
    else stopAnalytics();
    closeBanner();
  }

  function button(label, className, action) {
    var element = document.createElement('button');
    element.type = 'button';
    element.className = className;
    element.textContent = label;
    element.addEventListener('click', action);
    return element;
  }

  function showBanner(from) {
    if (banner) return;
    opener = from || null;
    banner = document.createElement('section');
    banner.className = 'consent';
    banner.setAttribute('aria-label', text.title);

    var title = document.createElement('p');
    title.className = 'consent-title';
    title.textContent = text.title;

    var body = document.createElement('p');
    body.textContent = text.text + ' ';
    var link = document.createElement('a');
    link.href = privacyPage;
    link.textContent = text.more;
    body.appendChild(link);

    var actions = document.createElement('div');
    actions.className = 'consent-actions';
    var accept = button(text.accept, 'consent-choice', function () { choose('granted'); });
    actions.appendChild(accept);
    actions.appendChild(button(text.reject, 'consent-choice', function () { choose('denied'); }));

    var close = button('\u00d7', 'consent-close', closeBanner);
    close.setAttribute('aria-label', text.close);

    banner.appendChild(close);
    banner.appendChild(title);
    banner.appendChild(body);
    banner.appendChild(actions);
    document.body.appendChild(banner);
    if (from) accept.focus();
  }

  var footerNav = document.querySelector('footer nav');
  if (footerNav) {
    var choices = button(text.choices, 'footer-choice', function () { showBanner(choices); });
    footerNav.appendChild(choices);
  }

  var choice = stored();
  var zone = timeZone();
  if (choice === 'granted') startAnalytics();
  else if (choice === 'denied' || navigator.globalPrivacyControl === true) window['ga-disable-' + MEASUREMENT_ID] = true;
  else if (!zone || ASK_FIRST.test(zone)) showBanner();
  else startAnalytics();
})();
