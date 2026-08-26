const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onReady=\{\(e\) => \{\n\s*e\.target\.setVolume\(100\);\n\s*e\.target\.playVideo\(\);\n\s*\}\}/,
  `onReady={(e) => {
                                 e.target.setVolume(100);
                                 e.target.playVideo();
                               }}
                               onEnd={(e) => {
                                 e.target.seekTo(3);
                                 e.target.playVideo();
                               }}`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Added onEnd to YouTube player');
