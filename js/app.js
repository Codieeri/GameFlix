// ========== STATE ==========
const state = {
  theme: localStorage.getItem('theme') || 'dark',
  isKidsMode: false,
  selectedGame: null,
  heroIndex: 0,
  heroGames: [],
  heroInterval: null,
};

// ========== EMBEDDED GAME DATA (Real Free Steam Games) ==========
const GAMES_DATA = [
  // ===== POPULAR =====
  {id:730, title:"Counter-Strike 2", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg", genre:"FPS", developer:"Valve", publisher:"Valve", platform:"Windows", release_date:"Aug 21, 2012", short_description:"Counter-Strike 2 is the next chapter in the legendary CS franchise. Featuring updated maps, stunning visuals, and improved gameplay mechanics while maintaining the core tactical shooter experience that fans love.", game_url:"https://store.steampowered.com/app/730/", rating:"Very Positive", sections:["popular"]},
  {id:570, title:"Dota 2", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg", genre:"MOBA", developer:"Valve", publisher:"Valve", platform:"Windows, Mac", release_date:"Jul 09, 2013", short_description:"Dota 2 is a multiplayer online battle arena featuring intense strategic gameplay with over 120 heroes. Every day millions of players enter the battle as one of over a hundred Dota heroes in an ever-changing battlefield.", game_url:"https://store.steampowered.com/app/570/", rating:"Very Positive", sections:["popular"]},
  {id:440, title:"Team Fortress 2", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg", genre:"FPS", developer:"Valve", publisher:"Valve", platform:"Windows, Mac", release_date:"Oct 10, 2007", short_description:"Team Fortress 2 features nine distinct classes providing a broad range of tactical abilities and personalities. Constantly updated with new game modes, maps, equipment and hats, it remains one of the most played online games.", game_url:"https://store.steampowered.com/app/440/", rating:"Very Positive", sections:["popular"]},
  {id:1172470, title:"Apex Legends", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg", genre:"Battle Royale", developer:"Respawn Entertainment", publisher:"Electronic Arts", platform:"Windows", release_date:"Nov 04, 2020", short_description:"Apex Legends is the ultimate survival shooter. Choose from a roster of unique Legends, each with their own personality, strengths, and abilities. Master their skills and become a champion of the Arena.", game_url:"https://store.steampowered.com/app/1172470/", rating:4.5, sections:["popular"]},
  {id:1085660, title:"Destiny 2", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg", genre:"Action FPS", developer:"Bungie", publisher:"Bungie", platform:"Windows", release_date:"Oct 01, 2019", short_description:"Destiny 2 is an action MMO with a single evolving world that you and your friends can join anytime. Journey across the solar system, unlock powerful abilities, and collect legendary gear.", game_url:"https://store.steampowered.com/app/1085660/", rating:"Mixed", sections:["popular"]},
  {id:230410, title:"Warframe", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg", genre:"Action RPG", developer:"Digital Extremes", publisher:"Digital Extremes", platform:"Windows", release_date:"Mar 25, 2013", short_description:"Warframe is a free-to-play cooperative third-person action game set in an evolving sci-fi world. Play as a Tenno warrior, equipped with a Warframe suit and an arsenal of weapons.", game_url:"https://store.steampowered.com/app/230410/", rating:"Very Positive", sections:["adventure"]},
  {id:238960, title:"Path of Exile", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/238960/header.jpg", genre:"Action RPG", developer:"Grinding Gear Games", publisher:"Grinding Gear Games", platform:"Windows, Mac", release_date:"Oct 23, 2013", short_description:"Path of Exile is an online action RPG set in the dark fantasy world of Wraeclast. With deep character customization and a massive passive skill tree, it offers endless build possibilities.", game_url:"https://store.steampowered.com/app/238960/", rating:"Very Positive", sections:["popular"]},
  {id:386360, title:"SMITE", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/386360/header.jpg", genre:"MOBA", developer:"Hi-Rez Studios", publisher:"Hi-Rez Studios", platform:"Windows", release_date:"Sep 08, 2015", short_description:"SMITE is a third-person multiplayer online battle arena where players choose from a diverse roster of mythological gods. Battle across various game modes in intense 5v5 matches.", game_url:"https://store.steampowered.com/app/386360/", rating:4.5, sections:["adventure"]},
  {id:109600, title:"Neverwinter", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/109600/header.jpg", genre:"MMORPG", developer:"Cryptic Studios", publisher:"Perfect World Entertainment", platform:"Windows", release_date:"Apr 30, 2013", short_description:"Neverwinter is a free-to-play action MMORPG based on the Dungeons & Dragons fantasy tabletop game. Explore the vast city of Neverwinter and its surrounding regions.", game_url:"https://store.steampowered.com/app/109600/", rating:"Mixed", sections:["popular"]},

  // ===== ADVENTURE =====
  {id:761890, title:"Albion Online", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/761890/header.jpg", genre:"MMORPG", developer:"Sandbox Interactive", publisher:"Sandbox Interactive", platform:"Windows", release_date:"Jul 17, 2017", short_description:"Albion Online is a sandbox MMORPG with a player-driven economy. Craft, trade, conquer, and leave your mark in a vast medieval fantasy world with no classes.", game_url:"https://store.steampowered.com/app/761890/", rating:"Mostly Positive", sections:["adventure"]},
  {id:236390, title:"War Thunder", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/header.jpg", genre:"Action Simulation", developer:"Gaijin Entertainment", publisher:"Gaijin Entertainment", platform:"Windows", release_date:"Aug 15, 2013", short_description:"War Thunder is a free-to-play vehicular combat MMO featuring aircraft, ground forces, and naval ships from the pre-WWII era to the early Cold War period.", game_url:"https://store.steampowered.com/app/236390/", rating:4, sections:["adventure"]},
  {id:9900, title:"Star Trek Online", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/9900/header.jpg", genre:"MMO Adventure", developer:"Cryptic Studios", publisher:"Perfect World Entertainment", platform:"Windows", release_date:"Jan 31, 2012", short_description:"Star Trek Online is a free-to-play MMORPG set in the legendary Star Trek universe. Command your own starship, explore the galaxy, and engage in epic space and ground combat.", game_url:"https://store.steampowered.com/app/9900/", rating:"Mostly Positive", sections:["adventure"]},
  {id:8500, title:"EVE Online", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/8500/header.jpg", genre:"MMORPG", developer:"CCP Games", publisher:"CCP Games", platform:"Windows, Mac", release_date:"May 06, 2003", short_description:"EVE Online is a massive space-faring sandbox MMO where players can build empires, explore uncharted systems, engage in epic fleet battles, or carve out a living as a trader.", game_url:"https://store.steampowered.com/app/8500/", rating:3.5, sections:["adventure"]},
  {id:1343400, title:"Old School RuneScape", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1343400/header.jpg", genre:"MMORPG", developer:"Jagex", publisher:"Jagex", platform:"Windows", release_date:"Feb 24, 2021", short_description:"Old School RuneScape is a massive multiplayer online role-playing game. Complete quests, level up skills, and explore the world of Gielinor in this beloved classic.", game_url:"https://store.steampowered.com/app/1343400/", rating:"Overwhelmingly Positive", sections:["adventure"]},

  // ===== HORROR =====
  {id:223710, title:"Cry of Fear", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/223710/header.jpg", genre:"Psychological Horror", developer:"Team Psykskallar", publisher:"Team Psykskallar", platform:"Windows", release_date:"Apr 15, 2013", short_description:"Cry of Fear is a free psychological horror game built on the Source engine. Navigate through a dark and twisted city as you uncover the terrifying truth behind a horrific incident.", game_url:"https://store.steampowered.com/app/223710/", rating:"Very Positive", sections:["horror"]},
  {id:700330, title:"SCP: Secret Laboratory", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/700330/header.jpg", genre:"Horror Multiplayer", developer:"Northwood Studios", publisher:"Northwood Studios", platform:"Windows", release_date:"Dec 29, 2017", short_description:"SCP: Secret Laboratory is a free multiplayer horror game based on the SCP Foundation. Play as an SCP, a scientist, a guard, or a civilian in a chaotic containment breach.", game_url:"https://store.steampowered.com/app/700330/", rating:"Very Positive", sections:["horror"]},
  {id:2232840, title:"Garten of Banban", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2232840/header.jpg", genre:"Indie Horror", developer:"Euphoric Brothers", publisher:"Euphoric Brothers", platform:"Windows", release_date:"Jan 6, 2023", short_description:"Enter Banban's Kindergarten and explore the mysterious establishment. Discover what happened to the missing children and don't lose your life and sanity in this eerie horror adventure.", game_url:"https://store.steampowered.com/app/2232840/", rating:3, sections:["horror"]},
  {id:1429100, title:"Siren Head: The Siren's Forest", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1429100/header.jpg", genre:"Creature Horror", developer:"Gwydion LLyr Meredydd", publisher:"Gwydion LLyr Meredydd", platform:"Windows", release_date:"Apr 6, 2021", short_description:"In this indie horror game, you must escape the Siren's Forest. Navigate through the dark woods and use multiple means of transportation to aid your escape from the terrifying Siren Head.", game_url:"https://store.steampowered.com/app/1429100/", rating:"Positive", sections:["horror"]},
  {id:1961460, title:"PROJECT: PLAYTIME", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1961460/header.jpg", genre:"Multiplayer Horror", developer:"MOB Entertainment", publisher:"MOB Entertainment", platform:"Windows", release_date:"Dec 12, 2022", short_description:"PROJECT: PLAYTIME is a free-to-play multiplayer horror game where six players attempt to create one giant toy while surviving a terrifying monster that roams the toy factory.", game_url:"https://store.steampowered.com/app/1961460/", rating:"Mostly Positive", sections:["horror"]},
  {id:2485460, title:"State of Survival", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2485460/header.jpg", genre:"Zombie Survival RPG", developer:"FunPlus International AG", publisher:"FunPlus International AG", platform:"Windows", release_date:"Aug 28, 2024", short_description:"State of Survival is a zombie survival RPG set in a post-apocalyptic world. Build settlements, recruit heroes, and fight off hordes of the undead to survive.", game_url:"https://store.steampowered.com/app/2485460/", rating:4, sections:["horror"]},

  // ===== NEW RELEASES =====
  {id:2139460, title:"Once Human", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2139460/header.jpg", genre:"Open World Survival", developer:"Starry Studio", publisher:"NetEase", platform:"Windows", release_date:"Jul 10, 2024", short_description:"Once Human is a multiplayer open-world survival game set in a strange, post-apocalyptic future. Unite with friends to fight monstrous aberrations, explore unknown territories, and build your own home in the vast open world.", game_url:"https://store.steampowered.com/app/2139460/", rating:4, sections:["popular","new-releases"]},
  {id:2507950, title:"Delta Force", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2507950/header.jpg", genre:"Tactical Shooter", developer:"Team Jade", publisher:"Level Infinite", platform:"Windows", release_date:"Dec 5, 2024", short_description:"Play for free in operator-based extraction and full-scale combined arms warfare. Become elite Operators in tactical 32v32 warfare with massive vehicles, realistic destruction, and dynamic battlefield events.", game_url:"https://store.steampowered.com/app/2507950/", rating:3.8, sections:["popular","new-releases"]},
  {id:2073850, title:"THE FINALS", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2073850/header.jpg", genre:"FPS", developer:"Embark Studios", publisher:"Electronic Arts", platform:"Windows", release_date:"Dec 7, 2023", short_description:"THE FINALS is a free-to-play competitive multiplayer first-person shooter where teams of three compete in dynamically changing arenas. Destroy everything to create new paths and tactical advantages.", game_url:"https://store.steampowered.com/app/2073850/", rating:4, sections:["popular","new-releases"]},
  {id:1203220, title:"NARAKA: BLADEPOINT", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1203220/header.jpg", genre:"Battle Royale", developer:"24 Entertainment", publisher:"NetEase", platform:"Windows", release_date:"Aug 11, 2021", short_description:"Dive into the legends of the Far East in NARAKA: BLADEPOINT; team up with friends in fast-paced melee-focused combat against 60 players. Master unique heroes, each with their own distinct abilities and fighting styles.", game_url:"https://store.steampowered.com/app/1203220/", rating:4, sections:["popular","new-releases"]},

  {id:2943650, title:"FragPunk", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2943650/header.jpg", genre:"FPS", developer:"Bad Guitar Studio", publisher:"Level Infinite", platform:"Windows", release_date:"Mar 6, 2025", short_description:"FragPunk is a free-to-play 5v5 hero shooter featuring unique Shard cards that let you dynamically reshape the battlefield in real-time. Master diverse heroes and tactical gameplay.", game_url:"https://store.steampowered.com/app/2943650/", rating:4, sections:["new-releases"]},
  {id:2452280, title:"Mecha BREAK", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2452280/header.jpg", genre:"Action", developer:"Amazing Seasun Games", publisher:"Level Infinite", platform:"Windows", release_date:"Mar 2025", short_description:"Mecha BREAK is an immersive multiplayer mech combat game. Pilot customizable mechs with devastating weapons and abilities. Engage in high-octane battles across stunning futuristic battlegrounds.", game_url:"https://store.steampowered.com/app/2452280/", rating:"Mostly Positive", sections:["new-releases"]},
  {id:835570, title:"Conqueror's Blade", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/835570/header.jpg", genre:"Action Strategy", developer:"Booming Games", publisher:"Booming Games", platform:"Windows", release_date:"May 30, 2019", short_description:"Conqueror's Blade gives you a chance to be a true warlord. Command medieval troops in epic 15 vs 15 siege battles, combining deep tactical gameplay with intense action combat.", game_url:"https://store.steampowered.com/app/835570/", rating:"Mostly Positive", sections:["new-releases","adventure"]},
  {id:1671200, title:"Honkai Impact 3rd", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1671200/header.jpg", genre:"Action RPG", developer:"miHoYo", publisher:"miHoYo", platform:"Windows", release_date:"Feb 26, 2024", short_description:"Honkai Impact 3rd is a next-gen 3D anime action game. Experience epic battles with stunning visuals, fluid combos, and an emotional storyline featuring the Valkyries fighting to save humanity.", game_url:"https://store.steampowered.com/app/1671200/", rating:"Very Positive", sections:["new-releases","adventure"]},

  {id:872200, title:"Rogue Company", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/872200/header.jpg", genre:"Third-Person Shooter", developer:"First Watch Games", publisher:"Hi-Rez Studios", platform:"Windows", release_date:"Jul 1, 2021", short_description:"Rogue Company is a free-to-play multiplayer third-person shooter with cross-play support. Choose from a diverse roster of Rogues, each with unique abilities, and compete in objective-based game modes.", game_url:"https://store.steampowered.com/app/872200/", rating:"Mostly Positive", sections:["new-releases"]},
  {id:677620, title:"Splitgate", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/677620/header.jpg", genre:"FPS", developer:"1047 Games", publisher:"1047 Games", platform:"Windows", release_date:"Sep 15, 2019", short_description:"Splitgate is a free-to-play multiplayer portal shooter combining the fast-paced action of an arena FPS with portal mechanics. Create portals to flank, escape, and outplay your opponents.", game_url:"https://store.steampowered.com/app/677620/", rating:"Very Positive", sections:["new-releases"]},
  {id:333930, title:"Dirty Bomb", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/333930/header.jpg", genre:"FPS", developer:"Splash Damage", publisher:"Splash Damage", platform:"Windows", release_date:"Jun 12, 2024", short_description:"Dirty Bomb is a fast-paced, team-based multiplayer FPS set in a near-future London. Master unique mercenaries with distinct abilities in objective-based combat across urban battlegrounds.", game_url:"https://store.steampowered.com/app/333930/", rating:4, sections:["new-releases"]},

  // ===== KIDS =====
  {id:304050, title:"Trove", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/304050/header.jpg", genre:"Voxel Adventure", developer:"Trion Worlds", publisher:"Trion Worlds", platform:"Windows", release_date:"Jul 09, 2015", short_description:"Trove is a free-to-play voxel MMO adventure game. Explore infinite realms, build anything you can imagine, and battle enemies in this colorful blocky world full of quests and loot.", game_url:"https://store.steampowered.com/app/304050/", rating:4.0, sections:["kids"]},
  {id:471710, title:"Rec Room", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/471710/header.jpg", genre:"Social Sandbox", developer:"Rec Room Inc.", publisher:"Rec Room Inc.", platform:"Windows", release_date:"Jun 01, 2016", short_description:"Rec Room is a social club where players can build and play games together. Play user-created games, build your own rooms, and hang out with friends in this creative virtual playground.", game_url:"https://store.steampowered.com/app/471710/", rating:4.0, sections:["kids"]},
  {id:1097150, title:"Fall Guys", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg", genre:"Party Game", developer:"Mediatonic", publisher:"Epic Games", platform:"Windows", release_date:"Aug 04, 2020", short_description:"Fall Guys is a massively multiplayer party game where up to 60 players compete in chaotic obstacle courses. Bounce, dive, and scramble your way to victory in this colorful battle royale.", game_url:"https://store.steampowered.com/app/1097150/", rating:4.0, sections:["kids"]},
  {id:822240, title:"Animal Jam", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/822240/header.jpg", genre:"Adventure", developer:"WildWorks, Inc.", publisher:"WildWorks, Inc.", platform:"Windows", release_date:"Jan 8, 2025", short_description:"In Animal Jam, you can become your favorite animal, collect amazing items, adopt adorable pets, and create a style to express the real you as you explore the beautiful 3D world of Jamaa!", game_url:"https://store.steampowered.com/app/822240/", rating:"Very Positive", sections:["kids"]},
  {id:1507410, title:"Coloring Book for Kids", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1507410/header.jpg", genre:"Casual", developer:"Peaksel", publisher:"Peaksel", platform:"Windows, Mac", release_date:"Mar 8, 2021", short_description:"Coloring Book for Kids is a creative coloring app specially designed for little ones. Spend some creative time with your children and surround them with beautiful colors and fun drawings!", game_url:"https://store.steampowered.com/app/1507410/", rating:"Positive", sections:["kids"]},
  {id:4038250, title:"Run Shiba Run!", thumbnail:"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4038250/33943f1ec73200c59b29e6082671df12fa9e2d4e/header.jpg?t=1774014866", genre:"Casual", developer:"Table for Twenty", publisher:"Table for Twenty", platform:"Windows, Mac", release_date:"Mar 20, 2026", short_description:"Goma the dog has escaped from their owner's leash and is running around the park without restraint to eat as many biscuits as they can. Help them fill their stomach before time runs out!", game_url:"https://store.steampowered.com/app/4038250/", rating:"Positive", sections:["kids"]},
  {id:291550, title:"Brawlhalla", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/291550/header.jpg", genre:"Fighting", developer:"Blue Mammoth Games", publisher:"Blue Mammoth Games", platform:"Windows", release_date:"Nov 03, 2015", short_description:"Brawlhalla is a free platform fighting game with over 50 playable characters. Battle with friends in online multiplayer or locally with up to 8 players.", game_url:"https://store.steampowered.com/app/291550/", rating:"Very Positive", sections:["kids"]},
  {id:252950, title:"Rocket League", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg", genre:"Sports", developer:"Psyonix", publisher:"Epic Games", platform:"Windows", release_date:"Jul 07, 2015", short_description:"Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem. Easy to pick up but challenging to master, with physics-based competition at its core.", game_url:"https://store.steampowered.com/app/252950/", rating:"Very Positive", sections:["kids"]},
];

// Helper: get games for a section
function getGamesForSection(key) {
  return GAMES_DATA.filter(g => g.sections && g.sections.includes(key));
}

// Helper: find game by ID
function findGameById(id) {
  return GAMES_DATA.find(g => g.id == id);
}

// ========== API HELPERS ==========
async function fetchScreenshots(appid) {
  try {
    const res = await fetch(`/api/games/${appid}/screenshots`);
    if (!res.ok) return {screenshots:[], fullDescription:''};
    return res.json();
  } catch(e) { console.error('Screenshot fetch error:', e); return {screenshots:[], fullDescription:''}; }
}
async function apiPost(path, data) {
  try {
    const res = await fetch(`/api${path}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    return res.json();
  } catch(e) { console.error('API post error:', path, e); return {error: e.message}; }
}

// ========== SVG ICON HELPERS ==========
const SVG = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h1M8 10h1M8 14h1M15 6h1M15 10h1M15 14h1"/></svg>',
  hardDrive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="14" width="20" height="6" rx="2"/><path d="M6 14V6a2 2 0 012-2h8a2 2 0 012 2v8"/><circle cx="17" cy="17" r="1"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
};

// ========== THEME ==========
function applyTheme(t) {
  state.theme = t;
  document.body.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
}
function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

// ========== SPLASH SCREEN ==========
function initSplash() {
  return new Promise(resolve => {
    const splash = document.getElementById('splash');
    const logo = document.getElementById('intro-logo');
    const skipBtn = document.getElementById('intro-skip');
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      try { if (audioCtx) audioCtx.close(); } catch(e){}
      splash.classList.add('fade-out');
      setTimeout(() => { splash.remove(); resolve(); }, 600);
    };
    skipBtn.addEventListener('click', finish);
    // TUDUM sound using Web Audio API
    let audioCtx;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playTudum = () => {
        const now = audioCtx.currentTime;
        // Low bass hit (the "TU" part)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(80, now);
        osc1.frequency.exponentialRampToValueAtTime(55, now + 0.4);
        gain1.gain.setValueAtTime(0.6, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        osc1.connect(gain1).connect(audioCtx.destination);
        osc1.start(now); osc1.stop(now + 1.2);
        // Sub rumble
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(45, now);
        osc2.frequency.exponentialRampToValueAtTime(30, now + 0.5);
        gain2.gain.setValueAtTime(0.4, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
        osc2.connect(gain2).connect(audioCtx.destination);
        osc2.start(now); osc2.stop(now + 1.0);
        // The "DUM" impact
        const osc3 = audioCtx.createOscillator();
        const gain3 = audioCtx.createGain();
        osc3.type = 'triangle';
        osc3.frequency.setValueAtTime(120, now + 0.08);
        osc3.frequency.exponentialRampToValueAtTime(60, now + 0.5);
        gain3.gain.setValueAtTime(0.3, now + 0.08);
        gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc3.connect(gain3).connect(audioCtx.destination);
        osc3.start(now + 0.08); osc3.stop(now + 0.8);
      };
      // Play sound after user interaction or on load
      setTimeout(playTudum, 1000);
    } catch(e) { /* Audio not available */ }
    // === Animation Timeline ===
    // Stage 1: Logo appears (0-1s) — handled by CSS animation
    // Stage 2: Trim letters from right to left, leaving only "G"
    const letters = Array.from(logo.querySelectorAll('.letter:not(.letter-g)')).reverse();
    const letterG = logo.querySelector('.letter-g');
    // Start trimming after 1.2s (letters fly away one by one, reversed: X→I→L→F→E→M→A)
    setTimeout(() => {
      letters.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('trim-away');
        }, i * 120); // stagger: X,I,L,F,E,M,A (reversed)
      });
      // After all other letters are trimmed, scale up G at center
      setTimeout(() => {
        letterG.classList.add('g-focus');
      }, letters.length * 120 + 200);
    }, 1200);
    // Stage 3: Fade out the big G (at ~4s)
    setTimeout(() => {
      letterG.classList.remove('g-focus');
      letterG.classList.add('g-fadeout');
      letterG.style.animation = 'none';
    }, 4000);
    // Stage 4: Exit splash (at ~4.8s)
    setTimeout(finish, 4800);
  });
}

// ========== NAVBAR ==========
function scrollToTop(e) { e && e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); }
function scrollToSection(e, id) {
  e && e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

// Mobile search toggle
function toggleMobileSearch() {
  const box = document.getElementById('search-box');
  const isHidden = box.style.display === 'none' || getComputedStyle(box).display === 'none';
  box.style.display = isHidden ? 'block' : 'none';
  if (isHidden) box.querySelector('input').focus();
}

// Hamburger menu
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const burger = document.getElementById('hamburger');
  menu.classList.toggle('active');
  burger.classList.toggle('active');
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('active');
  document.getElementById('hamburger').classList.remove('active');
}

// Search
let searchTimeout;
function handleSearch(query) {
  state.searchQuery = query;
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => doSearch(query), 300);
}
function handleMobileSearch(query) {
  handleSearch(query);
}
function doSearch(query) {
  const dd = document.getElementById('search-dropdown');
  if (!query || query.length < 2) { dd.classList.remove('active'); return; }
  const q = query.toLowerCase();
  const results = GAMES_DATA.filter(g =>
    (g.title || '').toLowerCase().includes(q) ||
    (g.genre || '').toLowerCase().includes(q) ||
    (g.developer || '').toLowerCase().includes(q) ||
    (g.publisher || '').toLowerCase().includes(q) ||
    (g.short_description || '').toLowerCase().includes(q)
  ).slice(0, 8);
  if (results.length === 0) {
    dd.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:.85rem">No games found</div>';
  } else {
    dd.innerHTML = results.map(g => `
      <div class="search-result" onclick="openGameDetail('${g.id}')">
        <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${g.id}/capsule_616x353.jpg" alt="${g.title}" loading="lazy" onerror="this.src='https://cdn.cloudflare.steamstatic.com/steam/apps/${g.id}/header.jpg'">
        <div class="sr-info">
          <div class="sr-title">${escHtml(g.title)}</div>
          <div class="sr-genre">${escHtml(g.genre || '')}</div>
        </div>
      </div>
    `).join('');
  }
  dd.classList.add('active');
}
// Close search dropdown on outside click
document.addEventListener('click', (e) => {
  const dd = document.getElementById('search-dropdown');
  const box = document.getElementById('search-box');
  if (dd && !box.contains(e.target)) dd.classList.remove('active');
});

// Search input listener
document.addEventListener('DOMContentLoaded', () => {
  const si = document.getElementById('search-input');
  if (si) si.addEventListener('input', (e) => handleSearch(e.target.value));
});

// ========== HERO SECTION ==========
function renderHero(games) {
  state.heroGames = games.slice(0, 5);
  const slidesEl = document.getElementById('hero-slides');
  const dotsEl = document.getElementById('hero-dots');
  slidesEl.innerHTML = state.heroGames.map((g, i) => `
    <div class="hero-slide${i===0?' active':''}" data-index="${i}">
      <div class="hero-bg" style="background-image:url('https://cdn.cloudflare.steamstatic.com/steam/apps/${g.id}/library_hero.jpg'), url('https://cdn.cloudflare.steamstatic.com/steam/apps/${g.id}/page_bg_generated.jpg'), url('${g.thumbnail}')"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-badge">${escHtml(g.genre || 'FREE')}</span>
        <h1 class="hero-title">${escHtml(g.title)}</h1>
        <p class="hero-desc">${escHtml(g.short_description || '')}</p>
        <div class="hero-btns">
          <button class="btn-play" onclick="window.open('${g.game_url || '#'}','_blank')">
            ${SVG.play} Play Now
          </button>
          <button class="btn-info" onclick="openGameDetail(${g.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  `).join('');
  dotsEl.innerHTML = state.heroGames.map((_, i) => `<div class="hero-dot${i===0?' active':''}" onclick="goToHeroSlide(${i})"></div>`).join('');
  startHeroRotation();
}
function goToHeroSlide(idx) {
  state.heroIndex = idx;
  document.querySelectorAll('.hero-slide').forEach((s,i) => s.classList.toggle('active', i===idx));
  document.querySelectorAll('.hero-dot').forEach((d,i) => d.classList.toggle('active', i===idx));
}
function startHeroRotation() {
  if (state.heroInterval) clearInterval(state.heroInterval);
  state.heroInterval = setInterval(() => {
    goToHeroSlide((state.heroIndex + 1) % state.heroGames.length);
  }, 8000);
}

// ========== GAME CARDS ==========
function createGameCard(g) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.onclick = () => openGameDetail(g.id);
  const appId = g.id;
  const rating = g.rating || '';
  const score = getRatingScore(rating);
  const fallbackImg = g.thumbnail || `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
  card.innerHTML = `
    <div class="card-img-wrap">
      <img class="card-img" src="https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg" alt="${escHtml(g.title)}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImg}'">
      <div class="card-gradient"></div>
      <span class="card-genre-badge">${escHtml(g.genre || '')}</span>
      ${rating ? `<span class="card-rating-badge">${renderStars(score, 9)}<span class="rating-num">${score.toFixed(1)}</span></span>` : ''}
    </div>
    <div class="card-title">${escHtml(g.title)}</div>
  `;
  return card;
}

// ========== CAROUSELS ==========
const CAROUSEL_SECTIONS = [
  {key:'popular', title:'Popular Games', id:'section-popular'},
  {key:'adventure', title:'Adventure Games', id:'section-adventure'},
  {key:'horror', title:'Horror Games', id:'section-horror'},
  {key:'new-releases', title:'New Releases Games', id:'section-new-releases'},
];

function renderCarousels() {
  const container = document.getElementById('normal-content');
  container.innerHTML = '';
  CAROUSEL_SECTIONS.forEach(sec => {
    const games = getGamesForSection(sec.key);
    if (!games || games.length === 0) return;
    const section = document.createElement('div');
    section.className = 'carousel-section';
    section.id = sec.id;
    section.innerHTML = `
      <div class="carousel-header">
        <h2 class="carousel-title">${escHtml(sec.title)}</h2>
      </div>
      <div class="carousel-wrap">
        <div class="carousel-fade left"></div>
        <div class="carousel-fade right"></div>
        <button class="carousel-arrow left" onclick="scrollCarousel(this, -1)">${SVG.chevronLeft}</button>
        <div class="carousel-container"></div>
        <button class="carousel-arrow right" onclick="scrollCarousel(this, 1)">${SVG.chevronRight}</button>
      </div>
    `;
    const carousel = section.querySelector('.carousel-container');
    games.forEach(g => carousel.appendChild(createGameCard(g)));
    container.appendChild(section);
    // Drag scrolling
    initCarouselDrag(carousel);
  });
  // Intersection Observer for lazy reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }});
  }, {threshold:0.1});
  document.querySelectorAll('.carousel-section').forEach(s => observer.observe(s));
}

function scrollCarousel(btn, dir) {
  const container = btn.parentElement.querySelector('.carousel-container');
  const scrollAmt = container.clientWidth * 0.7;
  container.scrollBy({left: dir * scrollAmt, behavior:'smooth'});
}

function initCarouselDrag(el) {
  let isDown=false, startX, scrollLeft;
  el.addEventListener('mousedown', (e) => {
    isDown=true; el.style.cursor='grabbing';
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });
  el.addEventListener('mouseleave', () => { isDown=false; el.style.cursor=''; });
  el.addEventListener('mouseup', () => { isDown=false; el.style.cursor=''; });
  el.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
  // Touch
  el.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  }, {passive:true});
  el.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft - (x - startX) * 1.2;
  }, {passive:true});
}

// ========== KIDS MODE ==========
function toggleKidsMode() {
  state.isKidsMode = !state.isKidsMode;
  const navbar = document.getElementById('navbar');
  const normal = document.getElementById('normal-content');
  const kids = document.getElementById('kids-content');
  const hero = document.getElementById('hero');
  const toggle = document.getElementById('kids-toggle');
  const navLinks = document.getElementById('nav-links');

  navbar.classList.toggle('kids-mode', state.isKidsMode);
  normal.style.display = state.isKidsMode ? 'none' : 'block';
  kids.classList.toggle('active', state.isKidsMode);
  hero.style.display = state.isKidsMode ? 'none' : '';

  if (state.isKidsMode) {
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg> Exit Kids';
    toggle.style.background = 'rgba(255,255,255,0.15)';
    toggle.style.border = '1px solid rgba(255,255,255,0.2)';
    navLinks.innerHTML = `
      <a href="#" onclick="scrollToTop(event)">Home</a>
      <a href="#" onclick="scrollToSection(event,'section-popular')">Popular</a>
      <a href="#" onclick="scrollToSection(event,'section-adventure')">Adventure Games</a>
    `;
    fetchKidsGames();
  } else {
    toggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="10" r="5"/><path d="M12 15v3"/><path d="M8 20h8"/><path d="M9 5c0-1 .5-2 1.5-2"/><path d="M15 5c0-1-.5-2-1.5-2"/></svg> Kids`;
    toggle.style.background = '';
    toggle.style.border = '';
    navLinks.innerHTML = `
      <a href="#" onclick="scrollToTop(event)">Home</a>
      <a href="#" onclick="scrollToSection(event,'section-popular')">Popular</a>
      <a href="#" onclick="scrollToSection(event,'section-adventure')">Adventure Games</a>
      <a href="#" onclick="scrollToSection(event,'section-horror')">Horror Games</a>
      <a href="#" onclick="scrollToSection(event,'section-new-releases')">New Releases Games</a>
    `;
  }
  window.scrollTo({top:0, behavior:'smooth'});
}

function fetchKidsGames() {
  const kidsGames = getGamesForSection('kids');
  renderKidsGrid(kidsGames);
}
function renderKidsGrid(games) {
  const grid = document.getElementById('kids-grid');
  grid.innerHTML = '';
  (games || []).forEach(g => grid.appendChild(createGameCard(g)));
}

// ========== GAME DETAIL ==========
async function openGameDetail(id) {
  // Close search dropdown
  document.getElementById('search-dropdown').classList.remove('active');

  // Find game from embedded data
  const game = findGameById(id);
  if (!game) return;

  const overlay = document.getElementById('game-detail');
  const card = document.getElementById('detail-card');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  state.selectedGame = game;
  renderDetailCard(game);

  // Fetch screenshots from Steam API asynchronously
  try {
    const result = await fetchScreenshots(game.id);
    if (result.screenshots && result.screenshots.length > 0) {
      const ssSection = document.getElementById('detail-screenshots-section');
      if (ssSection) {
        ssSection.style.display = '';
        ssSection.querySelector('.detail-screenshots').innerHTML = result.screenshots.map(s =>
          `<img src="${s.path_thumbnail}" alt="Screenshot" onclick="openLightbox('${s.path_full}')" loading="lazy">`
        ).join('');
      }
    }
    if (result.fullDescription) {
      const descEl = document.getElementById('detail-full-desc');
      if (descEl) {
        descEl.innerHTML = result.fullDescription;
        descEl.style.display = '';
      }
    }
  } catch(e) { /* silently ignore screenshot fetch errors */ }
}

function renderDetailCard(g) {
  const card = document.getElementById('detail-card');
  const url = g.game_url || '#';
  const platform = g.platform || '';
  let metaHtml = '';
  if (g.release_date) metaHtml += `<div class="detail-meta-item">${SVG.calendar} ${escHtml(g.release_date)}</div>`;
  if (g.developer) metaHtml += `<div class="detail-meta-item">${SVG.user} ${escHtml(g.developer)}</div>`;
  if (g.publisher && g.publisher !== g.developer) metaHtml += `<div class="detail-meta-item">${SVG.building} ${escHtml(g.publisher)}</div>`;
  if (g.platform) metaHtml += `<div class="detail-meta-item">${SVG.monitor} ${escHtml(g.platform)}</div>`;

  card.innerHTML = `
    <div class="detail-left">
      <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${g.id}/capsule_616x353.jpg" alt="${escHtml(g.title)}" onerror="this.src='${g.thumbnail}'">
    </div>
    <div class="detail-right">
      <h2 class="detail-title">${escHtml(g.title)}</h2>
      <div class="detail-badges">
        ${g.genre ? `<span class="detail-badge genre">${escHtml(g.genre)}</span>` : ''}
        ${platform ? `<span class="detail-badge platform">${escHtml(platform)}</span>` : ''}
        ${g.rating ? `<span class="detail-badge status" style="display:inline-flex;align-items:center;gap:4px">${renderStars(getRatingScore(g.rating), 13)}<span style="margin-left:2px;font-size:.75rem">${getRatingScore(g.rating).toFixed(1)}/5</span></span>` : ''}
      </div>
      ${metaHtml ? `<div class="detail-meta">${metaHtml}</div>` : ''}
      <p class="detail-short-desc">${escHtml(g.short_description || '')}</p>
      <a href="${url}" target="_blank" rel="noopener" class="detail-btn-play">
        ${SVG.play} Play Now
      </a>
      <div class="detail-section" id="detail-screenshots-section" style="display:none">
        <h3>Screenshots</h3>
        <div class="detail-screenshots"><div class="no-ss">Loading screenshots...</div></div>
      </div>
      <div class="detail-section">
        <h3>About</h3>
        <div class="detail-desc" id="detail-full-desc">${escHtml(g.short_description || 'No description available.')}</div>
      </div>
    </div>
  `;
}

function closeGameDetail() {
  const overlay = document.getElementById('game-detail');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  state.selectedGame = null;
}

// ========== LIGHTBOX ==========
function openLightbox(src) {
  event && event.stopPropagation();
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('active');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

// Close overlays on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (state.selectedGame) closeGameDetail();
    closeLightbox();
  }
});
document.getElementById('game-detail').addEventListener('click', (e) => {
  if (e.target.id === 'game-detail') closeGameDetail();
});

// ========== UTILITY ==========
// ========== RATING HELPERS ==========
const RATING_SCORES = {
  'Overwhelmingly Positive': 4.8,
  'Very Positive': 4.5,
  'Positive': 4.0,
  'Mostly Positive': 3.5,
  'Mixed': 3.0,
  'Mostly Negative': 2.0,
  'Negative': 1.5,
  'Very Negative': 1.0,
};
function getRatingScore(rating) { return typeof rating === 'number' ? rating : (RATING_SCORES[rating] || 0); }
function renderStars(score, size) {
  size = size || 10;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (score >= i) {
      html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else if (score >= i - 0.5) {
      html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><defs><linearGradient id="hg"><stop offset="50%" stop-color="#fbbf24"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#hg)" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><path fill="none" stroke="#fbbf24" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" clip-path="inset(0 0 0 50%)"/></svg>`;
    } else {
      html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
  }
  return html;
}

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ========== AUTH (Sign In / Sign Up / Log Out) ==========
function openAuthModal() {
  const btn = document.getElementById('auth-nav-btn');
  if (btn && btn.dataset.loggedIn === 'true') return;
  const modal = document.getElementById('auth-modal');
  if (modal) { modal.classList.add('active'); switchAuthView('signin'); }
}
function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('active');
}
function switchAuthView(view) {
  document.querySelectorAll('.auth-view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('auth-' + view);
  if (target) target.classList.add('active');
  // Clear errors
  const errEl = document.getElementById(view + '-error');
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
}
function handleSignIn(e) {
  e.preventDefault();
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;
  const errEl = document.getElementById('signin-error');
  errEl.style.display = 'none';
  // Dummy sign in: save to localStorage
  const users = JSON.parse(localStorage.getItem('gameflix_users') || '{}');
  if (!users[email]) {
    errEl.textContent = 'No account found with this email. Please create one first.';
    errEl.style.display = 'block';
    return;
  }
  if (users[email] !== password) {
    errEl.textContent = 'Incorrect password. Please try again.';
    errEl.style.display = 'block';
    return;
  }
  localStorage.setItem('gameflix_session', JSON.stringify({ email: email }));
  updateAuthUI(email);
  closeAuthModal();
}
function handleSignUp(e) {
  e.preventDefault();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const errEl = document.getElementById('signup-error');
  errEl.style.display = 'none';
  if (password !== confirm) {
    errEl.textContent = 'Passwords do not match. Please try again.';
    errEl.style.display = 'block';
    return;
  }
  if (password.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    errEl.style.display = 'block';
    return;
  }
  const users = JSON.parse(localStorage.getItem('gameflix_users') || '{}');
  if (users[email]) {
    errEl.textContent = 'An account with this email already exists.';
    errEl.style.display = 'block';
    return;
  }
  users[email] = password;
  localStorage.setItem('gameflix_users', JSON.stringify(users));
  localStorage.setItem('gameflix_session', JSON.stringify({ email: email }));
  updateAuthUI(email);
  closeAuthModal();
}
function handleLogOut() {
  localStorage.removeItem('gameflix_session');
  const btn = document.getElementById('auth-nav-btn');
  if (btn) {
    btn.dataset.loggedIn = '';
    btn.classList.remove('logged-in');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Sign In';
    btn.onclick = openAuthModal;
  }
}
function updateAuthUI(email) {
  const btn = document.getElementById('auth-nav-btn');
  if (!btn) return;
  const initial = email.charAt(0).toUpperCase();
  btn.dataset.loggedIn = 'true';
  btn.classList.add('logged-in');
  btn.innerHTML = '<span class="user-avatar">' + initial + '</span> Log Out';
  btn.onclick = handleLogOut;
}
function checkAuthSession() {
  const session = localStorage.getItem('gameflix_session');
  if (session) {
    try {
      const data = JSON.parse(session);
      if (data.email) updateAuthUI(data.email);
    } catch(e) { localStorage.removeItem('gameflix_session'); }
  }
}

// ========== INITIALIZATION ==========
async function init() {
  // Apply saved theme
  applyTheme(state.theme);
  // Check auth session
  checkAuthSession();
  // Show splash
  await initSplash();

  // Use embedded data directly - no API calls needed
  const popularGames = getGamesForSection('popular');

  // Render hero with top 5 popular games
  renderHero(popularGames);

  // Render carousel sections
  renderCarousels();

  // Responsive search toggle
  function updateSearchUI() {
    const sb = document.getElementById('search-box');
    const stb = document.getElementById('search-toggle-btn');
    if (window.innerWidth < 768) {
      sb.style.display = 'none';
      stb.style.display = 'flex';
    } else {
      sb.style.display = 'block';
      stb.style.display = 'none';
    }
  }
  updateSearchUI();
  window.addEventListener('resize', updateSearchUI);
}

// Start
init();
