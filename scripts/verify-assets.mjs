import fs from 'fs';
import path from 'path';

const htmlFiles = ['index.html', ...fs.readdirSync('pages').map(f => 'pages/' + f).filter(f => f.endsWith('.html'))];
let missing = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /(?:href|src)="([^"#?]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const target = decodeURIComponent(match[1]);
    if (target.startsWith('http') || target.startsWith('mailto:') || target.startsWith('data:')) continue;
    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) {
      console.log(`[Missing] in ${file}: ${target} -> ${resolved}`);
      missing++;
    }
  }
}

if (missing === 0) {
  console.log(`SUCCESS: All relative links, stylesheets, and scripts across ${htmlFiles.length} HTML pages resolved cleanly!`);
} else {
  console.log(`WARNING: ${missing} missing references found.`);
}
