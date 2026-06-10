(function () {
  'use strict';

  var WA_NUMBER = '8617751189576';
  var WA_BASE = 'https://wa.me/' + WA_NUMBER;

  var i18n = {
    en: {
      headerTitle: 'KIWL Customer Service',
      headerStatus: 'Online · Typically replies within minutes',
      toggleLabel: 'Chat with us',
      closeLabel: 'Close chat',
      greet: 'Hello! 👋 Welcome to KIWL Machinery.',
      intro: 'We are a professional hollow blow molding machine manufacturer based in Shanghai, China, with 20+ years of experience serving clients in 26+ countries.',
      pagePrefix: 'I see you are browsing:',
      pageAsk: 'Would you like to know more about this page, or speak directly with our sales manager?',
      btnMore: 'Tell me more',
      btnWhatsApp: 'Contact on WhatsApp',
      moreReply: 'Great! Here is a brief overview of what you are viewing:',
      afterMore: 'Our sales manager can provide detailed specs, pricing, and customization options. Click below to start a WhatsApp chat — your page link will be included automatically.',
      waBtn: 'Chat on WhatsApp with Sales',
      waBtnSub: 'Page link included for quick reference',
      userMore: 'Tell me more about this page',
      userWa: 'I want to contact sales on WhatsApp',
      homeContext: 'our homepage featuring KIWL blow molding machines and industry solutions',
      productsContext: 'our product catalog with KIWL C, E, U, and K series machines',
      productContext: 'a specific blow molding machine model',
      solutionsContext: 'our industry-specific blow molding solutions',
      solutionContext: 'an industry solution tailored for your sector',
      blogContext: 'our latest news and technology updates',
      articleContext: 'one of our company news articles',
      aboutContext: 'our company profile and manufacturing capabilities',
      serviceContext: 'our after-sales service and support offerings',
      contactContext: 'our contact and inquiry page',
      defaultContext: 'our website',
    },
    ar: {
      headerTitle: 'خدمة عملاء KIWL',
      headerStatus: 'متصل · نرد عادةً خلال دقائق',
      toggleLabel: 'تحدث معنا',
      closeLabel: 'إغلاق المحادثة',
      greet: 'مرحباً! 👋 أهلاً بك في آلات KIWL.',
      intro: 'نحن مصنع محترف لآلات قولبة النفخ المجوفة في شنغهاي، الصين، مع أكثر من 20 عاماً من الخبرة في خدمة عملاء من أكثر من 26 دولة.',
      pagePrefix: 'أرى أنك تتصفح:',
      pageAsk: 'هل تود معرفة المزيد عن هذه الصفحة، أم التحدث مباشرة مع مدير المبيعات؟',
      btnMore: 'أخبرني المزيد',
      btnWhatsApp: 'تواصل عبر واتساب',
      moreReply: 'رائع! إليك نظرة عامة على ما تتصفحه:',
      afterMore: 'يمكن لمدير المبيعات تزويدك بالمواصفات والأسعار وخيارات التخصيص. انقر أدناه لبدء محادثة واتساب — سيتم تضمين رابط الصفحة تلقائياً.',
      waBtn: 'تحدث مع المبيعات عبر واتساب',
      waBtnSub: 'رابط الصفحة مرفق للمراجعة السريعة',
      userMore: 'أخبرني المزيد عن هذه الصفحة',
      userWa: 'أريد التواصل مع المبيعات عبر واتساب',
      homeContext: 'الصفحة الرئيسية التي تعرض آلات قولبة النفخ وحلول الصناعة',
      productsContext: 'كتالوج المنتجات بسلسلة KIWL C و E و U و K',
      productContext: 'موديل محدد من آلات قولبة النفخ',
      solutionsContext: 'حلول قولبة النفخ الخاصة بالصناعة',
      solutionContext: 'حل صناعي مخصص لقطاعك',
      blogContext: 'أحدث الأخبار وتحديثات التكنولوجيا',
      articleContext: 'أحد أخبار شركتنا',
      aboutContext: 'ملف الشركة وقدرات التصنيع',
      serviceContext: 'خدمات ما بعد البيع والدعم',
      contactContext: 'صفحة الاتصال والاستفسار',
      defaultContext: 'موقعنا الإلكتروني',
    },
  };

  var root, panel, messagesEl, actionsEl, waBtn, toggleBtn;
  var chatStarted = false;
  var step = 0;

  function getLang() {
    try {
      if (location.pathname.indexOf('/ar') === 0) return 'ar';
      return localStorage.getItem('language') === 'ar' ? 'ar' : 'en';
    } catch (e) {
      return 'en';
    }
  }

  function t(key) {
    var lang = getLang();
    return (i18n[lang] && i18n[lang][key]) || i18n.en[key] || key;
  }

  function getPathname() {
    var p = window.location.pathname || '/';
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
  }

  function getPageInfo() {
    var path = getPathname();
    var url = window.location.href.split('#')[0];
    var cfg = window.SEO_CONFIG;
    var lang = getLang();
    var pages = cfg && (lang === 'ar' ? cfg.pagesAr : cfg.pages);
    var meta = (pages && pages[path]) || (pages && pages['/']) || {};
    var title = meta.title || document.title;
    var description = meta.description || '';
    var contextKey = 'defaultContext';

    if (path === '/') contextKey = 'homeContext';
    else if (path === '/products') contextKey = 'productsContext';
    else if (path.indexOf('/product/') === 0) contextKey = 'productContext';
    else if (path === '/solutions') contextKey = 'solutionsContext';
    else if (path.indexOf('/solution/') === 0) contextKey = 'solutionContext';
    else if (path === '/blog') contextKey = 'blogContext';
    else if (path.indexOf('/blog/') === 0) contextKey = 'articleContext';
    else if (path === '/about') contextKey = 'aboutContext';
    else if (path === '/service') contextKey = 'serviceContext';
    else if (path === '/contact') contextKey = 'contactContext';

    return {
      path: path,
      url: url,
      title: title,
      description: description,
      context: t(contextKey),
    };
  }

  function buildWhatsAppUrl() {
    var page = getPageInfo();
    var lang = getLang();
    var text;

    if (lang === 'ar') {
      text =
        'مرحباً فريق مبيعات KIWL،\n\n' +
        'أنا مهتم بآلات قولبة النفخ الخاصة بكم وأود الاستفسار.\n\n' +
        '📄 الصفحة التي أتصفحها:\n' +
        page.title + '\n' +
        page.url + '\n\n' +
        'يرجى مساعدتي. شكراً!';
    } else {
      text =
        'Hello KIWL Sales Team,\n\n' +
        'I am interested in your hollow blow molding machines and would like to inquire.\n\n' +
        '📄 Page I am viewing:\n' +
        page.title + '\n' +
        page.url + '\n\n' +
        'Please assist me. Thank you!';
    }

    return WA_BASE + '?text=' + encodeURIComponent(text);
  }

  function applyDirection() {
    var lang = getLang();
    if (lang === 'ar') {
      root.classList.add('rtl');
      root.setAttribute('dir', 'rtl');
    } else {
      root.classList.remove('rtl');
      root.setAttribute('dir', 'ltr');
    }
    if (toggleBtn) toggleBtn.setAttribute('aria-label', t('toggleLabel'));
    updateHeader();
    updateWaBtn();
  }

  function updateHeader() {
    var h3 = root.querySelector('.kiwl-support-header-text h3');
    var p = root.querySelector('.kiwl-support-header-text p');
    if (h3) h3.textContent = t('headerTitle');
    if (p) p.textContent = t('headerStatus');
  }

  function updateWaBtn() {
    if (waBtn) {
      waBtn.href = buildWhatsAppUrl();
      waBtn.querySelector('.kiwl-wa-label').textContent = t('waBtn');
      waBtn.querySelector('.kiwl-wa-sub').textContent = t('waBtnSub');
    }
  }

  function scrollMessages() {
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(text, type, extraClass) {
    var div = document.createElement('div');
    div.className = 'kiwl-msg ' + type + (extraClass ? ' ' + extraClass : '');
    div.innerHTML = text;
    messagesEl.appendChild(div);
    scrollMessages();
    return div;
  }

  function showTyping(ms) {
    return new Promise(function (resolve) {
      var el = document.createElement('div');
      el.className = 'kiwl-typing';
      el.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(el);
      scrollMessages();
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
        resolve();
      }, ms || 900);
    });
  }

  function delay(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  function setQuickButtons(buttons) {
    var container = actionsEl.querySelector('.kiwl-quick-btns');
    container.innerHTML = '';
    buttons.forEach(function (btn) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'kiwl-quick-btn';
      b.textContent = btn.label;
      b.disabled = !!btn.disabled;
      if (btn.onClick) b.addEventListener('click', btn.onClick);
      container.appendChild(b);
    });
  }

  function showWaButton() {
    waBtn.href = buildWhatsAppUrl();
    waBtn.classList.remove('hidden');
  }

  async function runIntroFlow() {
    if (chatStarted) return;
    chatStarted = true;
    step = 0;
    messagesEl.innerHTML = '';
    waBtn.classList.add('hidden');
    setQuickButtons([]);

    var page = getPageInfo();

    await showTyping(800);
    addMessage(t('greet'), 'bot');

    await delay(400);
    await showTyping(1000);
    addMessage(t('intro'), 'bot');

    await delay(500);
    await showTyping(900);
    addMessage(
      t('pagePrefix') + ' <strong>' + page.title + '</strong><br><span style="color:#64748b;font-size:12px">' + page.context + '</span>',
      'bot',
      'page-ref'
    );

    await delay(400);
    await showTyping(700);
    addMessage(t('pageAsk'), 'bot');

    setQuickButtons([
      { label: t('btnMore'), onClick: onMoreClick },
      { label: t('btnWhatsApp'), onClick: onWaClick },
    ]);
    step = 1;
  }

  async function onMoreClick() {
    setQuickButtons([]);
    addMessage(t('userMore'), 'user');

    var page = getPageInfo();

    await delay(300);
    await showTyping(900);
    addMessage(t('moreReply'), 'bot');

    await delay(400);
    await showTyping(1100);
    var desc = page.description || page.title;
    addMessage('<strong>' + page.title + '</strong><br>' + desc, 'bot', 'page-ref');

    await delay(500);
    await showTyping(800);
    addMessage(t('afterMore'), 'bot');

    showWaButton();
    setQuickButtons([
      { label: t('btnWhatsApp'), onClick: onWaClick },
    ]);
    step = 2;
  }

  async function onWaClick() {
    setQuickButtons([]);
    addMessage(t('userWa'), 'user');

    await delay(300);
    await showTyping(700);
    addMessage(t('afterMore'), 'bot');

    showWaButton();
    step = 3;
  }

  function resetChat() {
    chatStarted = false;
    step = 0;
    messagesEl.innerHTML = '';
    waBtn.classList.add('hidden');
    setQuickButtons([]);
  }

  function openPanel() {
    panel.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    applyDirection();
    runIntroFlow();
  }

  function closePanel() {
    panel.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  function togglePanel() {
    if (panel.classList.contains('open')) {
      closePanel();
    } else {
      openPanel();
    }
  }

  function createWidget() {
    root = document.createElement('div');
    root.id = 'kiwl-support-root';

    root.innerHTML =
      '<button type="button" class="kiwl-support-toggle" aria-label="Chat with us" aria-expanded="false">' +
        '<span class="kiwl-badge"></span>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
        '</svg>' +
      '</button>' +
      '<div class="kiwl-support-panel" role="dialog" aria-label="Customer service chat">' +
        '<div class="kiwl-support-header">' +
          '<div class="kiwl-support-avatar">KI</div>' +
          '<div class="kiwl-support-header-text">' +
            '<h3>KIWL Customer Service</h3>' +
            '<p>Online</p>' +
          '</div>' +
          '<button type="button" class="kiwl-support-close" aria-label="Close">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="kiwl-support-messages"></div>' +
        '<div class="kiwl-support-actions">' +
          '<div class="kiwl-quick-btns"></div>' +
          '<a class="kiwl-wa-btn hidden" href="' + WA_BASE + '" target="_blank" rel="noopener noreferrer">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
            '<span><span class="kiwl-wa-label">Chat on WhatsApp</span><br><small class="kiwl-wa-sub" style="font-weight:400;opacity:0.9;font-size:11px">Page link included</small></span>' +
          '</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(root);

    toggleBtn = root.querySelector('.kiwl-support-toggle');
    panel = root.querySelector('.kiwl-support-panel');
    messagesEl = root.querySelector('.kiwl-support-messages');
    actionsEl = root.querySelector('.kiwl-support-actions');
    waBtn = root.querySelector('.kiwl-wa-btn');

    toggleBtn.addEventListener('click', togglePanel);
    root.querySelector('.kiwl-support-close').addEventListener('click', closePanel);

    applyDirection();
  }

  function onRouteChange() {
    updateWaBtn();
    if (panel && panel.classList.contains('open') && chatStarted) {
      resetChat();
      runIntroFlow();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }

  window.addEventListener('popstate', onRouteChange);
  window.addEventListener('kiwl-lang-change', function () {
    applyDirection();
    if (panel && panel.classList.contains('open')) {
      resetChat();
      runIntroFlow();
    }
  });

  var origPush = history.pushState;
  var origReplace = history.replaceState;
  history.pushState = function () {
    origPush.apply(history, arguments);
    onRouteChange();
  };
  history.replaceState = function () {
    origReplace.apply(history, arguments);
    onRouteChange();
  };

  var langPoll = getLang();
  setInterval(function () {
    var cur = getLang();
    if (cur !== langPoll) {
      langPoll = cur;
      applyDirection();
    }
  }, 500);
})();
