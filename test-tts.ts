import * as googleTTS from 'google-tts-api';

async function test() {
  const result = await googleTTS.getAllAudioBase64('Bonjour le monde', {
    lang: 'fr',
    slow: false,
    host: 'https://translate.google.com',
  });
  console.log(result);
}
test();
