(() => {
'use strict';
const root=document.querySelector('.container');
if(!root)return;
const title=(ar,de)=>{const h=document.createElement('h2');h.className='section-title';h.textContent=ar+' | '+de;return h};
const box=()=>{const x=document.createElement('div');x.className='content-box';return x};
const safeUrl=(s)=>{try{const u=new URL(s,location.href);return ['https:','http:','mailto:'].includes(u.protocol)?u.href:null}catch{return null}};
const link=(label,url,klass='btn btn-social')=>{const href=safeUrl(url);if(!href)return null;const a=document.createElement('a');a.href=href;a.textContent=label;a.className=klass;a.target='_blank';a.rel='noopener noreferrer';return a};
const text=(tag,value)=>{const e=document.createElement(tag);e.textContent=value||'';return e};
const makeSection=(ar,de,items,render)=>{if(!Array.isArray(items)||!items.length)return;const h=title(ar,de),b=box();items.forEach(item=>{try{const el=render(item);if(el)b.appendChild(el)}catch(e){console.warn('Item skipped',e)}});root.append(h,b)};
fetch('content/site.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Content unavailable');return r.json()}).then(data=>{
makeSection('روابط ومراجع','Links & Referenzen',data.links,x=>{const a=link(x.label,x.url);if(a){a.title=x.category||'';}return a});
const seen=new Set();
makeSection('مؤلفاتي','Meine Bücher',(data.books||[]).filter(x=>{const k=(x.title||'').trim().toLocaleLowerCase();if(!k||seen.has(k))return false;seen.add(k);return true}),x=>{const c=document.createElement('article');c.className='editor-card';if(x.cover){const u=safeUrl(x.cover);if(u){const im=document.createElement('img');im.src=u;im.alt=x.title||'';im.loading='lazy';c.appendChild(im)}}c.append(text('h3',x.title),text('p',x.description),text('small',[x.isbn&&'ISBN: '+x.isbn,x.price].filter(Boolean).join(' · ')));const a=link('Zum Buch / شراء الكتاب',x.url,'btn btn-epubli');if(a)c.appendChild(a);return c});
makeSection('صور وفيديوهات','Mediengalerie',data.media,x=>{const c=document.createElement('article');c.className='editor-card';if(x.image){const u=safeUrl(x.image);if(u){const im=document.createElement('img');im.src=u;im.alt=x.title||'';im.loading='lazy';c.appendChild(im)}}c.appendChild(text('h3',x.title));const a=link('Video ansehen / شاهد الفيديو',x.videoUrl);if(a)c.appendChild(a);return c});
makeSection('قصائد','Gedichte',data.poems,x=>{const c=document.createElement('article');c.className='editor-card';c.appendChild(text('h3',x.title));for(const [value,dir] of [[x.arabic,'rtl'],[x.german,'ltr']]){if(value){const p=text('p',value);p.dir=dir;p.style.whiteSpace='pre-line';c.appendChild(p)}}return c});
makeSection('مقالات','Artikel',data.articles,x=>{const c=document.createElement('article');c.className='editor-card';c.append(text('h3',x.title));const p=text('p',x.body);p.style.whiteSpace='pre-line';c.appendChild(p);return c});
}).catch(e=>console.warn('Additional content could not be loaded:',e));
})();
