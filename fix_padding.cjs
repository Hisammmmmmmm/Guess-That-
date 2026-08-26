const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add pt-[76px] to the main container for playing screen so its content starts below Navbar and Scoreboard
code = code.replace(
  /'p-2 sm:p-3 md:p-4 max-w-6xl mx-auto overflow-hidden'/,
  "'p-2 sm:p-3 md:p-4 pt-[76px] sm:pt-[76px] md:pt-[76px] max-w-6xl mx-auto overflow-hidden flex flex-col'"
);

// 2. Remove pt-20 from the motion.div
code = code.replace(
  /className="w-full h-full flex flex-col justify-start gap-4 sm:gap-6 pt-20 overflow-y-auto custom-scrollbar pb-6"/,
  'className="w-full h-full flex flex-col justify-start gap-2 sm:gap-4 overflow-y-auto custom-scrollbar pb-6"'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Padding fixed');
