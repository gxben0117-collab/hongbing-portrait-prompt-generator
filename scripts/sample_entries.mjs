import { readFileSync } from 'fs';
const html = readFileSync('C:\\AIProjects\\測試區\\紅兵風格寫真咒語產生器\\index.html', 'utf-8');
const m = html.match(/const CATS = (\[[\s\S]*?\]);\s*\nlet curCatID/);
const CATS = JSON.parse(m[1]);
// Show first 3 entries from theme_01 and theme_10
['theme_01','theme_10','theme_13'].forEach(id => {
  const cat = CATS.find(c=>c.id===id);
  if (!cat) return;
  console.log(`\n=== ${cat.id} ${cat.name} (${cat.entries.length} entries) ===`);
  cat.entries.slice(0,3).forEach(e => {
    console.log(`  [${e.id}] ${e.name} / ${e.sub}`);
    console.log(`    scene: ${(e.scene||'').slice(0,80)}`);
    console.log(`    outfit: ${(e.outfit||'').slice(0,80)}`);
    console.log(`    tpl: ${e.tpl}, mk: ${e.mk}`);
  });
});
