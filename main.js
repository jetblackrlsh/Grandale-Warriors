"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const app = $("#app");
const STORE_KEY = "grand-dale-warriors-save-v1";
const todayKey = () => new Date().toLocaleDateString("en-CA");

const MUSIC = {
  deck: "assets/Music/The%20Smith%27s%20Guild_%20Deck%20Builder%20%26%20Gacha.mp3",
  gacha: "assets/Music/The%20Smith%27s%20Guild_%20Deck%20Builder%20%26%20Gacha.mp3",
  battle: "assets/Music/Grand%20Dale_%20Warrior%27s%20Duel.mp3",
  rewards: "assets/Music/Grand%20Dale_%20Lore%20%26%20Exploration.mp3",
  missions: "assets/Music/Grand%20Dale_%20Lore%20%26%20Exploration.mp3",
  lore: "assets/Music/Grand%20Dale_%20Lore%20%26%20Exploration.mp3",
};

const PAGES = [
  ["battle", "Battle"],
  ["deck", "Deck Builder"],
  ["gacha", "Gacha"],
  ["rewards", "Daily Reward"],
  ["missions", "Daily Missions"],
  ["lore", "Lore"],
];

const ELEMENTS = ["fire", "water", "wind", "stone", "frost", "storm", "vine", "light"];
const BIOMES = ["Amberwood", "Emberforge", "Riverdale", "Stormpeak", "Stonevault", "Skygrass", "Frostfen", "Greenweald"];
const BEATS = {
  fire: ["vine", "frost"],
  water: ["fire", "stone"],
  wind: ["storm", "frost"],
  stone: ["wind", "storm"],
  frost: ["water", "vine"],
  storm: ["water", "light"],
  vine: ["stone", "light"],
  light: ["frost", "fire"],
};

const CARD_ART = {
  amber: [0, 0], fox: [1, 0], otter: [2, 0], owl: [3, 0],
  fireaxe: [0, 1], watercharm: [1, 1], windboots: [2, 1], stoneshield: [3, 1],
  portal: [0, 2], lantern: [1, 2], vine: [2, 2], compass: [3, 2],
};

const BIOME_ART = {
  Amberwood: [0, 0], Emberforge: [1, 0], Riverdale: [2, 0], Stormpeak: [3, 0],
  Stonevault: [3, 0], Skygrass: [2, 0], Frostfen: [3, 0], Greenweald: [0, 0],
  fire: [0, 1], water: [1, 1], vine: [2, 1], storm: [3, 1],
};

const CARDS = [
  warrior("w-amber", "Eran Oakenroad", "Amberwood", "light", "Human guild champion who adapts to any road.", "amber"),
  warrior("w-fox", "Cinderpaw Smith", "Emberforge", "fire", "Foxfolk hammer duelist from the volcanic forges.", "fox"),
  warrior("w-otter", "Brin Riverglass", "Riverdale", "water", "Otterfolk scout who guards canal caravans.", "otter"),
  warrior("w-owl", "Orra Thunderquill", "Stormpeak", "storm", "Owlfolk seer with a staff full of summer lightning.", "owl"),
  warrior("w-stone", "Mossback Warder", "Stonevault", "stone", "Badgerfolk border guardian in runed plate.", "stoneshield"),
  warrior("w-wind", "Sable Skyrunner", "Skygrass", "wind", "Harefolk courier who reads pressure shifts.", "windboots"),
  warrior("w-frost", "Iva Snowmender", "Frostfen", "frost", "Lynxfolk healer whose tools hold clean cold.", "watercharm"),
  warrior("w-vine", "Tarlan Rootbow", "Greenweald", "vine", "Deerfolk ranger bound to orchard roads.", "vine"),
  tool("t-fire", "Ember-Hold Axe", "fire", "A fire tool that bites through vine and frost.", "fireaxe"),
  tool("t-water", "Riverglass Vessel", "water", "A purifying vessel that cools fire and cracks stone.", "watercharm"),
  tool("t-wind", "Gale-Step Boots", "wind", "Courier boots that outpace storm and frost.", "windboots"),
  tool("t-stone", "Borderstone Shield", "stone", "A shield that grounds wind and storm.", "stoneshield"),
  tool("t-frost", "Hoarfang Chisel", "frost", "A cold edge that slows water and vine.", "watercharm"),
  tool("t-storm", "Thunder Orb", "storm", "A charged focus that shocks water and light.", "portal"),
  tool("t-vine", "Rootbind Gauntlet", "vine", "Living craft that breaks stone and dims light.", "vine"),
  tool("t-light", "Guild Light Compass", "light", "A lantern compass that clears frost and fire.", "compass"),
  biome("b-amber", "Amberwood Guild Road", "Amberwood", "Neutral roads help adaptable warriors."),
  biome("b-ember", "Emberforge Kilnfield", "Emberforge", "Heat-shimmered forges feed firecraft."),
  biome("b-river", "Riverdale Locks", "Riverdale", "Canal wards carry clean water through farms."),
  biome("b-storm", "Stormpeak Citadel", "Stormpeak", "Lightning towers turn thunder into law."),
  biome("b-stone", "Stonevault Gate", "Stonevault", "Border walls echo with grounded runes."),
  biome("b-green", "Greenweald Orchard", "Greenweald", "Living bridges drink sunlight and rain."),
  magic("m-shift-tool", "Prismatic Reforge", "Change one equipped tool to a random element.", "portal", "shiftTool"),
  magic("m-shift-biome", "Weather Treaty", "Change the active biome to a random biome.", "compass", "shiftBiome"),
  magic("m-draw-magic", "Seer's Index", "Draw a random Magic card from your deck.", "portal", "drawMagic"),
  magic("m-draw-tool", "Smith's Favor", "Draw a random Element Tool from your deck.", "lantern", "drawTool"),
  magic("m-draw-warrior", "Guild Summons", "Draw a random Warrior from your deck.", "compass", "drawWarrior"),
  magic("m-reclaim", "Lantern of Return", "Add a random discarded card to your hand.", "lantern", "reclaim"),
];

const CARD_BY_ID = Object.fromEntries(CARDS.map((card) => [card.id, card]));

function warrior(id, name, biomePref, element, text, art) {
  return { id, name, type: "Warrior", biomePref, element, text, art };
}

function tool(id, name, element, text, art) {
  return { id, name, type: "Element Tool", element, text, art };
}

function biome(id, name, biome, text) {
  return { id, name, type: "Biome", biome, text, art: biome };
}

function magic(id, name, text, art, effect) {
  return { id, name, type: "Magic", text, art, effect };
}

const SFX_PATTERNS = {
  nav: [62, 67],
  musicToggle: [55, 67, 74],
  deckAdd: [60, 64, 67],
  deckRemove: [67, 64, 60],
  deckNew: [48, 55, 60, 67],
  deckActive: [52, 59, 64, 71],
  deckRename: [65, 69, 72],
  deckClear: [48, 45, 41],
  deckSave: [57, 64, 69, 76],
  gacha: [60, 72, 79, 84],
  daily: [65, 69, 72, 77],
  mission: [59, 62, 67, 74],
  draw: [52, 59],
  playWarrior: [48, 55, 60],
  playTool: [64, 67, 71],
  playBiome: [43, 50, 55, 62],
  playMagic: [72, 76, 79, 83],
  magicEffect: [83, 79, 76, 84],
  aiPlayWarrior: [36, 43, 48],
  aiPlayTool: [40, 47, 52],
  aiPlayBiome: [31, 38, 43, 50],
  aiPlayMagic: [60, 63, 67, 70],
  aiMagicEffect: [70, 67, 63, 75],
  discard: [58, 53],
  score: [60, 64, 67, 72],
  tie: [55, 55, 55],
  victory: [60, 64, 67, 72, 79, 84],
  defeat: [60, 56, 53, 48],
  error: [42, 42],
};

let state = loadState();
let page = location.hash.replace("#", "") || "battle";
let battle = null;
let selectedDeckId = state.activeDeckId;
let audio = null;
let audioCtx = null;
let musicUnlocked = false;

function defaultState() {
  const starter = makeStarterDeck();
  const owned = {};
  starter.forEach((id) => owned[id] = (owned[id] || 0) + 1);
  randomCards(5).forEach((id) => owned[id] = (owned[id] || 0) + 1);
  return {
    gold: 160,
    owned,
    decks: [{ id: "deck-1", name: "Amberwood Starter", cards: starter }],
    activeDeckId: "deck-1",
    dailyRewardDate: "",
    missionsDate: "",
    missions: [],
    audio: { music: 0.45, sfx: 0.65, enabled: false },
    stats: { wins: 0, battles: 0, cardsBought: 0, dailyClaims: 0 },
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
    if (parsed && parsed.owned && parsed.decks) return normalizeState(parsed);
  } catch (_) {}
  return normalizeState(defaultState());
}

function normalizeState(save) {
  save.audio ||= { music: 0.45, sfx: 0.65, enabled: false };
  save.stats ||= { wins: 0, battles: 0, cardsBought: 0, dailyClaims: 0 };
  if (!save.missionsDate || save.missionsDate !== todayKey()) {
    save.missionsDate = todayKey();
    save.missions = buildDailyMissions();
  }
  if (!save.decks.some((deck) => deck.id === save.activeDeckId)) save.activeDeckId = save.decks[0].id;
  return save;
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function makeStarterDeck() {
  return [
    pickByType("Warrior"),
    pickByType("Magic"),
    pickByType("Biome"),
    pickByType("Element Tool"),
    ...randomCards(5),
  ];
}

function randomCards(count, pool = CARDS) {
  return Array.from({ length: count }, () => randomItem(pool).id);
}

function pickByType(type) {
  return randomItem(CARDS.filter((card) => card.type === type)).id;
}

function buildDailyMissions() {
  const pool = [
    mission("win-1", "Win one battle", "wins", 1, 75),
    mission("battle-1", "Finish one battle", "battles", 1, 40),
    mission("play-tools-3", "Equip three tools in battle", "toolsPlayed", 3, 45),
    mission("play-magic-2", "Play two magic cards", "magicPlayed", 2, 50),
    mission("play-biome-1", "Replace the active biome", "biomesPlayed", 1, 35),
    mission("score-2", "Earn two duel points", "pointsScored", 2, 60),
    mission("gacha-1", "Buy one gacha card", "gachaBought", 1, 30),
    mission("daily-card-1", "Claim the daily card", "dailyClaimed", 1, 30),
  ];
  return shuffle(pool).slice(0, 3);
}

function mission(id, title, event, target, reward) {
  return { id, title, event, target, reward, progress: 0, claimed: false };
}

function track(event, amount = 1) {
  let changed = false;
  state.missions.forEach((missionItem) => {
    if (missionItem.event === event && !missionItem.claimed) {
      missionItem.progress = Math.min(missionItem.target, missionItem.progress + amount);
      changed = true;
    }
  });
  if (changed) saveState();
}

function render() {
  if (!PAGES.some(([id]) => id === page)) page = "battle";
  setupMusic();
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">GD</div>
          <div><h1>Grand Dale Warriors</h1><p>Element craft card duels</p></div>
        </div>
        <nav class="nav">
          ${PAGES.map(([id, label]) => `<button class="${page === id ? "active" : ""}" data-page="${id}">${label}</button>`).join("")}
        </nav>
        <div class="audio-controls">
          <button data-action="toggle-music">${state.audio.enabled ? "Music On" : "Music Off"}</button>
          <label class="range-row">Music <input data-action="music-volume" type="range" min="0" max="1" step="0.01" value="${state.audio.music}"><span>${Math.round(state.audio.music * 100)}</span></label>
          <label class="range-row">SFX <input data-action="sfx-volume" type="range" min="0" max="1" step="0.01" value="${state.audio.sfx}"><span>${Math.round(state.audio.sfx * 100)}</span></label>
        </div>
      </header>
      <main class="page">${renderPage()}</main>
    </div>
  `;
}

function renderPage() {
  if (page === "deck") return renderDeckBuilder();
  if (page === "gacha") return renderGacha();
  if (page === "rewards") return renderRewards();
  if (page === "missions") return renderMissions();
  if (page === "lore") return renderLore();
  return renderBattle();
}

function pageHeader(title, copy, extra = goldPill()) {
  return `<div class="page-header panel"><div><h2>${title}</h2><p>${copy}</p></div>${extra}</div>`;
}

function goldPill() {
  return `<div class="gold-pill">${state.gold} gold</div>`;
}

function renderDeckBuilder() {
  const deck = getDeck(selectedDeckId) || getActiveDeck();
  const ownedIds = Object.keys(state.owned).sort((a, b) => CARD_BY_ID[a].type.localeCompare(CARD_BY_ID[b].type) || CARD_BY_ID[a].name.localeCompare(CARD_BY_ID[b].name));
  const deckCounts = countIds(deck.cards);
  return `
    ${pageHeader("Deck Builder", "Manage deck slots, tune your active deck, and keep at least seven cards with each major card type represented.")}
    <div class="grid-2">
      <section class="panel section stack">
        <div class="toolbar">
          <select data-action="select-deck">
            ${state.decks.map((item) => `<option value="${item.id}" ${item.id === deck.id ? "selected" : ""}>${item.name}${item.id === state.activeDeckId ? " (Active)" : ""}</option>`).join("")}
          </select>
          <button data-action="new-deck">New Deck</button>
          <button data-action="set-active" ${deck.id === state.activeDeckId ? "disabled" : ""}>Set Active</button>
          <button data-action="rename-deck">Rename</button>
          <button data-action="clear-deck">Clear</button>
        </div>
        <div class="toolbar">
          <span class="status-pill">${deck.cards.length} cards</span>
          <span class="status-pill">${deckStatus(deck).valid ? "Legal deck" : deckStatus(deck).message}</span>
        </div>
        <div class="card-grid">
          ${deck.cards.length ? deck.cards.map((id, index) => renderCard(CARD_BY_ID[id], { count: deckCounts[id], className: "selectable", action: "remove-card", index })).join("") : `<div class="empty">Add cards from your collection</div>`}
        </div>
      </section>
      <aside class="panel section stack">
        <h3>Collection</h3>
        <div class="card-grid">
          ${ownedIds.map((id) => {
            const available = state.owned[id] - (deckCounts[id] || 0);
            return renderCard(CARD_BY_ID[id], { count: available, disabled: available <= 0, className: "selectable", action: "add-card" });
          }).join("")}
        </div>
      </aside>
    </div>
  `;
}

function deckStatus(deck) {
  if (deck.cards.length < 7) return { valid: false, message: "Minimum 7 cards" };
  const types = new Set(deck.cards.map((id) => CARD_BY_ID[id].type));
  for (const type of ["Warrior", "Magic", "Biome", "Element Tool"]) {
    if (!types.has(type)) return { valid: false, message: `Needs ${type}` };
  }
  return { valid: true, message: "Legal deck" };
}

function renderGacha() {
  return `
    ${pageHeader("Gacha", "Spend 50 gold to commission a random card from traveling smiths, guild brokers, and border merchants.")}
    <div class="shop-display">
      <div class="feature-art panel"></div>
      <section class="panel section stack">
        <h3>Smith's Guild Draw</h3>
        <p class="muted">Every purchase adds one random card to your collection. Rare cards are not locked away; the strength comes from building a coherent deck.</p>
        <button data-action="buy-gacha" ${state.gold < 50 ? "disabled" : ""}>Buy Random Card - 50 Gold</button>
        <div id="gacha-result">${state.lastGacha ? renderCard(CARD_BY_ID[state.lastGacha], { count: state.owned[state.lastGacha] }) : `<div class="empty">Your next draw will appear here</div>`}</div>
      </section>
    </div>
  `;
}

function renderRewards() {
  const claimed = state.dailyRewardDate === todayKey();
  return `
    ${pageHeader("Daily Reward", "Once per day, claim a free card from a guild courier crossing Amberwood.")}
    <div class="grid-2">
      <section class="panel section stack">
        <h3>Today's Courier</h3>
        <p class="muted">${claimed ? "You have already claimed today's card." : "A sealed card case is waiting at the road lantern."}</p>
        <button data-action="claim-daily" ${claimed ? "disabled" : ""}>Claim Random Card</button>
        <div>${state.lastDaily ? renderCard(CARD_BY_ID[state.lastDaily], { count: state.owned[state.lastDaily] }) : `<div class="empty">Daily card reward</div>`}</div>
      </section>
      <div class="lore-hero panel"></div>
    </div>
  `;
}

function renderMissions() {
  return `
    ${pageHeader("Daily Missions", "Three daily contracts award gold for battle, collection, and guild work.")}
    <div class="grid-3">
      ${state.missions.map((item, index) => `
        <section class="mission-card ${item.progress >= item.target ? "complete" : ""}">
          <h3>${item.title}</h3>
          <p class="muted">${Math.min(item.progress, item.target)} / ${item.target}</p>
          <div class="progress-bar"><span style="width:${Math.min(100, (item.progress / item.target) * 100)}%"></span></div>
          <p>${item.reward} gold</p>
          <button data-action="claim-mission" data-index="${index}" ${item.progress < item.target || item.claimed ? "disabled" : ""}>${item.claimed ? "Claimed" : "Claim Reward"}</button>
        </section>
      `).join("")}
    </div>
  `;
}

function renderLore() {
  return `
    ${pageHeader("Lore", "Grand Dale is a practical fantasy world where every road, pot, bridge, treaty, and duel carries a little magic.")}
    <div class="grid-2">
      <div class="lore-hero panel"></div>
      <section class="lore-block">
        <h3>Grand Dale</h3>
        <p>Grand Dale is a wide world of trade roads, living climates, guarded borders, and practical magic. Every kingdom depends on element smithing: fire tools that do not burn their handles, water vessels that purify rivers, storm craft for signal towers, vine braces for living bridges, and stranger works for survival.</p>
        <p>Beyond Amberwood, most peoples are humanoid animalfolk shaped by their native climates. Their bodies, food, architecture, festivals, clothing, and survival needs belong to their regions, so each border crossing feels like entering another weather-born civilization.</p>
        <p>Amberwood is the adaptable human homeland. Its guild members travel between kingdoms as neutral messengers, caravan guards, quest takers, dispute settlers, and artifact hunters. They are trusted because they can endure many environments and because Grand Dale cannot survive without trade.</p>
        <p>Every person also carries a signature magic ability, a private spark that works without tools. A smith, thief, farmer, healer, ruler, or warrior may each hold one irreplaceable secret.</p>
      </section>
    </div>
  `;
}

function renderBattle() {
  if (!battle) battle = newBattle();
  if (battle.result) return renderResult();
  const playerAdv = advantage(battle.player, battle.opponent, battle.biome).total;
  const oppAdv = advantage(battle.opponent, battle.player, battle.biome).total;
  return `
    ${pageHeader("Battle", "Face a random computer opponent over three scoring turns. Draw two cards each turn, play your hand, use one magic effect, then score advantage.", `<div class="stack"><div class="gold-pill">${state.gold} gold</div><button data-action="new-battle">New Battle</button></div>`)}
    <section class="battle-board">
      ${renderDuelist("player", battle.player, `You: ${playerAdv}`)}
      <div class="battle-center">
        ${renderBiomeBanner()}
        <div class="panel section">
          <h3>Turn ${battle.turn} / 3</h3>
          <div class="scoreline">You ${scorePips(battle.player.points)} <span class="muted">vs</span> ${scorePips(battle.opponent.points)} Opponent</div>
          <p class="muted small">Click cards in hand to play them. A new Warrior or Magic card discards your old one. Any Biome replaces the current biome for both duelists.</p>
          <div class="battle-actions">
            <button data-action="use-magic" ${!canUseMagic() ? "disabled" : ""}>Use Magic Effect</button>
            <button data-action="score-turn">Score Turn</button>
          </div>
        </div>
        <div class="log">${battle.log.slice(-8).map((line) => `<div>${line}</div>`).join("")}</div>
        <div class="panel section">
          <h3>Your Hand</h3>
          <div class="hand-row">${battle.player.hand.length ? battle.player.hand.map((id, index) => renderCard(CARD_BY_ID[id], { className: "hand-card selectable", action: "play-hand", index })).join("") : `<div class="empty">No cards in hand</div>`}</div>
        </div>
      </div>
      ${renderDuelist("opponent", battle.opponent, `${battle.opponent.name}: ${oppAdv}`)}
    </section>
  `;
}

function renderResult() {
  const won = battle.result === "win";
  return `
    <section class="result-screen panel" style="--result-art:url('${won ? "assets/art/victory-screen.png" : "assets/art/defeat-screen.png"}')">
      <div class="result-content">
        <h2>${won ? "Victory" : "You Lose"}</h2>
        <p>${won ? `The guild pays ${battle.reward} gold for your clean win.` : "The road remembers the lesson. Rebuild, redraw, and try again."}</p>
        <div class="scoreline">You ${scorePips(battle.player.points)} <span class="muted">vs</span> ${scorePips(battle.opponent.points)} Opponent</div>
        <div class="toolbar"><button data-action="new-battle">Battle Again</button><button data-page="deck">Adjust Deck</button></div>
      </div>
    </section>
  `;
}

function renderDuelist(side, duelist, title) {
  return `
    <aside class="duelist panel section">
      <h3>${title}</h3>
      <div class="active-zone">${duelist.warrior ? renderCard(CARD_BY_ID[duelist.warrior], {}) : `<div class="empty">No warrior</div>`}</div>
      <div><strong>Magic</strong>${duelist.magic ? renderCard(CARD_BY_ID[duelist.magic], { className: "tool-mini" }) : `<div class="empty">No magic</div>`}</div>
      <div><strong>Tools</strong><div class="tool-row">${duelist.tools.length ? duelist.tools.map((toolItem) => renderCard(CARD_BY_ID[toolItem.id], { className: "tool-mini", elementOverride: toolItem.element })).join("") : `<div class="empty">No equipped tools</div>`}</div></div>
    </aside>
  `;
}

function renderBiomeBanner() {
  if (!battle.biome) return `<div class="biome-banner panel"><div class="biome-art sheet" style="${biomeStyle("Amberwood")}"></div><div class="section"><h3>Open Trade Road</h3><p class="muted">No biome has been claimed yet.</p></div></div>`;
  const card = CARD_BY_ID[battle.biome];
  return `<div class="biome-banner panel"><div class="biome-art sheet" style="${biomeStyle(card.biome)}"></div><div class="section"><h3>${card.name}</h3><p class="muted">${card.text}</p></div></div>`;
}

function renderCard(card, options = {}) {
  const disabled = options.disabled ? "disabled" : "";
  const action = options.action ? `data-action="${options.action}"` : "";
  const id = options.action === "add-card" ? `data-id="${card.id}"` : "";
  const index = options.index !== undefined ? `data-index="${options.index}"` : "";
  const count = options.count !== undefined ? `<span class="count">${options.count}</span>` : "";
  const element = options.elementOverride || card.element;
  return `
    <article class="card ${options.className || ""} ${disabled}" ${action} ${id} ${index}>
      ${count}
      <div class="${card.type === "Biome" ? "biome-art sheet" : "card-art sheet"}" style="${card.type === "Biome" ? biomeStyle(card.biome) : cardStyle(card.art)}"></div>
      <div class="card-body">
        <div class="card-name">${card.name}</div>
        <div class="card-meta">
          <span class="tag">${card.type}</span>
          ${element ? `<span class="tag">${element}</span>` : ""}
          ${card.biomePref ? `<span class="tag">${card.biomePref}</span>` : ""}
          ${card.biome ? `<span class="tag">${card.biome}</span>` : ""}
        </div>
        <div class="muted small">${card.text}</div>
      </div>
    </article>
  `;
}

function cardStyle(key) {
  const [x, y] = CARD_ART[key] || CARD_ART.compass;
  return `background-position:${(x / 3) * 100}% ${(y / 2) * 100}%`;
}

function biomeStyle(key) {
  const [x, y] = BIOME_ART[key] || BIOME_ART.Amberwood;
  return `background-position:${(x / 3) * 100}% ${y * 100}%`;
}

function scorePips(points) {
  return `<span class="scoreline">${[0, 1, 2].map((i) => `<span class="pip ${i < points ? "on" : ""}"></span>`).join("")}</span>`;
}

function newBattle() {
  const playerDeck = shuffle(expandDeck(getActiveDeck().cards));
  const opponentDeck = shuffle(makeAiDeck());
  const player = makeDuelist("Player", playerDeck);
  const opponent = makeDuelist(randomItem(["Ironfang Raider", "Mistlock Envoy", "Stonegate Captain", "Skygrass Challenger"]), opponentDeck);
  const next = { turn: 1, biome: null, player, opponent, log: [], result: null, reward: 0 };
  battle = next;
  startTurn();
  next.log.unshift(`${player.name} faces ${opponent.name}. Both warriors step onto the road.`);
  return next;
}

function expandDeck(cards) {
  return cards.slice();
}

function makeAiDeck() {
  return [
    pickByType("Warrior"), pickByType("Warrior"), pickByType("Magic"), pickByType("Biome"),
    pickByType("Element Tool"), pickByType("Element Tool"), ...randomCards(7),
  ];
}

function makeDuelist(name, deck) {
  const warriors = deck.filter((id) => CARD_BY_ID[id].type === "Warrior");
  const warrior = randomItem(warriors);
  deck.splice(deck.indexOf(warrior), 1);
  return { name, deck, discard: [], hand: [], warrior, magic: null, tools: [], points: 0, magicUsed: false };
}

function startTurn() {
  ["player", "opponent"].forEach((side) => drawCards(battle[side], 2));
  battle.player.magicUsed = false;
  battle.opponent.magicUsed = false;
  playSfx("draw");
}

function drawCards(duelist, count, type = null) {
  for (let i = 0; i < count; i++) {
    const index = type ? duelist.deck.findIndex((id) => CARD_BY_ID[id].type === type) : 0;
    if (index < 0 || !duelist.deck.length) return;
    const [id] = duelist.deck.splice(index, 1);
    duelist.hand.push(id);
  }
}

function playCard(side, index) {
  const duelist = battle[side];
  const [id] = duelist.hand.splice(index, 1);
  const card = CARD_BY_ID[id];
  if (card.type === "Warrior") {
    if (duelist.warrior) duelist.discard.push(duelist.warrior);
    duelist.warrior = id;
    battle.log.unshift(`${duelist.name} sends out ${card.name}.`);
    playSfx(side === "player" ? "playWarrior" : "aiPlayWarrior");
  } else if (card.type === "Magic") {
    if (duelist.magic) duelist.discard.push(duelist.magic);
    duelist.magic = id;
    duelist.magicUsed = false;
    battle.log.unshift(`${duelist.name} prepares ${card.name}.`);
    track(side === "player" ? "magicPlayed" : "none");
    playSfx(side === "player" ? "playMagic" : "aiPlayMagic");
  } else if (card.type === "Element Tool") {
    duelist.tools.push({ id, element: card.element });
    battle.log.unshift(`${duelist.name} equips ${card.name}.`);
    track(side === "player" ? "toolsPlayed" : "none");
    playSfx(side === "player" ? "playTool" : "aiPlayTool");
  } else if (card.type === "Biome") {
    if (battle.biome) battle.player.discard.push(battle.biome);
    battle.biome = id;
    battle.log.unshift(`${duelist.name} claims ${card.name}.`);
    track(side === "player" ? "biomesPlayed" : "none");
    playSfx(side === "player" ? "playBiome" : "aiPlayBiome");
  }
}

function canUseMagic() {
  return battle?.player.magic && !battle.player.magicUsed;
}

function useMagic(side) {
  const duelist = battle[side];
  if (!duelist.magic || duelist.magicUsed) return;
  duelist.magicUsed = true;
  const card = CARD_BY_ID[duelist.magic];
  if (card.effect === "shiftTool" && duelist.tools.length) {
    const toolItem = randomItem(duelist.tools);
    toolItem.element = randomItem(ELEMENTS);
    battle.log.unshift(`${duelist.name} reforges a tool into ${toolItem.element}.`);
  } else if (card.effect === "shiftBiome") {
    battle.biome = randomItem(CARDS.filter((item) => item.type === "Biome")).id;
    battle.log.unshift(`${duelist.name} shifts the biome to ${CARD_BY_ID[battle.biome].name}.`);
  } else if (card.effect === "drawMagic") {
    drawCards(duelist, 1, "Magic");
    battle.log.unshift(`${duelist.name} draws a magic card.`);
  } else if (card.effect === "drawTool") {
    drawCards(duelist, 1, "Element Tool");
    battle.log.unshift(`${duelist.name} draws an elemental tool.`);
  } else if (card.effect === "drawWarrior") {
    drawCards(duelist, 1, "Warrior");
    battle.log.unshift(`${duelist.name} draws a warrior.`);
  } else if (card.effect === "reclaim" && duelist.discard.length) {
    duelist.hand.push(duelist.discard.splice(Math.floor(Math.random() * duelist.discard.length), 1)[0]);
    battle.log.unshift(`${duelist.name} returns a discarded card to hand.`);
  } else {
    drawCards(duelist, 1);
    battle.log.unshift(`${duelist.name}'s magic finds the next useful card.`);
  }
  playSfx(side === "player" ? "magicEffect" : "aiMagicEffect");
}

function aiTurn() {
  const ai = battle.opponent;
  let plays = Math.min(3, ai.hand.length);
  while (plays-- > 0 && ai.hand.length) {
    const index = Math.floor(Math.random() * ai.hand.length);
    playCard("opponent", index);
  }
  if (ai.magic && Math.random() > 0.35) useMagic("opponent");
}

function scoreTurn() {
  aiTurn();
  const player = advantage(battle.player, battle.opponent, battle.biome);
  const opponent = advantage(battle.opponent, battle.player, battle.biome);
  if (player.total > opponent.total) {
    battle.player.points += 1;
    track("pointsScored");
    battle.log.unshift(`You win the exchange ${player.total} to ${opponent.total}.`);
    playSfx("score");
  } else if (opponent.total > player.total) {
    battle.opponent.points += 1;
    battle.log.unshift(`${battle.opponent.name} wins the exchange ${opponent.total} to ${player.total}.`);
    playSfx("discard");
  } else {
    battle.log.unshift(`The exchange ties at ${player.total}. No point awarded.`);
    playSfx("tie");
  }
  if (battle.turn >= 3) finishBattle();
  else {
    battle.turn += 1;
    startTurn();
  }
}

function finishBattle() {
  state.stats.battles += 1;
  track("battles");
  const won = battle.player.points > battle.opponent.points;
  battle.result = won ? "win" : "lose";
  if (won) {
    battle.reward = 55 + Math.floor(Math.random() * 36);
    state.gold += battle.reward;
    state.stats.wins += 1;
    track("wins");
    playSfx("victory");
  } else {
    playSfx("defeat");
  }
  saveState();
}

function advantage(duelist, opponent, biomeId) {
  let total = duelist.warrior ? 1 : 0;
  const details = [];
  const warriorCard = CARD_BY_ID[duelist.warrior];
  const biomeCard = biomeId ? CARD_BY_ID[biomeId] : null;
  if (warriorCard && biomeCard?.biome === warriorCard.biomePref) {
    total += 1;
    details.push("preferred biome");
  }
  duelist.tools.forEach((toolItem) => {
    total += 1;
    if (warriorCard?.element === toolItem.element) total += 1;
    opponent.tools.forEach((oppTool) => {
      if (BEATS[toolItem.element]?.includes(oppTool.element)) total += 1;
      if (BEATS[oppTool.element]?.includes(toolItem.element)) total -= 1;
    });
  });
  return { total, details };
}

function getActiveDeck() {
  return getDeck(state.activeDeckId);
}

function getDeck(id) {
  return state.decks.find((deck) => deck.id === id);
}

function countIds(ids) {
  return ids.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
}

function addOwned(id) {
  state.owned[id] = (state.owned[id] || 0) + 1;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setupMusic() {
  const src = MUSIC[page] || MUSIC.lore;
  if (!audio) {
    audio = new Audio(src);
    audio.loop = true;
  }
  if (!audio.src.endsWith(src)) {
    audio.src = src;
    audio.load();
  }
  audio.volume = state.audio.music;
  if (state.audio.enabled && musicUnlocked) audio.play().catch(() => {});
}

function unlockAudio() {
  musicUnlocked = true;
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  setupMusic();
}

function playSfx(name) {
  if (!state.audio.sfx) return;
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  const pattern = SFX_PATTERNS[name] || SFX_PATTERNS.nav;
  const now = audioCtx.currentTime;
  pattern.forEach((midi, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = index % 2 ? "triangle" : "square";
    osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    gain.gain.setValueAtTime(0.0001, now + index * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.06 * state.audio.sfx, now + index * 0.07 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 0.12);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now + index * 0.07);
    osc.stop(now + index * 0.07 + 0.13);
  });
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("button, article[data-action]");
  if (!target) return;
  unlockAudio();
  const pageTarget = target.dataset.page;
  const action = target.dataset.action;
  if (pageTarget) {
    page = pageTarget;
    location.hash = page;
    playSfx("nav");
    render();
    return;
  }
  const deck = getDeck(selectedDeckId);
  if (action === "toggle-music") {
    state.audio.enabled = !state.audio.enabled;
    state.audio.enabled ? audio.play().catch(() => {}) : audio.pause();
    playSfx("musicToggle");
  }
  if (action === "add-card") {
    const id = target.dataset.id;
    const counts = countIds(deck.cards);
    if ((state.owned[id] || 0) > (counts[id] || 0)) {
      deck.cards.push(id);
      playSfx("deckAdd");
    } else playSfx("error");
  }
  if (action === "remove-card") {
    deck.cards.splice(Number(target.dataset.index), 1);
    playSfx("deckRemove");
  }
  if (action === "new-deck") {
    const newDeck = { id: `deck-${Date.now()}`, name: `Guild Deck ${state.decks.length + 1}`, cards: makeStarterDeck().filter((id) => state.owned[id]) };
    state.decks.push(newDeck);
    selectedDeckId = newDeck.id;
    playSfx("deckNew");
  }
  if (action === "set-active" && deckStatus(deck).valid) {
    state.activeDeckId = deck.id;
    battle = null;
    playSfx("deckActive");
  }
  if (action === "rename-deck") {
    const name = prompt("Deck name", deck.name);
    if (name?.trim()) deck.name = name.trim().slice(0, 32);
    playSfx("deckRename");
  }
  if (action === "clear-deck") {
    deck.cards = [];
    playSfx("deckClear");
  }
  if (action === "buy-gacha" && state.gold >= 50) {
    state.gold -= 50;
    const id = randomItem(CARDS).id;
    addOwned(id);
    state.lastGacha = id;
    state.stats.cardsBought += 1;
    track("gachaBought");
    playSfx("gacha");
  }
  if (action === "claim-daily" && state.dailyRewardDate !== todayKey()) {
    const id = randomItem(CARDS).id;
    addOwned(id);
    state.lastDaily = id;
    state.dailyRewardDate = todayKey();
    state.stats.dailyClaims += 1;
    track("dailyClaimed");
    playSfx("daily");
  }
  if (action === "claim-mission") {
    const missionItem = state.missions[Number(target.dataset.index)];
    if (missionItem && missionItem.progress >= missionItem.target && !missionItem.claimed) {
      missionItem.claimed = true;
      state.gold += missionItem.reward;
      playSfx("mission");
    }
  }
  if (action === "new-battle") {
    battle = newBattle();
    playSfx("playWarrior");
  }
  if (action === "play-hand") {
    playCard("player", Number(target.dataset.index));
  }
  if (action === "use-magic") useMagic("player");
  if (action === "score-turn") scoreTurn();
  saveState();
  render();
});

app.addEventListener("input", (event) => {
  const action = event.target.dataset.action;
  if (action === "music-volume") {
    state.audio.music = Number(event.target.value);
    if (audio) audio.volume = state.audio.music;
  }
  if (action === "sfx-volume") {
    state.audio.sfx = Number(event.target.value);
    playSfx("nav");
  }
  saveState();
  render();
});

app.addEventListener("change", (event) => {
  if (event.target.dataset.action === "select-deck") {
    selectedDeckId = event.target.value;
    playSfx("nav");
    render();
  }
});

window.addEventListener("hashchange", () => {
  page = location.hash.replace("#", "") || "battle";
  render();
});

window.render_game_to_text = () => JSON.stringify({
  page,
  gold: state.gold,
  music: { enabled: state.audio.enabled, volume: state.audio.music },
  sfxVolume: state.audio.sfx,
  activeDeck: getActiveDeck()?.name,
  battle: battle ? {
    turn: battle.turn,
    result: battle.result,
    biome: battle.biome ? CARD_BY_ID[battle.biome].name : null,
    player: { points: battle.player.points, hand: battle.player.hand.length, warrior: CARD_BY_ID[battle.player.warrior]?.name, tools: battle.player.tools.length, magic: battle.player.magic ? CARD_BY_ID[battle.player.magic].name : null },
    opponent: { points: battle.opponent.points, warrior: CARD_BY_ID[battle.opponent.warrior]?.name, tools: battle.opponent.tools.length },
  } : null,
});

window.advanceTime = () => {};

render();
