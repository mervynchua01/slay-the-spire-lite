/*The foundation of the game. Contains all game constants, the central state object, and reset functions. */

/* ---------------------------CONSTANTS ---------------------------*/
const WIN_LEVEL = 10;
const STARTING_HEALTH = 80;
const STARTING_MAX_HEALTH = 80;
const STARTING_ENERGY = 3;
const HAND_SIZE = 5;

const STARTER_DECK = [
  "strike",
  "strike",
  "strike",
  "strike",
  "strike",
  "defend",
  "defend",
  "defend",
  "defend",
  "bash",
];


/* ---------------------------GAME STATE ---------------------------*/
const state = {
  player: {
    name: "Player",
    level: 1,
    currentHealth: STARTING_HEALTH,
    maxHealth: STARTING_MAX_HEALTH,
    currentEnergy: STARTING_ENERGY,
    maxEnergy: STARTING_ENERGY,
    block: 0,
  },
  monster: null,
  playerDeck: [...STARTER_DECK],
  drawPile: [],
  hand: [],
  discardPile: [],
  exhaustPile: [],
  currentTurn: "player",
  gamePhase: "combat",
  monsterJustTookDamage: false,
  monsterDamageAmount: 0,
  playerJustTookDamage: false,
  playerDamageAmount: 0,
};

/* ---------------------------UTILITY FUNCTIONS ---------------------------*/
function shuffleArray(array) {  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* ---------------------------RESET FUNCTIONS ---------------------------*/

function resetDeck() {
  state.drawPile = [...state.playerDeck];
  shuffleArray(state.drawPile);
  state.hand = [];
  state.discardPile = [];
  state.exhaustPile = [];
}

function resetGame() {
  state.player.level = 1;
  state.player.currentHealth = STARTING_HEALTH;
  state.player.maxHealth = STARTING_MAX_HEALTH;
  state.player.currentEnergy = STARTING_ENERGY;
  state.player.maxEnergy = STARTING_ENERGY;
  state.player.block = 0;

  state.monster = null;
  state.currentTurn = "player";
  state.gamePhase = "combat";

  state.playerDeck = [...STARTER_DECK];
  resetDeck();
}

function resetCombat(monster) {
  state.monster = monster;
  state.gamePhase = "combat";
  state.currentTurn = "player";

  resetDeck();
}

/* ---------------------------EXPORTS ---------------------------*/
export {
  WIN_LEVEL,
  STARTING_HEALTH,
  STARTING_ENERGY,
  HAND_SIZE,
  STARTER_DECK,
  state,
  shuffleArray,
  resetGame,
  resetCombat,
};
