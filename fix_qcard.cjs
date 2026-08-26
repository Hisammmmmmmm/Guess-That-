const fs = require('fs');
let code = fs.readFileSync('src/components/QuestionCard.tsx', 'utf8');

// Fix radio circle text-xs
code = code.replace(
  /className=\{`\$\{isAnswered \? 'w-5 h-5 sm:w-6 sm:h-6 text-\[10px\]' : 'w-6 h-6 sm:w-7 sm:h-7 text-xs'\} rounded-full flex items-center justify-center text-xs/g,
  "className={`\\${isAnswered ? 'w-5 h-5 sm:w-6 sm:h-6 text-[10px]' : 'w-6 h-6 sm:w-7 sm:h-7 text-xs'} rounded-full flex items-center justify-center"
);

// Fix option text string literal
code = code.replace(
  /className="font-bold tracking-tight \$\{isAnswered \? 'text-xs sm:text-sm' : 'text-sm sm:text-base'\} text-white group-hover:text-purple-200 transition-colors truncate"/g,
  "className={`font-bold tracking-tight \\${isAnswered ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} text-white group-hover:text-purple-200 transition-colors truncate`}"
);

fs.writeFileSync('src/components/QuestionCard.tsx', code);
