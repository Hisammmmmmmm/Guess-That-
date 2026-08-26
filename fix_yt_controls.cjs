const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/controls: isAnswered \? 1 : 0/g, 'controls: 0');
fs.writeFileSync('src/App.tsx', code);
