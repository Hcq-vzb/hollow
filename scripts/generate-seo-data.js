const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const bundle = fs.readFileSync(path.join(ROOT, 'bundle.js'), 'utf8');
const SITE = 'https://hollowblowmolders.com';
const LOGO = 'c8fa0b915c846a3bbd6e.jpeg';
const OG_IMAGE = `${SITE}/${LOGO}`;

function parseAssets(src) {
  const assets = {};
  const re = /(\d+)\(e,t,n\)\{e\.exports=n\.p\+"([^"]+)"\}/g;
  let m;
  while ((m = re.exec(src)) !== null) assets[m[1]] = m[2];
  return assets;
}

function parseProductImages(src, assets) {
  const products = {};
  const re = /"(kiwl-[^"]+)":\{id:\d+,brand:"KIWL",model:"[^"]+",series:"[^"]+",mainImage:new URL\(a\((\d+)\),a\.b\)\.href/g;
  let m;
  while ((m = re.exec(src)) !== null) products[m[1]] = assets[m[2]];
  return products;
}

function toIsoDate(display, id) {
  const base = !Number.isNaN(Date.parse(display)) ? new Date(display) : new Date('2026-05-13');
  base.setDate(base.getDate() - (id - 1) * 14);
  return base.toISOString().slice(0, 10);
}

function imgUrl(file) {
  return file ? `${SITE}/${file}` : OG_IMAGE;
}

const assets = parseAssets(bundle);
const productImages = parseProductImages(bundle, assets);

const blogs = [];
const blogRe = /\{id:(\d+),title:"([^"]+)",date:"([^"]+)",image:new URL\(a\((\d+)\),a\.b\)\.href,excerpt:"([^"]*)",path:"(\/blog\/\d+)"\}/g;
let m;
while ((m = blogRe.exec(bundle)) !== null) {
  const id = +m[1];
  blogs.push({
    id,
    title: m[2],
    date: m[3],
    datePublished: toIsoDate(m[3], id),
    excerpt: m[5],
    path: m[6],
    image: assets[m[4]],
    body: m[5] + ' KIWL Machinery continues to invest in blow molding innovation, manufacturing excellence, and global customer support from our Shanghai production base.',
  });
}

const solutions = [
  { path: '/solution/chemical-industry', title: 'Chemical Industry Blow Molding Solutions', description: 'Hollow blow molding machines and packaging solutions for chemical industry containers, drums, and industrial bottles. KIWL provides corrosion-resistant designs and high-capacity production systems.', image: '6299116d84e606b49b78.jpg' },
  { path: '/solution/food-bev', title: 'Food & Beverage Blow Molding Solutions', description: 'Food-grade blow molding machines for bottles, jars, and beverage packaging with hygienic production standards and oil-free clamping options.', image: '6e7dc808987ebf83fbde.jpg' },
  { path: '/solution/medical', title: 'Medical & Pharmaceutical Blow Molding Solutions', description: 'Precision blow molding equipment for medical and pharmaceutical containers, IV bottles, and sterile packaging with clean-room compatibility.', image: '97ca6afa1403f3690bfb.png' },
  { path: '/solution/packaging', title: 'Packaging Industry Blow Molding Solutions', description: 'High-output blow molding machines for diverse packaging applications and custom bottle production with rapid mold change capability.', image: '354f0f6c83cfeb296d82.png' },
  { path: '/solution/automotive', title: 'Automotive Parts Blow Molding Solutions', description: 'Blow molding solutions for automotive fluid reservoirs, ducts, and plastic hollow components with consistent wall thickness control.', image: 'fec86fb65ef6250c1d46.png' },
  { path: '/solution/daily-chemicals', title: 'Daily Chemicals Blow Molding Solutions', description: 'Blow molding machines for shampoo, detergent, and personal care product bottles and containers in multiple volumes and shapes.', image: '8d09b8fc5760f5263d86.png' },
];

const productPaths = [...new Set([...bundle.matchAll(/path:"(\/product\/kiwl-[^"]+)"/g)].map((x) => x[1]))];

function productNameFromPath(p) {
  return p.split('/').pop().replace(/kiwl-/i, 'KIWL-').toUpperCase().replace(/-(\d)/g, '-$1');
}

function productSeries(name) {
  const s = name.match(/KIWL-([A-Z])/);
  return s ? `KIWL-${s[1]} Series` : 'KIWL Series';
}

/* Pyramid keyword tiers (Google: title/description/headings > meta keywords)
   L1 core → homepage only
   L2 category → /products, /solutions, /about, /service, /contact, /blog
   L3 series/industry → solution pages + series context on products
   L4 long-tail → individual product & blog pages */
const KEYWORD_PYRAMID = {
  core: {
    en: ['hollow blow molding machine manufacturer', 'blow molding machine manufacturer China', 'KIWL Machinery', 'plastic blow molding equipment'],
    ar: ['مصنع آلات قولبة النفخ المجوفة', 'مصنع آلات قولبة النفخ الصين', 'آلات KIWL', 'معدات قولبة النفخ البلاستيكية'],
  },
  category: {
    products: {
      en: ['blow molding machines', 'hollow blow molding machines', 'plastic bottle manufacturing equipment', 'KIWL machine catalog'],
      ar: ['آلات قولبة النفخ', 'آلات قولبة النفخ المجوفة', 'معدات تصنيع الزجاجات البلاستيكية', 'كتالوج آلات KIWL'],
    },
    solutions: {
      en: ['industry blow molding solutions', 'custom blow molding solutions', 'plastic container manufacturing'],
      ar: ['حلول قولبة النفخ الصناعية', 'حلول قولبة نفخ مخصصة', 'تصنيع الحاويات البلاستيكية'],
    },
    about: {
      en: ['blow molding machine supplier', 'hollow blow molding manufacturer Shanghai', 'KIWL company profile'],
      ar: ['مورد آلات قولبة النفخ', 'مصنع قولبة النفخ شنغهاي', 'ملف شركة KIWL'],
    },
    service: {
      en: ['blow molding machine service', 'blow molding installation training', 'blow molding spare parts support'],
      ar: ['خدمة آلات قولبة النفخ', 'تركيب وتدريب قولبة النفخ', 'دعم قطع غيار قولبة النفخ'],
    },
    contact: {
      en: ['blow molding machine quote', 'blow molding machine inquiry', 'contact blow molding manufacturer'],
      ar: ['عرض سعر آلة قولبة النفخ', 'استفسار آلة قولبة النفخ', 'اتصل بمصنع قولبة النفخ'],
    },
    blog: {
      en: ['blow molding industry news', 'blow molding technology updates', 'KIWL machinery blog'],
      ar: ['أخبار صناعة قولبة النفخ', 'تحديثات تكنولوجيا قولبة النفخ', 'مدونة آلات KIWL'],
    },
  },
  series: {
    'KIWL-C': {
      en: ['KIWL-C series blow molding machine', 'high-performance blow molding', 'servo wall thickness control'],
      ar: ['سلسلة KIWL-C قولبة النفخ', 'قولبة نفخ عالية الأداء', 'تحكم سماكة الجدار بالسيرفو'],
      focus: 'plastic bottles, drums, and industrial hollow containers',
      focusAr: 'الزجاجات والبراميل والحاويات الصناعية المجوفة',
    },
    'KIWL-E': {
      en: ['KIWL-E series blow molding machine', 'energy-saving blow molding machine', 'electric blow molding equipment'],
      ar: ['سلسلة KIWL-E قولبة النفخ', 'آلة قولبة نفخ موفرة للطاقة', 'معدات قولبة نفخ كهربائية'],
      focus: 'cost-efficient hollow product production with lower energy consumption',
      focusAr: 'إنتاج المنتجات المجوفة بكفاءة تكلفة واستهلاك طاقة أقل',
    },
    'KIWL-U': {
      en: ['KIWL-U series blow molding machine', 'versatile blow molding machine', 'multi-format bottle production'],
      ar: ['سلسلة KIWL-U قولبة النفخ', 'آلة قولبة نفخ متعددة الاستخدامات', 'إنتاج زجاجات متعددة الأشكال'],
      focus: 'versatile bottle and container formats across industries',
      focusAr: 'أشكال متنوعة من الزجاجات والحاويات عبر الصناعات',
    },
    'KIWL-K': {
      en: ['KIWL-K series blow molding machine', 'compact blow molding machine', 'small hollow product manufacturing'],
      ar: ['سلسلة KIWL-K قولبة النفخ', 'آلة قولبة نفخ مدمجة', 'تصنيع المنتجات المجوفة الصغيرة'],
      focus: 'compact production lines for small to medium hollow products',
      focusAr: 'خطوط إنتاج مدمجة للمنتجات المجوفة الصغيرة والمتوسطة',
    },
  },
  solution: {
    '/solution/chemical-industry': {
      en: ['chemical industry blow molding', 'industrial drum blow molding machine', 'chemical container manufacturing'],
      ar: ['قولبة نفخ صناعة الكيماويات', 'آلة قولبة براميل صناعية', 'تصنيع حاويات كيميائية'],
    },
    '/solution/food-bev': {
      en: ['food grade blow molding machine', 'beverage bottle blow molding', 'food packaging blow molding'],
      ar: ['آلة قولبة نفخ غذائية', 'قولبة نفخ زجاجات المشروبات', 'قولبة نفخ تعبئة الأغذية'],
    },
    '/solution/medical': {
      en: ['medical blow molding machine', 'pharmaceutical container blow molding', 'sterile packaging blow molding'],
      ar: ['آلة قولبة نفخ طبية', 'قولبة نفخ حاويات دوائية', 'قولبة نفخ تعبئة معقمة'],
    },
    '/solution/packaging': {
      en: ['packaging blow molding machine', 'custom bottle blow molding', 'high-output blow molding'],
      ar: ['آلة قولبة نفخ للتعبئة', 'قولبة نفخ زجاجات مخصصة', 'قولبة نفخ عالية الإنتاج'],
    },
    '/solution/automotive': {
      en: ['automotive blow molding', 'automotive fluid reservoir blow molding', 'plastic automotive parts blow molding'],
      ar: ['قولبة نفخ السيارات', 'قولبة خزانات سوائل السيارات', 'قولبة قطع بلاستيكية للسيارات'],
    },
    '/solution/daily-chemicals': {
      en: ['daily chemical bottle blow molding', 'shampoo bottle blow molding machine', 'detergent container blow molding'],
      ar: ['قولبة نفخ زجاجات المواد الكيميائية اليومية', 'آلة قولبة زجاجات الشامبو', 'قولبة نفخ حاويات المنظفات'],
    },
  },
};

function seriesKey(name) {
  const m = name.match(/KIWL-([A-Z])/);
  return m ? `KIWL-${m[1]}` : 'KIWL-C';
}

function productDescription(name) {
  const series = productSeries(name);
  const sk = KEYWORD_PYRAMID.series[seriesKey(name)] || KEYWORD_PYRAMID.series['KIWL-C'];
  return `${name} ${seriesKey(name)} series blow molding machine for ${sk.focus}. ${series} with servo wall thickness control — specs and quote from KIWL Machinery.`;
}

function productDescriptionAr(name) {
  const series = productSeries(name);
  const sk = KEYWORD_PYRAMID.series[seriesKey(name)] || KEYWORD_PYRAMID.series['KIWL-C'];
  return `ماكينة ${name} من ${series} لـ${sk.focusAr}. تحكم سيرفو بسماكة الجدار — اطلب المواصفات وعرض السعر من KIWL Machinery.`;
}

function buildKeywords(route, meta, lang) {
  const isAr = lang === 'ar';
  const pick = (arr) => (isAr ? arr.ar || arr.en : arr.en).slice(0, 4);

  if (route === '/') return pick(KEYWORD_PYRAMID.core).join(', ');

  const catMap = {
    '/products': 'products',
    '/solutions': 'solutions',
    '/about': 'about',
    '/service': 'service',
    '/contact': 'contact',
    '/blog': 'blog',
  };
  if (catMap[route]) {
    const cat = KEYWORD_PYRAMID.category[catMap[route]];
    const brand = isAr ? 'آلات KIWL' : 'KIWL Machinery';
    return [...pick(cat), brand].join(', ');
  }

  if (KEYWORD_PYRAMID.solution[route]) {
    const sol = KEYWORD_PYRAMID.solution[route];
    const parent = pick(KEYWORD_PYRAMID.category.solutions).slice(0, 1);
    return [...pick(sol), ...parent].join(', ');
  }

  if (meta.type === 'product' && meta.productName) {
    const sk = KEYWORD_PYRAMID.series[seriesKey(meta.productName)];
    const longtail = isAr
      ? [`ماكينة قولبة النفخ ${meta.productName}`, `قولبة نفخ ${meta.productName}`]
      : [`${meta.productName} blow molding machine`, `${meta.productName} hollow blow molding machine`];
    const seriesKw = sk ? pick(sk).slice(0, 2) : [];
    return [...longtail, ...seriesKw].join(', ');
  }

  if (meta.type === 'article') {
    const blogKw = pick(KEYWORD_PYRAMID.category.blog).slice(0, 2);
    const headline = meta.article?.headline || meta.title || '';
    const topic = headline.split(/[|,]/)[0].trim().slice(0, 40);
    return [...blogKw, topic, isAr ? 'آلات KIWL' : 'KIWL Machinery'].filter(Boolean).join(', ');
  }

  return (isAr ? KEYWORD_PYRAMID.core.ar : KEYWORD_PYRAMID.core.en).slice(0, 3).join(', ');
}

function semanticImagePath(type, slug, ext) {
  return `images/${type}/${slug}.${ext.replace(/^\./, '')}`;
}

function copySemanticImage(hashFile, semanticRel) {
  if (!hashFile) return null;
  const src = path.join(ROOT, hashFile);
  const dest = path.join(ROOT, semanticRel);
  if (!fs.existsSync(src)) return hashFile;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  return semanticRel.replace(/\\/g, '/');
}

const pages = {
  '/': {
    title: 'KIWL Machinery - Professional Hollow Blow Molding Machine Manufacturer',
    description: 'Leading manufacturer of hollow blow molding machines with 20+ years of experience. High-quality plastic manufacturing solutions for global industries.',
    type: 'website',
    image: LOGO,
    body: 'KIWL Machinery Manufacturing Co., Ltd. is a professional hollow blow molding machine manufacturer in Shanghai, China. We supply KIWL C, E, U, and K series machines for chemical, food, medical, packaging, and automotive applications worldwide.',
  },
  '/products': {
    title: 'Blow Molding Machines & Products | KIWL Machinery',
    description: 'Explore KIWL C, E, U, and K series hollow blow molding machines. Professional plastic bottle and container manufacturing equipment for global industries.',
    type: 'website',
    image: '354f0f6c83cfeb296d82.png',
    body: 'Browse the complete KIWL blow molding machine catalog including high-performance C series, energy-saving E series, versatile U series, and compact K series models.',
  },
  '/solutions': {
    title: 'Industry Blow Molding Solutions | KIWL Machinery',
    description: 'Custom hollow blow molding solutions for chemical, food, medical, packaging, automotive, and daily chemical industries.',
    type: 'website',
    image: '6299116d84e606b49b78.jpg',
    body: 'KIWL delivers industry-specific blow molding solutions with tailored machine configurations, mold support, and production line integration.',
  },
  '/about': {
    title: 'About KIWL Machinery | Blow Molding Machine Supplier',
    description: 'KIWL Machinery in Shanghai, China — 20+ years as a trusted blow molding machine supplier. Hollow blow molding machines, precision molds, and global support.',
    type: 'website',
    image: LOGO,
    body: 'Founded with a customer-first philosophy, KIWL has grown into a trusted blow molding machine supplier serving enterprises across 26+ countries with installation, training, and after-sales support.',
  },
  '/blog': {
    title: 'Blow Molding News & Industry Blog | KIWL Machinery',
    description: 'Latest blow molding industry news, technology updates, and production insights from KIWL Machinery. Trends in hollow blow molding manufacturing.',
    type: 'website',
    image: 'e417cf1702eaea654b34.jpeg',
    body: 'Read KIWL company news, production upgrades, technology breakthroughs, and industry trends in hollow blow molding manufacturing.',
  },
  '/service': {
    title: 'Service & Support | KIWL Machinery',
    description: 'Professional after-sales service, installation, training, and maintenance for KIWL blow molding machines worldwide.',
    type: 'website',
    image: LOGO,
    body: 'KIWL provides on-site installation, operator training, spare parts supply, and responsive technical support for blow molding production lines.',
  },
  '/contact': {
    title: 'Contact KIWL Machinery | Get a Quote',
    description: 'Contact KIWL Machinery for blow molding machine inquiries, quotes, and technical support. Shanghai, China.',
    type: 'website',
    image: LOGO,
    body: 'Reach KIWL sales and engineering teams for machine selection, quotation, customization, and export shipping support.',
  },
};

for (const p of productPaths) {
  const slug = p.split('/').pop();
  const name = productNameFromPath(p);
  const hashImg = productImages[slug];
  const ext = hashImg ? path.extname(hashImg).slice(1) : 'png';
  const semantic = copySemanticImage(hashImg, semanticImagePath('products', slug, ext));
  pages[p] = {
    title: `${name} Blow Molding Machine | ${seriesKey(name)} Series`,
    description: productDescription(name),
    type: 'product',
    productName: name,
    sku: name,
    image: semantic || hashImg || LOGO,
    body: `${name} is a ${productSeries(name)} hollow blow molding machine designed for stable clamping force, efficient plasticizing, and consistent bottle quality. Request specifications and quotation from KIWL Machinery.`,
  };
}

for (const sol of solutions) {
  const slug = sol.path.split('/').pop();
  const ext = path.extname(sol.image).slice(1);
  const semantic = copySemanticImage(sol.image, semanticImagePath('solutions', slug, ext));
  pages[sol.path] = {
    title: `${sol.title} | KIWL Machinery`,
    description: sol.description,
    type: 'website',
    image: semantic || sol.image,
    body: sol.description,
  };
}

for (const b of blogs) {
  const ext = path.extname(b.image).slice(1);
  const semantic = copySemanticImage(b.image, semanticImagePath('blog', `post-${b.id}`, ext));
  pages[b.path] = {
    title: `${b.title} | KIWL Blog`,
    description: b.excerpt,
    type: 'article',
    image: semantic || b.image,
    body: b.body,
    article: {
      headline: b.title,
      datePublished: b.datePublished,
      dateModified: b.datePublished,
    },
  };
}

Object.keys(pages).forEach((key) => {
  const page = pages[key];
  if (page.image && !page.image.startsWith('images/')) {
    const slug = key === '/' ? 'home' : key.replace(/^\//, '').replace(/\//g, '-');
    const ext = path.extname(page.image).slice(1) || 'jpeg';
    const folder = key.startsWith('/product/') ? 'products' : key.startsWith('/solution/') ? 'solutions' : key.startsWith('/blog/') ? 'blog' : 'pages';
    const semantic = copySemanticImage(page.image, semanticImagePath(folder, slug, ext));
    if (semantic) page.image = semantic;
  }
  page.imageUrl = imgUrl(page.image);
});

const arStatic = {
  '/': {
    title: 'آلات KIWL - مصنع محترف لآلات قولبة النفخ المجوفة',
    description: 'شركة رائدة في تصنيع آلات قولبة النفخ المجوفة مع أكثر من 20 عامًا من الخبرة. حلول تصنيع بلاستيكية عالية الجودة للصناعات العالمية.',
    body: 'شركة KIWL Machinery Manufacturing Co., Ltd. هي مصنع محترف لآلات قولبة النفخ المجوفة في شنغهاي، الصين. نوفر سلسلة KIWL C و E و U و K لصناعات الكيماويات والأغذية والطب والتعبئة والسيارات.',
  },
  '/products': {
    title: 'آلات قولبة النفخ والمنتجات | آلات KIWL',
    description: 'استكشف سلسلة KIWL C و E و U و K لآلات قولبة النفخ المجوفة. معدات احترافية لتصنيع الزجاجات والحاويات البلاستيكية.',
    body: 'تصفح كتالوج آلات قولبة النفخ KIWL الكامل بما في ذلك سلسلة C عالية الأداء وسلسلة E الموفرة للطاقة وسلسلة U المتعددة الاستخدامات وسلسلة K المدمجة.',
  },
  '/solutions': {
    title: 'حلول قولبة النفخ الصناعية | آلات KIWL',
    description: 'حلول قولبة نفخ مخصصة لصناعات الكيماويات والأغذية والطب والتعبئة والسيارات والمواد الكيميائية اليومية.',
    body: 'توفر KIWL حلول قولبة نفخ مخصصة للصناعة مع تكوينات آلات مخصصة ودعم القوالب وتكامل خطوط الإنتاج.',
  },
  '/about': {
    title: 'عن آلات KIWL | مورد آلات قولبة النفخ',
    description: 'شركة KIWL Machinery في شنغهاي، الصين — أكثر من 20 عامًا كمورد موثوق لآلات قولبة النفخ المجوفة والقوالب الدقيقة ودعم عالمي.',
    body: 'تأسست KIWL على فلسفة العميل أولاً، وأصبحت موردًا موثوقًا لآلات قولبة النفخ تخدم الشركات في أكثر من 26 دولة.',
  },
  '/blog': {
    title: 'أخبار قولبة النفخ والمدونة | آلات KIWL',
    description: 'أحدث أخبار صناعة قولبة النفخ وتحديثات التكنولوجيا ورؤى الإنتاج من KIWL Machinery.',
    body: 'اقرأ أخبار شركة KIWL وتحديثات الإنتاج والاختراقات التكنولوجية واتجاهات صناعة قولبة النفخ المجوفة.',
  },
  '/service': {
    title: 'الخدمة والدعم | آلات KIWL',
    description: 'خدمة ما بعد البيع والتركيب والتدريب والصيانة الاحترافية لآلات قولبة النفخ KIWL في جميع أنحاء العالم.',
    body: 'توفر KIWL التركيب في الموقع وتدريب المشغلين وتوريد قطع الغيار والدعم الفني السريع.',
  },
  '/contact': {
    title: 'اتصل بآلات KIWL | احصل على عرض سعر',
    description: 'تواصل مع KIWL Machinery للاستفسارات وعروض الأسعار والدعم الفني. شنغهاي، الصين.',
    body: 'تواصل مع فرق المبيعات والهندسة في KIWL لاختيار الآلة والتسعير والتخصيص ودعم الشحن.',
  },
};

const arSolutions = {
  '/solution/chemical-industry': 'حلول قولبة النفخ لصناعة الكيماويات',
  '/solution/food-bev': 'حلول قولبة النفخ للأغذية والمشروبات',
  '/solution/medical': 'حلول قولبة النفخ للطب والأدوية',
  '/solution/packaging': 'حلول قولبة النفخ لصناعة التعبئة والتغليف',
  '/solution/automotive': 'حلول قولبة النفخ لقطع السيارات',
  '/solution/daily-chemicals': 'حلول قولبة النفخ للمواد الكيميائية اليومية',
};

const arPages = {};
for (const [route, data] of Object.entries(pages)) {
  const base = arStatic[route];
  if (base) {
    arPages[route] = { ...base, type: data.type, productName: data.productName, sku: data.sku, image: data.image, imageUrl: data.imageUrl, article: data.article, body: base.body };
  } else if (arSolutions[route]) {
    arPages[route] = {
      title: `${arSolutions[route]} | آلات KIWL`,
      description: data.description,
      type: data.type,
      image: data.image,
      imageUrl: data.imageUrl,
      body: data.description,
    };
  } else if (data.type === 'product' && data.productName) {
    arPages[route] = {
      title: `ماكينة قولبة النفخ ${data.productName} | آلات KIWL`,
      description: productDescriptionAr(data.productName),
      type: 'product',
      productName: data.productName,
      sku: data.productName,
      image: data.image,
      imageUrl: data.imageUrl,
      body: `${data.productName} هي ماكينة قولبة نفخ مجوفة من ${productSeries(data.productName)} مصممة لقوة clamping مستقرة وتجانس بلاستيكي وجودة زجاجات ثابتة.`,
    };
  } else if (data.type === 'article' && data.article) {
    arPages[route] = {
      title: `${data.article.headline} | مدونة KIWL`,
      description: data.description,
      type: 'article',
      image: data.image,
      imageUrl: data.imageUrl,
      article: data.article,
      body: data.body,
    };
  } else {
    arPages[route] = { ...data };
  }
  if (!arPages[route].imageUrl) arPages[route].imageUrl = data.imageUrl;
}

for (const [route, meta] of Object.entries(pages)) {
  meta.keywords = buildKeywords(route, meta, 'en');
  meta.tier = route === '/' ? 'core' : ['/products', '/solutions', '/about', '/service', '/contact', '/blog'].includes(route) ? 'category' : route.startsWith('/solution/') ? 'industry' : meta.type === 'product' ? 'longtail' : meta.type === 'article' ? 'longtail' : 'category';
}
for (const [route, meta] of Object.entries(arPages)) {
  meta.keywords = buildKeywords(route, meta, 'ar');
  meta.tier = pages[route]?.tier || 'category';
}

fs.writeFileSync(
  path.join(ROOT, 'seo-data.js'),
  `/* Auto-generated — run: node scripts/generate-seo-data.js */
window.SEO_CONFIG = ${JSON.stringify({ site: SITE, ogImage: OG_IMAGE, siteName: 'KIWL Machinery', pages, pagesAr: arPages }, null, 2)};
`
);

fs.writeFileSync(path.join(ROOT, 'seo-pages.json'), JSON.stringify({ site: SITE, pages, pagesAr: arPages }, null, 2));

const urls = Object.keys(pages).sort((a, b) => {
  if (a === '/') return -1;
  if (b === '/') return 1;
  return a.localeCompare(b);
});

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map((u) => {
    const en = `${SITE}${u === '/' ? '/' : u}`;
    const ar = `${SITE}/ar${u === '/' ? '/' : u}`;
    const lastmod = pages[u].article?.datePublished || today;
    return `  <url>
    <loc>${en}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.startsWith('/blog/') ? 'monthly' : 'weekly'}</changefreq>
    <priority>${u === '/' ? '1.0' : u.startsWith('/product/') ? '0.8' : u.startsWith('/blog/') ? '0.7' : u === '/products' || u === '/solutions' ? '0.9' : '0.6'}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${ar}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
  </url>
  <url>
    <loc>${ar}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.startsWith('/blog/') ? 'monthly' : 'weekly'}</changefreq>
    <priority>${u === '/' ? '1.0' : u.startsWith('/product/') ? '0.8' : u.startsWith('/blog/') ? '0.7' : u === '/products' || u === '/solutions' ? '0.9' : '0.6'}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${ar}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log(`Generated seo-data.js + seo-pages.json (${Object.keys(pages).length} routes)`);
console.log(`Generated sitemap.xml (${urls.length * 2} URLs with en/ar)`);

require('./generate-prerender');
