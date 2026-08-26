const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                  {/* CENTER PANEL: Image / Music Visualizer */}
                  <div className="flex-1 flex flex-col min-w-0 relative w-full h-full max-h-[60vh] md:max-h-none">
                    {settings.gameMode === 'music_blind_test' ? (
                       <div className="flex-1 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden h-full min-h-[250px]">
                         {/* Animated background elements */}
                         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                            
                         <div className="relative flex flex-col items-center justify-center gap-6 z-10">
                           <div className="relative">
                             <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                             <div className="w-32 h-32 md:w-40 md:h-40 bg-black/50 border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] relative z-10">
                               <Music className="w-16 h-16 md:w-20 md:h-20 text-white/80" />
                             </div>
                                
                             {/* Sound wave rings */}
                             <div className="absolute inset-0 rounded-full border border-white/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                             <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
                           </div>
                              
                           <div className="text-center">
                             <span className="text-white/60 font-bold tracking-[0.3em] uppercase text-sm md:text-base">Écoutez attentivement</span>
                           </div>
                         </div>
                       </div>
                    ) : (`;

const replacement = `                  {/* CENTER PANEL: Image / Music Visualizer */}
                  <div className="flex-1 flex flex-col min-w-0 relative w-full h-full max-h-[60vh] md:max-h-none">
                    {settings.gameMode === 'music_blind_test' ? (
                       <div className="flex-1 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden h-full min-h-[250px]">
                         {/* Animated background elements (visible when not answered) */}
                         <div className={\`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 \${isAnswered ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'}\`}>
                           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                           
                           <div className="relative flex flex-col items-center justify-center gap-6 z-10">
                             <div className="relative">
                               <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                               <div className="w-32 h-32 md:w-40 md:h-40 bg-black/50 border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] relative z-10">
                                 <Music className="w-16 h-16 md:w-20 md:h-20 text-white/80" />
                               </div>
                               
                               {/* Sound wave rings */}
                               <div className="absolute inset-0 rounded-full border border-white/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                               <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
                             </div>
                             
                             <div className="text-center">
                               <span className="text-white/60 font-bold tracking-[0.3em] uppercase text-sm md:text-base">Écoutez attentivement</span>
                             </div>
                           </div>
                         </div>

                         {/* YouTube Video Player (Always rendered to play music, visible when answered) */}
                         {currentQuestion.youtubeVideoId && (
                           <div className={\`absolute inset-0 w-full h-full z-20 transition-opacity duration-700 \${isAnswered ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}>
                             <YouTube
                               videoId={currentQuestion.youtubeVideoId}
                               opts={{
                                 width: '100%',
                                 height: '100%',
                                 playerVars: {
                                   autoplay: 1,
                                   controls: isAnswered ? 1 : 0,
                                   disablekb: 1,
                                   fs: 0,
                                   start: 3,
                                 },
                               }}
                               className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-3xl"
                               onReady={(e) => {
                                 e.target.setVolume(100);
                                 e.target.playVideo();
                               }}
                             />
                           </div>
                         )}
                       </div>
                    ) : (`;

if (code.includes('Écoutez attentivement')) {
  // Use regex to replace everything between CENTER PANEL and "VisualClue"
  const startRegex = /\{\/\* CENTER PANEL: Image \/ Music Visualizer \*\/\}/;
  const endRegex = /<VisualClue/;
  
  const match1 = code.match(startRegex);
  const match2 = code.match(endRegex);
  
  if (match1 && match2) {
    const before = code.substring(0, match1.index);
    const after = code.substring(match2.index);
    code = before + replacement.replace(') : (', '') + '                    ) : (\n                      ' + after;
    fs.writeFileSync('src/App.tsx', code);
    console.log("Success");
  } else {
    console.log("Could not match start or end");
  }
} else {
  console.log("Target not found");
}
