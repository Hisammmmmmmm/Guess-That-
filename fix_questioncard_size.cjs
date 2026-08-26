const fs = require('fs');
let code = fs.readFileSync('src/components/QuestionCard.tsx', 'utf8');

code = code.replace(
  /className="flex flex-col gap-2 sm:gap-3 w-full h-\[300px\] sm:h-\[180px\]"/,
  'className="flex flex-col gap-2 sm:gap-3 w-full min-h-[200px] sm:min-h-[160px] flex-1"'
);

// Reduce padding on the options so they take up less vertical space on mobile
code = code.replace(
  /className=\{`relative w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 group \$\{btnClasses\}`\}/g,
  "className={`relative w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 rounded-2xl border transition-all duration-300 group ${btnClasses}`}"
);

fs.writeFileSync('src/components/QuestionCard.tsx', code);
console.log('QuestionCard sizes fixed');
