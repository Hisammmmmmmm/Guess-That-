const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Inside server.ts, change youtubeVideoId logic
code = code.replace(
  /let youtubeVideoId = undefined;\n\s*if \(gameMode === 'music_blind_test' && q\.youtubeSearchQuery && ytSearchFn\) \{\n\s*try \{\n\s*if \(ytCache\.has\(q\.youtubeSearchQuery\)\) \{\n\s*youtubeVideoId = ytCache\.get\(q\.youtubeSearchQuery\)\.videoId;\n\s*\} else \{\n\s*const r = await ytSearchFn\(q\.youtubeSearchQuery\);\n\s*const video = r\.videos\[0\];\n\s*if \(video\) \{\n\s*youtubeVideoId = video\.videoId;\n\s*ytCache\.set\(q\.youtubeSearchQuery, \{ videoId: video\.videoId, title: video\.title \}\);\n\s*\}\n\s*\}\n\s*\} catch \(e\) \{\n\s*console\.error\('Failed to fetch youtube video for', q\.youtubeSearchQuery, e\);\n\s*\}\n\s*\}/,
  `let youtubeVideoIds = [];
            if (gameMode === 'music_blind_test' && q.youtubeSearchQuery && ytSearchFn) {
              try {
                if (ytCache.has(q.youtubeSearchQuery)) {
                  youtubeVideoIds = ytCache.get(q.youtubeSearchQuery).videoIds || [ytCache.get(q.youtubeSearchQuery).videoId];
                } else {
                  const r = await ytSearchFn(q.youtubeSearchQuery);
                  if (r.videos && r.videos.length > 0) {
                    youtubeVideoIds = r.videos.slice(0, 5).map(v => v.videoId);
                    ytCache.set(q.youtubeSearchQuery, { videoIds: youtubeVideoIds, videoId: youtubeVideoIds[0], title: r.videos[0].title });
                  }
                }
              } catch (e) {
                console.error('Failed to fetch youtube video for', q.youtubeSearchQuery, e);
              }
            }`
);

// Also we need to inject youtubeVideoIds into the returned object
code = code.replace(
  /imageUrl: finalImg,\n\s*youtubeVideoId,\n\s*imagePrompt:/,
  `imageUrl: finalImg,
              youtubeVideoId: youtubeVideoIds[0],
              youtubeVideoIds: youtubeVideoIds,
              imagePrompt:`
);

fs.writeFileSync('server.ts', code);
