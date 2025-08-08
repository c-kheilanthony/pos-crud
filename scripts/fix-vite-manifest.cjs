const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '..', 'public', 'build');
const src = path.join(buildDir, '.vite', 'manifest.json');
const dest = path.join(buildDir, 'manifest.json');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Copied .vite/manifest.json -> manifest.json');
} else {
  console.warn('No .vite/manifest.json found; skipping copy.');
}