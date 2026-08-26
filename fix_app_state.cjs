const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('currentYtIndex')) {
  // Add state
  code = code.replace(
    /const \[isAnswered, setIsAnswered\] = useState\(false\);/,
    `const [isAnswered, setIsAnswered] = useState(false);
  const [currentYtIndex, setCurrentYtIndex] = useState(0);`
  );

  // Reset state on next question
  code = code.replace(
    /setScoreEarnedForCurrent\(0\);/,
    `setScoreEarnedForCurrent(0);
    setCurrentYtIndex(0);`
  );
  
  // Calculate active ID
  code = code.replace(
    /const currentQuestion = quizData\?.questions\[currentQuestionIndex\];/,
    `const currentQuestion = quizData?.questions[currentQuestionIndex];
  const activeVideoId = currentQuestion?.youtubeVideoIds?.[currentYtIndex] || currentQuestion?.youtubeVideoId;`
  );
  
  // Replace references
  code = code.replace(/youtubeVideoId=\{currentQuestion\.youtubeVideoId\}/g, 'youtubeVideoId={activeVideoId}');
  
  // Update YouTube component error handler
  code = code.replace(
    /onError=\{\(e\) => console\.error\("Youtube Player Error:", e\)\}/g,
    `onError={(e) => {
                                 console.error("Youtube Player Error:", e);
                                 if (currentQuestion.youtubeVideoIds && currentYtIndex < currentQuestion.youtubeVideoIds.length - 1) {
                                   setCurrentYtIndex(prev => prev + 1);
                                 }
                               }}`
  );
  
  // Oh wait, in App.tsx I have a YouTube component in the center:
  code = code.replace(
    /<YouTube\s+videoId=\{currentQuestion\.youtubeVideoId\}/,
    `<YouTube
                               videoId={activeVideoId}`
  );
  
  code = code.replace(
    /className="w-full h-full \[\&>iframe\]:w-full \[\&>iframe\]:h-full \[\&>iframe\]:rounded-3xl"\n\s*onReady=\{\(e\) => \{\n\s*e\.target\.setVolume\(100\);\n\s*e\.target\.playVideo\(\);\n\s*\}\}/,
    `className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-3xl"
                               onReady={(e) => {
                                 e.target.setVolume(100);
                                 e.target.playVideo();
                               }}
                               onError={(e) => {
                                 console.error("Youtube Player Error Center:", e);
                                 if (currentQuestion.youtubeVideoIds && currentYtIndex < currentQuestion.youtubeVideoIds.length - 1) {
                                   setCurrentYtIndex(prev => prev + 1);
                                 }
                               }}`
  );

  fs.writeFileSync('src/App.tsx', code);
  console.log("Success");
}
