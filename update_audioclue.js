const fs = require('fs');
let code = fs.readFileSync('src/components/AudioCluePlayer.tsx', 'utf8');

// Replace the hidden YouTube player in AudioCluePlayer to NOT render in music mode
code = code.replace('{youtubeVideoId && (\\n         <div className="hidden">', '{youtubeVideoId && !isMusicMode && (\\n         <div className="hidden">');

fs.writeFileSync('src/components/AudioCluePlayer.tsx', code);
