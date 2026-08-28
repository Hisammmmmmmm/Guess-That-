import { QuizData, Question } from '../types';
import { PRESET_QUIZ_DATA } from './presetThemes';
import { LOCALIZED_CINEMA_EN, LOCALIZED_GAMING_EN } from './localizedPresets';

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
    wikiSearchQuery: "Freddie Mercury Queen Band",
    youtubeSearchQuery: "Queen Bohemian Rhapsody Official Video",
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
    wikiSearchQuery: "Michael Jackson Thriller Red Jacket",
    youtubeSearchQuery: "Michael Jackson Thriller Official Music Video",
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
    wikiSearchQuery: "Daft Punk Helmets Guy Manuel Thomas Bangalter",
    youtubeSearchQuery: "Daft Punk Around the World Official Video",
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
    wikiSearchQuery: "Kurt Cobain Nirvana",
    youtubeSearchQuery: "Nirvana Smells Like Teen Spirit Official Video",
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
    wikiSearchQuery: "The Beatles Abbey Road Crossing",
    youtubeSearchQuery: "The Beatles Hey Jude Official Video",
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
    wikiSearchQuery: "Eminem Marshall Mathers 8 Mile",
    youtubeSearchQuery: "Eminem Lose Yourself Official Music Video",
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
    wikiSearchQuery: "ABBA Band Agnetha Bjorn Benny Anni-Frid",
    youtubeSearchQuery: "ABBA Dancing Queen Official Music Video",
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
    wikiSearchQuery: "Bob Marley Reggae Legend",
    youtubeSearchQuery: "Bob Marley Could You Be Loved Official Video",
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
    wikiSearchQuery: "Pink Floyd Dark Side of the Moon Prism",
    youtubeSearchQuery: "Pink Floyd Comfortably Numb Live Pulse",
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
    wikiSearchQuery: "Madonna Pop Singer Like a Virgin",
    youtubeSearchQuery: "Madonna Vogue Official Music Video",
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
    wikiSearchQuery: "Angus Young ACDC Guitarist Schoolboy Uniform",
    youtubeSearchQuery: "ACDC Highway to Hell Official Video",
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
    wikiSearchQuery: "David Bowie Ziggy Stardust Aladdin Sane Lightning",
    youtubeSearchQuery: "David Bowie Heroes Official Music Video",
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
    wikiSearchQuery: "Prince Purple Rain Musician",
    youtubeSearchQuery: "Prince Purple Rain Official Music Video",
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
    wikiSearchQuery: "Elton John Piano Glasses",
    youtubeSearchQuery: "Elton John Rocket Man Official Music Video",
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
    wikiSearchQuery: "Billie Eilish Singer Bad Guy",
    youtubeSearchQuery: "Billie Eilish Bad Guy Official Music Video",
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

// Procedural dynamic question generator for ANY custom topic
export function generateDynamicFallbackQuiz(
  topic: string,
  gameMode: string = 'quiz',
  difficulty: string = 'medium',
  language: string = 'fr'
): QuizData {
  const cleanTopic = topic.trim();
  const lower = cleanTopic.toLowerCase();

  // Check direct preset matches across ALL languages
  const isCinema = lower.includes('ciné') || lower.includes('film') || lower.includes('movie') || lower.includes('cine') || lower.includes('película') || lower.includes('kino') || lower.includes('映画') || lower.includes('سينما') || lower.includes('电影') || lower.includes('кино');
  const isGaming = lower.includes('jeu') || lower.includes('game') || lower.includes('gaming') || lower.includes('playstation') || lower.includes('nintendo') || lower.includes('juego') || lower.includes('videojuego') || lower.includes('spiel') || lower.includes('ビデオゲーム') || lower.includes('ألعاب') || lower.includes('游戏') || lower.includes('игры');
  const isAnimes = lower.includes('anim') || lower.includes('manga') || lower.includes('dessin') || lower.includes('dragon ball') || lower.includes('naruto') || lower.includes('one piece') || lower.includes('anime') || lower.includes('アニメ') || lower.includes('أنمي') || lower.includes('动漫');
  const isMusic = lower.includes('musique') || lower.includes('song') || lower.includes('chanson') || lower.includes('hit') || lower.includes('rock') || lower.includes('pop') || lower.includes('musica') || lower.includes('musik') || lower.includes('音楽') || lower.includes('موسيقى') || lower.includes('音乐');
  const isSeries = lower.includes('série') || lower.includes('serie') || lower.includes('tv') || lower.includes('netflix') || lower.includes('streaming') || lower.includes('ドラマ') || lower.includes('مسلسل') || lower.includes('电视剧');
  const isWorld = lower.includes('monde') || lower.includes('voyage') || lower.includes('monument') || lower.includes('histoire') || lower.includes('géographie') || lower.includes('pays') || lower.includes('capitale') || lower.includes('mundo') || lower.includes('世界') || lower.includes('عالم') || lower.includes('мир');

  // Check direct preset matches across ALL languages
  if (isCinema) {
    const data = PRESET_QUIZ_DATA.cinema;
    return language === 'fr' ? { ...data, topic: cleanTopic } : {
      ...data,
      topic: cleanTopic,
      themeTitle: `Cult Movies & Cinema : ${cleanTopic}`,
      themeDescription: `15 legendary films and iconic scenes.`,
      questions: LOCALIZED_CINEMA_EN,
    };
  }
  if (isGaming) {
    const data = PRESET_QUIZ_DATA.gaming;
    return language === 'fr' ? { ...data, topic: cleanTopic } : {
      ...data,
      topic: cleanTopic,
      themeTitle: `Video Games & Retrogaming : ${cleanTopic}`,
      themeDescription: `From Mario to Cyberpunk: 15 gaming legends.`,
      questions: LOCALIZED_GAMING_EN,
    };
  }
  if (isAnimes) {
    const data = PRESET_QUIZ_DATA.animes;
    return { ...data, topic: cleanTopic, questions: ANIMES_QUESTIONS };
  }
  if (isMusic) {
    const data = PRESET_QUIZ_DATA.music;
    return { ...data, topic: cleanTopic, questions: MUSIC_QUESTIONS };
  }
  if (isSeries) {
    const data = PRESET_QUIZ_DATA.series;
    return { ...data, topic: cleanTopic, questions: SERIES_QUESTIONS };
  }
  if (isWorld) {
    const data = PRESET_QUIZ_DATA.world;
    return { ...data, topic: cleanTopic, questions: WORLD_QUESTIONS };
  }

  // Localization templates for custom topic generation in ALL 11 languages
  const localizedAspects: Record<string, {
    prefix: string;
    aspects: { title: string; q: (t: string) => string; ans: (t: string) => string; dist: string[]; clue: (t: string, cat: string) => string; trivia: (t: string) => string; }[];
    themeTitle: (t: string) => string;
    themeDesc: (t: string) => string;
  }> = {
    en: {
      prefix: 'English',
      themeTitle: (t) => `Ultimate Trivia: ${t}`,
      themeDesc: (t) => `15 captivating questions and clues about ${t}`,
      aspects: [
        { title: "Origins & Lore", q: (t) => `What foundational element or inspiration originally defines "${t}"?`, ans: (t) => `${t}`, dist: ["The alternate spinoff", "The rejected prototype", "The modern reboot"], clue: (t) => `Focus on the foundational origins of ${t}.`, trivia: (t) => `In the history of "${t}", early development underwent numerous creative transformations.` },
        { title: "Iconic Symbol", q: (t) => `Which of the following is the most iconic symbol or emblem associated with "${t}"?`, ans: (t) => `${t}`, dist: ["The rival emblem", "The provisional badge", "The secondary seal"], clue: (t) => `Think about the primary visual emblem of ${t}.`, trivia: (t) => `The iconic design of "${t}" has become a recognized benchmark in popular culture.` },
        { title: "Famous Milestone", q: (t) => `Which memorable milestone or breakthrough achievement defined the history of "${t}"?`, ans: (t) => `${t}`, dist: ["The minor incident", "The unconfirmed rumor", "The obscure early prologue"], clue: (t) => `Remember the biggest turning point for ${t}.`, trivia: (t) => `This milestone set a global standard in the legacy of ${t}.` },
        { title: "Key Protagonist", q: (t) => `Which central figure or iconic character best embodies "${t}"?`, ans: (t) => `${t}`, dist: ["The secondary antagonist", "The missing mentor", "The occasional ally"], clue: (t) => `Identify the main hero or leading face of ${t}.`, trivia: (t) => `Fans regularly rank this persona among the all-time favorites in ${t}.` },
        { title: "Secret & Trivia", q: (t) => `What surprising behind-the-scenes detail or hidden secret fascinates fans of "${t}"?`, ans: (t) => `${t}`, dist: ["A translation mistake", "An ordinary deleted scene", "A false rumor"], clue: (t) => `Think of the most famous inside secret of ${t}.`, trivia: (t) => `This fascinating trivia was only revealed years after the initial debut!` },
        { title: "Iconic Rivalry", q: (t) => `Which legendary opposition or climactic rivalry is central to "${t}"?`, ans: (t) => `${t}`, dist: ["The minor disagreement", "The unanimous truce", "The forgotten pact"], clue: (t) => `Recall the greatest duel in ${t}.`, trivia: (t) => `This rivalry remains celebrated across generations of fans.` },
        { title: "Legendary Artifact", q: (t) => `Which cult item, gear or mythic artifact is synonymous with "${t}"?`, ans: (t) => `${t}`, dist: ["The standard tool", "The modern replica", "The lost relic"], clue: (t) => `Consider the most famous signature item of ${t}.`, trivia: (t) => `Replicas of this iconic artifact are among the most sought-after collector pieces.` },
        { title: "Iconic Setting", q: (t) => `Which majestic location or legendary realm serves as the primary stage in "${t}"?`, ans: (t) => `${t}`, dist: ["The border outpost", "The abandoned desert", "The enemy fortress"], clue: (t) => `Visualize the core world or main hub of ${t}.`, trivia: (t) => `The architecture and atmosphere of this setting inspired countless future works.` },
        { title: "Record & Impact", q: (t) => `What world record, historic reception or milestone honors the legacy of "${t}"?`, ans: (t) => `${t}`, dist: ["The average ranking", "The initial stumbling", "The honorable mention"], clue: (t) => `Focus on the highest global achievement of ${t}.`, trivia: (t) => `This phenomenal achievement solidified ${t} as a cultural cornerstone.` },
        { title: "Cultural Legacy", q: (t) => `How has "${t}" fundamentally shaped modern popular culture?`, ans: (t) => `${t}`, dist: ["A temporary fad", "A forgotten controversy", "An anonymous tribute"], clue: (t) => `Reflect on the worldwide influence of ${t}.`, trivia: (t) => `References to "${t}" continue to appear across cinema, games, and modern art.` },
        { title: "Famous Quote", q: (t) => `Which memorable quote or signature motto best captures the spirit of "${t}"?`, ans: (t) => `${t}`, dist: ["The generic proverb", "The technical formula", "The improvised phrase"], clue: (t) => `Recall the most famous catchphrase from ${t}.`, trivia: (t) => `This catchphrase was improvised during initial production!` },
        { title: "The Ultimate Challenge", q: (t) => `Which monumental trial or epic conflict represents the peak climax in "${t}"?`, ans: (t) => `${t}`, dist: ["The warm-up skirmish", "The initiation test", "The hidden pathway"], clue: (t) => `Think of the most intense challenge in ${t}.`, trivia: (t) => `The dramatic climax kept audiences on the edge of their seats worldwide.` },
        { title: "Core Mechanic", q: (t) => `Which golden rule or fundamental principle defines the inner world of "${t}"?`, ans: (t) => `${t}`, dist: ["A temporary exception", "An optional guideline", "A localized convention"], clue: (t) => `Focus on the essential principle of ${t}.`, trivia: (t) => `This master rule governs every critical event in the universe of ${t}.` },
        { title: "Did You Know?", q: (t) => `Which unexpected reveal about "${t}" surprises even seasoned enthusiasts?`, ans: (t) => `${t}`, dist: ["A simple coincidence", "A common confusion", "An unverified whisper"], clue: (t) => `Think about the most shocking truth about ${t}.`, trivia: (t) => `Only a tiny percentage of hardcore enthusiasts know this unique detail!` },
        { title: "Masterpiece Status", q: (t) => `Why does "${t}" continue to be revered as a timeless masterpiece today?`, ans: (t) => `${t}`, dist: ["A late rediscovery", "A marketing revival", "A cult following only"], clue: (t) => `Consider what makes ${t} eternally relevant.`, trivia: (t) => `Generations of creators cite "${t}" as their single biggest source of inspiration.` }
      ]
    },
    es: {
      prefix: 'Español',
      themeTitle: (t) => `Quiz Definitivo: ${t}`,
      themeDesc: (t) => `15 enigmas y preguntas apasionantes sobre ${t}`,
      aspects: [
        { title: "Orígenes", q: (t) => `¿Qué elemento o inspiración original caracteriza a "${t}"?`, ans: (t) => `${t}`, dist: ["La versión derivada", "El prototipo descartado", "El reboot moderno"], clue: (t) => `Piensa en los orígenes de ${t}.`, trivia: (t) => `La creación de "${t}" estuvo llena de anécdotas sorprendentes.` },
        { title: "Símbolo Icónico", q: (t) => `¿Cuál de las siguientes opciones es el símbolo más icónico de "${t}"?`, ans: (t) => `${t}`, dist: ["El escudo rival", "La insignia provisional", "El sello secundario"], clue: (t) => `Visualiza el logotipo principal de ${t}.`, trivia: (t) => `Este símbolo es reconocido por millones de personas en todo el mundo.` },
        { title: "Hito Histórico", q: (t) => `¿Qué logro o momento memorable definió la historia de "${t}"?`, ans: (t) => `${t}`, dist: ["El incidente menor", "El rumor no confirmado", "El prólogo desconocido"], clue: (t) => `Recuerda el mayor hito de ${t}.`, trivia: (t) => `Marcó un antes y un después en la historia de ${t}.` },
        { title: "Protagonista", q: (t) => `¿Qué figura central o personaje clave encarna mejor "${t}"?`, ans: (t) => `${t}`, dist: ["El antagonista secundario", "El mentor desaparecido", "El aliado ocasional"], clue: (t) => `Identifica al héroe principal de ${t}.`, trivia: (t) => `Es uno de los personajes más queridos por la comunidad.` },
        { title: "Secreto & Curiosidad", q: (t) => `¿Qué detalle curioso o secreto de producción fascina a los fans de "${t}"?`, ans: (t) => `${t}`, dist: ["Un error de doblaje", "Una escena eliminada común", "Un falso rumor"], clue: (t) => `Piensa en el secreto mejor guardado de ${t}.`, trivia: (t) => `Este detalle fue revelado mucho después del lanzamiento oficial.` },
        { title: "Rivalidad Legendaria", q: (t) => `¿Qué rivalidad legendaria o gran enfrentamiento destaca en "${t}"?`, ans: (t) => `${t}`, dist: ["El desacuerdo menor", "La tregua pacífica", "El pacto olvidado"], clue: (t) => `Recuerda el combate más épico de ${t}.`, trivia: (t) => `Este enfrentamiento sigue siendo un referente en la cultura popular.` },
        { title: "Artefacto Mítico", q: (t) => `¿Qué objeto, accesorio o artefacto legendario es inseparable de "${t}"?`, ans: (t) => `${t}`, dist: ["La herramienta común", "La copia moderna", "La reliquia olvidada"], clue: (t) => `Visualiza el objeto más famoso de ${t}.`, trivia: (t) => `Las réplicas de este artefacto son muy codiciadas por coleccionistas.` },
        { title: "Lugar Emblemático", q: (t) => `¿Qué escenario majestuoso o lugar icónico sirve de entorno principal en "${t}"?`, ans: (t) => `${t}`, dist: ["El puesto fronterizo", "El desierto abandonado", "La fortaleza enemiga"], clue: (t) => `Piensa en el mundo principal de ${t}.`, trivia: (t) => `El diseño de este escenario inspiró a numerosos artistas.` },
        { title: "Récord & Éxito", q: (t) => `¿Qué récord o recepción histórica consagra el éxito de "${t}"?`, ans: (t) => `${t}`, dist: ["El resultado medio", "El tropiezo inicial", "La mención honorífica"], clue: (t) => `Enfócate en el mayor logro mundial de ${t}.`, trivia: (t) => `Rompió marcas históricas a nivel internacional.` },
        { title: "Legado Cultural", q: (t) => `¿Cómo ha influido profundamente "${t}" en la cultura contemporánea?`, ans: (t) => `${t}`, dist: ["Una moda pasajera", "Una controversia olvidada", "Un homenaje anónimo"], clue: (t) => `Reflexiona sobre el impacto universal de ${t}.`, trivia: (t) => `Su legado sigue vivo y ha inspirado a generaciones de creadores.` },
        { title: "Frase Inolvidable", q: (t) => `¿Qué célebre frase o lema resume a la perfección el espíritu de "${t}"?`, ans: (t) => `${t}`, dist: ["El proverbio genérico", "La fórmula técnica", "La frase improvisada"], clue: (t) => `Recuerda la cita más icónica de ${t}.`, trivia: (t) => `Esta frase fue improvisada durante los primeros ensayos.` },
        { title: "El Gran Desafío", q: (t) => `¿Qué prueba definitiva representa el clímax supremo en "${t}"?`, ans: (t) => `${t}`, dist: ["El duelo inicial", "El entrenamiento básico", "El atajo secreto"], clue: (t) => `Piensa en el momento más dramático de ${t}.`, trivia: (t) => `El clímax mantuvo en vilo a millones de espectadores.` },
        { title: "Regla Fundamental", q: (t) => `¿Qué regla de oro o principio esencial rige el funcionamiento de "${t}"?`, ans: (t) => `${t}`, dist: ["Una excepción temporal", "Una guía opcional", "Una costumbre local"], clue: (t) => `Identifica la regla maestra de ${t}.`, trivia: (t) => `Esta regla es clave para entender todas las decisiones en ${t}.` },
        { title: "¿Sabías Que?", q: (t) => `¿Qué revelación sorprendente sobre "${t}" asombra a los más conocedores?`, ans: (t) => `${t}`, dist: ["Una simple coincidencia", "Una confusión común", "Un rumor pasajero"], clue: (t) => `Piensa en la curiosidad más llamativa de ${t}.`, trivia: (t) => `¡Solo los mayores expertos conocen este detalle especial!` },
        { title: "Obra Maestra", q: (t) => `¿Por qué "${t}" sigue siendo considerado hoy en día una obra maestra atemporal?`, ans: (t) => `${t}`, dist: ["Un redescubrimiento tardío", "Un relanzamiento comercial", "Un éxito modesto"], clue: (t) => `Considera la calidad atemporal de ${t}.`, trivia: (t) => `Sigue siendo un estándar de excelencia en su categoría.` }
      ]
    },
    de: {
      prefix: 'Deutsch',
      themeTitle: (t) => `Ultimatives Quiz: ${t}`,
      themeDesc: (t) => `15 spannende Rätsel und Fragen rund um ${t}`,
      aspects: [
        { title: "Ursprung & Entstehung", q: (t) => `Welches grundlegende Element oder welche Inspiration prägte "${t}" ursprünglich?`, ans: (t) => `${t}`, dist: ["Die alternative Ableger-Version", "Der verworfene Prototyp", "Das moderne Reboot"], clue: (t) => `Denke an die Anfänge von ${t}.`, trivia: (t) => `Die Entstehungsgeschichte von "${t}" war voller Überraschungen!` },
        { title: "Kult-Symbol", q: (t) => `Welches der folgenden Symbole ist das bekannteste Erkennungszeichen von "${t}"?`, ans: (t) => `${t}`, dist: ["Das gegnerische Wappen", "Das vorläufige Abzeichen", "Das sekundäre Siegel"], clue: (t) => `Erinnere dich an das Hauptlogo von ${t}.`, trivia: (t) => `Dieses Symbol ist weltweit für Millionen von Fans ein Begriff.` },
        { title: "Historischer Meilenstein", q: (t) => `Welcher unvergessliche Durchbruch prägte die Geschichte von "${t}" maßgeblich?`, ans: (t) => `${t}`, dist: ["Der kleine Zwischenfall", "Das unbestätigte Gerücht", "Der unbekannte Prolog"], clue: (t) => `Denke an den größten Höhepunkt von ${t}.`, trivia: (t) => `Dieser Moment setzte weltweit neue Maßstäbe für ${t}.` },
        { title: "Schlüsselfigur", q: (t) => `Welche zentrale Gestalt oder Hauptfigur verkörpert "${t}" am besten?`, ans: (t) => `${t}`, dist: ["Der Nebenantagonist", "Der verschollene Mentor", "Der gelegentliche Verbündete"], clue: (t) => `Finde den bekanntesten Helden von ${t}.`, trivia: (t) => `Diese Figur gehört zu den absoluten Lieblingen der Community.` },
        { title: "Geheimnis & Anekdote", q: (t) => `Welches überraschende Detail hinter den Kulissen fasziniert Fans von "${t}"?`, ans: (t) => `${t}`, dist: ["Ein Übersetzungsfehler", "Eine gewöhnliche gelöschte Szene", "Ein falsches Gerücht"], clue: (t) => `Denke an das bestgehütete Geheimnis von ${t}.`, trivia: (t) => `Diese Anekdote wurde erst Jahre nach dem Debüt enthüllt!` },
        { title: "Legendäre Rivalität", q: (t) => `Welche legendäre Rivalität oder welcher epische Konflikt steht im Zentrum von "${t}"?`, ans: (t) => `${t}`, dist: ["Die kleine Meinungsverschiedenheit", "Der friedliche Waffenstillstand", "Der vergessene Pakt"], clue: (t) => `Erinnere dich an den größten Showdown in ${t}.`, trivia: (t) => `Dieses Aufeinandertreffen ist bis heute unvergessen.` },
        { title: "Mythisches Artefakt", q: (t) => `Welcher Kult-Gegenstand oder welches mythische Artefakt ist untrennbar mit "${t}" verbunden?`, ans: (t) => `${t}`, dist: ["Das Standardwerkzeug", "Die moderne Nachbildung", "Das verlorene Relikt"], clue: (t) => `Denke an den berühmtesten Gegenstand von ${t}.`, trivia: (t) => `Repliken dieses Artefakts sind begehrte Sammlerstücke.` },
        { title: "Kultiger Schauplatz", q: (t) => `Welcher majestätische Ort dient als Hauptbühne in "${t}"?`, ans: (t) => `${t}`, dist: ["Der Grenzposten", "Die verlassene Wüste", "Die feindliche Festung"], clue: (t) => `Visualisiere die Hauptwelt von ${t}.`, trivia: (t) => `Die Architektur dieses Ortes inspirierte unzählige Künstler.` },
        { title: "Rekord & Erfolg", q: (t) => `Welcher historische Rekord oder Erfolg krönt das Vermächtnis von "${t}"?`, ans: (t) => `${t}`, dist: ["Die durchschnittliche Wertung", "Der holprige Start", "Die lobende Erwähnung"], clue: (t) => `Fokussiere dich auf den größten Triumph von ${t}.`, trivia: (t) => `Dieser Erfolg machte ${t} zu einem weltweiten Phänomen.` },
        { title: "Kulturelles Erbe", q: (t) => `Wie hat "${t}" die moderne Popkultur nachhaltig beeinflusst?`, ans: (t) => `${t}`, dist: ["Ein flüchtiger Trend", "Eine vergessene Kontroverse", "Eine anonyme Hommage"], clue: (t) => `Reflektiere über den weltweiten Einfluss von ${t}.`, trivia: (t) => `Referenzen auf "${t}" finden sich heute in Kunst, Film und Gaming.` },
        { title: "Berühmtes Zitat", q: (t) => `Welches legendäre Zitat oder welches Motto bringt den Geist von "${t}" auf den Punkt?`, ans: (t) => `${t}`, dist: ["Das allgemeine Sprichwort", "Die technische Formel", "Der improvisierte Satz"], clue: (t) => `Erinnere dich an den bekanntesten Spruch aus ${t}.`, trivia: (t) => `Dieser Spruch entstand spontan bei den ersten Proben!` },
        { title: "Die Große Prüfung", q: (t) => `Welche monumentale Herausforderung bildet den dramatischen Höhepunkt in "${t}"?`, ans: (t) => `${t}`, dist: ["Das kleine Scharmützel", "Die Einsteigermission", "Der geheime Pfad"], clue: (t) => `Denke an die intensivste Prüfung in ${t}.`, trivia: (t) => `Dieser Höhepunkt hielt das Publikum weltweit in Atem.` },
        { title: "Grundregel", q: (t) => `Welches fundamentale Prinzip oder Gesetz bestimmt das Universum von "${t}"?`, ans: (t) => `${t}`, dist: ["Eine temporäre Ausnahme", "Eine optionale Richtlinie", "Eine lokale Gewohnheit"], clue: (t) => `Konzentriere dich auf das Kernprinzip von ${t}.`, trivia: (t) => `Dieses Gesetz ist der Schlüssel zu allen Wendungen in ${t}.` },
        { title: "Wusstest du schon?", q: (t) => `Welche verblüffende Tatsache über "${t}" überrascht selbst eingefleischte Kenner?`, ans: (t) => `${t}`, dist: ["Ein reiner Zufall", "Eine häufige Verwechslung", "Ein flüchtiges Gerücht"], clue: (t) => `Denke an die überraschendste Wahrheit über ${t}.`, trivia: (t) => `Nur die treuesten Fans kennen dieses besondere Detail!` },
        { title: "Meisterwerk-Status", q: (t) => `Warum gilt "${t}" bis heute als zeitloses Meisterwerk?`, ans: (t) => `${t}`, dist: ["Eine späte Wiederentdeckung", "Eine Marketing-Kampagne", "Ein reiner Achtungserfolg"], clue: (t) => `Bedenke die zeitlose Klasse von ${t}.`, trivia: (t) => `Zahlreiche Schöpfer bezeichnen "${t}" als ihre größte Inspirationsquelle.` }
      ]
    },
    it: {
      prefix: 'Italiano',
      themeTitle: (t) => `Quiz Definitivo: ${t}`,
      themeDesc: (t) => `15 enigmi e domande affascinanti su ${t}`,
      aspects: [
        { title: "Origini & Creazione", q: (t) => `Quale elemento o ispirazione fondamentale definisce in origine "${t}"?`, ans: (t) => `${t}`, dist: ["Lo spinoff alternativo", "Il prototipo scartato", "Il reboot moderno"], clue: (t) => `Pensa alle origini di ${t}.`, trivia: (t) => `La nascita di "${t}" ha attraversato momenti davvero curiosi!` },
        { title: "Simbolo Iconico", q: (t) => `Quale tra i seguenti è il simbolo più iconico associato a "${t}"?`, ans: (t) => `${t}`, dist: ["Lo stemma rivale", "Il distintivo provvisorio", "Il sigillo secondario"], clue: (t) => `Visualizza il logo principale di ${t}.`, trivia: (t) => `Questo simbolo è riconosciuto a livello internazionale.` },
        { title: "Pietra Miliare", q: (t) => `Quale traguardo memorabile o svolta storica ha definito il successo di "${t}"?`, ans: (t) => `${t}`, dist: ["L'incidente minore", "La voce non confermata", "L'oscuro prologo"], clue: (t) => `Ricorda il momento culminante di ${t}.`, trivia: (t) => `Ha segnato una svolta epocale nella storia di ${t}.` },
        { title: "Protagonista Chiave", q: (t) => `Quale figura centrale o personaggio leggendario incarna meglio "${t}"?`, ans: (t) => `${t}`, dist: ["L'antagonista secondario", "Il mentore scomparso", "L'alleato temporaneo"], clue: (t) => `Trova il volto principale di ${t}.`, trivia: (t) => `È tra i personaggi più amati della cultura pop.` },
        { title: "Segreto & Curiosità", q: (t) => `Quale retroscena o segreto affascina gli appassionati di "${t}"?`, ans: (t) => `${t}`, dist: ["Un errore di traduzione", "Una scena tagliata comune", "Una falsa voce"], clue: (t) => `Pensa al segreto più celebre di ${t}.`, trivia: (t) => `Questo aneddoto è stato rivelato solo molti anni dopo il lancio!` },
        { title: "Rivalità Epica", q: (t) => `Quale leggendaria rivalità o scontro al vertice caratterizza "${t}"?`, ans: (t) => `${t}`, dist: ["La disputa passeggera", "La tregua pacifica", "Il patto dimenticato"], clue: (t) => `Ricorda il duello più memorabile di ${t}.`, trivia: (t) => `Questo scontro rimane leggendario nella memoria dei fan.` },
        { title: "Artefatto Mitico", q: (t) => `Quale oggetto leggendario o reliquia di culto è inseparabile da "${t}"?`, ans: (t) => `${t}`, dist: ["L'attrezzo comune", "La replica moderna", "La reliquia perduta"], clue: (t) => `Pensa all'oggetto simbolo di ${t}.`, trivia: (t) => `Le repliche di questo oggetto sono ambitissime dai collezionisti.` },
        { title: "Luogo Iconico", q: (t) => `Quale luogo maestoso o mondo leggendario fa da scenario principale in "${t}"?`, ans: (t) => `${t}`, dist: ["L'avamposto di confine", "Il deserto abbandonato", "La fortezza nemica"], clue: (t) => `Visualizza il mondo di ${t}.`, trivia: (t) => `L'atmosfera di questo luogo ha ispirato innumerevoli opere.` },
        { title: "Record & Trionfo", q: (t) => `Quale record mondiale o traguardo storico consacra "${t}"?`, ans: (t) => `${t}`, dist: ["Il punteggio medio", "La falsa partenza iniziale", "La menzione onorevole"], clue: (t) => `Pensa al trionfo supremo di ${t}.`, trivia: (t) => `Ha stabilito standard globali senza precedenti.` },
        { title: "Eredità Culturale", q: (t) => `In che modo "${t}" ha influenzato profondamente la cultura contemporanea?`, ans: (t) => `${t}`, dist: ["Una moda passeggera", "Una controversia dimenticata", "Un omaggio anonimo"], clue: (t) => `Rifletti sull'impatto mondiale di ${t}.`, trivia: (t) => `Influenze e citazioni di "${t}" continuano a emergere ovunque.` },
        { title: "Citazione Celebre", q: (t) => `Quale memorabile citazione o motto racchiude lo spirito di "${t}"?`, ans: (t) => `${t}`, dist: ["Il proverbio generico", "La formula tecnica", "La battuta improvvisata"], clue: (t) => `Ricorda la frase più celebre di ${t}.`, trivia: (t) => `Questa frase è stata improvvisata durante le prime prove!` },
        { title: "La Grande Prova", q: (t) => `Quale epica prova o conflitto insormontabile rappresenta il culmine in "${t}"?`, ans: (t) => `${t}`, dist: ["La schermaglia iniziale", "L'addestramento base", "Il passaggio segreto"], clue: (t) => `Pensa al momento più intenso di ${t}.`, trivia: (t) => `Il climax ha lasciato milioni di persone col fiato sospeso.` },
        { title: "Regola Fondamentale", q: (t) => `Quale principio cardine o legge essenziale governa il mondo di "${t}"?`, ans: (t) => `${t}`, dist: ["Un'eccezione temporanea", "Una linea guida facoltativa", "Una convenzione locale"], clue: (t) => `Focalizzati sulla regola chiave di ${t}.`, trivia: (t) => `Questa regola spiega ogni evento cruciale in ${t}.` },
        { title: "Lo Sapevi?", q: (t) => `Quale sorprendente rivelazione su "${t}" stupisce anche i più grandi intenditori?`, ans: (t) => `${t}`, dist: ["Una pura coincidenza", "Una confusione classica", "Una voce infondata"], clue: (t) => `Pensa alla curiosità più inaspettata su ${t}.`, trivia: (t) => `Solo una piccola percentuale di esperti conosce questo dettaglio!` },
        { title: "Capolavoro Senza Tempo", q: (t) => `Perché "${t}" viene ancora oggi celebrato come un capolavoro assoluto?`, ans: (t) => `${t}`, dist: ["Una riscoperta tardiva", "Un rilancio commerciale", "Un successo di nicchia"], clue: (t) => `Pensa al valore senza tempo di ${t}.`, trivia: (t) => `Intere generazioni continuano a citare "${t}" come loro massima ispirazione.` }
      ]
    },
    pt: {
      prefix: 'Português',
      themeTitle: (t) => `Quiz Definitivo: ${t}`,
      themeDesc: (t) => `15 enigmas e perguntas fascinantes sobre ${t}`,
      aspects: [
        { title: "Origens & Criação", q: (t) => `Que elemento ou inspiração fundamental define originalmente "${t}"?`, ans: (t) => `${t}`, dist: ["O spinoff alternativo", "O protótipo descartado", "O reboot moderno"], clue: (t) => `Pense nas origens de ${t}.`, trivia: (t) => `A criação de "${t}" teve momentos surpreendentes!` },
        { title: "Símbolo Icônico", q: (t) => `Qual dos seguintes é o símbolo mais icônico associado a "${t}"?`, ans: (t) => `${t}`, dist: ["O brasão rival", "O distintivo provisório", "O selo secundário"], clue: (t) => `Visualize o logo principal de ${t}.`, trivia: (t) => `Este símbolo é reconhecido mundialmente.` },
        { title: "Marco Histórico", q: (t) => `Que marco memorável ou grande conquista definiu a história de "${t}"?`, ans: (t) => `${t}`, dist: ["O incidente menor", "O boato não confirmado", "O prólogo desconhecido"], clue: (t) => `Lembre-se do maior ápice de ${t}.`, trivia: (t) => `Marcou um antes e depois na trajetória de ${t}.` },
        { title: "Protagonista Chave", q: (t) => `Que figura central ou personagem lendário melhor personifica "${t}"?`, ans: (t) => `${t}`, dist: ["O antagonista secundário", "O mentor desaparecido", "O aliado ocasional"], clue: (t) => `Identifique o herói principal de ${t}.`, trivia: (t) => `É um dos personagens mais queridos do universo ${t}.` },
        { title: "Segredo & Curiosidade", q: (t) => `Que detalhe curioso dos bastidores fascina os fãs de "${t}"?`, ans: (t) => `${t}`, dist: ["Um erro de tradução", "Uma cena deletada comum", "Um boato falso"], clue: (t) => `Pense no segredo mais bem guardado de ${t}.`, trivia: (t) => `Este detalhe só foi revelado anos após a estreia!` },
        { title: "Rivalidade Épica", q: (t) => `Que rivalidade lendária ou confronto no topo se destaca em "${t}"?`, ans: (t) => `${t}`, dist: ["O desacordo menor", "A trégua pacífica", "O pacto esquecido"], clue: (t) => `Lembre-se da maior disputa em ${t}.`, trivia: (t) => `Esse duelo é celebrado até hoje pela comunidade.` },
        { title: "Artefato Mítico", q: (t) => `Que item, acessório ou artefato lendário é inseparável de "${t}"?`, ans: (t) => `${t}`, dist: ["A ferramenta comum", "A réplica moderna", "A relíquia perdida"], clue: (t) => `Visualize o objeto icônico de ${t}.`, trivia: (t) => `Réplicas desse artefato são cobiçadas por colecionadores.` },
        { title: "Cenário Icônico", q: (t) => `Que local majestoso ou reino lendário serve de palco principal em "${t}"?`, ans: (t) => `${t}`, dist: ["O posto de fronteira", "O deserto abandonado", "A fortaleza inimiga"], clue: (t) => `Pense no cenário principal de ${t}.`, trivia: (t) => `O visual deste lugar inspirou incontáveis artistas.` },
        { title: "Recorde & Sucesso", q: (t) => `Que recorde histórico ou consagração marca o sucesso de "${t}"?`, ans: (t) => `${t}`, dist: ["O resultado mediano", "O tropeço inicial", "A menção honrosa"], clue: (t) => `Foque na maior conquista mundial de ${t}.`, trivia: (t) => `Alcançou marcas históricas em todo o mundo.` },
        { title: "Legado Cultural", q: (t) => `Como "${t}" influenciou profundamente a cultura contemporânea?`, ans: (t) => `${t}`, dist: ["Uma moda passageira", "Uma polêmica esquecida", "Uma homenagem anônima"], clue: (t) => `Reflita sobre o impacto universal de ${t}.`, trivia: (t) => `O impacto de "${t}" segue vivo em jogos, cinema e arte.` },
        { title: "Frase Inesquecível", q: (t) => `Que célebre frase ou lema resume perfeitamente o espírito de "${t}"?`, ans: (t) => `${t}`, dist: ["O provérbio genérico", "A fórmula técnica", "A frase improvisada"], clue: (t) => `Lembre-se da citação mais famosa de ${t}.`, trivia: (t) => `Esta frase foi improvisada nos primeiros testes!` },
        { title: "O Grande Desafio", q: (t) => `Que desafio épico representa o clímax supremo em "${t}"?`, ans: (t) => `${t}`, dist: ["O combate inicial", "O treino básico", "O atalho secreto"], clue: (t) => `Pense no momento mais emocionante de ${t}.`, trivia: (t) => `O clímax prendeu a atenção de milhões de espectadores.` },
        { title: "Regra de Ouro", q: (t) => `Que princípio fundamental rege o funcionamento do universo de "${t}"?`, ans: (t) => `${t}`, dist: ["Uma exceção temporária", "Uma diretriz opcional", "Um costume local"], clue: (t) => `Identifique o conceito central de ${t}.`, trivia: (t) => `Essa regra explica todos os acontecimentos em ${t}.` },
        { title: "Você Sabia?", q: (t) => `Que revelação surpreendente sobre "${t}" espanta até os maiores conhecedores?`, ans: (t) => `${t}`, dist: ["Uma mera coincidência", "Uma confusão comum", "Um boato passageiro"], clue: (t) => `Pense na curiosidade mais impressionante sobre ${t}.`, trivia: (t) => `Apenas os fãs mais dedicados sabem este detalhe!` },
        { title: "Obra-Prima", q: (t) => `Por que "${t}" continua sendo considerado uma obra-prima atemporal?`, ans: (t) => `${t}`, dist: ["Um sucesso passageiro", "Um relançamento comercial", "Um culto modesto"], clue: (t) => `Considere o impacto duradouro de ${t}.`, trivia: (t) => `Inúmeros criadores citam "${t}" como sua inspiração máxima.` }
      ]
    },
    nl: {
      prefix: 'Nederlands',
      themeTitle: (t) => `Ultieme Quiz: ${t}`,
      themeDesc: (t) => `15 boeiende vragen en raadsels over ${t}`,
      aspects: [
        { title: "Oorsprong & Creatie", q: (t) => `Welk fundamenteel element of inspiratiebron kenmerkt oorspronkelijk "${t}"?`, ans: (t) => `${t}`, dist: ["De alternatieve spinoff", "Het verworpen prototype", "De moderne reboot"], clue: (t) => `Denk aan het begin van ${t}.`, trivia: (t) => `De vroege ontwikkeling van "${t}" kende verrassende wendingen!` },
        { title: "Iconisch Symbool", q: (t) => `Welk van de volgende symbolen is het meest iconische embleem van "${t}"?`, ans: (t) => `${t}`, dist: ["Het rivaliserende wapen", "Het tijdelijke insigne", "Het secundaire zegel"], clue: (t) => `Visualiseer het hoofdlogo van ${t}.`, trivia: (t) => `Dit symbool is wereldwijd direct herkenbaar.` },
        { title: "Historische Mijlpaal", q: (t) => `Welke gedenkwaardige doorbraak definieerde de geschiedenis van "${t}"?`, ans: (t) => `${t}`, dist: ["Het kleine incident", "Het onbevestigde gerucht", "De onbekende proloog"], clue: (t) => `Denk aan het grootste succes van ${t}.`, trivia: (t) => `Dit moment zette wereldwijd de toon voor ${t}.` },
        { title: "Hoofdfiguur", q: (t) => `Welke centrale figuur of held belichaamt "${t}" het best?`, ans: (t) => `${t}`, dist: ["De secundaire antagonist", "De verdwenen mentor", "De toevallige bondgenoot"], clue: (t) => `Herken de belangrijkste hoofdpersoon van ${t}.`, trivia: (t) => `Deze figuur is een van de favorieten aller tijden.` },
        { title: "Geheim & Trivia", q: (t) => `Welk verrassend detail achter de schermen fascineert fans van "${t}"?`, ans: (t) => `${t}`, dist: ["Een vertaalfout", "Een gewone verwijderde scène", "Een vals gerucht"], clue: (t) => `Denk aan het best bewaarde geheim van ${t}.`, trivia: (t) => `Dit detail werd pas jaren na de lancering onthuld!` },
        { title: "Legendarische Rivaliteit", q: (t) => `Welke legendarische rivaliteit of strijd staat centraal in "${t}"?`, ans: (t) => `${t}`, dist: ["Het kleine meningsverschil", "Het vreedzame bestand", "Het vergeten pact"], clue: (t) => `Herinner je het grootste duel in ${t}.`, trivia: (t) => `Deze rivaliteit blijft generaties lang populair.` },
        { title: "Mythisch Artefact", q: (t) => `Welk iconisch voorwerp of mythisch artefact is onlosmakelijk verbonden met "${t}"?`, ans: (t) => `${t}`, dist: ["Het standaard gereedschap", "De moderne replica", "Het verloren relikwie"], clue: (t) => `Visualiseer het beroemdste voorwerp van ${t}.`, trivia: (t) => `Replica's hiervan zijn zeer gewilde verzamelobjecten.` },
        { title: "Iconische Locatie", q: (t) => `Welke majestueuze plek dient als hoofddecor in "${t}"?`, ans: (t) => `${t}`, dist: ["De grenspost", "De verlaten woestijn", "Het vijandelijke fort"], clue: (t) => `Denk aan de centrale wereld van ${t}.`, trivia: (t) => `De sfeer van deze locatie inspireerde vele andere werken.` },
        { title: "Record & Triomf", q: (t) => `Welk historisch record of succes bekroont "${t}"?`, ans: (t) => `${t}`, dist: ["De gemiddelde score", "De moeizame start", "De eervolle vermelding"], clue: (t) => `Focus op de hoogste wereldwijde prestatie van ${t}.`, trivia: (t) => `Dit succes maakte ${t} tot een wereldwijd fenomeen.` },
        { title: "Culturele Erfenis", q: (t) => `Hoe heeft "${t}" de hedendaagse cultuur blijvend beïnvloed?`, ans: (t) => `${t}`, dist: ["Een tijdelijke rage", "Een vergeten controverse", "Een anoniem eerbetoon"], clue: (t) => `Denk aan de wereldwijde impact van ${t}.`, trivia: (t) => `Verwijzingen naar "${t}" duiken nog steeds overal op.` },
        { title: "Beroemde Quote", q: (t) => `Welke onvergetelijke uitspraak vat de geest van "${t}" perfect samen?`, ans: (t) => `${t}`, dist: ["Het generieke spreekwoord", "De technische formule", "De geïmproviseerde zin"], clue: (t) => `Herinner je de beroemdste uitspraak uit ${t}.`, trivia: (t) => `Deze zin werd spontaan bedacht tijdens de eerste repetities!` },
        { title: "De Ultieme Beproeving", q: (t) => `Welke epische beproeving vormt de ultieme climax in "${t}"?`, ans: (t) => `${t}`, dist: ["Het inleidende gevecht", "De basistraining", "De geheime route"], clue: (t) => `Denk aan het spannendste moment in ${t}.`, trivia: (t) => `Deze climax hield miljoenen kijkers op het puntje van hun stoel.` },
        { title: "Basisprincipe", q: (t) => `Welke gouden regel of wet bepaalt de werking van het universum van "${t}"?`, ans: (t) => `${t}`, dist: ["Een tijdelijke uitzondering", "Een optionele richtlijn", "Een lokale gewoonte"], clue: (t) => `Focus op de hoofdregel van ${t}.`, trivia: (t) => `Deze regel is essentieel om alle gebeurtenissen in ${t} te begrijpen.` },
        { title: "Wist Je Dat?", q: (t) => `Welke verrassende onthulling over "${t}" verbaast zelfs grote kenners?`, ans: (t) => `${t}`, dist: ["Een toevalligheid", "Een veelvoorkomende vergissing", "Een gerucht"], clue: (t) => `Denk aan het meest opzienbarende feit over ${t}.`, trivia: (t) => `Slechts weinigen kennen dit bijzondere detail!` },
        { title: "Meesterwerk", q: (t) => `Waarom wordt "${t}" nog steeds gezien als een tijdloos meesterwerk?`, ans: (t) => `${t}`, dist: ["Een late herontdekking", "Een commerciële stunt", "Een bescheiden succes"], clue: (t) => `Denk aan de blijvende genialiteit van ${t}.`, trivia: (t) => `Talloze makers noemen "${t}" als hun grootste inspiratiebron.` }
      ]
    },
    ru: {
      prefix: 'Русский',
      themeTitle: (t) => `Главный квиз: ${t}`,
      themeDesc: (t) => `15 захватывающих вопросов и загадок о ${t}`,
      aspects: [
        { title: "Истоки и создание", q: (t) => `Какой ключевой элемент или первоначальное вдохновение легли в основу "${t}"?`, ans: (t) => `${t}`, dist: ["Альтернативный спин-офф", "Отклоненный прототип", "Современный перезапуск"], clue: (t) => `Вспомните о зарождении ${t}.`, trivia: (t) => `История создания "${t}" полна неожиданных поворотов!` },
        { title: "Культовый символ", q: (t) => `Какой из следующих символов является самым узнаваемым знаком "${t}"?`, ans: (t) => `${t}`, dist: ["Символ соперников", "Временный значок", "Вторичная печать"], clue: (t) => `Представьте главный логотип ${t}.`, trivia: (t) => `Этот символ узнаваем миллионами людей по всему миру.` },
        { title: "Исторический прорыв", q: (t) => `Какое выдающееся событие или достижение определило историю "${t}"?`, ans: (t) => `${t}`, dist: ["Незначительный инцидент", "Неподтвержденный слух", "Малоизвестный пролог"], clue: (t) => `Вспомните главный триумф ${t}.`, trivia: (t) => `Это событие задало мировые стандарты для ${t}.` },
        { title: "Ключевой персонаж", q: (t) => `Какая центральная фигура или легендарный персонаж лучше всего воплощает "${t}"?`, ans: (t) => `${t}`, dist: ["Второстепенный антагонист", "Исчезнувший наставник", "Случайный союзник"], clue: (t) => `Назовите главное лицо ${t}.`, trivia: (t) => `Этот персонаж входит в число самых любимых в истории.` },
        { title: "Секрет и факт", q: (t) => `Какая закулисная тайна или секрет больше всего удивляет поклонников "${t}"?`, ans: (t) => `${t}`, dist: ["Ошибка перевода", "Обычная удаленная сцена", "Ложный слух"], clue: (t) => `Подумайте о самом тщательно скрываемом факте о ${t}.`, trivia: (t) => `Этот секрет был раскрыт лишь спустя годы после премьеры!` },
        { title: "Легендарное соперничество", q: (t) => `Какое великое противостояние или поединок занимает центральное место в "${t}"?`, ans: (t) => `${t}`, dist: ["Мелкое разногласие", "Мирное перемирие", "Забытый договор"], clue: (t) => `Вспомните самую грандиозную дуэль в ${t}.`, trivia: (t) => `Это соперничество стало эталоном в поп-культуре.` },
        { title: "Культовый артефакт", q: (t) => `Какой легендарный предмет или артефакт неразрывно связан с "${t}"?`, ans: (t) => `${t}`, dist: ["Обычный инструмент", "Современная копия", "Утерянная реликвия"], clue: (t) => `Представьте самый знаменитый предмет из ${t}.`, trivia: (t) => `Копии этого артефакта являются мечтой коллекционеров.` },
        { title: "Знаковое место", q: (t) => `Какая величественная локация служит главной ареной событий в "${t}"?`, ans: (t) => `${t}`, dist: ["Пограничный форпост", "Заброшенная пустыня", "Крепость врагов"], clue: (t) => `Представьте главный мир ${t}.`, trivia: (t) => `Атмосфера этого места вдохновила многих творцов.` },
        { title: "Рекорд и признание", q: (t) => `Какой мировой рекорд или грандиозный успех увековечил "${t}"?`, ans: (t) => `${t}`, dist: ["Средний результат", "Трудный старт", "Почетное упоминание"], clue: (t) => `Вспомните высшее мировое достижение ${t}.`, trivia: (t) => `Этот успех сделал ${t} международным феноменом.` },
        { title: "Культурное наследие", q: (t) => `Как "${t}" навсегда изменил современную популярную культуру?`, ans: (t) => `${t}`, dist: ["Кратковременная мода", "Забытый скандал", "Безымянная дань"], clue: (t) => `Оцените мировое влияние ${t}.`, trivia: (t) => `Отсылки к "${t}" встречаются в кино, играх и искусстве.` },
        { title: "Знаменитая цитата", q: (t) => `Какая крылатая фраза или девиз идеально передает дух "${t}"?`, ans: (t) => `${t}`, dist: ["Обычная пословица", "Техническая формула", "Случайная реплика"], clue: (t) => `Вспомните самую известную цитату из ${t}.`, trivia: (t) => `Эта фраза была сымпровизирована прямо на съемках!` },
        { title: "Главное испытание", q: (t) => `Какая решающая битва или испытание является кульминацией в "${t}"?`, ans: (t) => `${t}`, dist: ["Начальная стычка", "Базовая тренировка", "Тайный обход"], clue: (t) => `Подумайте о самом напряженном моменте в ${t}.`, trivia: (t) => `Кульминация держала в напряжении миллионы зрителей.` },
        { title: "Главный закон", q: (t) => `Какое фундаментальное правило управляет вселенной "${t}"?`, ans: (t) => `${t}`, dist: ["Временное исключение", "Необязательный совет", "Местный обычай"], clue: (t) => `Сосредоточьтесь на главном правиле ${t}.`, trivia: (t) => `Этот закон лежит в основе всех событий в ${t}.` },
        { title: "А вы знали?", q: (t) => `Какое неожиданное открытие о "${t}" удивляет даже преданных фанатов?`, ans: (t) => `${t}`, dist: ["Простое совпадение", "Частая путаница", "Случайный слух"], clue: (t) => `Подумайте о самом неожиданном факте о ${t}.`, trivia: (t) => `Лишь единицы знают эту уникальную подробность!` },
        { title: "Шедевр на все времена", q: (t) => `Почему "${t}" до сих пор признается непревзойденным шедевром?`, ans: (t) => `${t}`, dist: ["Позднее переосмысление", "Маркетинговый ход", "Умеренный успех"], clue: (t) => `Оцените непреходящую ценность ${t}.`, trivia: (t) => `Множество авторов называют "${t}" своим главным вдохновением.` }
      ]
    },
    ja: {
      prefix: '日本語',
      themeTitle: (t) => `究極のクイズ：${t}`,
      themeDesc: (t) => `${t}に関する15の魅力的な謎と問題`,
      aspects: [
        { title: "起源と誕生", q: (t) => `「${t}」を最初に特徴づけた根本的な要素や着想は何ですか？`, ans: (t) => `${t}`, dist: ["スピンオフ企画", "ボツになった試作品", "現代版リブート"], clue: (t) => `『${t}』の始まりについて考えてみましょう。`, trivia: (t) => `「${t}」の制作秘話には多くのサプライズが隠されています！` },
        { title: "象徴的シンボル", q: (t) => `「${t}」を代表する最も象徴的なエンブレムやマークはどれですか？`, ans: (t) => `${t}`, dist: ["ライバルの紋章", "仮のバッジ", "サブマーク"], clue: (t) => `『${t}』のメインロゴをイメージしてください。`, trivia: (t) => `このシンボルは世界中で認知されています。` },
        { title: "歴史的マイルストーン", q: (t) => `「${t}」の歴史において最大の転換点となった偉業は何ですか？`, ans: (t) => `${t}`, dist: ["小さな出来事", "未確認の噂", "無名のプロローグ"], clue: (t) => `『${t}』の最大のハイライトを思い出してください。`, trivia: (t) => `世界基準を塗り替えた金字塔です。` },
        { title: "主要キャラクター", q: (t) => `「${t}」を最も象徴する中心人物・伝説の主人公は誰ですか？`, ans: (t) => `${t}`, dist: ["サブの敵役", "失踪した師匠", "一時的な味方"], clue: (t) => `『${t}』の象徴的な顔を思い浮かべてください。`, trivia: (t) => `ファン投票で常にトップに君臨する大人気キャラクターです。` },
        { title: "制作秘話＆トリビア", q: (t) => `「${t}」のファンを驚かせる舞台裏の隠されたエピソードは何ですか？`, ans: (t) => `${t}`, dist: ["翻訳ミス", "通常のカットシーン", "誤った噂"], clue: (t) => `『${t}』の知られざる裏話について考えてみてください。`, trivia: (t) => `この裏話は公開から何年も経ってから明かされました！` },
        { title: "伝説のライバル関係", q: (t) => `「${t}」において最も熱狂的な宿命の対決・ライバル関係はどれですか？`, ans: (t) => `${t}`, dist: ["小さな口論", "平和協定", "忘れられた約束"], clue: (t) => `『${t}』における最高のライバル対決を思い出してください。`, trivia: (t) => `この対決は語り草となっている名シーンです。` },
        { title: "伝説のアイテム", q: (t) => `「${t}」に不可欠な最も有名なキーアイテムや伝説の装備は何ですか？`, ans: (t) => `${t}`, dist: ["普通の道具", "現代のレプリカ", "失われた遺物"], clue: (t) => `『${t}』の代表的なアイテムをイメージしてください。`, trivia: (t) => `このアイテムのレプリカはコレクター垂涎の品です。` },
        { title: "象徴的な舞台", q: (t) => `「${t}」の主要な舞台となる伝説的な世界や聖地はどこですか？`, ans: (t) => `${t}`, dist: ["辺境の砦", "見捨てられた砂漠", "敵の要塞"], clue: (t) => `『${t}』の中心となる舞台をイメージしてください。`, trivia: (t) => `この舞台設定は多くの後続作品に影響を与えました。` },
        { title: "記録と世界的ヒット", q: (t) => `「${t}」の偉業を証明する歴史的な記録や評価は何ですか？`, ans: (t) => `${t}`, dist: ["平均的な評価", "初期の苦戦", "特別賞のノミネート"], clue: (t) => `『${t}』の世界的な最高実績に注目してください。`, trivia: (t) => `この快挙により世界的な社会現象となりました。` },
        { title: "文化的インパクト", q: (t) => `「${t}」は現代のポップカルチャーにどのような影響を与えましたか？`, ans: (t) => `${t}`, dist: ["一時的なブーム", "忘れられた論争", "無名のトリビュート"], clue: (t) => `『${t}』のグローバルな影響力を考えてみましょう。`, trivia: (t) => `現在でも多くの映画やゲームで引用されています。` },
        { title: "名言・決めゼリフ", q: (t) => `「${t}」の魂を象徴する最も有名な名言や決めゼリフは何ですか？`, ans: (t) => `${t}`, dist: ["一般的なことわざ", "専門的な計算式", "アドリブの一言"], clue: (t) => `『${t}』で最も記憶に残るセリフを思い出してください。`, trivia: (t) => `このセリフは現場のアドリブから生まれました！` },
        { title: "最大の試練・クライマックス", q: (t) => `「${t}」の最高潮となる最大の試練や決戦は何ですか？`, ans: (t) => `${t}`, dist: ["最初の小競り合い", "基礎トレーニング", "秘密の裏道"], clue: (t) => `『${t}』の最もドラマチックな瞬間を思い出してください。`, trivia: (t) => `このクライマックスは世界中の観客を釘付けにしました。` },
        { title: "基本原則・ルール", q: (t) => `「${t}」の世界観を支配する最も重要な基本法則は何ですか？`, ans: (t) => `${t}`, dist: ["一時的な例外", "任意のガイドライン", "ローカルな慣習"], clue: (t) => `『${t}』の根幹にあるルールに注目してください。`, trivia: (t) => `この法則がすべての展開の鍵となっています。` },
        { title: "知られざる真実", q: (t) => `「${t}」について熱烈なファンさえも驚く意外な真実は何ですか？`, ans: (t) => `${t}`, dist: ["単なる偶然", "よくある勘違い", "噂話"], clue: (t) => `『${t}』の最も驚くべき事実に注目してください。`, trivia: (t) => `この事実を知るファンはごく一部です！` },
        { title: "名作としての評価", q: (t) => `「${t}」が今なお時代を超えた大傑作と称賛される理由は何ですか？`, ans: (t) => `${t}`, dist: ["後年の再評価", "販売戦略による復活", "一部のマニア受け"], clue: (t) => `『${t}』の普遍的な魅力を考えてみましょう。`, trivia: (t) => `多くのクリエイターが「${t}」を最大のインスピレーションに挙げています。` }
      ]
    },
    zh: {
      prefix: '中文',
      themeTitle: (t) => `终极问答：${t}`,
      themeDesc: (t) => `关于 ${t} 的15个精彩谜题与知识问答`,
      aspects: [
        { title: "起源与背景", q: (t) => `最初定义 "${t}" 的核心灵感与原始概念是什么？`, ans: (t) => `${t}`, dist: ["外传衍生设定", "被废弃的初版草案", "现代重置版设定"], clue: (t) => `思考《${t}》的最早起源。`, trivia: (t) => `在《${t}》的早期开发中充满了意想不到的趣事！` },
        { title: "标志性象征", q: (t) => `以下哪项是与 "${t}" 最具代表性的标志性图案或徽章？`, ans: (t) => `${t}`, dist: ["对手势力的标志", "临时草案徽章", "次要衍生印记"], clue: (t) => `联想《${t}》的核心视觉符号。`, trivia: (t) => `该标志在全球范围内具有极高的辨识度。` },
        { title: "里程碑成就", q: (t) => `哪项历史性突破奠定了 "${t}" 的辉煌地位？`, ans: (t) => `${t}`, dist: ["次要小插曲", "未证实的传闻", "冷门的序章事件"], clue: (t) => `回想《${t}》的最重大巅峰成就。`, trivia: (t) => `该成就树立了行业与文化的全球标杆。` },
        { title: "核心主角", q: (t) => `哪位标志性人物或传奇主角最能代表 "${t}"？`, ans: (t) => `${t}`, dist: ["次要反派", "隐退的导师", "临时盟友"], clue: (t) => `找出《${t}》最具影响力的主角。`, trivia: (t) => `该角色在粉丝群体中享有极高人气。` },
        { title: "幕后秘密与趣闻", q: (t) => `关于 "${t}" 幕后制作，最让粉丝津津乐道的秘密是什么？`, ans: (t) => `${t}`, dist: ["翻译失误", "普通删减镜头", "不实流言"], clue: (t) => `思考《${t}》最著名的幕后轶事。`, trivia: (t) => `这一细节在作品首发多年后才正式揭秘！` },
        { title: "宿命对决", q: (t) => `哪场经典对决或宿敌冲突构成了 "${t}" 的高潮？`, ans: (t) => `${t}`, dist: ["短暂小分歧", "和平停战", "被遗忘的盟约"], clue: (t) => `回想《${t}》中最扣人心弦的对峙。`, trivia: (t) => `这场对决至今仍被广为传颂。` },
        { title: "传奇神器/道具", q: (t) => `哪件标志性道具或神级装备与 "${t}" 密不可分？`, ans: (t) => `${t}`, dist: ["标准普通工具", "现代复制品", "失落的普通残骸"], clue: (t) => `联想《${t}》中最著名的物品。`, trivia: (t) => `该道具的模型是收藏家梦寐以求的珍品。` },
        { title: "经典场景", q: (t) => `哪个宏大地点或标志性世界构成了 "${t}" 的主舞台？`, ans: (t) => `${t}`, dist: ["边境哨所", "荒废沙漠", "敌方堡垒"], clue: (t) => `想象《${t}》中最经典的世界舞台。`, trivia: (t) => `该场景的宏大构想启发了后世无数创作者。` },
        { title: "历史纪录与成就", q: (t) => `哪项世界纪录或全球轰动确立了 "${t}" 的传奇地位？`, ans: (t) => `${t}`, dist: ["普通平均评分", "初期的波折", "提名荣誉"], clue: (t) => `关注《${t}》取得的最高全球成就。`, trivia: (t) => `这一成就在全球掀起了现象级热潮。` },
        { title: "文化遗产", q: (t) => `"${t}" 对现代大众流行文化产生了怎样深远的影响？`, ans: (t) => `${t}`, dist: ["短暂的潮流", "被遗忘的争议", "无名致敬"], clue: (t) => `思考《${t}》在全球范围内的持久影响力。`, trivia: (t) => `对《${t}》的致敬与引用至今仍随处可见。` },
        { title: "经典名言", q: (t) => `哪句深入人心的名言或口号最能概括 "${t}" 的精髓？`, ans: (t) => `${t}`, dist: ["通用俗语", "专业技术术语", "随口即兴台词"], clue: (t) => `回忆《${t}》中最震撼人心的台词。`, trivia: (t) => `这句台词是在最初拍摄即兴诞生的！` },
        { title: "终极考验", q: (t) => `哪场决定命运的重大危机或终极试炼是 "${t}" 的最高潮？`, ans: (t) => `${t}`, dist: ["初期的简单交锋", "基础入阶测试", "隐秘小道探寻"], clue: (t) => `思考《${t}》中最惊心动魄的决战时刻。`, trivia: (t) => `这个高潮情节让全球观众屏息凝神。` },
        { title: "核心法则", q: (t) => `哪项根本法则或黄金定律支配着 "${t}" 的运作？`, ans: (t) => `${t}`, dist: ["临时特例", "可选建议", "局部风俗"], clue: (t) => `抓住《${t}》不可动摇的核心原则。`, trivia: (t) => `该法则是理解《${t}》所有关键情节的关键。` },
        { title: "冷知识与真象", q: (t) => `关于 "${t}"，哪项令人惊讶的冷知识即使资深粉丝也会感到惊奇？`, ans: (t) => `${t}`, dist: ["纯属巧合", "常见误解", "无稽之谈"], clue: (t) => `思考《${t}》中最不可思议的真实细节。`, trivia: (t) => `只有极少数骨灰级爱好者才知晓这个细节！` },
        { title: "殿堂级杰作", q: (t) => `为什么 "${t}" 至今仍被奉为无可替代的传世经典？`, ans: (t) => `${t}`, dist: ["晚期的偶然翻红", "营销炒作复苏", "小众圈子自娱"], clue: (t) => `体会《${t}》经久不衰的非凡魅力。`, trivia: (t) => `众多顶尖创作者皆将《${t}》视为最重要的灵感来源。` }
      ]
    },
    ar: {
      prefix: 'العربية',
      themeTitle: (t) => `المسابقة الكبرى: ${t}`,
      themeDesc: (t) => `15 لغزاً وسؤالاً مشوقاً حول ${t}`,
      aspects: [
        { title: "الأصول والنشأة", q: (t) => `ما هو العنصر التأسيسي أو الإلهام الأصلي الذي يحدد "${t}"؟`, ans: (t) => `${t}`, dist: ["العمل المشتق البديل", "النموذج الأولي المرفوض", "الإصدار المعاد إنتاجه"], clue: (t) => `فكر في بدايات وأصول ${t}.`, trivia: (t) => `تاريخ ابتكار "${t}" مليء بالمفاجآت المثيرة!` },
        { title: "الرمز الأيقوني", q: (t) => `أي مما يلي هو الرمز الأكثر شهرة المرتبط بـ "${t}"؟`, ans: (t) => `${t}`, dist: ["شعار المنافسين", "الشارة المؤقتة", "الختم الثانوي"], clue: (t) => `تذكر الشعار الرئيسي لـ ${t}.`, trivia: (t) => `هذا الرمز معروف ومشهور عالمياً.` },
        { title: "الإنجاز التاريخي", q: (t) => `ما هو الإنجاز التاريخي أو النقطة الفارقة في تاريخ "${t}"؟`, ans: (t) => `${t}`, dist: ["الحادث البسيط", "الشائعة غير المؤكدة", "المقدمة المجهولة"], clue: (t) => `تذكر أكبر إنجاز في تاريخ ${t}.`, trivia: (t) => `وضع هذا الإنجاز معياراً عالمياً لـ ${t}.` },
        { title: "الشخصية الرئيسية", q: (t) => `ما هي الشخصية الأسطورية أو البطل الرئيسي الذي يجسد "${t}"؟`, ans: (t) => `${t}`, dist: ["الخصم الثانوي", "المرشد المفقود", "الحليف المؤقت"], clue: (t) => `حدد الوجه الأبرز لـ ${t}.`, trivia: (t) => `تعد هذه الشخصية من بين الأكثر شعبية على الإطلاق.` },
        { title: "الأسرار والكواليس", q: (t) => `ما هو السر المثير من وراء الكواليس الذي يدهش عشاق "${t}"؟`, ans: (t) => `${t}`, dist: ["خطأ في الترجمة", "مشهد محذوف عادي", "شائعة غير صحيحة"], clue: (t) => `فكر في السر الأكثر إثارة حول ${t}.`, trivia: (t) => `تم الكشف عن هذه المعلومة بعد سنوات طويلة من الإطلاق!` },
        { title: "المنافسة الأسطورية", q: (t) => `ما هي المواجهة الأسطورية أو المنافسة الكبرى في "${t}"؟`, ans: (t) => `${t}`, dist: ["الخلاف البسيط", "الهدنة السلمية", "الميثاق المنسي"], clue: (t) => `تذكر النزال الأقوى في ${t}.`, trivia: (t) => `تظل هذه المواجهة محفورة في ذاكرة المتابعين.` },
        { title: "العنصر الأسطوري", q: (t) => `ما هو الغرض أو العنصر الأسطوري الذي لا ينفصل عن "${t}"؟`, ans: (t) => `${t}`, dist: ["الأداة العادية", "النسخة المقلدة الحديثة", "الأثر المفقود"], clue: (t) => `تذكر الأداة الأكثر شهرة في ${t}.`, trivia: (t) => `النسخ المقلدة من هذا العنصر مطلوبة بشدة من هواة الجمع.` },
        { title: "الموقع الأيقوني", q: (t) => `ما هو الموقع المهيب أو العالم الأسطوري الذي تدور فيه أحداث "${t}"؟`, ans: (t) => `${t}`, dist: ["المخفر الحدودي", "الصحراء المهجورة", "قلعة الأعداء"], clue: (t) => `تخيل العالم الرئيسي لـ ${t}.`, trivia: (t) => `ألهمت أجواء هذا الموقع الكثير من الأعمال الأخرى.` },
        { title: "الرقم القياسي والنجاح", q: (t) => `ما هو الرقم القياسي العالمي أو النجاح الساحق الذي حققه "${t}"؟`, ans: (t) => `${t}`, dist: ["النتيجة المتوسطة", "البداية الصعبة", "التقدير الشرفي"], clue: (t) => `ركز على أكبر إنجاز عالمي لـ ${t}.`, trivia: (t) => `حقق هذا الإنجاز شهرة عالمية غير مسبوقة.` },
        { title: "الأثر الثقافي", q: (t) => `كيف أثر "${t}" بشكل عميق في الثقافة المعاصرة؟`, ans: (t) => `${t}`, dist: ["موضة عابرة", "جدل منسي", "تكريم مجهول"], clue: (t) => `تأمل في التأثير العالمي لـ ${t}.`, trivia: (t) => `لا تزال الإشارات إلى "${t}" حاضرة في مختلف الفنون.` },
        { title: "المقولة الشهيرة", q: (t) => `ما هي المقولة أو الشعار الشهير الذي يلخص روح "${t}"؟`, ans: (t) => `${t}`, dist: ["المثل العام", "المعادلة الفنية", "العبارة العفوية"], clue: (t) => `تذكر أشهر جملة قيلت في ${t}.`, trivia: (t) => `تمت صياغة هذه العبارة بشكل عفوي أثناء الإعداد الأول!` },
        { title: "التحدي الأكبر", q: (t) => `ما هو التحدي المصيري الذي يمثل ذروة الأحداث في "${t}"؟`, ans: (t) => `${t}`, dist: ["المناوشة الأولى", "التدريب الأولي", "الممر السري"], clue: (t) => `فكر في اللحظة الأكثر إثارة في ${t}.`, trivia: (t) => `حبست هذه الذروة أنفاس الملايين حول العالم.` },
        { title: "القاعدة الذهبية", q: (t) => `ما هو المبدأ الجوهري أو القانون الأساسي الذي يحكم عالم "${t}"؟`, ans: (t) => `${t}`, dist: ["استثناء مؤقت", "توجيه اختياري", "عادة محلية"], clue: (t) => `ركز على القاعدة الجوهرية لـ ${t}.`, trivia: (t) => `هذا القانون هو المفتاح لفهم كافة أحداث ${t}.` },
        { title: "هل تعلم؟", q: (t) => `ما هي الحقيقة المدهشة حول "${t}" التي تفاجئ حتى كبار المتابعين؟`, ans: (t) => `${t}`, dist: ["مجرد صدفة", "التباس شائع", "شائعة عابرة"], clue: (t) => `فكر في المعلومة الأكثر إثارة للاهتمام حول ${t}.`, trivia: (t) => `قلة قليلة من الخبراء فقط يعرفون هذا التفصيل المميز!` },
        { title: "التحفة الخالدة", q: (t) => `لماذا لا يزال "${t}" يعتبر حتى اليوم تحفة استثنائية؟`, ans: (t) => `${t}`, dist: ["إعادة اكتشاف متأخرة", "حملة ترويجية", "نجاح محدود"], clue: (t) => `تأمل في القيمة الخالدة لـ ${t}.`, trivia: (t) => `يعتبر الكثير من المبدعين "${t}" مصدر إلهامهم الأول.` }
      ]
    }
  };

  const selectedLoc = localizedAspects[language] || (language === 'fr' ? null : localizedAspects['en']);

  // Generative custom template builder for ANY topic
  const questions: Question[] = [];
  const aspects = selectedLoc ? selectedLoc.aspects : [
    { title: "Origines & Création", q: (t: string) => `Quel élément ou inspiration fondatrice caractérise originellement "${t}" ?`, ans: (t) => `${t}`, dist: ["La version alternative", "Le prototype rejeté", "L'adaptation moderne"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Élément Iconique", q: (t: string) => `Parmi ces propositions, quel est le symbole le plus immédiatement reconnaissable associé à "${t}" ?`, ans: (t) => `${t}`, dist: ["Le blason rival", "Le logo provisoire", "L'insigne secondaire"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Moment d'Anthologie", q: (t: string) => `Quelle scène, événement marquant ou exploit reste gravé dans l'histoire de "${t}" ?`, ans: (t) => `${t}`, dist: ["L'incident mineur", "La rumeur non confirmée", "Le prologue méconnu"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Personnage / Figure Clé", q: (t: string) => `Quelle figure centrale ou protagoniste emblématique incarne le mieux "${t}" ?`, ans: (t) => `${t}`, dist: ["L'antagoniste secondaire", "Le mentor disparu", "L'allié d'un jour"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Mystère & Secret", q: (t: string) => `Quel détail insolite ou secret de coulisses passionne les adeptes de "${t}" ?`, ans: (t) => `${t}`, dist: ["Une erreur de traduction", "Une scène coupée banale", "Une fausse attribution"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Rivalité Célèbre", q: (t: string) => `Quelle opposition légendaire ou contraste saisissant fait la renommée de "${t}" ?`, ans: (t) => `${t}`, dist: ["La discorde passagère", "L'accord unanime", "La trêve oubliée"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Objet / Artefact Mythique", q: (t: string) => `Quel objet, accessoire ou arme culte est indissociable de "${t}" ?`, ans: (t) => `${t}`, dist: ["L'outil standard", "Le duplicata moderne", "La relique perdue"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Lieu & Décor", q: (t: string) => `Quel cadre majestueux ou lieu emblématique sert de théâtre d'action principal dans "${t}" ?`, ans: (t) => `${t}`, dist: ["Le poste frontalier", "L'avant-poste désert", "La forteresse ennemie"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Record / Succès", q: (t: string) => `Quel accomplissement historique ou record d'audience couronne l'univers de "${t}" ?`, ans: (t) => `${t}`, dist: ["Le score moyen", "L'échec initial", "La mention d'honneur"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Évolution & Héritage", q: (t: string) => `Comment "${t}" a-t-il profondément influencé la culture populaire contemporaine ?`, ans: (t) => `${t}`, dist: ["Un effet de mode éphémère", "Une controverse oubliée", "Un hommage anonyme"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Réplique / Citation", q: (t: string) => `Quelle réplique d'anthologie ou devise percutante résume l'esprit de "${t}" ?`, ans: (t) => `${t}`, dist: ["Le proverbe générique", "La formule technique", "La phrase improvisée"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "La Grande Épreuve", q: (t: string) => `Quel défi insurmontable constitue le point culminant dans "${t}" ?`, ans: (t) => `${t}`, dist: ["L'échauffourée initiale", "L'entraînement d'initiation", "Le passage secret"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Détail Technique / Clé", q: (t: string) => `Quel élément technique ou règle d'or régit le fonctionnement dans "${t}" ?`, ans: (t) => `${t}`, dist: ["L'exception temporaire", "L'usage facultatif", "La convention locale"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Le Savais-Tu ?", q: (t: string) => `Quelle révélation surprenante sur "${t}" surprend même les plus grands passionnés ?`, ans: (t) => `${t}`, dist: ["Une simple coïncidence", "Une confusion classique", "Un bruit de couloir"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` },
    { title: "Consécration Ultime", q: (t: string) => `Pourquoi "${t}" demeure-t-il aujourd'hui une référence incontournable ?`, ans: (t) => `${t}`, dist: ["Une redécouverte tardive", "Une réédition marketing", "Un succès d'estime"], clue: (t: string, c: string) => `Pense à l'aspect "${c}" spécifique à ${t}.`, trivia: (t: string) => `Dans l'histoire de "${t}", cet élément a suscité d'innombrables théories de passionnés !` }
  ];

  for (let i = 0; i < 15; i++) {
    const asp = aspects[i];
    const questionText = asp.q(cleanTopic);
    const answerText = asp.ans(cleanTopic);
    const opts = [answerText, ...asp.dist].sort(() => Math.random() - 0.5);
    questions.push({
      id: i + 1,
      question: questionText,
      options: opts,
      correctAnswer: answerText,
      wikiSearchQuery: `${cleanTopic} ${asp.title}`,
      youtubeSearchQuery: `${cleanTopic} theme ost`,
      clue: asp.clue(cleanTopic, asp.title),
      audioNotes: [261.63 + i * 20, 329.63 + i * 15, 392.0 + i * 10],
      trivia: asp.trivia(cleanTopic),
      category: asp.title
    });
  }

  const themeTitle = selectedLoc ? selectedLoc.themeTitle(cleanTopic) : `Ultimate Blind Test : ${cleanTopic}`;
  const themeDescription = selectedLoc ? selectedLoc.themeDesc(cleanTopic) : `15 énigmes captivantes et illustrées autour de ${cleanTopic}`;

  return {
    topic: cleanTopic,
    themeTitle,
    themeDescription,
    primaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    ambientSound: 'synthwave',
    questions
  };
}
