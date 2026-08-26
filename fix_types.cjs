const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  /youtubeVideoId\?: string;/,
  'youtubeVideoId?: string;\n  youtubeVideoIds?: string[];'
);

fs.writeFileSync('src/types.ts', code);
