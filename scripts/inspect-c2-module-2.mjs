import fs from 'node:fs';
const source = fs.readFileSync('shared/course/c2.ts','utf8');
const titles = [...source.matchAll(/title: "([^"]+)"/g)].map((m) => m[1]);
console.log(titles.slice(15,30).map((title, index) => `${index + 16}. ${title}`).join('\n'));
