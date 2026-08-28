const fs = require('fs');
let code = fs.readFileSync('src/data/fallbackGenerator.ts', 'utf8');

// I'll just restore the (t) => t logic because it's simpler
code = code.replace(/ans: \(\) => `[^`]+`/g, 'ans: (t) => `${t}`');

fs.writeFileSync('src/data/fallbackGenerator.ts', code);
