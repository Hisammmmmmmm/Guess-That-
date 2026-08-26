const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change the question size and add truncate so it stays on one line
code = code.replace(
  /className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight font-heading drop-shadow-2xl"/,
  'className="text-sm sm:text-base md:text-xl lg:text-2xl font-black text-white leading-tight font-heading drop-shadow-2xl whitespace-nowrap overflow-hidden text-ellipsis px-1"'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Question text size fixed');
