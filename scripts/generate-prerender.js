const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'seo-pages.json'), 'utf8'));
const SITE = data.site;

function jsonLd(pathname, meta, canonical, lang) {
  const schemas = [];
  const image = meta.imageUrl || `${SITE}/${meta.image || 'c8fa0b915c846a3bbd6e.jpeg'}`;

  if (pathname === '/') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'KIWL Machinery',
      url: SITE,
      logo: `${SITE}/c8fa0b915c846a3bbd6e.jpeg`,
      description: meta.description,
      address: { '@type': 'PostalAddress', addressLocality: 'Shanghai', addressCountry: 'CN' },
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
      name: 'KIWL Machinery',
      url: SITE,
      inLanguage: lang === 'ar' ? 'ar' : 'en',
    });
  }

  if (meta.type === 'product' && meta.productName) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: meta.productName,
      sku: meta.sku || meta.productName,
      description: meta.description,
      image,
      brand: { '@type': 'Brand', name: 'KIWL' },
      manufacturer: { '@type': 'Organization', name: 'KIWL Machinery', url: SITE },
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
      image,
      author: { '@type': 'Organization', name: 'KIWL Machinery' },
      publisher: {
        '@type': 'Organization',
        name: 'KIWL Machinery',
        logo: { '@type': 'ImageObject', url: `${SITE}/c8fa0b915c846a3bbd6e.jpeg` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    });
  }

  return schemas;
}

function buildHtml({ pathname, meta, lang, canonical, enHref, arHref }) {
  const isAr = lang === 'ar';
  const image = meta.imageUrl || `${SITE}/c8fa0b915c846a3bbd6e.jpeg`;
  const schemas = jsonLd(pathname, meta, canonical, lang);
  const body = meta.body || meta.description;
  const arPrefixScript = isAr
    ? `<script>(function(){try{localStorage.setItem('language','ar');}catch(e){}var p=location.pathname.replace(/^\\/ar/,'')||'/';if(p!==location.pathname)history.replaceState(null,'',p+'?lang=ar');})();</script>`
    : '';

  return `<!doctype html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description.replace(/"/g, '&quot;')}">
  ${meta.keywords ? `<meta name="keywords" content="${meta.keywords.replace(/"/g, '&quot;')}">` : ''}
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/jpeg" href="/c8fa0b915c846a3bbd6e.jpeg">
  <link rel="alternate" hreflang="en" href="${enHref}">
  <link rel="alternate" hreflang="ar" href="${arHref}">
  <link rel="alternate" hreflang="x-default" href="${enHref}">
  <meta property="og:type" content="${meta.type === 'article' ? 'article' : 'website'}">
  <meta property="og:site_name" content="KIWL Machinery">
  <meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}">
  <meta property="og:description" content="${meta.description.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta property="og:locale" content="${isAr ? 'ar_SA' : 'en_US'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}">
  <meta name="twitter:description" content="${meta.description.replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="${image}">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <link rel="preload" href="/bundle.js" as="script">
  <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
  <link rel="stylesheet" href="/support-chat.css">
  ${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n  ')}
  <style>html,body{margin:0;padding:0;width:100%;height:100%}html.light,html.light body{background:#fff!important;color:#000}html.dark,html.dark body{background:#1a1a1a!important;color:#fff}</style>
  <script>(function(l){if(l.search[1]==='/'){var d=l.search.slice(1).split('&').map(function(s){return s.replace(/~and~/g,'&')}).join('?');history.replaceState(null,null,l.pathname.slice(0,-1)+d+l.hash)}})(location);</script>
  <script>(function(){if(location.hash&&location.hash.indexOf('#/')===0)history.replaceState(null,'',location.hash.slice(1)+location.search)})();</script>
  <script>(function(){var p=new URLSearchParams(location.search),g=p.get('lang');if(g==='ar'||g==='en')try{localStorage.setItem('language',g)}catch(e){}})();</script>
  ${arPrefixScript}
  <script>(function(){var a=localStorage.getItem('language')==='ar';document.documentElement.lang=a?'ar':'en';document.documentElement.dir=a?'rtl':'ltr';document.documentElement.classList.add('light')})();</script>
</head>
<body>
  <noscript>
    <main style="max-width:960px;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.6">
      <h1>${meta.title.replace(/\|.*$/, '').trim()}</h1>
      <p>${body}</p>
      <p><a href="${enHref}">${isAr ? 'الدخول إلى الموقع' : 'Enter website'}</a> · <a href="${SITE}/contact">${isAr ? 'اتصل بنا' : 'Contact KIWL'}</a></p>
    </main>
  </noscript>
  <div id="root"></div>
  <script src="/seo-data.js"></script>
  <script src="/seo.js"></script>
  <script defer src="/bundle.js"></script>
  <script defer src="/support-chat.js"></script>
</body>
</html>`;
}

function writePage(filePath, html) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

let count = 0;
for (const [pathname, meta] of Object.entries(data.pages)) {
  const enHref = `${SITE}${pathname === '/' ? '/' : pathname}`;
  const arHref = `${SITE}/ar${pathname === '/' ? '/' : pathname}`;
  const enHtml = buildHtml({ pathname, meta, lang: 'en', canonical: enHref, enHref, arHref });
  const arMeta = data.pagesAr[pathname] || meta;
  const arHtml = buildHtml({ pathname, meta: arMeta, lang: 'ar', canonical: arHref, enHref, arHref });

  if (pathname === '/') {
    writePage(path.join(ROOT, 'index.html'), enHtml);
    writePage(path.join(ROOT, 'ar', 'index.html'), arHtml);
  } else {
    const rel = pathname.slice(1);
    writePage(path.join(ROOT, rel, 'index.html'), enHtml);
    writePage(path.join(ROOT, 'ar', rel, 'index.html'), arHtml);
  }
  count += 2;
}

console.log(`Generated ${count} prerendered HTML pages`);
