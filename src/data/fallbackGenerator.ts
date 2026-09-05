import { QuizData, Question } from '../types';
import { PRESET_QUIZ_DATA } from './presetThemes';

// Curated 15-question sets for all primary categories
const ANIMES_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Dans quel animé légendaire Son Goku recherche-t-il les 7 boules de cristal magiques ?",
    options: ["Dragon Ball", "Naruto", "One Piece", "Bleach"],
    correctAnswer: "Dragon Ball",
    wikiSearchQuery: "Son Goku Dragon Ball",
    youtubeSearchQuery: "Dragon Ball Cha La Head Cha La OST",
    clue: "Un nuage magique, un bâton de puissance et le dragon sacré Shenron.",
    audioNotes: [261.63, 329.63, 392.0, 523.25],
    trivia: "Akira Toriyama s'est inspiré du roman chinois traditionnel 'La Pérégrination vers l'Ouest'.",
    category: "Shonen Culte"
  },
  {
    id: 2,
    question: "Quel pirate au chapeau de paille rêve de trouver le trésor ultime laissé par Gol D. Roger ?",
    options: ["Monkey D. Luffy", "Roronoa Zoro", "Portgas D. Ace", "Trafalgar Law"],
    correctAnswer: "Monkey D. Luffy",
    wikiSearchQuery: "Monkey D Luffy One Piece",
    youtubeSearchQuery: "One Piece We Are OST",
    clue: "Il a mangé le fruit du Gomu Gomu et s'étire comme du caoutchouc.",
    audioNotes: [392.0, 440.0, 523.25, 659.25],
    trivia: "One Piece est la bande dessinée créée par un seul auteur la plus vendue au monde.",
    category: "Pirates & Aventure"
  },
  {
    id: 3,
    question: "Dans quel animé un jeune ninja orphelin porte-t-il le démon renard à 9 queues scellé en lui ?",
    options: ["Bleach", "Naruto", "Hunter x Hunter", "Fairy Tail"],
    correctAnswer: "Naruto",
    wikiSearchQuery: "Naruto Uzumaki Nine Tails",
    youtubeSearchQuery: "Naruto Sadness and Sorrow OST",
    clue: "Le village caché de Konoha et le rêve de devenir Hokage.",
    audioNotes: [329.63, 392.0, 440.0, 493.88],
    trivia: "Le plat préféré de Naruto, les ramen de chez Ichiraku, existe réellement au Japon.",
    category: "Ninja Shonen"
  },
  {
    id: 4,
    question: "Quel lycéen surdoué trouve un carnet surnaturel permettant de tuer en écrivant un nom ?",
    options: ["Light Yagami", "L", "Ryuk", "Near"],
    correctAnswer: "Light Yagami",
    wikiSearchQuery: "Light Yagami Death Note",
    youtubeSearchQuery: "Death Note L Theme OST",
    clue: "Il veut devenir le dieu d'un monde nouveau sous le pseudonyme de Kira.",
    audioNotes: [220.0, 261.63, 329.63, 440.0],
    trivia: "Les dieux de la mort (Shinigami) dans la série sont obsédés par les pommes rouges.",
    category: "Thriller Psychologique"
  },
  {
    id: 5,
    question: "Quel chef-d'œuvre du Studio Ghibli met en scène une fillette travaillant dans des bains pour esprits ?",
    options: ["Mon Voisin Totoro", "Le Voyage de Chihiro", "Princesse Mononoké", "Le Château Ambulant"],
    correctAnswer: "Le Voyage de Chihiro",
    wikiSearchQuery: "Spirited Away Chihiro Ghibli",
    youtubeSearchQuery: "Spirited Away One Summers Day Joe Hisaishi",
    clue: "La sorcière Yubaba, le dragon Haku et le Sans-Visage.",
    audioNotes: [261.63, 329.63, 392.0, 440.0, 523.25],
    trivia: "C'est le seul film d'animation japonais traditionnel à avoir remporté l'Oscar du meilleur film d'animation.",
    category: "Studio Ghibli"
  },
  {
    id: 6,
    question: "Dans quel animé l'humanité vit-elle retranchée derrière trois gigantesques murs contre des monstres géants ?",
    options: ["L'Attaque des Titans", "Tokyo Ghoul", "Neon Genesis Evangelion", "Parasyte"],
    correctAnswer: "L'Attaque des Titans",
    wikiSearchQuery: "Attack on Titan Colossal Titan",
    youtubeSearchQuery: "Attack on Titan Guren no Yumiya OST",
    clue: "Le Bataillon d'exploration avec équipement tridimensionnel et le Titan Colossal.",
    audioNotes: [196.0, 246.94, 293.66, 392.0],
    trivia: "L'auteur Hajime Isayama a eu l'idée des Titans après avoir croisé un client ivre dans un cybercafé.",
    category: "Dark Fantasy"
  },
  {
    id: 7,
    question: "Quel pourfendeur de démons voyage avec sa sœur Nezuko transformée en démon dans une boîte en bois ?",
    options: ["Tanjiro Kamado", "Zenitsu Agatsuma", "Inosuke Hashibira", "Giyu Tomioka"],
    correctAnswer: "Tanjiro Kamado",
    wikiSearchQuery: "Tanjiro Kamado Demon Slayer",
    youtubeSearchQuery: "Demon Slayer Gurenge OST",
    clue: "Le Souffle de l'Eau et des boucles d'oreilles Hanafuda.",
    audioNotes: [329.63, 392.0, 440.0, 523.25],
    trivia: "Le film 'Le Train de l'Infini' est le film le plus rentable de toute l'histoire du cinéma au Japon.",
    category: "Shonen"
  },
  {
    id: 8,
    question: "Dans quel animé culte Satoshi (Sacha) parcourt-il le monde avec une souris électrique jaune ?",
    options: ["Digimon", "Pokémon", "Yo-kai Watch", "Yu-Gi-Oh!"],
    correctAnswer: "Pokémon",
    wikiSearchQuery: "Pikachu Ash Ketchum Pokemon",
    youtubeSearchQuery: "Pokemon Theme Song Original Anime",
    clue: "« Attrapez-les tous ! » et l'attaque Fatal-Foudre.",
    audioNotes: [523.25, 659.25, 783.99, 1046.5],
    trivia: "Pikachu a été conçu par Atsuko Nishida en s'inspirant d'un écureuil plutôt que d'une souris.",
    category: "Créatures & Aventure"
  },
  {
    id: 9,
    question: "Quels frères alchimistes cherchent la pierre philosophale pour restaurer leurs corps perdus ?",
    options: ["Edward et Alphonse Elric", "Gon et Killua", "Sasuke et Itachi", "Eren et Armin"],
    correctAnswer: "Edward et Alphonse Elric",
    wikiSearchQuery: "Edward Elric Fullmetal Alchemist",
    youtubeSearchQuery: "Fullmetal Alchemist Again YUI OST",
    clue: "Le principe de l'échange équivalent et une armure animée par une âme.",
    audioNotes: [220.0, 277.18, 329.63, 440.0],
    trivia: "L'auteur Hiromu Arakawa a grandi dans une ferme laitière, d'où son avatar d'autoportrait en vache !",
    category: "Alchimie & Drame"
  },
  {
    id: 10,
    question: "Dans quel animé culte de mecha de 1995 Shinji Ikari pilote-t-il l'EVA-01 contre des Anges mystérieux ?",
    options: ["Gundam", "Code Geass", "Neon Genesis Evangelion", "Gurren Lagann"],
    correctAnswer: "Neon Genesis Evangelion",
    wikiSearchQuery: "Evangelion Unit 01 Shinji Ikari",
    youtubeSearchQuery: "Evangelion A Cruel Angels Thesis OST",
    clue: "L'organisation NERV, la ville de Tokyo-3 et le cri déchirant de l'EVA violette.",
    audioNotes: [261.63, 329.63, 392.0, 523.25],
    trivia: "La chanson du générique 'A Cruel Angel's Thesis' est l'une des chansons de karaoké les plus chantées au Japon.",
    category: "Science-Fiction Mecha"
  },
  {
    id: 11,
    question: "Quel jeune garçon aux cheveux verts veut passer l'examen des Hunters pour retrouver son père Ging ?",
    options: ["Gon Freecss", "Killua Zoldyck", "Kurapika", "Leorio"],
    correctAnswer: "Gon Freecss",
    wikiSearchQuery: "Gon Freecss Hunter x Hunter",
    youtubeSearchQuery: "Hunter x Hunter Departure OST",
    clue: "Une canne à pêche magique et l'énergie spirituelle du Nen.",
    audioNotes: [293.66, 349.23, 440.0, 523.25],
    trivia: "L'auteur Yoshihiro Togashi est marié à Naoko Takeuchi, la créatrice de Sailor Moon !",
    category: "Shonen"
  },
  {
    id: 12,
    question: "Quel shinigami remplaçant aux cheveux orange utilise le sabre Zangetsu pour purifier les Hollows ?",
    options: ["Ichigo Kurosaki", "Renji Abarai", "Byakuya Kuchiki", "Sosuke Aizen"],
    correctAnswer: "Ichigo Kurosaki",
    wikiSearchQuery: "Ichigo Kurosaki Bleach Zanpakuto",
    youtubeSearchQuery: "Bleach Number One OST",
    clue: "Le monde de la Soul Society et la technique ultime du Bankai.",
    audioNotes: [329.63, 392.0, 493.88, 587.33],
    trivia: "Le titre 'Bleach' a été choisi par Tite Kubo pour évoquer la couleur blanche contrastant avec les robes noires des faucheurs.",
    category: "Action Surnaturelle"
  },
  {
    id: 13,
    question: "Quel exorciste légendaire aux yeux bandés possède le pouvoir de l'Infini dans Jujutsu Kaisen ?",
    options: ["Satoru Gojo", "Yuji Itadori", "Megumi Fushiguro", "Sukuna"],
    correctAnswer: "Satoru Gojo",
    wikiSearchQuery: "Satoru Gojo Jujutsu Kaisen",
    youtubeSearchQuery: "Jujutsu Kaisen Kaikai Kitan Eve OST",
    clue: "Des lunettes noires, des yeux d'azur étincelants et l'extension du territoire 'Sphère de l'Espace Infini'.",
    audioNotes: [440.0, 554.37, 659.25, 880.0],
    trivia: "Satoru Gojo porte un bandeau car ses Six Yeux captent trop d'informations sensorielles s'ils ne sont pas filtrés.",
    category: "Occulte Moderne"
  },
  {
    id: 14,
    question: "Quel film culte de science-fiction cyberpunk de 1988 se déroule dans un Néo-Tokyo post-apocalyptique ?",
    options: ["Ghost in the Shell", "Akira", "Cowboy Bebop", "Cyber City Oedo"],
    correctAnswer: "Akira",
    wikiSearchQuery: "Akira Kaneda Red Motorcycle",
    youtubeSearchQuery: "Akira Kanedas Theme OST",
    clue: "La légendaire moto rouge de Kaneda et la transformation psychokinétique de Tetsuo.",
    audioNotes: [130.81, 164.81, 196.0, 261.63],
    trivia: "Akira a utilisé plus de 160 000 cellulos dessinés à la main, un record mondial d'animation artisanale.",
    category: "Cyberpunk Culte"
  },
  {
    id: 15,
    question: "Quel esprit bienveillant de la forêt ressemble à une gigantesque chouette-peluche dans l'œuvre de Miyazaki ?",
    options: ["Totoro", "Noiraude", "Catbus", "Jiji"],
    correctAnswer: "Totoro",
    wikiSearchQuery: "My Neighbor Totoro Studio Ghibli",
    youtubeSearchQuery: "My Neighbor Totoro Tonari no Totoro Joe Hisaishi",
    clue: "Il abrite les petites filles sous un grand parapluie à un arrêt d'autobus sous la pluie.",
    audioNotes: [261.63, 329.63, 392.0, 523.25, 440.0],
    trivia: "Totoro est devenu la mascotte officielle et le logo de Studio Ghibli.",
    category: "Studio Ghibli"
  }
];

const MUSIC_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Quel groupe britannique légendaire mené par Freddie Mercury a composé le chef-d'œuvre 'Bohemian Rhapsody' ?",
    options: ["Queen", "The Beatles", "The Rolling Stones", "Led Zeppelin"],
    correctAnswer: "Queen",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Queen_1977.jpg/800px-Queen_1977.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg/800px-Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg",
    wikiSearchQuery: "Freddie Mercury Queen Band",
    youtubeSearchQuery: "Queen Bohemian Rhapsody audio",
    youtubeVideoId: "fJ9rUzIMcZQ",
    youtubeVideoIds: ["fJ9rUzIMcZQ", "3p4MZJsexEs", "HgzGwKwLmgM"],
    clue: "« Scaramouche, Scaramouche, will you do the Fandango? »",
    audioNotes: [261.63, 329.63, 392.0, 440.0, 523.25],
    trivia: "L'enregistrement de Bohemian Rhapsody a nécessité 180 pistes superposées pour les chœurs d'opéra !",
    category: "Rock Légendaire"
  },
  {
    id: 2,
    question: "Quel Roi de la Pop a révolutionné l'industrie musicale en 1982 avec l'album et le clip 'Thriller' ?",
    options: ["Prince", "Michael Jackson", "Stevie Wonder", "George Michael"],
    correctAnswer: "Michael Jackson",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Michael_Jackson_in_1988.jpg/800px-Michael_Jackson_in_1988.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Michael_Jackson_HIStory_Tour_Munich_1997_3.jpg/800px-Michael_Jackson_HIStory_Tour_Munich_1997_3.jpg",
    wikiSearchQuery: "Michael Jackson Thriller Red Jacket",
    youtubeSearchQuery: "Michael Jackson Thriller audio",
    youtubeVideoId: "sOnqjkJTMaA",
    youtubeVideoIds: ["sOnqjkJTMaA", "4V90AmXnguw", "B3OBvA6O7zM"],
    clue: "Le Moonwalk, une veste en cuir rouge vif et un gant blanc scintillant.",
    audioNotes: [293.66, 349.23, 440.0, 523.25],
    trivia: "Thriller reste à ce jour l'album le plus vendu de tous les temps, avec plus de 70 millions d'exemplaires.",
    category: "Pop Mythique"
  },
  {
    id: 3,
    question: "Quel duo casqué français a conquis le monde avec 'Around the World' et 'Get Lucky' ?",
    options: ["Justice", "Air", "Daft Punk", "Phoenix"],
    correctAnswer: "Daft Punk",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Daft_Punk_in_2013.jpg/800px-Daft_Punk_in_2013.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Daft_Punk_Alive_2007.jpg/800px-Daft_Punk_Alive_2007.jpg",
    wikiSearchQuery: "Daft Punk Helmets Guy Manuel Thomas Bangalter",
    youtubeSearchQuery: "Daft Punk Around the World audio",
    youtubeVideoId: "K0HSD_i2DvA",
    youtubeVideoIds: ["K0HSD_i2DvA", "yca6UsllwYs", "L93-7vRfxNo"],
    clue: "Deux robots futuristes : un casque doré et un casque argenté.",
    audioNotes: [392.0, 440.0, 523.25, 659.25],
    trivia: "Leurs célèbres casques de robots étaient équipés d'affichages LED personnalisés et de systèmes de climatisation intégrés.",
    category: "French Touch & Électro"
  },
  {
    id: 4,
    question: "Quel groupe de grunge de Seattle mené par Kurt Cobain a explosé en 1991 avec 'Smells Like Teen Spirit' ?",
    options: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"],
    correctAnswer: "Nirvana",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nirvana_around_1992.jpg/800px-Nirvana_around_1992.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Kurt_Cobain_1993.jpg/800px-Kurt_Cobain_1993.jpg",
    wikiSearchQuery: "Kurt Cobain Nirvana",
    youtubeSearchQuery: "Nirvana Smells Like Teen Spirit audio",
    youtubeVideoId: "hTWKbfoikeg",
    youtubeVideoIds: ["hTWKbfoikeg", "zYxkezUr8MQ", "5be1q8uD4e0"],
    clue: "La pochette mythique d'un bébé nageant vers un billet de banque sur l'album Nevermind.",
    audioNotes: [220.0, 261.63, 329.63, 392.0],
    trivia: "Le titre 'Smells Like Teen Spirit' vient d'un graffiti fait par une amie de Kurt Cobain sur son mur, en référence à une marque de déodorant.",
    category: "Grunge & Rock 90s"
  },
  {
    id: 5,
    question: "Quel groupe de Liverpool surnommé les 'Fab Four' a composé 'Hey Jude' et 'Let It Be' ?",
    options: ["The Who", "The Kinks", "The Beatles", "The Beach Boys"],
    correctAnswer: "The Beatles",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/The_Fabs.JPG/800px-The_Fabs.JPG",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Beatles_Abbey_Road_crossing_2004.jpg/800px-Beatles_Abbey_Road_crossing_2004.jpg",
    wikiSearchQuery: "The Beatles Abbey Road Crossing",
    youtubeSearchQuery: "The Beatles Hey Jude audio",
    youtubeVideoId: "A_MjCqQoLLA",
    youtubeVideoIds: ["A_MjCqQoLLA", "mQER0A0ej0M", "bkswNk58Gg4"],
    clue: "John, Paul, George et Ringo traversant le passage piéton d'Abbey Road.",
    audioNotes: [261.63, 293.66, 329.63, 349.23, 392.0],
    trivia: "En avril 1964, les Beatles occupaient simultanément les 5 premières places du classement Billboard américain !",
    category: "Pop Rock Vintage"
  },
  {
    id: 6,
    question: "Quel rappeur de Détroit a remporté un Oscar avec la bande originale 'Lose Yourself' du film 8 Mile ?",
    options: ["Tupac Shakur", "Eminem", "Snoop Dogg", "Jay-Z"],
    correctAnswer: "Eminem",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Eminem_-_Concert_for_Valor_in_Washington%2C_D.C._Nov._11%2C_2014_%282%29_%28cropped%29.jpg/800px-Eminem_-_Concert_for_Valor_in_Washington%2C_D.C._Nov._11%2C_2014_%282%29_%28cropped%29.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Eminem_Live_in_Sydney%2C_2011.jpg/800px-Eminem_Live_in_Sydney%2C_2011.jpg",
    wikiSearchQuery: "Eminem Marshall Mathers 8 Mile",
    youtubeSearchQuery: "Eminem Lose Yourself audio soundtrack",
    youtubeVideoId: "_Yhyp-_hX2s",
    youtubeVideoIds: ["_Yhyp-_hX2s", "xFYQQPAOz7Y", "7bDLIV96LD4"],
    clue: "« Mom's spaghetti » et le surnom de Slim Shady.",
    audioNotes: [220.0, 246.94, 261.63, 293.66],
    trivia: "Eminem ne s'est pas rendu à la cérémonie des Oscars car il pensait n'avoir aucune chance de gagner !",
    category: "Hip-Hop Culte"
  },
  {
    id: 7,
    question: "Quel groupe suédois iconique des années 70 a remporté l'Eurovision avec 'Waterloo' et chanté 'Dancing Queen' ?",
    options: ["Roxette", "Ace of Base", "ABBA", "Europe"],
    correctAnswer: "ABBA",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/ABBA_-_TopPop_1974_08.png/800px-ABBA_-_TopPop_1974_08.png",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/ABBA_in_Rotterdam_%281979%29.jpg/800px-ABBA_in_Rotterdam_%281979%29.jpg",
    wikiSearchQuery: "ABBA Band Agnetha Bjorn Benny Anni-Frid",
    youtubeSearchQuery: "ABBA Dancing Queen audio",
    youtubeVideoId: "xFrGuyw1Vm8",
    youtubeVideoIds: ["xFrGuyw1Vm8", "3w5b82Fomg0", "unfzfe8f9NI"],
    clue: "Deux couples aux costumes scintillants et la comédie musicale Mamma Mia.",
    audioNotes: [329.63, 392.0, 440.0, 523.25],
    trivia: "Le nom ABBA est un acronyme formé des initiales des prénoms des quatre membres.",
    category: "Disco & Pop 70s"
  },
  {
    id: 8,
    question: "Quelle légende jamaïcaine a popularisé le reggae mondialement avec 'No Woman, No Cry' et 'Could You Be Loved' ?",
    options: ["Peter Tosh", "Jimmy Cliff", "Bob Marley", "Burning Spear"],
    correctAnswer: "Bob Marley",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bob-Marley.jpg/800px-Bob-Marley.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Bob_Marley_1976.jpg/800px-Bob_Marley_1976.jpg",
    wikiSearchQuery: "Bob Marley Reggae Legend",
    youtubeSearchQuery: "Bob Marley Could You Be Loved audio",
    youtubeVideoId: "Mm7UWHW307U",
    youtubeVideoIds: ["Mm7UWHW307U", "69RdQFDuYzo", "vdB-8eLEW8g"],
    clue: "Les couleurs vert, jaune, rouge et son groupe The Wailers.",
    audioNotes: [261.63, 329.63, 392.0, 440.0],
    trivia: "L'album best-of 'Legend' est resté plus de 700 semaines dans le classement Billboard 200.",
    category: "Reggae"
  },
  {
    id: 9,
    question: "Quel groupe de rock progressif a créé l'album au prisme diffractant la lumière 'The Dark Side of the Moon' ?",
    options: ["Genesis", "Yes", "Pink Floyd", "King Crimson"],
    correctAnswer: "Pink Floyd",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Pink_Floyd_-_all_members.jpg/800px-Pink_Floyd_-_all_members.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/David_Gilmour_1977.jpg/800px-David_Gilmour_1977.jpg",
    wikiSearchQuery: "Pink Floyd Dark Side of the Moon Prism",
    youtubeSearchQuery: "Pink Floyd Comfortably Numb audio",
    youtubeVideoId: "_FrOQC-zEog",
    youtubeVideoIds: ["_FrOQC-zEog", "lt-z8e_l9_w", "y3eI0gI9hV8"],
    clue: "David Gilmour, Roger Waters et le morceau emblématique 'Another Brick in the Wall'.",
    audioNotes: [196.0, 220.0, 261.63, 329.63],
    trivia: "L'album 'The Dark Side of the Moon' est resté 950 semaines dans les charts d'albums américains.",
    category: "Rock Progressif"
  },
  {
    id: 10,
    question: "Quelle reine de la Pop a scandalisé et enchanté le monde avec 'Like a Virgin' et 'Vogue' ?",
    options: ["Cyndi Lauper", "Whitney Houston", "Madonna", "Cher"],
    correctAnswer: "Madonna",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Madonna_Rebel_Heart_Tour_2015_-_Stockholm_%2823051472299%29_%28cropped%29.jpg/800px-Madonna_Rebel_Heart_Tour_2015_-_Stockholm_%2823051472299%29_%28cropped%29.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Madonna_1985.jpg/800px-Madonna_1985.jpg",
    wikiSearchQuery: "Madonna Pop Singer Like a Virgin",
    youtubeSearchQuery: "Madonna Vogue audio",
    youtubeVideoId: "GuJQSAiODqI",
    youtubeVideoIds: ["GuJQSAiODqI", "EDwb9jOVRtU", "VFmN46_m48s"],
    clue: "Le bustier conique conçu par Jean-Paul Gaultier.",
    audioNotes: [349.23, 392.0, 440.0, 523.25],
    trivia: "Le Livre Guinness des records classe Madonna comme l'artiste féminine ayant vendu le plus d'albums dans l'histoire.",
    category: "Pop Diva"
  },
  {
    id: 11,
    question: "Quel groupe de hard rock australien a électrisé la planète avec 'Highway to Hell' et 'Back in Black' ?",
    options: ["Iron Maiden", "Guns N' Roses", "AC/DC", "Kiss"],
    correctAnswer: "AC/DC",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/AC-DC-1979-promo.png/800px-AC-DC-1979-promo.png",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Angus_Young_performing_with_ACDC_in_2008.jpg/800px-Angus_Young_performing_with_ACDC_in_2008.jpg",
    wikiSearchQuery: "Angus Young ACDC Guitarist Schoolboy Uniform",
    youtubeSearchQuery: "ACDC Highway to Hell audio",
    youtubeVideoId: "gEPmA3BL9bE",
    youtubeVideoIds: ["gEPmA3BL9bE", "l482T0yNkeo", "pAgnJDJN4VA"],
    clue: "Le guitariste Angus Young sautant sur scène en uniforme d'écolier avec sa Gibson SG.",
    audioNotes: [220.0, 261.63, 293.66, 329.63],
    trivia: "L'album 'Back in Black' est le deuxième album studio le plus vendu au monde derrière Thriller.",
    category: "Hard Rock"
  },
  {
    id: 12,
    question: "Quel artiste caméléon a incarné Ziggy Stardust et chanté 'Space Oddity' et 'Heroes' ?",
    options: ["Mick Jagger", "David Bowie", "Iggy Pop", "Rod Stewart"],
    correctAnswer: "David Bowie",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg/800px-David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/David_Bowie_1974.jpg/800px-David_Bowie_1974.jpg",
    wikiSearchQuery: "David Bowie Ziggy Stardust Aladdin Sane Lightning",
    youtubeSearchQuery: "David Bowie Heroes audio",
    youtubeVideoId: "bsYp9q3QNaQ",
    youtubeVideoIds: ["bsYp9q3QNaQ", "lXgkuM2NhYI", "Tgcc5hMmODs"],
    clue: "Un éclair coloré peint sur le visage et les yeux vairons.",
    audioNotes: [261.63, 329.63, 392.0, 523.25],
    trivia: "Bowie n'avait pas les yeux vairons de naissance : sa pupille gauche était dilatée en permanence suite à une bagarre au collège !",
    category: "Glam Rock & Pop"
  },
  {
    id: 13,
    question: "Quel virtuose de Minneapolis a chanté 'Purple Rain' sous une pluie violette et joué de 27 instruments ?",
    options: ["Prince", "Stevie Wonder", "Lenny Kravitz", "James Brown"],
    correctAnswer: "Prince",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Prince_at_Coachella_%28cropped%29.jpg/800px-Prince_at_Coachella_%28cropped%29.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Prince_Purple_Rain_Tour_1985.jpg/800px-Prince_Purple_Rain_Tour_1985.jpg",
    wikiSearchQuery: "Prince Purple Rain Musician",
    youtubeSearchQuery: "Prince Purple Rain audio",
    youtubeVideoId: "TvnYmWpD_T8",
    youtubeVideoIds: ["TvnYmWpD_T8", "7NN3gsSf-Ys", "S05OqXm7aGk"],
    clue: "Une guitare en forme de symbole d'amour et un costume violet flamboyant.",
    audioNotes: [293.66, 349.23, 440.0, 587.33],
    trivia: "Sur son premier album 'For You', Prince a joué lui-même les 27 instruments présents sur le disque.",
    category: "Funk & Pop"
  },
  {
    id: 14,
    question: "Quel compositeur et pianiste britannique aux lunettes excentriques a interprété 'Rocket Man' et 'Your Song' ?",
    options: ["Billy Joel", "Paul McCartney", "Elton John", "Phil Collins"],
    correctAnswer: "Elton John",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Elton_John_2011_Shankbone_2.JPG/800px-Elton_John_2011_Shankbone_2.JPG",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Elton_John_1975.jpg/800px-Elton_John_1975.jpg",
    wikiSearchQuery: "Elton John Piano Glasses",
    youtubeSearchQuery: "Elton John Rocket Man audio",
    youtubeVideoId: "DtVBCG6ThDk",
    youtubeVideoIds: ["DtVBCG6ThDk", "GlPlfCy1urI", "CBwK6Iqj4bM"],
    clue: "Des costumes à plumes, des lunettes géantes en strass et son ami parolier Bernie Taupin.",
    audioNotes: [261.63, 329.63, 392.0, 440.0, 523.25],
    trivia: "Sa chanson 'Candle in the Wind 1997' en hommage à Lady Diana est le single physique le plus vendu de tous les temps.",
    category: "Piano Pop"
  },
  {
    id: 15,
    question: "Quelle jeune chanteuse a raflé les 4 trophées majeurs des Grammys en 2020 avec 'Bad Guy' ?",
    options: ["Dua Lipa", "Olivia Rodrigo", "Billie Eilish", "Ariana Grande"],
    correctAnswer: "Billie Eilish",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Billie_Eilish_at_the_2024_Golden_Globes_3.jpg/800px-Billie_Eilish_at_the_2024_Golden_Globes_3.jpg",
    secondaryImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Billie_Eilish_2019_by_Glenn_Francis.jpg/800px-Billie_Eilish_2019_by_Glenn_Francis.jpg",
    wikiSearchQuery: "Billie Eilish Singer Bad Guy",
    youtubeSearchQuery: "Billie Eilish Bad Guy audio",
    youtubeVideoId: "DyDfgMOUjCI",
    youtubeVideoIds: ["DyDfgMOUjCI", "4tKGXG_p1Fw", "viimfQi_pUw"],
    clue: "Des cheveux bicolores vert néon, des basses vibrantes et des voix murmurées.",
    audioNotes: [130.81, 164.81, 196.0, 261.63],
    trivia: "Son premier album a été enregistré entièrement dans la petite chambre de son frère Finneas.",
    category: "Pop Moderne"
  }
];

const SERIES_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Dans quelle série Walter White devient-il 'Heisenberg', un fabricant de méthamphétamine bleue pure à 99% ?",
    options: ["Better Call Saul", "Ozark", "Breaking Bad", "Narcos"],
    correctAnswer: "Breaking Bad",
    wikiSearchQuery: "Breaking Bad Walter White Heisenberg Hat",
    youtubeSearchQuery: "Breaking Bad Theme Song Original",
    clue: "Un camping-car dans le désert du Nouveau-Mexique et son compère Jesse Pinkman.",
    audioNotes: [196.0, 220.0, 261.63, 329.63],
    trivia: "La fameuse méthamphétamine bleue utilisée sur le tournage était en réalité du sucre candi aromatisé au coton à sucre !",
    category: "Drame Psychologique"
  },
  {
    id: 2,
    question: "Dans Game of Thrones, quelle est la devise solennelle de la Maison Stark de Winterfell ?",
    options: ["Winter is Coming", "Hear Me Roar", "Fire and Blood", "Ours is the Fury"],
    correctAnswer: "Winter is Coming",
    wikiSearchQuery: "Game of Thrones Winterfell Stark Direwolf",
    youtubeSearchQuery: "Game of Thrones Main Theme Ramin Djawadi",
    clue: "Un loup géant en emblème et la menace glaciale des Marcheurs Blancs.",
    audioNotes: [220.0, 261.63, 293.66, 329.63],
    trivia: "Le dialecte Dothraki a été entièrement créé par le linguiste David J. Peterson et comprend plus de 3 000 mots.",
    category: "Fantasy Médiévale"
  },
  {
    id: 3,
    question: "Dans quelle série fantastique des enfants d'Hawkins affrontent-ils le Démogorgon dans l'Upside Down ?",
    options: ["Dark", "Locke & Key", "Stranger Things", "The Umbrella Academy"],
    correctAnswer: "Stranger Things",
    wikiSearchQuery: "Stranger Things Eleven Demogorgon Hawkins",
    youtubeSearchQuery: "Stranger Things Synthwave Theme Song OST",
    clue: "Onze (Eleven), des gaufres Eggo et des vélos BMX sous des néons des années 80.",
    audioNotes: [130.81, 164.81, 196.0, 246.94, 261.63],
    trivia: "Pour tester l'actrice Millie Bobby Brown lors de son audition, les créateurs lui ont demandé de simuler des crises de larmes intenses.",
    category: "Sci-Fi Rétro"
  },
  {
    id: 4,
    question: "Dans La Casa de Papel, quel est le masque porté par les braqueurs de la Fabrique nationale de la monnaie ?",
    options: ["Guy Fawkes", "Salvador Dalí", "Mona Lisa", "Le Cri"],
    correctAnswer: "Salvador Dalí",
    wikiSearchQuery: "Money Heist Dali Mask Salvador Dali",
    youtubeSearchQuery: "Bella Ciao Money Heist La Casa de Papel",
    clue: "Des combinaisons rouges et le chant antifasciste italien 'Bella Ciao'.",
    audioNotes: [261.63, 293.66, 329.63, 392.0],
    trivia: "La série a failli être annulée après sa première diffusion à la télévision espagnole, avant de devenir un phénomène mondial sur Netflix.",
    category: "Braquage & Suspense"
  },
  {
    id: 5,
    question: "Dans quelle série historique Tommy Shelby dirige-t-il un gang de criminels coiffés de casquettes à lames de rasoir ?",
    options: ["Boardwalk Empire", "Peaky Blinders", "Sons of Anarchy", "Gangs of London"],
    correctAnswer: "Peaky Blinders",
    wikiSearchQuery: "Thomas Shelby Peaky Blinders Cillian Murphy",
    youtubeSearchQuery: "Peaky Blinders Red Right Hand Nick Cave",
    clue: "La ville industrielle de Birmingham dans les années 1920 et la fumée de cigarette.",
    audioNotes: [196.0, 246.94, 293.66, 349.23],
    trivia: "Le gang des Peaky Blinders a réellement existé à Birmingham à la fin du XIXe siècle.",
    category: "Drame Historique"
  },
  {
    id: 6,
    question: "Dans quelle sitcom culte 6 amis new-yorkais se réunissent-ils sur le canapé orange du Central Perk ?",
    options: ["How I Met Your Mother", "Seinfeld", "Friends", "The Big Bang Theory"],
    correctAnswer: "Friends",
    wikiSearchQuery: "Friends Central Perk Orange Couch",
    youtubeSearchQuery: "Friends Theme Song Ill Be There For You The Rembrandts",
    clue: "Rachel, Monica, Phoebe, Joey, Chandler et Ross.",
    audioNotes: [261.63, 329.63, 392.0, 523.25],
    trivia: "Lors des dernières saisons, les 6 acteurs principaux gagnaient chacun 1 million de dollars par épisode !",
    category: "Comédie Culte"
  },
  {
    id: 7,
    question: "Dans quelle série post-apocalyptique Rick Grimes se réveille-t-il d'un coma dans un monde envahi de rôdeurs ?",
    options: ["The Last of Us", "Fear the Walking Dead", "The Walking Dead", "Z Nation"],
    correctAnswer: "The Walking Dead",
    wikiSearchQuery: "Rick Grimes Walking Dead Sheriff Hat",
    youtubeSearchQuery: "The Walking Dead Theme Song Bear McCreary",
    clue: "Un revolver Colt Python, une veste de shérif et la prison fortifiée.",
    audioNotes: [146.83, 174.61, 220.0, 261.63],
    trivia: "Les figurants jouant les zombies devaient passer une semaine d'entraînement dans une 'école des zombies' pour perfectionner leur démarche.",
    category: "Horreur & Survie"
  },
  {
    id: 8,
    question: "Dans The Witcher, quel est le nom du sorceleur mutant aux cheveux blancs chasseur de monstres ?",
    options: ["Geralt de Riv", "Vesemir", "Jaskier", "Eskel"],
    correctAnswer: "Geralt de Riv",
    wikiSearchQuery: "Geralt of Rivia The Witcher Henry Cavill",
    youtubeSearchQuery: "The Witcher Toss a Coin to Your Witcher",
    clue: "« Toss a coin to your Witcher » et ses deux épées (l'acier et l'argent).",
    audioNotes: [220.0, 261.63, 329.63, 392.0],
    trivia: "Henry Cavill a insisté pour réaliser lui-même toutes ses cascades et combats à l'épée.",
    category: "Fantasy Héroïque"
  },
  {
    id: 9,
    question: "Quelle série britannique met en scène Benedict Cumberbatch résolvant des crimes au 221B Baker Street ?",
    options: ["Luther", "Sherlock", "Broadchurch", "Peaky Blinders"],
    correctAnswer: "Sherlock",
    wikiSearchQuery: "Sherlock Holmes Benedict Cumberbatch Baker Street",
    youtubeSearchQuery: "Sherlock BBC Theme Song David Arnold",
    clue: "Un manteau Belstaff à col relevé, le Dr John Watson et le 'Palais Mental'.",
    audioNotes: [261.63, 311.13, 392.0, 466.16],
    trivia: "Le 'Palais Mental' est une véritable technique mnémotechnique de l'Antiquité grecque appelée méthode des loci.",
    category: "Enquête Policière"
  },
  {
    id: 10,
    question: "Dans quelle série coréenne 456 joueurs endettés risquent-ils leur vie dans des jeux d'enfants pour 45,6 milliards de wons ?",
    options: ["Alice in Borderland", "All of Us Are Dead", "Squid Game", "Hellbound"],
    correctAnswer: "Squid Game",
    wikiSearchQuery: "Squid Game Giant Doll Younghee Pink Guards",
    youtubeSearchQuery: "Squid Game Pink Soldiers OST",
    clue: "La poupée géante 'Un, deux, trois, soleil' et des gardes masqués en rose.",
    audioNotes: [261.63, 293.66, 329.63, 392.0],
    trivia: "Le créateur Hwang Dong-hyuk a attendu plus de 10 ans avant qu'un studio n'accepte de produire le scénario.",
    category: "Thriller Psychologique"
  },
  {
    id: 11,
    question: "Dans The Mandalorian, quel est le véritable nom du bébé de l'espèce de Yoda sauvé par Din Djarin ?",
    options: ["Yaddle", "Grogu", "Baby Yoda", "Minch"],
    correctAnswer: "Grogu",
    wikiSearchQuery: "Grogu Baby Yoda Mandalorian",
    youtubeSearchQuery: "The Mandalorian Main Theme Ludwig Goransson",
    clue: "Une cape beige, de grandes oreilles vertes et l'armure en beskar étincelante.",
    audioNotes: [196.0, 261.63, 293.66, 392.0],
    trivia: "La marionnette animatronique de Grogu coûte environ 5 millions de dollars.",
    category: "Star Wars"
  },
  {
    id: 12,
    question: "Dans quelle série d'anthologie futuriste chaque épisode explore-t-il les dérives sombres des nouvelles technologies ?",
    options: ["Altered Carbon", "Westworld", "Black Mirror", "Love Death and Robots"],
    correctAnswer: "Black Mirror",
    wikiSearchQuery: "Black Mirror Broken Screen White Bear",
    youtubeSearchQuery: "Black Mirror Ambient Sci Fi Theme",
    clue: "Un écran noir brisé reflétant le visage du spectateur éteint.",
    audioNotes: [130.81, 164.81, 196.0, 220.0],
    trivia: "Le titre fait référence à l'écran éteint d'un smartphone, d'une télévision ou d'une tablette qui devient un 'miroir noir'.",
    category: "Sci-Fi Dystopique"
  },
  {
    id: 13,
    question: "Dans quelle série culte les rescapés du vol Oceanic 815 découvrent-ils une mystérieuse trappe et un monstre de fumée noire ?",
    options: ["Manifest", "The 100", "Lost", "Under the Dome"],
    correctAnswer: "Lost",
    wikiSearchQuery: "Lost TV Series Island Oceanic 815",
    youtubeSearchQuery: "Lost Michael Giacchino Life and Death OST",
    clue: "Les chiffres maudits : 4, 8, 15, 16, 23, 42 et le projet Dharma Initiative.",
    audioNotes: [220.0, 261.63, 293.66, 329.63],
    trivia: "Le pilote de Lost a coûté entre 10 et 14 millions de dollars, un record absolu à l'époque pour la télévision.",
    category: "Mystère & Survie"
  },
  {
    id: 14,
    question: "Dans quelle série scandinave le fermier Ragnar Lothbrok devient-il roi en pillant l'Angleterre avec son drakkar ?",
    options: ["The Last Kingdom", "Barbarians", "Vikings", "Norsemen"],
    correctAnswer: "Vikings",
    wikiSearchQuery: "Ragnar Lothbrok Vikings Travis Fimmel",
    youtubeSearchQuery: "Vikings If I Had a Heart Fever Ray",
    clue: "Le sanctuaire d'Uppsala, son frère Rollo et la guerrière au bouclier Lagertha.",
    audioNotes: [146.83, 196.0, 220.0, 293.66],
    trivia: "Les tatouages de Ragnar ont évolué au fil des saisons pour refléter ses conquêtes et ses croyances religieuses.",
    category: "Fresque Historique"
  },
  {
    id: 15,
    question: "Dans quelle série satirique des super-héros corrompus appelés 'Les Sept' sont traqués par Billy Butcher ?",
    options: ["Invincible", "The Umbrella Academy", "The Boys", "Watchmen"],
    correctAnswer: "The Boys",
    wikiSearchQuery: "Homelander The Boys Antony Starr",
    youtubeSearchQuery: "The Boys Score Christopher Lennertz",
    clue: "Le protecteur mégalomane 'Le Protecteur' (Homelander) et le composé V.",
    audioNotes: [164.81, 196.0, 246.94, 329.63],
    trivia: "Le costume d'Homelander intègre des coussinets musculaires conçus pour sculpter sa silhouette menaçante.",
    category: "Super-Héros Subversif"
  }
];

const WORLD_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Quel monument parisien de fer puddlé de 330 mètres a été inauguré pour l'Exposition universelle de 1889 ?",
    options: ["Arc de Triomphe", "Tour Eiffel", "Panthéon", "Sacré-Cœur"],
    correctAnswer: "Tour Eiffel",
    wikiSearchQuery: "Tour Eiffel Paris France Gustave Eiffel",
    youtubeSearchQuery: "Parisian Accordion Cafe Music Ambience",
    clue: "La Dame de Fer conçue par l'ingénieur Gustave Eiffel sur le Champ-de-Mars.",
    audioNotes: [261.63, 329.63, 392.0, 523.25],
    trivia: "La tour Eiffel rétrécit d'environ 15 cm en hiver et grandit en été à cause de la dilatation thermique du fer !",
    category: "Monument Européen"
  },
  {
    id: 2,
    question: "Quelle fortification colossale s'étendant sur plus de 20 000 km protégeait la frontière nord de la Chine ?",
    options: ["Cité Interdite", "Armée de terre cuite", "Grande Muraille de Chine", "Palais du Potala"],
    correctAnswer: "Grande Muraille de Chine",
    wikiSearchQuery: "Great Wall of China Mutianyu",
    youtubeSearchQuery: "Traditional Chinese Guzheng Erhu Ambience",
    clue: "Des tours de guet en pierre serpentant sur les crêtes montagneuses asiatiques.",
    audioNotes: [220.0, 261.63, 329.63, 440.0],
    trivia: "Contrairement à la légende urbaine tenace, la Grande Muraille n'est pas visible à l'œil nu depuis l'orbite terrestre basse.",
    category: "Merveille du Monde"
  },
  {
    id: 3,
    question: "Quel somptueux mausolée de marbre blanc a été érigé à Agra par l'empereur Shah Jahan par amour pour son épouse ?",
    options: ["Fort Rouge", "Taj Mahal", "Temple d'Or", "Qutub Minar"],
    correctAnswer: "Taj Mahal",
    wikiSearchQuery: "Taj Mahal Agra India White Marble",
    youtubeSearchQuery: "Indian Sitar and Tabla Classical Ambience",
    clue: "Quatre minarets élancés reflétés dans un bassin d'eau symétrique bordé de cyprès.",
    audioNotes: [293.66, 349.23, 440.0, 523.25],
    trivia: "La couleur du marbre du Taj Mahal change au fil de la journée : rose à l'aube, blanc le midi et doré au clair de lune.",
    category: "Merveille d'Asie"
  },
  {
    id: 4,
    question: "Quel amphithéâtre romain antique ovale pouvait accueillir jusqu'à 50 000 spectateurs pour des combats de gladiateurs ?",
    options: ["Panthéon de Rome", "Colisée de Rome", "Cirque Maxime", "Forum Romain"],
    correctAnswer: "Colisée de Rome",
    wikiSearchQuery: "Colosseum Rome Italy Ancient Amphitheatre",
    youtubeSearchQuery: "Gladiator Hans Zimmer Now We Are Free OST",
    clue: "Des arches en travertin au cœur de la Ville Éternelle en Italie.",
    audioNotes: [196.0, 246.94, 293.66, 392.0],
    trivia: "Les Romains pouvaient inonder l'arène du Colisée pour y organiser de véritables batailles navales (les naumachies) !",
    category: "Antiquité Romaine"
  },
  {
    id: 5,
    question: "Quel complexe pharaonique comprend la tombe de Khéops et le légendaire lion à tête d'homme taillé dans la roche ?",
    options: ["Vallée des Rois", "Karnak", "Pyramides et Sphinx de Gizeh", "Abou Simbel"],
    correctAnswer: "Pyramides et Sphinx de Gizeh",
    wikiSearchQuery: "Giza Pyramids and Great Sphinx Cairo Egypt",
    youtubeSearchQuery: "Egyptian Oud and Desert Wind Ambience",
    clue: "La seule des Sept Merveilles du monde antique encore debout aujourd'hui.",
    audioNotes: [220.0, 277.18, 329.63, 440.0],
    trivia: "La Grande Pyramide de Khéops est restée la plus haute structure artificielle du monde pendant plus de 3 800 ans.",
    category: "Égypte Antique"
  },
  {
    id: 6,
    question: "Quelle cité inca perchée à 2 430 mètres d'altitude sur une crête des Andes a été redécouverte en 1911 ?",
    options: ["Cuzco", "Tiahuanaco", "Machu Picchu", "Nazca"],
    correctAnswer: "Machu Picchu",
    wikiSearchQuery: "Machu Picchu Peru Inca Citadel Andes",
    youtubeSearchQuery: "Andean Pan Flute El Condor Pasa Ambience",
    clue: "Des terrasses agricoles en escalier surplombant la rivière Urubamba au Pérou.",
    audioNotes: [261.63, 329.63, 392.0, 523.25],
    trivia: "Les pierres incas sont taillées si parfaitement qu'aucune lame de couteau ne peut se glisser entre elles, sans aucun mortier !",
    category: "Civilisation Inca"
  },
  {
    id: 7,
    question: "Quelle statue de cuivre offerte par la France brandit une torche et une tablette gravée du 4 juillet 1776 à New York ?",
    options: ["Mont Rushmore", "Statue de la Liberté", "Lincoln Memorial", "Gateway Arch"],
    correctAnswer: "Statue de la Liberté",
    wikiSearchQuery: "Statue of Liberty New York Harbor Torch",
    youtubeSearchQuery: "New York City Broadway Jazz Trumpet",
    clue: "Une couronne à sept pointes symbolisant les sept continents et les sept mers.",
    audioNotes: [261.63, 329.63, 392.0, 523.25],
    trivia: "La statue était à l'origine d'un brun cuivré brillant : sa couleur verte actuelle est due à l'oxydation naturelle du cuivre.",
    category: "Symbole Américain"
  },
  {
    id: 8,
    question: "Quel volcan conique sacré aux neiges éternelles culminant à 3 776 mètres est le point culminant du Japon ?",
    options: ["Mont Aso", "Mont Fuji", "Mont Hiei", "Mont Ontake"],
    correctAnswer: "Mont Fuji",
    wikiSearchQuery: "Mount Fuji Japan Snow Peak Cherry Blossoms",
    youtubeSearchQuery: "Traditional Japanese Koto and Shakuhachi Flute",
    clue: "Souvent immortalisé avec des cerisiers en fleurs (sakura) et les célèbres estampes d'Hokusai.",
    audioNotes: [329.63, 392.0, 440.0, 523.25],
    trivia: "Le Mont Fuji est en réalité composé de trois volcans distincts superposés les uns sur les autres.",
    category: "Nature & Volcan"
  },
  {
    id: 9,
    question: "Quelles chutes d'eau monumentales à la frontière entre le Canada et les États-Unis forment un fer à cheval géant ?",
    options: ["Chutes d'Iguazú", "Chutes Victoria", "Chutes du Niagara", "Salto Ángel"],
    correctAnswer: "Chutes du Niagara",
    wikiSearchQuery: "Niagara Falls Horseshoe Falls Canada USA",
    youtubeSearchQuery: "Mighty Waterfalls Roaring Water Nature Ambience",
    clue: "Le bateau 'Maid of the Mist' naviguant dans la brume vêtus de ponchos imperméables bleus.",
    audioNotes: [130.81, 164.81, 196.0, 261.63],
    trivia: "Les chutes du Niagara produisent plus de 2 millions de kilowatts d'électricité grâce aux centrales hydroélectriques.",
    category: "Merveille Naturelle"
  },
  {
    id: 10,
    question: "Quelle basilique catalane inachevée conçue par l'architecte Antoni Gaudí domine Barcelone de ses tours organiques ?",
    options: ["Cathédrale de Séville", "Alhambra de Grenade", "Sagrada Família", "Parc Güell"],
    correctAnswer: "Sagrada Família",
    wikiSearchQuery: "Sagrada Familia Barcelona Antoni Gaudi",
    youtubeSearchQuery: "Spanish Classical Guitar Concierto de Aranjuez",
    clue: "Des piliers en troncs d'arbres et des vitraux kaléidoscopiques multicolores.",
    audioNotes: [261.63, 329.63, 392.0, 440.0],
    trivia: "La construction a commencé en 1882 et se poursuit encore aujourd'hui, financée exclusivement par les dons et les billets d'entrée !",
    category: "Architecture Singulière"
  },
  {
    id: 11,
    question: "Quelle statue Art déco géante de 38 mètres ouvre ses bras protecteurs au sommet du mont Corcovado à Rio de Janeiro ?",
    options: ["Christ Rédempteur", "Pain de Sucre", "Monument aux Découvertes", "Statue de l'Unité"],
    correctAnswer: "Christ Rédempteur",
    wikiSearchQuery: "Christ the Redeemer Rio de Janeiro Corcovado",
    youtubeSearchQuery: "Bossa Nova Girl from Ipanema Stan Getz",
    clue: "Une vue panoramique spectaculaire sur la baie de Guanabara et la plage de Copacabana au Brésil.",
    audioNotes: [220.0, 261.63, 329.63, 440.0],
    trivia: "La statue est frappée par la foudre en moyenne 3 à 5 fois par an !",
    category: "Merveille Moderne"
  },
  {
    id: 12,
    question: "Quelle cité antique troglodyte nabatéenne taillée dans la roche gréseuse rose se cache dans le défilé du Siq en Jordanie ?",
    options: ["Palmyre", "Persépolis", "Pétra", "Babylone"],
    correctAnswer: "Pétra",
    wikiSearchQuery: "Petra Jordan Al Khazneh Treasury Rose Red City",
    youtubeSearchQuery: "Middle Eastern Desert Flute Oud Ambience",
    clue: "Le monument d'Al-Khazneh ('Le Trésor') immortalisé dans Indiana Jones et la Dernière Croisade.",
    audioNotes: [220.0, 277.18, 329.63, 440.0],
    trivia: "Seulement 15% de la ville antique de Pétra a été excavée par les archéologues à ce jour : 85% reste enfoui sous le sable !",
    category: "Cité Millénaire"
  },
  {
    id: 13,
    question: "Quelle célèbre tour de l'horloge néogothique du palais de Westminster sonne toutes les 15 minutes à Londres ?",
    options: ["Tower Bridge", "Big Ben", "The Shard", "Westminster Abbey"],
    correctAnswer: "Big Ben",
    wikiSearchQuery: "Big Ben Elizabeth Tower London Clock",
    youtubeSearchQuery: "Big Ben Westminster Chimes Clock Bell",
    clue: "Son carillon légendaire de 13,7 tonnes au bord de la Tamise.",
    audioNotes: [392.0, 329.63, 349.23, 261.63],
    trivia: "Strictement parlant, 'Big Ben' est le surnom de la cloche géante à l'intérieur, la tour elle-même se nommant 'Elizabeth Tower'.",
    category: "Monument Britannique"
  },
  {
    id: 14,
    question: "Quel plateau rocheux sacré dominant Athènes abrite le Parthénon dédié à la déesse de la sagesse ?",
    options: ["Mont Olympe", "Delphes", "Acropole d'Athènes", "Épidaure"],
    correctAnswer: "Acropole d'Athènes",
    wikiSearchQuery: "Acropolis Athens Parthenon Greece Ancient",
    youtubeSearchQuery: "Greek Bouzouki Zorba Dance Folk Music",
    clue: "Des colonnes doriques en marbre blanc du Pentélique et les statues des Cariatides.",
    audioNotes: [220.0, 261.63, 329.63, 440.0],
    trivia: "Les colonnes du Parthénon sont légèrement inclinées vers l'intérieur pour corriger l'illusion d'optique et paraître parfaitement droites !",
    category: "Grèce Antique"
  },
  {
    id: 15,
    question: "Quelle île chilienne isolée du Pacifique est célèbre pour ses 887 statues géantes de pierre volcanique appelées Moaï ?",
    options: ["Galápagos", "Tahiti", "Île de Pâques (Rapa Nui)", "Île Pitcairn"],
    correctAnswer: "Île de Pâques (Rapa Nui)",
    wikiSearchQuery: "Easter Island Moai Statues Rapa Nui Ahu",
    youtubeSearchQuery: "Polynesian Drums and Ocean Waves Ambience",
    clue: "Des bustes monolithiques sculptés au regard tourné vers l'intérieur des terres.",
    audioNotes: [196.0, 246.94, 293.66, 349.23],
    trivia: "La plupart des Moaï possèdent un corps complet enterré jusqu'au cou sous les sédiments volcaniques !",
    category: "Mystère Insulaire"
  }
];

export const FALLBACK_THEME_SETS: Record<string, Question[]> = {
  animes: ANIMES_QUESTIONS,
  music: MUSIC_QUESTIONS,
  series: SERIES_QUESTIONS,
  world: WORLD_QUESTIONS,
};

// Procedural dynamic question generator in French for ANY custom topic
export function generateDynamicFallbackQuiz(
  topic: string,
  gameMode: string = 'quiz',
  difficulty: string = 'medium'
): QuizData {
  const cleanTopic = topic.trim();
  const lower = cleanTopic.toLowerCase();

  // Check direct preset matches
  const isCinema = lower.includes('ciné') || lower.includes('film') || lower.includes('movie');
  const isGaming = lower.includes('jeu') || lower.includes('game') || lower.includes('gaming') || lower.includes('playstation') || lower.includes('nintendo');
  const isAnimes = lower.includes('anim') || lower.includes('manga') || lower.includes('dessin') || lower.includes('dragon ball') || lower.includes('naruto') || lower.includes('one piece');
  const isMusic = lower.includes('musique') || lower.includes('song') || lower.includes('chanson') || lower.includes('hit') || lower.includes('rock') || lower.includes('pop');
  const isSeries = lower.includes('série') || lower.includes('serie') || lower.includes('tv') || lower.includes('netflix') || lower.includes('streaming');
  const isWorld = lower.includes('monde') || lower.includes('voyage') || lower.includes('monument') || lower.includes('histoire') || lower.includes('géographie') || lower.includes('pays') || lower.includes('capitale');

  const effectiveMode = (gameMode || 'quiz') as any;
  const effectiveDiff = (difficulty || 'medium') as any;

  if (isCinema) {
    return { ...PRESET_QUIZ_DATA.cinema, topic: cleanTopic, gameMode: effectiveMode, difficulty: effectiveDiff };
  }
  if (isGaming) {
    return { ...PRESET_QUIZ_DATA.gaming, topic: cleanTopic, gameMode: effectiveMode, difficulty: effectiveDiff };
  }
  if (isAnimes) {
    return {
      ...(PRESET_QUIZ_DATA.animes || PRESET_QUIZ_DATA.cinema),
      topic: cleanTopic,
      themeTitle: 'Animés & Mangas Cultes',
      questions: ANIMES_QUESTIONS.map((q) => ({
        ...q,
        imageUrl: q.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(q.correctAnswer + ' anime hero artwork') }?width=800&height=450&nologo=true`,
        imagePrompt: q.imagePrompt || `${q.correctAnswer} anime hero artwork`,
      })),
      gameMode: effectiveMode,
      difficulty: effectiveDiff,
    };
  }
  if (isMusic) {
    return {
      ...(PRESET_QUIZ_DATA.music || PRESET_QUIZ_DATA.cinema),
      topic: cleanTopic,
      themeTitle: 'Légendes de la Musique',
      questions: MUSIC_QUESTIONS,
      gameMode: effectiveMode,
      difficulty: effectiveDiff,
    };
  }
  if (isSeries) {
    return {
      ...(PRESET_QUIZ_DATA.series || PRESET_QUIZ_DATA.cinema),
      topic: cleanTopic,
      themeTitle: 'Séries TV & Streaming Cultes',
      questions: SERIES_QUESTIONS,
      gameMode: effectiveMode,
      difficulty: effectiveDiff,
    };
  }
  if (isWorld) {
    return {
      ...(PRESET_QUIZ_DATA.world || PRESET_QUIZ_DATA.cinema),
      topic: cleanTopic,
      themeTitle: 'Merveilles du Monde & Voyages',
      questions: WORLD_QUESTIONS.map((q) => ({
        ...q,
        imageUrl: q.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(q.correctAnswer + ' landmark photo') }?width=800&height=450&nologo=true`,
        imagePrompt: q.imagePrompt || `${q.correctAnswer} landmark photo`,
      })),
      gameMode: effectiveMode,
      difficulty: effectiveDiff,
    };
  }

  // 15 tailored questions for any custom topic
  const aspects = [
    { title: "Origines & Création", q: `Quelle est l'origine ou l'œuvre fondatrice liée à "${cleanTopic}" ?`, ans: `Le chef-d'œuvre originel de ${cleanTopic}`, distractors: [`La variante alternative`, `Le précurseur oublié`, `La réédition tardive`], clue: `Pense aux prémices et aux débuts de ${cleanTopic}.`, trivia: `Cette œuvre a posé les fondations culturelles de tout le genre.` },
    { title: "Élément Emblématique", q: `Quel est l'élément ou symbole le plus iconique associé à "${cleanTopic}" ?`, ans: `L'emblème majeur de ${cleanTopic}`, distractors: [`Le symbole secondaire`, `L'accessoire occasionnel`, `La marque concurrente`], clue: `Reconnaissable au premier coup d'œil !`, trivia: `Cet emblème est devenu universellement reconnu.` },
    { title: "Figure Clé", q: `Quelle figure emblématique ou créateur a marqué l'histoire de "${cleanTopic}" ?`, ans: `Le créateur pionnier`, distractors: [`Le critique contemporain`, `Le successeur médiatique`, `L'investisseur initial`], clue: `Son influence reste indélébile sur le domaine.`, trivia: `Sa vision a révolutionné l'approche moderne.` },
    { title: "Lieu Culte", q: `Quel lieu mythique ou environnement est indissociable de "${cleanTopic}" ?`, ans: `Le sanctuaire historique`, distractors: [`Le quartier périphérique`, `La ville voisine`, `La base secondaire`], clue: `C'est là que tout se joue !`, trivia: `Des millions de passionnés considèrent ce lieu comme culte.` },
    { title: "Objet ou Arme Célèbre", q: `Quel artefact, outil ou objet rare fait la renommée de "${cleanTopic}" ?`, ans: `L'artefact légendaire`, distractors: [`L'objet courant`, `La réplique moderne`, `Le prototype initial`], clue: `Doté d'une aura et d'une puissance uniques.`, trivia: `Cet objet suscite toutes les convoitises dans l'univers.` },
    { title: "Rivalité Légendaire", q: `Quel grand duel ou antagoniste principal affronte-t-on dans "${cleanTopic}" ?`, ans: `L'adversaire juré`, distractors: [`L'allié temporaire`, `Le rival mineur`, `Le conseiller secret`], clue: `Une confrontation d'anthologie au sommet.`, trivia: `Leur confrontation est restée gravée dans les mémoires.` },
    { title: "Événement Majeur", q: `Quel événement historique ou tournant narratif a bouleversé "${cleanTopic}" ?`, ans: `La grande révélation charnière`, distractors: [`La trêve passagère`, `L'incident mineur`, `Le traité secondaire`], clue: `Rien n'a plus jamais été comme avant après cela.`, trivia: `Cet événement a surpris l'ensemble de la communauté.` },
    { title: "Citation ou Réplique Culte", q: `Quelle phrase mémorable est systématiquement rattachée à "${cleanTopic}" ?`, ans: `La citation devenue universelle`, distractors: [`Le slogan publicitaire`, `La réplique improvisée`, `Le proverbe ancien`], clue: `Une formule percutante répétée par tous les fans.`, trivia: `Cette réplique a été parodiée et reprise dans la pop culture.` },
    { title: "Thème Musical ou Ambiance", q: `Quel style sonore ou composition définit l'ambiance de "${cleanTopic}" ?`, ans: `Le thème instrumental culte`, distractors: [`La ritournelle d'ascenseur`, `Le remix moderne`, `L'intermède acoustique`], clue: `Les premières notes suffisent à l'identifier.`, trivia: `Cette mélodie a été composée avec un orchestre symphonique.` },
    { title: "Évolution & Époque d'Or", q: `Quelle période est généralement considérée comme l'âge d'or de "${cleanTopic}" ?`, ans: `La décennie triomphale`, distractors: [`La période de transition`, `Le début expérimental`, `La phase tardive`], clue: `L'apogée créative et la reconnaissance populaire.`, trivia: `Cette période a battu tous les records d'audience et de ventes.` },
    { title: "Secret ou Anecdote Cachée", q: `Quel fait insolite ou secret de coulisses concerne "${cleanTopic}" ?`, ans: `L'anecdote surprenante de production`, distractors: [`Le détail erroné`, `La rumeur démentie`, `La théorie populaire`], clue: `Un détail méconnu mais bien réel.`, trivia: `Ce secret n'a été révélé que bien des années plus tard.` },
    { title: "Innovation Révolutionnaire", q: `Quelle grande innovation technique ou stylistique a apporté "${cleanTopic}" ?`, ans: `La technique avant-gardiste`, distractors: [`Le format traditionnel`, `L'adaptation standard`, `L'effet de mode éphémère`], clue: `Une première dans l'histoire qui a inspiré ses pairs.`, trivia: `Ce procédé a été breveté et réutilisé par l'industrie.` },
    { title: "Affrontement Final", q: `Quel dénouement épique ou climax caractérise l'expérience de "${cleanTopic}" ?`, ans: `L'apothéose finale spectaculaire`, distractors: [`Le dénouement en demi-teinte`, `La fin ouverte mystérieuse`, `Le faux clap de fin`], clue: `Une montée en tension dramatique inoubliable.`, trivia: `Cette séquence a nécessité des mois de préparation minutieuse.` },
    { title: "Héritage Culturel", q: `Quel impact durable et hommage contemporain retient-on de "${cleanTopic}" ?`, ans: `L'influence majeure sur la pop culture`, distractors: [`L'engouement localisé`, `Le succès éphémère`, `Le phénomène marginal`], clue: `Toujours cité en référence par les créateurs actuels.`, trivia: `Cette œuvre continue d'inspirer les nouvelles générations.` },
    { title: "Défi Ultime des Experts", q: `Pour les véritables connaisseurs, quel détail pointu distingue "${cleanTopic}" ?`, ans: `La caractéristique exclusive d'initié`, distractors: [`Le piège classique`, `L'élément de surface`, `La variante approximative`], clue: `Seuls les passionnés les plus aguerris connaissent la réponse.`, trivia: `Moins de 5% des participants répondent correctement sans hésiter !` }
  ];

  const questions: Question[] = aspects.map((asp, idx) => {
    const rawOptions = [asp.ans, ...asp.distractors];
    // Shuffle options
    const shuffled = [...rawOptions].sort(() => Math.random() - 0.5);

    let qText = asp.q;
    if (gameMode === 'visual_blind_test') {
      const visualPrompts = [
        `Quel élément ou personnage lié à "${cleanTopic}" est illustré ici ?`,
        `De quelle scène ou œuvre issue de "${cleanTopic}" provient cette image ?`,
        `Identifie cet objet ou lieu culte de "${cleanTopic}" :`,
        `Qui ou quoi est représenté sur ce visuel de "${cleanTopic}" ?`,
        `Reconnais-tu cet élément marquant de "${cleanTopic}" ?`
      ];
      qText = visualPrompts[idx % visualPrompts.length];
    } else if (gameMode === 'music_blind_test') {
      qText = `À quel thème, scène ou morceau de "${cleanTopic}" correspond cet extrait audio ?`;
    }

    const visualImgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(asp.ans + ' ' + cleanTopic + ' illustration photo')}?width=800&height=450&nologo=true`;
    return {
      id: idx + 1,
      question: qText,
      options: shuffled,
      correctAnswer: asp.ans,
      clue: gameMode === 'visual_blind_test' ? '' : asp.clue,
      wikiSearchQuery: `${asp.ans} ${cleanTopic}`,
      youtubeSearchQuery: `${asp.ans} ${cleanTopic} OST soundtrack`,
      audioNotes: [261.63 + idx * 25, 329.63 + idx * 20, 392.0 + idx * 15, 523.25],
      imageUrl: gameMode === 'visual_blind_test' ? visualImgUrl : `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanTopic + ' theme')}?width=800&height=450&nologo=true`,
      imagePrompt: `${asp.ans} ${cleanTopic}`,
      trivia: asp.trivia,
      category: asp.title
    };
  });

  return {
    topic: cleanTopic,
    themeTitle: `${effectiveMode === 'music_blind_test' ? 'Blind Test Musical' : effectiveMode === 'visual_blind_test' ? 'Blind Test Visuel' : 'Quiz'} : ${cleanTopic}`,
    themeDescription: `15 énigmes sur mesure sur le thème "${cleanTopic}".`,
    primaryColor: '#9333ea',
    accentColor: '#f43f5e',
    ambientSound: 'synthwave',
    questions,
    fallbackUsed: true,
    gameMode: effectiveMode,
    difficulty: effectiveDiff,
  };
}

export const generateFallbackQuiz = generateDynamicFallbackQuiz;
