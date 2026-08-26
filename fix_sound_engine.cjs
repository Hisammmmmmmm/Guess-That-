const fs = require('fs');
let code = fs.readFileSync('src/services/soundEngine.ts', 'utf8');

code = code.replace(
  /this\.ambienceNodes\?\.oscillators\.forEach/g,
  `nodesToStop?.oscillators.forEach`
);

code = code.replace(
  /setTimeout\(\(\) => \{\n\s*nodesToStop\?\.oscillators/g,
  `const nodesToStop = this.ambienceNodes;\n        setTimeout(() => {\n          nodesToStop?.oscillators`
);

fs.writeFileSync('src/services/soundEngine.ts', code);
console.log('Fixed closure bug in soundEngine.ts');
