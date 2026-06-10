const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '../bundle.js');
let s = fs.readFileSync(bundlePath, 'utf8');

const hashGetLocation =
  'function(e,t){let{pathname:n="/",search:r="",hash:a=""}=g(e.location.hash.substr(1));return n.startsWith("/")||n.startsWith(".")||(n="/"+n),m("",{pathname:n,search:r,hash:a},t.state&&t.state.usr||null,t.state&&t.state.key||"default")}';

const browserGetLocation =
  'function(e,t){let{pathname:n="/",search:r="",hash:a=""}=e.location;return m("",{pathname:n,search:r,hash:a},t.state&&t.state.usr||null,t.state&&t.state.key||"default")}';

const hashCreateHref =
  'function(e,t){let n=e.document.querySelector("base"),r="";if(n&&n.getAttribute("href")){let t=e.location.href,n=t.indexOf("#");r=-1===n?t:t.slice(0,n)}return r+"#"+("string"==typeof t?t:f(t))}';

const browserCreateHref = 'function(e,t){return"string"==typeof t?t:f(t)}';

const hashGuard =
  'function(e,t){p("/"===e.pathname.charAt(0),"relative pathnames are not supported in hash history.push("+JSON.stringify(t)+")")}';

const browserGuard =
  'function(e,t){p("/"===e.pathname.charAt(0),"relative pathnames are not supported in history.push("+JSON.stringify(t)+")")}';

if (s.includes(hashGetLocation)) {
  s = s.replace(hashGetLocation, browserGetLocation);
  s = s.replace(hashCreateHref, browserCreateHref);
  s = s.replace(hashGuard, browserGuard);
  console.log('bundle.js patched: hash history → browser history');
} else if (s.includes(browserGetLocation)) {
  console.log('bundle.js already uses browser history');
} else {
  console.error('Unknown router history implementation — manual patch required');
  process.exit(1);
}

const langMetaOverride =
  "document.title=t;var r=document.querySelector('meta[name=\"description\"]');r||((r=document.createElement(\"meta\")).setAttribute(\"name\",\"description\"),document.head.appendChild(r)),r.setAttribute(\"content\",n)";

const langMetaEvent = 'window.dispatchEvent(new Event("kiwl-lang-change"))';

if (s.includes(langMetaOverride)) {
  s = s.replace(langMetaOverride, langMetaEvent);
  console.log('bundle.js patched: language meta → SEO event');
} else if (s.includes(langMetaEvent)) {
  console.log('bundle.js already has SEO language event patch');
} else {
  console.warn('Language meta override pattern not found');
}

const floatComponent =
  'xl=function(){return(0,xi.jsx)("div",{className:"fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3",children:[{type:"whatsapp"';

if (s.includes(floatComponent)) {
  const floatStart = s.indexOf('xl=function(){return(0,xi.jsx)("div",{className:"fixed right-4 top-1/2');
  const floatEnd = s.indexOf('})})};function wl(', floatStart);
  if (floatStart !== -1 && floatEnd !== -1) {
    s = s.slice(0, floatStart) + 'xl=function(){return null}' + s.slice(floatEnd + 4);
    console.log('bundle.js patched: removed legacy WhatsApp/email floating buttons');
  }
} else if (s.includes('xl=function(){return null}')) {
  console.log('bundle.js already has floating buttons removed');
}

fs.writeFileSync(bundlePath, s);
console.log('Run: node scripts/build-seo.js');
