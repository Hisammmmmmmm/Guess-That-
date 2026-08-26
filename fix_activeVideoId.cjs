const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const currentQuestion: Question \| undefined = quizData\?.questions\[currentQuestionIndex\];/,
  `const currentQuestion: Question | undefined = quizData?.questions[currentQuestionIndex];\n  const activeVideoId = currentQuestion?.youtubeVideoIds?.[currentYtIndex] || currentQuestion?.youtubeVideoId;`
);

fs.writeFileSync('src/App.tsx', code);
console.log('activeVideoId added');
