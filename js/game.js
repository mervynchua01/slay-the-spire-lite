/*-------------------------------- Constants --------------------------------*/
const WIN_LEVEL = 10;
const STARTING_HEALTH = 80;
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

/*---------------------------- Variables (state) ----------------------------*/

const state = {
  player: {
    name: "Player",
    level: 1,
    currentHealth: STARTING_HEALTH,
    maxHealth: STARTING_HEALTH,
    currentEnergy: STARTING_ENERGY,
    maxEnergy: STARTING_ENERGY,
    block: 0,
  },
  monster: {
    name: "Goblin",
    currentHealth: 20,
    maxHealth: 20,
    damage: 6,
    intent: "attack",
  },
  deck: [...STARTER_DECK],
  drawPile: [],
  hand: [],
  discardPile: [],
  currentTurn: "player",
  gamePhase: "combat", // 'combat', 'victory', 'defeat', 'gameWon'
};

/*-------------------------------- Functions --------------------------------*/

// Overall game functions
function checkWin() {
  if (state.player.level >= WIN_LEVEL) {
    state.gamePhase = "gameWon";
    console.log("CONGRATS! You won the game!");
    return true;
  }
  return false;
}

function checkLose() {
  if (state.player.currentHealth <= 0) {
    state.gamePhase = "defeat";
    console.log("GAME OVER! Your hp went to 0!");
    return true;
  }
  return false;
}

// Battle functions
function checkMonsterDead() {
  if (state.monster.currentHealth <= 0) {
    state.gamePhase = "victory";
    console.log("Monster defeated!");
    return true;
  }
  return false;
}

function handleVictory() {
  state.player.level += 1;
  console.log(`Level up! Now level ${state.player.level}`);

  if (checkWin()) return;

  // Future: card rewards, deckbuilding
  resetCombat();
}

function handleDefeat() {
  state.gamePhase = "defeat";
  console.log("You have been defeated.");
  // Future: show defeat screen, offer restart
}

// Reset Functions
function resetGame() {
  state.player.level = 1;
  state.player.currentHealth = STARTING_HEALTH;
  state.player.maxHealth = STARTING_HEALTH;
  state.player.currentEnergy = STARTING_ENERGY;
  state.player.maxEnergy = STARTING_ENERGY;
  state.player.block = 0;

  state.deck = [...STARTER_DECK];
  state.drawPile = [];
  state.hand = [];
  state.discardPile = [];

  state.gamePhase = "combat";
  state.currentTurn = "player";
}

function resetCombat() {
  state.player.currentEnergy = state.player.maxEnergy;
  state.player.block = 0;

  // Note: state.monster will be set by monsters.js via spawnMonster()

  state.drawPile = [...state.deck];
  state.hand = [];
  state.discardPile = [];

  state.currentTurn = "player";
  state.gamePhase = "combat";
}

/*-------------------------------- Exports --------------------------------*/

export {
  WIN_LEVEL,
  STARTING_ENERGY,
  HAND_SIZE,
  state,
  checkWin,
  checkLose,
  checkMonsterDead,
  handleVictory,
  handleDefeat,
  resetGame,
  resetCombat,
};
