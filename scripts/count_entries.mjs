import { readFileSync } from 'fs';
const html = readFileSync('C:\\AIProjects\\測試區\\紅兵風格寫真咒語產生器\\index.html', 'utf-8');
const m = html.match(/const CATS = (\[[\s\S]*?\]);\s*\nlet curCatID/);
if (!m) { console.log('CATS not found'); process.exit(1); }
const CATS = JSON.parse(m[1]);
let total = 0;
CATS.forEach(c => {
  const n = c.entries ? c.entries.length : 0;
  total += n;
  console.log(`${c.id} (${c.name}): ${n} entries`);
});
console.log(`\nTotal: ${total}`);
