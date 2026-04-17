// ========== STATE ==========
const state = {
  theme: localStorage.getItem('theme') || 'dark',
  isKidsMode: false,
  selectedGame: null,
  heroIndex: 0,
  heroGames: [],
  heroInterval: null,
  isLoggedIn: false,
  currentUser: null,
};

// ========== GAME DATA ==========
const GAMES_DATA = [
  {id:730, title:"Counter-Strike 2", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg", genre:"FPS", developer:"Valve", publisher:"Valve", platform:"Windows", release_date:"Aug 21, 2012", short_description:"Counter-Strike 2 is the next chapter in the legendary CS franchise. Featuring updated maps, stunning visuals, and improved gameplay mechanics while maintaining the core tactical shooter experience that fans love.", game_url:"https://store.steampowered.com/app/730/", rating:"Very Positive", sections:["popular"]},
  {id:570, title:"Dota 2", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg", genre:"MOBA", developer:"Valve", publisher:"Valve", platform:"Windows, Mac", release_date:"Jul 09, 2013", short_description:"Dota 2 is a multiplayer online battle arena featuring intense strategic gameplay with over 120 heroes. Every day millions of players enter the battle as one of over a hundred Dota heroes.", game_url:"https://store.steampowered.com/app/570/", rating:"Very Positive", sections:["popular"]},
  {id:440, title:"Team Fortress 2", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg", genre:"FPS", developer:"Valve", publisher:"Valve", platform:"Windows, Mac", release_date:"Oct 10, 2007", short_description:"Team Fortress 2 features nine distinct classes providing a broad range of tactical abilities and personalities. Constantly updated with new game modes, maps, equipment and hats.", game_url:"https://store.steampowered.com/app/440/", rating:"Very Positive", sections:["popular"]},
  {id:1172470, title:"Apex Legends", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg", genre:"Battle Royale", developer:"Respawn Entertainment", publisher:"Electronic Arts", platform:"Windows", release_date:"Nov 04, 2020", short_description:"Apex Legends is the ultimate survival shooter. Choose from a roster of unique Legends, each with their own personality, strengths, and abilities.", game_url:"https://store.steampowered.com/app/1172470/", rating:4.5, sections:["popular"]},
  {id:1085660, title:"Destiny 2", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg", genre:"Action FPS", developer:"Bungie", publisher:"Bungie", platform:"Windows", release_date:"Oct 01, 2019", short_description:"Destiny 2 is an action MMO with a single evolving world that you and your friends can join anytime. Journey across the solar system.", game_url:"https://store.steampowered.com/app/1085660/", rating:"Mixed", sections:["popular"]},
  {id:238960, title:"Path of Exile", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/238960/header.jpg", genre:"Action RPG", developer:"Grinding Gear Games", publisher:"Grinding Gear Games", platform:"Windows, Mac", release_date:"Oct 23, 2013", short_description:"Path of Exile is an online action RPG set in the dark fantasy world of Wraeclast. With deep character customization and a massive passive skill tree.", game_url:"https://store.steampowered.com/app/238960/", rating:"Very Positive", sections:["popular"]},
  {id:109600, title:"Neverwinter", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/109600/header.jpg", genre:"MMORPG", developer:"Cryptic Studios", publisher:"Perfect World Entertainment", platform:"Windows", release_date:"Apr 30, 2013", short_description:"Neverwinter is a free-to-play action MMORPG based on the Dungeons & Dragons fantasy tabletop game.", game_url:"https://store.steampowered.com/app/109600/", rating:"Mixed", sections:["popular"]},
  {id:2139460, title:"Once Human", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2139460/header.jpg", genre:"Open World Survival", developer:"Starry Studio", publisher:"NetEase", platform:"Windows", release_date:"Jul 10, 2024", short_description:"Once Human is a multiplayer open-world survival game set in a strange, post-apocalyptic future. Unite with friends to fight monstrous aberrations.", game_url:"https://store.steampowered.com/app/2139460/", rating:4, sections:["popular","new-releases"]},
  {id:2507950, title:"Delta Force", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2507950/header.jpg", genre:"Tactical Shooter", developer:"Team Jade", publisher:"Level Infinite", platform:"Windows", release_date:"Dec 5, 2024", short_description:"Play for free in operator-based extraction and full-scale combined arms warfare with massive vehicles and dynamic battlefield events.", game_url:"https://store.steampowered.com/app/2507950/", rating:3.8, sections:["popular","new-releases"]},
  {id:2073850, title:"THE FINALS", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2073850/header.jpg", genre:"FPS", developer:"Embark Studios", publisher:"Electronic Arts", platform:"Windows", release_date:"Dec 7, 2023", short_description:"THE FINALS is a free-to-play competitive multiplayer FPS where teams of three compete in dynamically changing arenas.", game_url:"https://store.steampowered.com/app/2073850/", rating:4, sections:["popular","new-releases"]},
  {id:1203220, title:"NARAKA: BLADEPOINT", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1203220/header.jpg", genre:"Battle Royale", developer:"24 Entertainment", publisher:"NetEase", platform:"Windows", release_date:"Aug 11, 2021", short_description:"Dive into the legends of the Far East in fast-paced melee-focused combat against 60 players.", game_url:"https://store.steampowered.com/app/1203220/", rating:4, sections:["popular","new-releases"]},
  {id:230410, title:"Warframe", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg", genre:"Action RPG", developer:"Digital Extremes", publisher:"Digital Extremes", platform:"Windows", release_date:"Mar 25, 2013", short_description:"Warframe is a free-to-play cooperative third-person action game set in an evolving sci-fi world.", game_url:"https://store.steampowered.com/app/230410/", rating:"Very Positive", sections:["adventure"]},
  {id:386360, title:"SMITE", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/386360/header.jpg", genre:"MOBA", developer:"Hi-Rez Studios", publisher:"Hi-Rez Studios", platform:"Windows", release_date:"Sep 08, 2015", short_description:"SMITE is a third-person MOBA where players choose from mythological gods. Battle in intense 5v5 matches.", game_url:"https://store.steampowered.com/app/386360/", rating:4.5, sections:["adventure"]},
  {id:761890, title:"Albion Online", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/761890/header.jpg", genre:"MMORPG", developer:"Sandbox Interactive", publisher:"Sandbox Interactive", platform:"Windows", release_date:"Jul 17, 2017", short_description:"Albion Online is a sandbox MMORPG with a player-driven economy. Craft, trade, conquer.", game_url:"https://store.steampowered.com/app/761890/", rating:"Mostly Positive", sections:["adventure"]},
  {id:236390, title:"War Thunder", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/header.jpg", genre:"Action Simulation", developer:"Gaijin Entertainment", publisher:"Gaijin Entertainment", platform:"Windows", release_date:"Aug 15, 2013", short_description:"War Thunder is a free-to-play vehicular combat MMO featuring aircraft, ground forces, and naval ships.", game_url:"https://store.steampowered.com/app/236390/", rating:4, sections:["adventure"]},
  {id:9900, title:"Star Trek Online", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/9900/header.jpg", genre:"MMO Adventure", developer:"Cryptic Studios", publisher:"Perfect World Entertainment", platform:"Windows", release_date:"Jan 31, 2012", short_description:"Star Trek Online is a free-to-play MMORPG set in the legendary Star Trek universe. Command your own starship.", game_url:"https://store.steampowered.com/app/9900/", rating:"Mostly Positive", sections:["adventure"]},
  {id:8500, title:"EVE Online", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/8500/header.jpg", genre:"MMORPG", developer:"CCP Games", publisher:"CCP Games", platform:"Windows, Mac", release_date:"May 06, 2003", short_description:"EVE Online is a massive space-faring sandbox MMO where players can build empires and explore uncharted systems.", game_url:"https://store.steampowered.com/app/8500/", rating:3.5, sections:["adventure"]},
  {id:1343400, title:"Old School RuneScape", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1343400/header.jpg", genre:"MMORPG", developer:"Jagex", publisher:"Jagex", platform:"Windows", release_date:"Feb 24, 2021", short_description:"Old School RuneScape is a massive multiplayer online RPG. Complete quests, level up skills, and explore Gielinor.", game_url:"https://store.steampowered.com/app/1343400/", rating:"Overwhelmingly Positive", sections:["adventure"]},
  {id:835570, title:"Conqueror's Blade", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/835570/header.jpg", genre:"Action Strategy", developer:"Booming Games", publisher:"Booming Games", platform:"Windows", release_date:"May 30, 2019", short_description:"Conqueror's Blade gives you a chance to be a true warlord. Command medieval troops in epic 15 vs 15 siege battles.", game_url:"https://store.steampowered.com/app/835570/", rating:"Mostly Positive", sections:["new-releases","adventure"]},
  {id:1671200, title:"Honkai Impact 3rd", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1671200/header.jpg", genre:"Action RPG", developer:"miHoYo", publisher:"miHoYo", platform:"Windows", release_date:"Feb 26, 2024", short_description:"Honkai Impact 3rd is a next-gen 3D anime action game with stunning visuals and fluid combos.", game_url:"https://store.steampowered.com/app/1671200/", rating:"Very Positive", sections:["new-releases","adventure"]},
  {id:223710, title:"Cry of Fear", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/223710/header.jpg", genre:"Psychological Horror", developer:"Team Psykskallar", publisher:"Team Psykskallar", platform:"Windows", release_date:"Apr 15, 2013", short_description:"Cry of Fear is a free psychological horror game built on the Source engine. Navigate through a dark and twisted city.", game_url:"https://store.steampowered.com/app/223710/", rating:"Very Positive", sections:["horror"]},
  {id:700330, title:"SCP: Secret Laboratory", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/700330/header.jpg", genre:"Horror Multiplayer", developer:"Northwood Studios", publisher:"Northwood Studios", platform:"Windows", release_date:"Dec 29, 2017", short_description:"SCP: Secret Laboratory is a free multiplayer horror game based on the SCP Foundation containment breach.", game_url:"https://store.steampowered.com/app/700330/", rating:"Very Positive", sections:["horror"]},
  {id:2232840, title:"Garten of Banban", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2232840/header.jpg", genre:"Indie Horror", developer:"Euphoric Brothers", publisher:"Euphoric Brothers", platform:"Windows", release_date:"Jan 6, 2023", short_description:"Enter Banban's Kindergarten and explore the mysterious establishment. Discover what happened to the missing children.", game_url:"https://store.steampowered.com/app/2232840/", rating:3, sections:["horror"]},
  {id:1429100, title:"Siren Head: The Siren's Forest", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1429100/header.jpg", genre:"Creature Horror", developer:"Gwydion LLyr Meredydd", publisher:"Gwydion LLyr Meredydd", platform:"Windows", release_date:"Apr 6, 2021", short_description:"Navigate through the dark woods and use multiple means of transportation to escape the terrifying Siren Head.", game_url:"https://store.steampowered.com/app/1429100/", rating:"Positive", sections:["horror"]},
  {id:1961460, title:"PROJECT: PLAYTIME", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1961460/header.jpg", genre:"Multiplayer Horror", developer:"MOB Entertainment", publisher:"MOB Entertainment", platform:"Windows", release_date:"Dec 12, 2022", short_description:"PROJECT: PLAYTIME is a free multiplayer horror game where six players create one giant toy while surviving a monster.", game_url:"https://store.steampowered.com/app/1961460/", rating:"Mostly Positive", sections:["horror"]},
  {id:2485460, title:"State of Survival", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2485460/header.jpg", genre:"Zombie Survival RPG", developer:"FunPlus International AG", publisher:"FunPlus International AG", platform:"Windows", release_date:"Aug 28, 2024", short_description:"State of Survival is a zombie survival RPG set in a post-apocalyptic world. Build settlements and fight the undead.", game_url:"https://store.steampowered.com/app/2485460/", rating:4, sections:["horror"]},
  {id:2943650, title:"FragPunk", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2943650/header.jpg", genre:"FPS", developer:"Bad Guitar Studio", publisher:"Level Infinite", platform:"Windows", release_date:"Mar 6, 2025", short_description:"FragPunk is a free-to-play 5v5 hero shooter featuring unique Shard cards that dynamically reshape the battlefield.", game_url:"https://store.steampowered.com/app/2943650/", rating:4, sections:["new-releases"]},
  {id:2452280, title:"Mecha BREAK", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/2452280/header.jpg", genre:"Action", developer:"Amazing Seasun Games", publisher:"Level Infinite", platform:"Windows", release_date:"Mar 2025", short_description:"Mecha BREAK is an immersive multiplayer mech combat game with customizable mechs and devastating weapons.", game_url:"https://store.steampowered.com/app/2452280/", rating:"Mostly Positive", sections:["new-releases"]},
  {id:872200, title:"Rogue Company", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/872200/header.jpg", genre:"Third-Person Shooter", developer:"First Watch Games", publisher:"Hi-Rez Studios", platform:"Windows", release_date:"Jul 1, 2021", short_description:"Rogue Company is a free-to-play multiplayer third-person shooter with cross-play support.", game_url:"https://store.steampowered.com/app/872200/", rating:"Mostly Positive", sections:["new-releases"]},
  {id:677620, title:"Splitgate", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/677620/header.jpg", genre:"FPS", developer:"1047 Games", publisher:"1047 Games", platform:"Windows", release_date:"Sep 15, 2019", short_description:"Splitgate is a free-to-play multiplayer portal shooter combining arena FPS action with portal mechanics.", game_url:"https://store.steampowered.com/app/677620/", rating:"Very Positive", sections:["new-releases"]},
  {id:333930, title:"Dirty Bomb", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/333930/header.jpg", genre:"FPS", developer:"Splash Damage", publisher:"Splash Damage", platform:"Windows", release_date:"Jun 12, 2024", short_description:"Dirty Bomb is a fast-paced, team-based multiplayer FPS set in a near-future London.", game_url:"https://store.steampowered.com/app/333930/", rating:4, sections:["new-releases"]},
  {id:304050, title:"Trove", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/304050/header.jpg", genre:"Voxel Adventure", developer:"Trion Worlds", publisher:"Trion Worlds", platform:"Windows", release_date:"Jul 09, 2015", short_description:"Trove is a free-to-play voxel MMO adventure game. Explore infinite realms, build anything you can imagine.", game_url:"https://store.steampowered.com/app/304050/", rating:4.0, sections:["kids"]},
  {id:471710, title:"Rec Room", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/471710/header.jpg", genre:"Social Sandbox", developer:"Rec Room Inc.", publisher:"Rec Room Inc.", platform:"Windows", release_date:"Jun 01, 2016", short_description:"Rec Room is a social club where players can build and play games together.", game_url:"https://store.steampowered.com/app/471710/", rating:4.0, sections:["kids"]},
  {id:1097150, title:"Fall Guys", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg", genre:"Party Game", developer:"Mediatonic", publisher:"Epic Games", platform:"Windows", release_date:"Aug 04, 2020", short_description:"Fall Guys is a massively multiplayer party game where up to 60 players compete in chaotic obstacle courses.", game_url:"https://store.steampowered.com/app/1097150/", rating:4.0, sections:["kids"]},
  {id:822240, title:"Animal Jam", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/822240/header.jpg", genre:"Adventure", developer:"WildWorks, Inc.", publisher:"WildWorks, Inc.", platform:"Windows", release_date:"Jan 8, 2025", short_description:"In Animal Jam, become your favorite animal, collect amazing items, and create a style to express the real you.", game_url:"https://store.steampowered.com/app/822240/", rating:"Very Positive", sections:["kids"]},
  {id:1507410, title:"Coloring Book for Kids", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/1507410/header.jpg", genre:"Casual", developer:"Peaksel", publisher:"Peaksel", platform:"Windows, Mac", release_date:"Mar 8, 2021", short_description:"Coloring Book for Kids is a creative coloring app specially designed for little ones.", game_url:"https://store.steampowered.com/app/1507410/", rating:"Positive", sections:["kids"]},
  {id:4038250, title:"Run Shiba Run!", thumbnail:"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4038250/33943f1ec73200c59b29e6082671df12fa9e2d4e/header.jpg?t=1774014866", genre:"Casual", developer:"Table for Twenty", publisher:"Table for Twenty", platform:"Windows, Mac", release_date:"Mar 20, 2026", short_description:"Help Goma the dog eat as many biscuits as they can before time runs out!", game_url:"https://store.steampowered.com/app/4038250/", rating:"Positive", sections:["kids"]},
  {id:291550, title:"Brawlhalla", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/291550/header.jpg", genre:"Fighting", developer:"Blue Mammoth Games", publisher:"Blue Mammoth Games", platform:"Windows", release_date:"Nov 03, 2015", short_description:"Brawlhalla is a free platform fighting game with over 50 playable characters.", game_url:"https://store.steampowered.com/app/291550/", rating:"Very Positive", sections:["kids"]},
  {id:252950, title:"Rocket League", thumbnail:"https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg", genre:"Sports", developer:"Psyonix", publisher:"Epic Games", platform:"Windows", release_date:"Jul 07, 2015", short_description:"Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem.", game_url:"https://store.steampowered.com/app/252950/", rating:"Very Positive", sections:["kids"]},
];

// ========== HELPERS ==========
function getGamesForSection(key) { return GAMES_DATA.filter(g => g.sections && g.sections.includes(key)); }
function findGameById(id) { return GAMES_DATA.find(g => g.id == id); }
function escHtml(s) { const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }

function getRatingScore(rating) {
  if (typeof rating === 'number') return rating;
  if (typeof rating === 'string') {
    const map = {'Overwhelmingly Positive':5,'Very Positive':4.5,'Mostly Positive':4,'Positive':3.5,'Mixed':3,'Mostly Negative':2,'Negative':1.5,'Very Negative':1};
    return map[rating] || 3;
  }
  return 3;
}

function renderStars(score, maxStars) {
  let html = '';
  const full = Math.floor(score);
  const half = score % 1 >= 0.5 ? 1 : 0;
  const empty = maxStars - full - half;
  for (let i=0;i<full;i++) html += '<span class="star filled">&#9733;</span>';
  if (half) html += '<span class="star half">&#9733;</span>';
  for (let i=0;i<empty;i++) html += '<span class="star empty">&#9733;</span>';
  return html;
}

// ========== STEAM MEDIA ==========
function getGameMedia(appid) {
  if (typeof STEAM_MEDIA !== 'undefined' && STEAM_MEDIA[String(appid)]) {
    const data = STEAM_MEDIA[String(appid)];
    return {
      screenshots: data.screenshots.length > 0 ? data.screenshots : getFallbackScreenshots(appid),
      trailers: data.trailers,
    };
  }
  return { screenshots: getFallbackScreenshots(appid), trailers: [] };
}

function getFallbackScreenshots(appid) {
  return [
    { thumb: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`, full: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg` },
    { thumb: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`, full: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg` },
    { thumb: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`, full: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg` },
  ];
}

// ========== SVG ICONS ==========
const SVG = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h1M8 10h1M8 14h1M15 6h1M15 10h1M15 14h1"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
  playCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
};

// ========== THEME ==========
function applyTheme(t) { state.theme = t; document.body.setAttribute('data-theme', t); localStorage.setItem('theme', t); }
function toggleTheme() { applyTheme(state.theme === 'dark' ? 'light' : 'dark'); }

// ========== SPLASH ==========
function initSplash() {
  return new Promise(resolve => {
    const splash = document.getElementById('splash');
    if (!splash) { resolve(); return; }
    const logo = document.getElementById('intro-logo');
    const skipBtn = document.getElementById('intro-skip');
    let resolved = false;
    const finish = () => { if (resolved) return; resolved = true; splash.classList.add('fade-out'); setTimeout(() => { splash.remove(); resolve(); }, 600); };
    skipBtn.addEventListener('click', finish);
    try { var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); setTimeout(() => { var now=audioCtx.currentTime; var o1=audioCtx.createOscillator();var g1=audioCtx.createGain();o1.type='sine';o1.frequency.setValueAtTime(80,now);o1.frequency.exponentialRampToValueAtTime(55,now+0.4);g1.gain.setValueAtTime(0.6,now);g1.gain.exponentialRampToValueAtTime(0.01,now+1.2);o1.connect(g1).connect(audioCtx.destination);o1.start(now);o1.stop(now+1.2); }, 1000); } catch(e) {}
    const letters = Array.from(logo.querySelectorAll('.letter:not(.letter-g)')).reverse();
    const letterG = logo.querySelector('.letter-g');
    setTimeout(() => { letters.forEach((el, i) => { setTimeout(() => { el.classList.add('trim-away'); }, i * 120); }); setTimeout(() => { letterG.classList.add('g-focus'); }, letters.length * 120 + 200); }, 1200);
    setTimeout(() => { letterG.classList.remove('g-focus'); letterG.classList.add('g-fadeout'); letterG.style.animation = 'none'; }, 4000);
    setTimeout(finish, 2000);
  });
}

// ========== NAVBAR ==========
function scrollToTop(e) { e && e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); }
function scrollToSection(e, id) { e && e.preventDefault(); const el = document.getElementById(id); if (el) el.scrollIntoView({behavior:'smooth', block:'start'}); }
function toggleMobileMenu() { document.getElementById('mobile-menu').classList.toggle('active'); document.getElementById('hamburger').classList.toggle('active'); }
function closeMobileMenu() { document.getElementById('mobile-menu').classList.remove('active'); document.getElementById('hamburger').classList.remove('active'); }

// ========== SEARCH ==========
let searchTimeout;
function handleSearch(query) { state.searchQuery = query; clearTimeout(searchTimeout); searchTimeout = setTimeout(() => doSearch(query), 300); }
function handleMobileSearch(query) { handleSearch(query); }
function doSearch(query) {
  const dd = document.getElementById('search-dropdown');
  if (!dd) return;
  if (!query || query.length < 2) { dd.classList.remove('active'); return; }
  const q = query.toLowerCase();
  const results = GAMES_DATA.filter(g => (g.title||'').toLowerCase().includes(q) || (g.genre||'').toLowerCase().includes(q) || (g.developer||'').toLowerCase().includes(q)).slice(0, 8);
  if (results.length === 0) { dd.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:.85rem">No games found</div>'; }
  else { dd.innerHTML = results.map(g => `<div class="search-result" onclick="openGameDetail('${g.id}')"><img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${g.id}/capsule_616x353.jpg" alt="${escHtml(g.title)}" loading="lazy"><div class="sr-info"><div class="sr-title">${escHtml(g.title)}</div><div class="sr-genre">${escHtml(g.genre||'')}</div></div></div>`).join(''); }
  dd.classList.add('active');
}
document.addEventListener('click', (e) => { const dd = document.getElementById('search-dropdown'); const box = document.getElementById('search-box'); if (dd && box && !box.contains(e.target)) dd.classList.remove('active'); });
document.addEventListener('DOMContentLoaded', () => { const si = document.getElementById('search-input'); if (si) si.addEventListener('input', (e) => handleSearch(e.target.value)); });

// ========== HERO ==========
function renderHero(games) {
  state.heroGames = games.slice(0, 5);
  const slidesEl = document.getElementById('hero-slides');
  const dotsEl = document.getElementById('hero-dots');
  if (!slidesEl || !dotsEl) return;
  slidesEl.innerHTML = state.heroGames.map((g, i) => `<div class="hero-slide${i===0?' active':''}" data-index="${i}"><div class="hero-bg" style="background-image:url('https://cdn.cloudflare.steamstatic.com/steam/apps/${g.id}/library_hero.jpg'),url('https://cdn.cloudflare.steamstatic.com/steam/apps/${g.id}/page_bg_generated.jpg')"></div><div class="hero-overlay"></div><div class="hero-content"><span class="hero-badge">${escHtml(g.genre||'FREE')}</span><h1 class="hero-title">${escHtml(g.title)}</h1><p class="hero-desc">${escHtml(g.short_description||'')}</p><div class="hero-btns"><button class="btn-play" onclick="window.open('${g.game_url||'#'}','_blank')">${SVG.play} Play Now</button><button class="btn-info" onclick="openGameDetail(${g.id})">${SVG.playCircle} Screenshots</button></div></div></div>`).join('');
  dotsEl.innerHTML = state.heroGames.map((_, i) => `<div class="hero-dot${i===0?' active':''}" onclick="goToHeroSlide(${i})"></div>`).join('');
  startHeroRotation();
}
function goToHeroSlide(idx) { state.heroIndex = idx; document.querySelectorAll('.hero-slide').forEach((s,i) => s.classList.toggle('active', i===idx)); document.querySelectorAll('.hero-dot').forEach((d,i) => d.classList.toggle('active', i===idx)); }
function startHeroRotation() { if (state.heroInterval) clearInterval(state.heroInterval); state.heroInterval = setInterval(() => { goToHeroSlide((state.heroIndex + 1) % state.heroGames.length); }, 8000); }

// ========== GAME CARDS ==========
function createGameCard(g) {
  const card = document.createElement('div'); card.className = 'game-card'; card.onclick = () => openGameDetail(g.id);
  const appId = g.id; const rating = g.rating || ''; const score = getRatingScore(rating);
  card.innerHTML = `<div class="card-img-wrap"><img class="card-img" src="https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg" alt="${escHtml(g.title)}" loading="lazy"><div class="card-gradient"></div><span class="card-genre-badge">${escHtml(g.genre||'')}</span>${rating ? `<span class="card-rating-badge">${renderStars(score, 9)}<span class="rating-num">${score.toFixed(1)}</span></span>` : ''}</div><div class="card-title">${escHtml(g.title)}</div>`;
  return card;
}

// ========== CAROUSELS ==========
const CAROUSEL_SECTIONS = [{key:'popular',title:'Popular Games',id:'section-popular'},{key:'adventure',title:'Adventure Games',id:'section-adventure'},{key:'horror',title:'Horror Games',id:'section-horror'},{key:'new-releases',title:'New Releases Games',id:'section-new-releases'}];
function renderCarousels() {
  const container = document.getElementById('normal-content'); if (!container) return; container.innerHTML = '';
  CAROUSEL_SECTIONS.forEach(sec => {
    const games = getGamesForSection(sec.key); if (!games || games.length === 0) return;
    const section = document.createElement('div'); section.className = 'carousel-section'; section.id = sec.id;
    section.innerHTML = `<div class="carousel-header"><h2 class="carousel-title">${escHtml(sec.title)}</h2></div><div class="carousel-wrap"><div class="carousel-fade left"></div><div class="carousel-fade right"></div><button class="carousel-arrow left" onclick="scrollCarousel(this, -1)">${SVG.chevronLeft}</button><div class="carousel-container"></div><button class="carousel-arrow right" onclick="scrollCarousel(this, 1)">${SVG.chevronRight}</button></div>`;
    const carousel = section.querySelector('.carousel-container'); games.forEach(g => carousel.appendChild(createGameCard(g)));
    container.appendChild(section); initCarouselDrag(carousel);
  });
  const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }}); }, {threshold:0.1});
  document.querySelectorAll('.carousel-section').forEach(s => observer.observe(s));
}
function scrollCarousel(btn, dir) { const container = btn.parentElement.querySelector('.carousel-container'); container.scrollBy({left: dir * container.clientWidth * 0.7, behavior:'smooth'}); }
function initCarouselDrag(el) { let isDown=false,startX,scrollLeft; el.addEventListener('mousedown',(e)=>{isDown=true;el.style.cursor='grabbing';startX=e.pageX-el.offsetLeft;scrollLeft=el.scrollLeft;}); el.addEventListener('mouseleave',()=>{isDown=false;el.style.cursor='';}); el.addEventListener('mouseup',()=>{isDown=false;el.style.cursor='';}); el.addEventListener('mousemove',(e)=>{if(!isDown)return;e.preventDefault();el.scrollLeft=scrollLeft-(e.pageX-el.offsetLeft-startX)*1.5;}); }

// ========== KIDS MODE ==========
function toggleKidsMode() {
  state.isKidsMode = !state.isKidsMode;
  const navbar=document.getElementById('navbar'),normal=document.getElementById('normal-content'),kids=document.getElementById('kids-content'),hero=document.getElementById('hero'),toggle=document.getElementById('kids-toggle'),navLinks=document.getElementById('nav-links');
  if(navbar)navbar.classList.toggle('kids-mode',state.isKidsMode); if(normal)normal.style.display=state.isKidsMode?'none':'block'; if(kids)kids.classList.toggle('active',state.isKidsMode); if(hero)hero.style.display=state.isKidsMode?'none':'';
  if(state.isKidsMode){if(toggle){toggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg> Exit Kids';}if(navLinks)navLinks.innerHTML='<a href="#" onclick="scrollToTop(event)">Home</a><a href="#" onclick="scrollToSection(event,\'section-popular\')">Popular</a>';renderKidsGrid(getGamesForSection('kids'));}
  else{if(toggle){toggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="10" r="5"/><path d="M12 15v3"/><path d="M8 20h8"/><path d="M9 5c0-1 .5-2 1.5-2"/><path d="M15 5c0-1-.5-2-1.5-2"/></svg> Kids';}if(navLinks)navLinks.innerHTML='<a href="#" onclick="scrollToTop(event)">Home</a><a href="#" onclick="scrollToSection(event,\'section-popular\')">Popular</a><a href="#" onclick="scrollToSection(event,\'section-adventure\')">Adventure Games</a><a href="#" onclick="scrollToSection(event,\'section-horror\')">Horror Games</a><a href="#" onclick="scrollToSection(event,\'section-new-releases\')">New Releases Games</a>';}
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderKidsGrid(games) { const grid=document.getElementById('kids-grid'); if(!grid)return; grid.innerHTML=''; (games||[]).forEach(g=>grid.appendChild(createGameCard(g))); }

// ========== GAME DETAIL WITH SCREENSHOTS ==========
function openGameDetail(id) {
  const dd=document.getElementById('search-dropdown'); if(dd)dd.classList.remove('active');
  const game=findGameById(id); if(!game)return; state.selectedGame=game;
  const detailEl=document.getElementById('game-detail'),cardEl=document.getElementById('detail-card'); if(!detailEl||!cardEl)return;
  const rating=game.rating||'',score=getRatingScore(rating);

  // Get screenshots
  var screenshots = [];
  try {
    if (typeof STEAM_MEDIA !== 'undefined' && STEAM_MEDIA[String(id)] && STEAM_MEDIA[String(id)].screenshots && STEAM_MEDIA[String(id)].screenshots.length > 0) {
      screenshots = STEAM_MEDIA[String(id)].screenshots;
    }
  } catch(e) {}
  if (screenshots.length === 0) {
    screenshots = [
      { thumb: 'https://cdn.cloudflare.steamstatic.com/steam/apps/'+id+'/capsule_616x353.jpg', full: 'https://cdn.cloudflare.steamstatic.com/steam/apps/'+id+'/capsule_616x353.jpg' },
      { thumb: 'https://cdn.cloudflare.steamstatic.com/steam/apps/'+id+'/header.jpg', full: 'https://cdn.cloudflare.steamstatic.com/steam/apps/'+id+'/header.jpg' },
      { thumb: 'https://cdn.cloudflare.steamstatic.com/steam/apps/'+id+'/library_600x900.jpg', full: 'https://cdn.cloudflare.steamstatic.com/steam/apps/'+id+'/library_600x900.jpg' },
    ];
  }

  var ssHtml = screenshots.map(function(s, i) {
    return '<div class="screenshot-thumb" onclick="openLightbox(\''+s.full+'\')"><img src="'+s.thumb+'" alt="Screenshot '+(i+1)+'" loading="lazy"><div class="screenshot-overlay">'+SVG.image+'</div></div>';
  }).join('');

  cardEl.innerHTML = '<div class="detail-hero" style="background-image:url(\'https://cdn.cloudflare.steamstatic.com/steam/apps/'+id+'/library_hero.jpg\'),url(\'https://cdn.cloudflare.steamstatic.com/steam/apps/'+id+'/page_bg_generated.jpg\')"><div class="detail-hero-overlay"></div><div class="detail-hero-content"><span class="detail-badge">'+escHtml(game.genre||'')+'</span><h2 class="detail-title">'+escHtml(game.title)+'</h2>'+(rating?'<div class="detail-rating">'+renderStars(score,5)+' <span>'+score.toFixed(1)+'/5</span></div>':'')+'</div></div><div class="detail-body"><div class="detail-meta"><div class="detail-meta-item">'+SVG.user+' '+escHtml(game.developer||'')+'</div><div class="detail-meta-item">'+SVG.building+' '+escHtml(game.publisher||'')+'</div><div class="detail-meta-item">'+SVG.calendar+' '+escHtml(game.release_date||'')+'</div><div class="detail-meta-item">'+SVG.monitor+' '+escHtml(game.platform||'')+'</div></div><p class="detail-desc">'+escHtml(game.short_description||'')+'</p><div class="detail-btns"><button class="btn-play" onclick="window.open(\''+(game.game_url||'#')+'\',\'_blank\')">'+SVG.play+' Play Free on Steam</button><button class="btn-info" onclick="window.open(\''+(game.game_url||'#')+'\',\'_blank\')">'+SVG.externalLink+' Store Page</button></div><div class="detail-screenshots-section"><h3 class="detail-section-title">Screenshots</h3><div class="detail-screenshots">'+ssHtml+'</div></div></div>';

  detailEl.classList.add('active'); document.body.style.overflow='hidden';
}

function closeGameDetail() { const detailEl=document.getElementById('game-detail'); if(detailEl)detailEl.classList.remove('active'); document.body.style.overflow=''; state.selectedGame=null; }

// ========== LIGHTBOX ==========
function openLightbox(src) {
  var lb=document.getElementById('lightbox'); var img=document.getElementById('lightbox-img');
  if(lb&&img){ img.style.display='block'; img.src=src; lb.classList.add('active'); document.body.style.overflow='hidden'; }
}
function closeLightbox() { var lb=document.getElementById('lightbox'); if(lb){ lb.classList.remove('active'); if(!state.selectedGame)document.body.style.overflow=''; } }

// ========== AUTH ==========
function openAuthModal() { const modal=document.getElementById('auth-modal'); if(modal){modal.classList.add('active');document.body.style.overflow='hidden';} }
function closeAuthModal() { const modal=document.getElementById('auth-modal'); if(modal){modal.classList.remove('active');document.body.style.overflow='';} }
function switchAuthView(view) { document.querySelectorAll('.auth-view').forEach(v=>v.classList.remove('active')); const target=document.getElementById('auth-'+view); if(target)target.classList.add('active'); }
function handleSignIn(e) { e.preventDefault(); const email=document.getElementById('signin-email').value; const password=document.getElementById('signin-password').value; if(email&&password){state.isLoggedIn=true;state.currentUser=email;updateAuthButton();closeAuthModal();e.target.reset();} }
function handleSignUp(e) { e.preventDefault(); const email=document.getElementById('signup-email').value; const password=document.getElementById('signup-password').value; const confirm=document.getElementById('signup-confirm').value; const errorEl=document.getElementById('signup-error'); if(password!==confirm){if(errorEl){errorEl.textContent='Passwords do not match';errorEl.style.display='block';}return;} if(email&&password&&confirm){state.isLoggedIn=true;state.currentUser=email;updateAuthButton();closeAuthModal();e.target.reset();} }
function updateAuthButton() { const btn=document.getElementById('auth-nav-btn'); if(!btn)return; if(state.isLoggedIn){btn.onclick=handleLogout;btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg> Log Out';btn.style.background='rgba(220,38,38,0.2)';btn.style.border='1px solid rgba(220,38,38,0.3)';btn.style.color='#f87171';}else{btn.onclick=openAuthModal;btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Sign In';btn.style.background='';btn.style.border='';btn.style.color='';} }
function handleLogout() { state.isLoggedIn=false; state.currentUser=null; updateAuthButton(); }

// ========== KEYBOARD ==========
document.addEventListener('keydown', (e) => { if(e.key==='Escape'){closeLightbox();closeGameDetail();closeAuthModal();closeMobileMenu();} });

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', async () => { applyTheme(state.theme); await initSplash(); renderHero(getGamesForSection('popular')); renderCarousels(); renderKidsGrid(getGamesForSection('kids')); updateAuthButton(); });
