import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync('index.html','utf8');
const js=readFileSync('assets/site-content.js','utf8');
const cfg=readFileSync('.pages.yml','utf8');
const data=JSON.parse(readFileSync('content/site.json','utf8'));
assert(html.includes('<main class="container"'), 'Missing main element');
assert(html.includes('</main>'), 'Missing closing main');
assert(html.includes('assets/site-content.js'), 'Content renderer not loaded');
assert(html.includes('assets/site-enhancements.css'), 'Responsive stylesheet not loaded');
assert(html.includes('جامعة بون'), 'Requested Arabic university missing');
assert(html.includes('Universität Bonn'), 'Requested German university missing');
assert(html.includes('graves.jpg'), 'Original poetic image must be preserved');
assert(html.includes('kusai.webp'), 'Author photo must be preserved');
assert(!html.includes('reader.readAsDataURL'), 'Temporary browser-only uploader must be removed');
assert(cfg.includes('content/site.json'), 'CMS must edit the real content file');
assert(Array.isArray(data.links), 'Links list missing');
for (const name of ['books','media','poems','articles']) assert(Array.isArray(data[name]), name+' list missing');
for (const item of data.links) {
  assert(item.label && item.url, 'Incomplete link');
  assert(/^https:\/\//.test(item.url), 'Unsafe URL: '+item.url);
}
for(const asset of ['main.jpg','euphrat.jpg','kusai.webp','graves.jpg']) assert(existsSync(asset),'Missing original image: '+asset);
new Function(js);
console.log('Website integrity checks passed.');
