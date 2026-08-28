const fs = require('fs');
let code = fs.readFileSync('src/data/fallbackGenerator.ts', 'utf8');
code = code.replace(/ans: \(t\) => `(.*?)(\s*(?:de |of |di |von |van |de |of |de )?\${t}| de \${t}|\${t})`/g, 'ans: () => `$1`');
fs.writeFileSync('src/data/fallbackGenerator.ts', code);
