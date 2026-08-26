const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\{settings\.gameMode !== 'music_blind_test' && \(\n\s*\{\/\* Frame 3: Audio Player \*\/\}/g,
  "{settings.gameMode !== 'music_blind_test' && ("
);

code = code.replace(
  /\{settings\.gameMode !== 'music_blind_test' && \(\n\s*\{\/\* Frame 5: Category \*\/\}/g,
  "{settings.gameMode !== 'music_blind_test' && ("
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed syntax error');
