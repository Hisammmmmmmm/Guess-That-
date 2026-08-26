const fs = require('fs');
let code = fs.readFileSync('src/components/QuestionCard.tsx', 'utf8');

code = code.replace(
  /className=\{`group relative h-13 sm:h-15 border/g,
  "className={`group relative ${isAnswered ? 'h-10 sm:h-11' : 'h-13 sm:h-15'} border"
);

// We should also adjust the option text size maybe?
code = code.replace(
  /text-sm sm:text-base font-bold tracking-tight/g,
  "font-bold tracking-tight ${isAnswered ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}"
);

// And radio circle size
code = code.replace(
  /w-6 h-6 sm:w-7 sm:h-7 rounded-full/g,
  "${isAnswered ? 'w-5 h-5 sm:w-6 sm:h-6 text-[10px]' : 'w-6 h-6 sm:w-7 sm:h-7 text-xs'} rounded-full"
);

fs.writeFileSync('src/components/QuestionCard.tsx', code);
