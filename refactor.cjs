const fs = require('fs');
const path = require('path');

function getCssFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getCssFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.css') && !file.endsWith('App.css')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const colorMap = [
  { var: 'var(--white)', regex: /#ffffff|#fff(?![0-9a-fA-F])/gi },
  { var: 'var(--off-white)', regex: /#f8f8f8|#f6f7fb|#f9f9f9|#f7f7f7|#f8fafc|#f9fafb|#fdfbfb|#f8f9fa/gi },
  { var: 'var(--light-gray)', regex: /#e5e5e5|#eee(?![0-9a-fA-F])|#e2e8f0|#e4e4e7|#ebedee|#e0e0e0|#cbd5e1|#d1d5db|#ccc(?![0-9a-fA-F])|#cbd5e0|#f1f5f9|#f5f5f5|#f0f0f0|#f3f4f6/gi },
  { var: 'var(--success-light)', regex: /#a7f3d0/gi },
];

const rgbaMap = [
  { regex: /rgba\(\s*99\s*,\s*102\s*,\s*241\s*,\s*([0-9.]+)\s*\)/g, replace: 'color-mix(in srgb, var(--info) calc(\$1 * 100%), transparent)' },
  { regex: /rgba\(\s*112\s*,\s*44\s*,\s*155\s*,\s*([0-9.]+)\s*\)/g, replace: 'color-mix(in srgb, var(--primary-purple) calc(\$1 * 100%), transparent)' },
  { regex: /rgba\(\s*255\s*,\s*192\s*,\s*225\s*,\s*([0-9.]+)\s*\)/g, replace: 'color-mix(in srgb, var(--primary-pink) calc(\$1 * 100%), transparent)' },
  { regex: /rgba\(\s*255\s*,\s*0\s*,\s*128\s*,\s*([0-9.]+)\s*\)/g, replace: 'color-mix(in srgb, var(--primary-pink) calc(\$1 * 100%), transparent)' },
  { regex: /rgba\(\s*128\s*,\s*0\s*,\s*255\s*,\s*([0-9.]+)\s*\)/g, replace: 'color-mix(in srgb, var(--primary-purple) calc(\$1 * 100%), transparent)' },
  { regex: /rgba\(\s*255\s*,\s*64\s*,\s*128\s*,\s*([0-9.]+)\s*\)/g, replace: 'color-mix(in srgb, var(--primary-pink) calc(\$1 * 100%), transparent)' },
  { regex: /rgba\(\s*255\s*,\s*100\s*,\s*200\s*,\s*([0-9.]+)\s*\)/g, replace: 'color-mix(in srgb, var(--primary-pink) calc(\$1 * 100%), transparent)' },
  { regex: /rgba\(\s*255\s*,\s*26\s*,\s*140\s*,\s*([0-9.]+)\s*\)/g, replace: 'color-mix(in srgb, var(--primary-pink) calc(\$1 * 100%), transparent)' },
  { regex: /rgba\(\s*240\s*,\s*98\s*,\s*146\s*,\s*([0-9.]+)\s*\)/g, replace: 'color-mix(in srgb, var(--primary-pink) calc(\$1 * 100%), transparent)' },
  { regex: /rgba\(\s*214\s*,\s*0\s*,\s*110\s*,\s*([0-9.]+)\s*\)/g, replace: 'color-mix(in srgb, var(--primary-magenta) calc(\$1 * 100%), transparent)' }
];

const cssFiles = getCssFiles('./src');

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;
  
  colorMap.forEach(map => {
    content = content.replace(map.regex, map.var);
  });
  
  rgbaMap.forEach(map => {
    content = content.replace(map.regex, map.replace);
  });
  
  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
