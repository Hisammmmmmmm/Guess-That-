const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change from justify-between to flex-col with overflow-y-auto so on small screens it can scroll instead of breaking layout
code = code.replace(
  /className="w-full h-full flex flex-col justify-between gap-2\.5 sm:gap-3 pt-20"/g,
  'className="w-full h-full flex flex-col justify-start gap-4 sm:gap-6 pt-20 overflow-y-auto custom-scrollbar pb-6"'
);

// We need to also allow the main game container to scroll if necessary, or let the motion.div handle it.
// Right now main has overflow-hidden when playing:
// 'h-screen max-h-screen overflow-hidden' -> we can keep this, so the motion.div scrolls!

fs.writeFileSync('src/App.tsx', code);
console.log('App layout fixed');
