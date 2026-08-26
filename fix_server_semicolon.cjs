const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /const ytCache = new Map<string, \{ videoId: string; title: string \}>\(\);/,
  'const ytCache = new Map<string, { videoId: string; title: string; videoIds?: string[] }>();'
);

fs.writeFileSync('server.ts', code);
console.log('fixed ytCache Map declaration');
