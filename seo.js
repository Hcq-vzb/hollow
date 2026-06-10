(function () {

  'use strict';



  var cfg = window.SEO_CONFIG;

  if (!cfg) return;



  var SITE = cfg.site;

  var DEFAULT_IMAGE = cfg.ogImage;



  function getLang() {

    try {

      if (location.pathname.indexOf('/ar') === 0) return 'ar';

      return localStorage.getItem('language') === 'ar' ? 'ar' : 'en';

    } catch (e) {

      return 'en';

    }

  }



  function getPathname() {

    var p = window.location.pathname || '/';

    if (p.indexOf('/ar') === 0) p = p.replace(/^\/ar/, '') || '/';

    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);

    return p || '/';

  }



  function getPageImage(meta) {

    if (meta.imageUrl) return meta.imageUrl;

    if (meta.image) return meta.image.indexOf('http') === 0 ? meta.image : SITE + '/' + meta.image;

    return DEFAULT_IMAGE;

  }



  function upsertMeta(attr, key, content) {

    var selector = 'meta[' + attr + '="' + key + '"]';

    var el = document.querySelector(selector);

    if (!el) {

      el = document.createElement('meta');

      el.setAttribute(attr, key);

      document.head.appendChild(el);

    }

    el.setAttribute('content', content);

  }



  function upsertLink(rel, href, extra) {

    var el = document.querySelector('link[rel="' + rel + '"]' + (extra ? '[' + extra.attr + '="' + extra.value + '"]' : ''));

    if (!el) {

      el = document.createElement('link');

      el.setAttribute('rel', rel);

      if (extra) el.setAttribute(extra.attr, extra.value);

      document.head.appendChild(el);

    }

    el.setAttribute('href', href);

  }



  function removeJsonLd() {

    document.querySelectorAll('script[data-seo-jsonld]').forEach(function (n) {

      n.parentNode.removeChild(n);

    });

  }



  function injectJsonLd(data) {

    var s = document.createElement('script');

    s.type = 'application/ld+json';

    s.setAttribute('data-seo-jsonld', '1');

    s.textContent = JSON.stringify(data);

    document.head.appendChild(s);

  }



  function buildSchemas(path, meta, canonical) {

    var schemas = [];

    var lang = getLang();

    var image = getPageImage(meta);

    var enHref = SITE + (path === '/' ? '/' : path);

    var arHref = SITE + '/ar' + (path === '/' ? '/' : path);



    if (path === '/') {

      schemas.push({

        '@context': 'https://schema.org',

        '@type': 'Organization',

        name: cfg.siteName,

        url: SITE,

        logo: DEFAULT_IMAGE,

        description: meta.description,

        address: {

          '@type': 'PostalAddress',

          addressLocality: 'Shanghai',

          addressCountry: 'CN',

        },

        contactPoint: {

          '@type': 'ContactPoint',

          contactType: 'sales',

          telephone: '+86-17751189576',

          availableLanguage: ['English', 'Arabic'],

        },

      });

      schemas.push({

        '@context': 'https://schema.org',

        '@type': 'WebSite',

        name: cfg.siteName,

        url: SITE,

        inLanguage: lang === 'ar' ? 'ar' : 'en',

        publisher: { '@type': 'Organization', name: cfg.siteName },

      });

    }



    if (meta.type === 'product' && meta.productName) {

      schemas.push({

        '@context': 'https://schema.org',

        '@type': 'Product',

        name: meta.productName,

        sku: meta.sku || meta.productName,

        description: meta.description,

        image: image,

        brand: { '@type': 'Brand', name: 'KIWL' },

        manufacturer: { '@type': 'Organization', name: cfg.siteName, url: SITE },

        url: canonical,

      });

    }



    if (meta.type === 'article' && meta.article) {

      schemas.push({

        '@context': 'https://schema.org',

        '@type': 'BlogPosting',

        headline: meta.article.headline,

        description: meta.description,

        datePublished: meta.article.datePublished,

        dateModified: meta.article.dateModified || meta.article.datePublished,

        image: image,

        author: { '@type': 'Organization', name: cfg.siteName },

        publisher: {

          '@type': 'Organization',

          name: cfg.siteName,

          logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE },

        },

        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },

      });

    }



    if (path !== '/') {

      var crumbs = [{ name: lang === 'ar' ? 'الرئيسية' : 'Home', item: SITE + '/' }];

      var segments = path.split('/').filter(Boolean);

      var acc = '';

      segments.forEach(function (seg, i) {

        acc += '/' + seg;

        var label = seg.replace(/-/g, ' ');

        if (seg === 'products') label = lang === 'ar' ? 'المنتجات' : 'Products';

        if (seg === 'product') label = lang === 'ar' ? 'منتج' : 'Product';

        if (seg === 'blog') label = lang === 'ar' ? 'المدونة' : 'Blog';

        if (seg === 'solution') label = lang === 'ar' ? 'الحلول' : 'Solutions';

        if (seg.startsWith('kiwl-')) label = seg.toUpperCase().replace('kiwl-', 'KIWL-');

        crumbs.push({

          name: label,

          item: i === segments.length - 1 ? canonical : SITE + acc,

        });

      });

      schemas.push({

        '@context': 'https://schema.org',

        '@type': 'BreadcrumbList',

        itemListElement: crumbs.map(function (c, idx) {

          return {

            '@type': 'ListItem',

            position: idx + 1,

            name: c.name,

            item: c.item,

          };

        }),

      });

    }



    return schemas;

  }



  function applySeo() {

    var path = getPathname();

    var lang = getLang();

    var pages = lang === 'ar' ? cfg.pagesAr : cfg.pages;

    var meta = pages[path] || pages['/'];

    var enHref = SITE + (path === '/' ? '/' : path);

    var arHref = SITE + '/ar' + (path === '/' ? '/' : path);

    var canonical = lang === 'ar' ? arHref : enHref;

    var image = getPageImage(meta);



    document.title = meta.title;

    upsertMeta('name', 'description', meta.description);

    if (meta.keywords) upsertMeta('name', 'keywords', meta.keywords);

    upsertLink('canonical', canonical);



    upsertMeta('property', 'og:type', meta.type === 'article' ? 'article' : 'website');

    upsertMeta('property', 'og:site_name', cfg.siteName);

    upsertMeta('property', 'og:title', meta.title);

    upsertMeta('property', 'og:description', meta.description);

    upsertMeta('property', 'og:url', canonical);

    upsertMeta('property', 'og:image', image);

    upsertMeta('property', 'og:locale', lang === 'ar' ? 'ar_SA' : 'en_US');



    upsertMeta('name', 'twitter:card', 'summary_large_image');

    upsertMeta('name', 'twitter:title', meta.title);

    upsertMeta('name', 'twitter:description', meta.description);

    upsertMeta('name', 'twitter:image', image);



    upsertLink('alternate', enHref, { attr: 'hreflang', value: 'en' });

    upsertLink('alternate', arHref, { attr: 'hreflang', value: 'ar' });

    upsertLink('alternate', enHref, { attr: 'hreflang', value: 'x-default' });



    removeJsonLd();

    buildSchemas(path, meta, canonical).forEach(injectJsonLd);

  }



  function migrateHashUrl() {

    var hash = window.location.hash;

    if (hash && hash.indexOf('#/') === 0) {

      var target = hash.slice(1);

      history.replaceState(null, '', target + window.location.search);

    }

  }



  migrateHashUrl();

  applySeo();



  window.addEventListener('popstate', applySeo);

  window.addEventListener('hashchange', function () {

    migrateHashUrl();

    applySeo();

  });



  var pushState = history.pushState;

  var replaceState = history.replaceState;

  history.pushState = function () {

    pushState.apply(history, arguments);

    applySeo();

  };

  history.replaceState = function () {

    replaceState.apply(history, arguments);

    applySeo();

  };



  window.addEventListener('kiwl-lang-change', applySeo);



  var langPoll = getLang();

  setInterval(function () {

    var current = getLang();

    if (current !== langPoll) {

      langPoll = current;

      applySeo();

    }

  }, 500);

})();


