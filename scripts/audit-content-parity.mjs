import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
let count=0;
for(const group of ['blog','portfolio','services','team','sectors']) {
 const files=readdirSync('src/content/'+group).filter(file=>file.endsWith('.json'));
 for(const file of files) {
  const entry=JSON.parse(readFileSync('src/content/'+group+'/'+file,'utf8'));count++;
  if(entry.slug) assert.equal(entry.slug,file.slice(0,-5),'Stable id differs from filename');
  if(group==='blog' && entry.status!=='draft') assert(entry.sections.length>0,'Published article has no body: '+file);
  if(group==='sectors') for(const section of entry.sections) assert(existsSync('src/components/sections/sectors/'+section+'.astro'),'Missing sector section '+section);
 }
}
for(const name of ['portfolio','team','services']) assert(readFileSync('src/data/'+name+'.ts','utf8').includes("getCollection('"+name+"')"),'Collection is not the source of truth: '+name);
console.log('Content audit passed for '+count+' collection entries.');
