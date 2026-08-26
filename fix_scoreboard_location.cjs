const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Move ScoreBoard out of the motion.div to just above it!
code = code.replace(
  /\{\/\* Top HUD: Score & Progress Bar \*\/\}\n\s*<ScoreBoard[\s\S]*?\/>/,
  '' // Remove it from inside motion.div
);

code = code.replace(
  /<AnimatePresence mode="wait">\n\s*\{\/\* 1\. HOME/,
  `{screen === 'playing' && quizData && (
          <ScoreBoard
            currentIndex={currentQuestionIndex}
            totalQuestions={quizData.questions.length}
            score={stats.score}
            streak={stats.streak}
            correctCount={stats.correctAnswers}
            primaryColor={quizData.primaryColor}
            gameMode={settings.gameMode}
            themeTitle={quizData.themeTitle}
          />
        )}
        <AnimatePresence mode="wait">
          {/* 1. HOME`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Moved ScoreBoard out of motion.div');
