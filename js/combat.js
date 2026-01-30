/* Manages the combat flow: turn management, monster behavior, and win/lose conditions. Contains monster data, damage calculations, and the game loop for combat (player turn → enemy turn → repeat). */

import { state, WIN_LEVEL, HAND_SIZE } from "./state.js";
import { drawCards, discardHand } from "./cards.js";

/* ---------------------------MONSTER DATA ---------------------------*/
const MONSTER_DATA = {
  // ===== SLIMES =====
  acid_slime_large: {
    sprite: "",
    name: "Acid Slime (L)",
    health: 65,
    maxHealth: 65,
    block: 0,
    moveset: [
      {
        name: "Corrosive Spit",
        chance: 0.3,
        value: 7,
        type: "attack",
        intentIcon: "🤢",
        debuff: "weak",
        debuffAmount: 2,
        description: "Deals 7 damage and applies 2 Weak",
      },
      {
        name: "Tackle",
        chance: 0.4,
        value: 16,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 16 damage",
      },
      {
        name: "Lick",
        chance: 0.3,
        value: 0,
        type: "debuff",
        intentIcon: "👅",
        debuff: "frail",
        debuffAmount: 2,
        description: "Applies 2 Frail",
      },
    ],
  },

  acid_slime_medium: {
    sprite: "",
    name: "Acid Slime (M)",
    health: 28,
    maxHealth: 28,
    block: 0,
    moveset: [
      {
        name: "Corrosive Spit",
        chance: 0.4,
        value: 7,
        type: "attack",
        intentIcon: "🤢",
        debuff: "weak",
        debuffAmount: 1,
        description: "Deals 7 damage and applies 1 Weak",
      },
      {
        name: "Tackle",
        chance: 0.4,
        value: 10,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 10 damage",
      },
      {
        name: "Lick",
        chance: 0.2,
        value: 0,
        type: "debuff",
        intentIcon: "👅",
        debuff: "frail",
        debuffAmount: 1,
        description: "Applies 1 Frail",
      },
    ],
  },

  acid_slime_small: {
    sprite: "",
    name: "Acid Slime (S)",
    health: 8,
    maxHealth: 8,
    block: 0,
    moveset: [
      {
        name: "Tackle",
        chance: 1.0,
        value: 3,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 3 damage",
      },
    ],
  },

  spike_slime_large: {
    sprite: "🦠",
    name: "Spike Slime (L)",
    health: 64,
    maxHealth: 64,
    block: 0,
    moveset: [
      {
        name: "Flame Tackle",
        chance: 0.3,
        value: 16,
        type: "attack",
        intentIcon: "🔥",
        addCard: "slimed",
        addCardAmount: 2,
        description: "Deals 16 damage and adds 2 Slimed",
      },
      {
        name: "Lick",
        chance: 0.4,
        value: 0,
        type: "debuff",
        intentIcon: "👅",
        debuff: "frail",
        debuffAmount: 2,
        description: "Applies 2 Frail",
      },
      {
        name: "Tackle",
        chance: 0.3,
        value: 16,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 16 damage",
      },
    ],
  },

  spike_slime_medium: {
    sprite: "",
    name: "Spike Slime (M)",
    health: 28,
    maxHealth: 28,
    block: 0,
    moveset: [
      {
        name: "Flame Tackle",
        chance: 0.3,
        value: 8,
        type: "attack",
        intentIcon: "🔥",
        addCard: "slimed",
        addCardAmount: 1,
        description: "Deals 8 damage and adds 1 Slimed",
      },
      {
        name: "Lick",
        chance: 0.4,
        value: 0,
        type: "debuff",
        intentIcon: "👅",
        debuff: "frail",
        debuffAmount: 1,
        description: "Applies 1 Frail",
      },
      {
        name: "Tackle",
        chance: 0.3,
        value: 10,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 10 damage",
      },
    ],
  },

  spike_slime_small: {
    sprite: "",
    name: "Spike Slime (S)",
    health: 10,
    maxHealth: 10,
    block: 0,
    moveset: [
      {
        name: "Tackle",
        chance: 1.0,
        value: 5,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 5 damage",
      },
    ],
  },

  // ===== LOUSES =====
  red_louse: {
    sprite: "",
    name: "Red Louse",
    health: 10,
    maxHealth: 10,
    block: 0,
    moveset: [
      {
        name: "Bite",
        chance: 0.75,
        value: 5,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 5 damage",
      },
      {
        name: "Grow",
        chance: 0.25,
        value: 0,
        type: "buff",
        intentIcon: "💪",
        buffType: "strength",
        buffAmount: 3,
        description: "Gains 3 Strength",
      },
    ],
  },

  green_louse: {
    sprite: "",
    name: "Green Louse",
    health: 11,
    maxHealth: 11,
    block: 0,
    moveset: [
      {
        name: "Bite",
        chance: 0.75,
        value: 5,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 5 damage",
      },
      {
        name: "Spit Web",
        chance: 0.25,
        value: 0,
        type: "debuff",
        intentIcon: "🕸️",
        debuff: "weak",
        debuffAmount: 2,
        description: "Applies 2 Weak",
      },
    ],
  },

  // ===== JAW WORM =====
  jaw_worm: {
    sprite: "",
    name: "Jaw Worm",
    health: 44,
    maxHealth: 44,
    block: 0,
    moveset: [
      {
        name: "Chomp",
        chance: 0.25,
        value: 11,
        type: "attack",
        intentIcon: "⚠️",
        description: "Deals 11 damage",
      },
      {
        name: "Bellow",
        chance: 0.3,
        value: 0,
        type: "buff",
        intentIcon: "💪",
        buffType: "strength",
        buffAmount: 3,
        blockGain: 6,
        description: "Gains 3 Strength and 6 Block",
      },
      {
        name: "Thrash",
        chance: 0.45,
        value: 7,
        type: "attack",
        intentIcon: "🛡️",
        blockGain: 5,
        description: "Deals 7 damage and gains 5 Block",
      },
    ],
  },

  // ===== CULTIST =====
  cultist: {
    sprite: "",
    name: "Cultist",
    health: 48,
    maxHealth: 48,
    block: 0,
    moveset: [
      {
        name: "Incantation",
        chance: 0.25,
        value: 0,
        type: "buff",
        intentIcon: "✨",
        buffType: "ritual",
        buffAmount: 3,
        description: "Gains 3 Ritual",
      },
      {
        name: "Dark Strike",
        chance: 0.75,
        value: 6,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 6 damage",
      },
    ],
  },

  // ===== GREMLINS =====
  fat_gremlin: {
    sprite: "",
    name: "Fat Gremlin",
    health: 13,
    maxHealth: 13,
    block: 0,
    moveset: [
      {
        name: "Smash",
        chance: 1.0,
        value: 4,
        type: "attack",
        intentIcon: "🤢",
        debuff: "weak",
        debuffAmount: 1,
        description: "Deals 4 damage and applies 1 Weak",
      },
    ],
  },

  mad_gremlin: {
    sprite: "",
    name: "Mad Gremlin",
    health: 20,
    maxHealth: 20,
    block: 0,
    moveset: [
      {
        name: "Scratch",
        chance: 1.0,
        value: 4,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 4 damage",
      },
    ],
  },

  shield_gremlin: {
    sprite: "",
    name: "Shield Gremlin",
    health: 12,
    maxHealth: 12,
    block: 0,
    moveset: [
      {
        name: "Protect",
        chance: 0.6,
        value: 0,
        type: "buff",
        intentIcon: "🛡️",
        blockGain: 7,
        description: "Gains 7 Block",
      },
      {
        name: "Shield Bash",
        chance: 0.4,
        value: 6,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 6 damage",
      },
    ],
  },

  sneaky_gremlin: {
    sprite: "",
    name: "Sneaky Gremlin",
    health: 10,
    maxHealth: 10,
    block: 0,
    moveset: [
      {
        name: "Puncture",
        chance: 1.0,
        value: 9,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 9 damage",
      },
    ],
  },

  gremlin_wizard: {
    sprite: "",
    name: "Gremlin Wizard",
    health: 23,
    maxHealth: 23,
    block: 0,
    moveset: [
      {
        name: "Charging",
        chance: 0.6,
        value: 0,
        type: "buff",
        intentIcon: "🔮",
        description: "Charging up power",
      },
      {
        name: "Ultimate Blast",
        chance: 0.4,
        value: 25,
        type: "attack",
        intentIcon: "💥",
        description: "Deals 25 damage",
      },
    ],
  },

  // ===== SLAVERS =====
  blue_slaver: {
    sprite: "",
    name: "Blue Slaver",
    health: 46,
    maxHealth: 46,
    block: 0,
    moveset: [
      {
        name: "Stab",
        chance: 0.4,
        value: 12,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 12 damage",
      },
      {
        name: "Rake",
        chance: 0.6,
        value: 7,
        type: "attack",
        intentIcon: "🤢",
        debuff: "weak",
        debuffAmount: 1,
        description: "Deals 7 damage and applies 1 Weak",
      },
    ],
  },

  red_slaver: {
    sprite: "",
    name: "Red Slaver",
    health: 46,
    maxHealth: 46,
    block: 0,
    moveset: [
      {
        name: "Stab",
        chance: 0.4,
        value: 13,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 13 damage",
      },
      {
        name: "Scrape",
        chance: 0.6,
        value: 8,
        type: "attack",
        intentIcon: "💢",
        debuff: "vulnerable",
        debuffAmount: 1,
        description: "Deals 8 damage and applies 1 Vulnerable",
      },
    ],
  },

  // ===== FUNGI BEAST =====
  fungi_beast: {
    sprite: "",
    name: "Fungi Beast",
    health: 22,
    maxHealth: 22,
    block: 0,
    moveset: [
      {
        name: "Bite",
        chance: 0.6,
        value: 6,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 6 damage",
      },
      {
        name: "Grow",
        chance: 0.4,
        value: 0,
        type: "buff",
        intentIcon: "💪",
        buffType: "strength",
        buffAmount: 3,
        description: "Gains 3 Strength",
      },
    ],
  },

  // ===== LOOTER =====
  looter: {
    sprite: "",
    name: "Looter",
    health: 44,
    maxHealth: 44,
    block: 0,
    moveset: [
      {
        name: "Mug",
        chance: 0.55,
        value: 10,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 10 damage",
      },
      {
        name: "Lunge",
        chance: 0.25,
        value: 12,
        type: "attack",
        intentIcon: "⚠️",
        description: "Deals 12 damage",
      },
      {
        name: "Smoke Bomb",
        chance: 0.2,
        value: 0,
        type: "special",
        intentIcon: "💨",
        description: "Escapes from battle",
      },
    ],
  },

  // ===== ELITES =====
  gremlin_nob: {
    sprite: "",
    name: "Gremlin Nob",
    health: 82,
    maxHealth: 82,
    block: 0,
    elite: true,
    moveset: [
      {
        name: "Bellow",
        chance: 0.2,
        value: 0,
        type: "buff",
        intentIcon: "🤬",
        buffType: "strength",
        buffAmount: 2,
        blockGain: 9,
        description: "Gains 2 Strength and 9 Block",
      },
      {
        name: "Skull Bash",
        chance: 0.4,
        value: 6,
        type: "attack",
        intentIcon: "💢",
        debuff: "vulnerable",
        debuffAmount: 2,
        description: "Deals 6 damage and applies 2 Vulnerable",
      },
      {
        name: "Rush",
        chance: 0.4,
        value: 14,
        type: "attack",
        intentIcon: "⚠️",
        description: "Deals 14 damage",
      },
    ],
  },

  lagavulin: {
    sprite: "",
    name: "Lagavulin",
    health: 109,
    maxHealth: 109,
    block: 0,
    elite: true,
    moveset: [
      {
        name: "Stunned",
        chance: 0.2,
        value: 0,
        type: "special",
        intentIcon: "💤",
        description: "Zzz...",
      },
      {
        name: "Siphon Soul",
        chance: 0.4,
        value: 0,
        type: "debuff",
        intentIcon: "📉",
        debuff: "dexterity_down",
        debuffAmount: 1,
        description: "Reduces Dexterity by 1",
      },
      {
        name: "Attack",
        chance: 0.4,
        value: 18,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 18 damage",
      },
    ],
  },

  sentries: {
    sprite: "",
    name: "Sentry",
    health: 38,
    maxHealth: 38,
    block: 0,
    elite: true,
    moveset: [
      {
        name: "Beam",
        chance: 0.5,
        value: 9,
        type: "attack",
        intentIcon: "🔥",
        addCard: "dazed",
        addCardAmount: 1,
        description: "Deals 9 damage and adds 1 Dazed",
      },
      {
        name: "Bolt",
        chance: 0.5,
        value: 9,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 9 damage",
      },
    ],
  },

  // ===== BOSSES =====
  slime_boss: {
    sprite: "",
    name: "Slime Boss",
    health: 140,
    maxHealth: 140,
    block: 0,
    boss: true,
    moveset: [
      {
        name: "Preparing",
        chance: 0.1,
        value: 0,
        type: "buff",
        intentIcon: "⏳",
        description: "Preparing...",
      },
      {
        name: "Slam",
        chance: 0.3,
        value: 35,
        type: "attack",
        intentIcon: "⚠️",
        description: "Deals 35 damage",
      },
      {
        name: "Corrosive Spit",
        chance: 0.3,
        value: 11,
        type: "attack",
        intentIcon: "🤢",
        addCard: "slimed",
        addCardAmount: 3,
        description: "Deals 11 damage and adds 3 Slimed",
      },
      {
        name: "Lick",
        chance: 0.3,
        value: 0,
        type: "debuff",
        intentIcon: "👅",
        debuff: "weak",
        debuffAmount: 2,
        description: "Applies 2 Weak",
      },
    ],
  },

  hexaghost: {
    sprite: "",
    name: "Hexaghost",
    health: 250,
    maxHealth: 250,
    block: 0,
    boss: true,
    moveset: [
      {
        name: "Activate",
        chance: 0.1,
        value: 0,
        type: "buff",
        intentIcon: "✨",
        buffType: "strength",
        buffAmount: 2,
        description: "Gains 2 Strength",
      },
      {
        name: "Divider",
        chance: 0.15,
        value: 35,
        type: "attack",
        intentIcon: "💥",
        description: "Deals 35 damage",
      },
      {
        name: "Sear",
        chance: 0.3,
        value: 6,
        type: "attack",
        intentIcon: "🔥",
        addCard: "burn",
        addCardAmount: 1,
        description: "Deals 6 damage and adds 1 Burn",
      },
      {
        name: "Tackle",
        chance: 0.25,
        value: 10,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 10 damage twice",
      },
      {
        name: "Inflame",
        chance: 0.2,
        value: 0,
        type: "buff",
        intentIcon: "💪",
        buffType: "strength",
        buffAmount: 2,
        blockGain: 12,
        description: "Gains 2 Strength and 12 Block",
      },
    ],
  },

  the_guardian: {
    sprite: "",
    name: "The Guardian",
    health: 240,
    maxHealth: 240,
    block: 0,
    boss: true,
    moveset: [
      {
        name: "Charging Up",
        chance: 0.1,
        value: 0,
        type: "buff",
        intentIcon: "🛡️",
        blockGain: 9,
        description: "Gains 9 Block",
      },
      {
        name: "Fierce Bash",
        chance: 0.2,
        value: 32,
        type: "attack",
        intentIcon: "⚠️",
        description: "Deals 32 damage",
      },
      {
        name: "Vent Steam",
        chance: 0.15,
        value: 0,
        type: "debuff",
        intentIcon: "💨",
        debuff: "weak",
        debuffAmount: 2,
        description: "Applies 2 Weak and 2 Vulnerable",
      },
      {
        name: "Whirlwind",
        chance: 0.2,
        value: 20,
        type: "attack",
        intentIcon: "💥",
        description: "Deals 20 damage",
      },
      {
        name: "Defensive Mode",
        chance: 0.15,
        value: 0,
        type: "buff",
        intentIcon: "🛡️",
        blockGain: 9,
        description: "Gains 9 Block",
      },
      {
        name: "Roll Attack",
        chance: 0.1,
        value: 9,
        type: "attack",
        intentIcon: "⚔️",
        description: "Deals 9 damage",
      },
      {
        name: "Twin Slam",
        chance: 0.1,
        value: 16,
        type: "attack",
        intentIcon: "💢",
        description: "Deals 16 damage twice",
      },
    ],
  },
};

const ENCOUNTER_POOLS = {
  easy: ["spike_slime_large", "spike_slime_large"],
  normal: ["jaw_worm", "cultist", "blue_slaver", "red_slaver", "fungi_beast"],
  elites: ["gremlin_nob", "lagavulin", "sentries"],
  bosses: ["slime_boss", "hexaghost", "the_guardian"],
};


/* ---------------------------MONSTER FUNCTIONS ---------------------------*/
function getMonsterDifficulty(currentLevel) {
  let difficulty = "";

  if (currentLevel <= 3) {
    difficulty = "easy";
  } else if (currentLevel <= 6) {
    difficulty = "normal";
  } else if (currentLevel <= 9) {
    difficulty = "elites";
  } else if (currentLevel === 10) {
    difficulty = "bosses";
  }

  return spawnMonster(difficulty);
}

function spawnMonster(difficulty) {
    const pool = ENCOUNTER_POOLS[difficulty];
    const randomGenerator = pool[Math.floor(Math.random() * pool.length)];
    const monsterTemplate = MONSTER_DATA[randomGenerator];
    const monster = JSON.parse(JSON.stringify(monsterTemplate));

    monster.currentIntent = monsterIntent(monster);

    return monster;
  }

// Randomise the intent
function monsterIntent(monster) {
  const roll = Math.random();
  let cumulativeChance = 0;

  for (const move of monster.moveset) {
    cumulativeChance += move.chance;

    if (roll < cumulativeChance) {
      return move;
    }
  }
}

// Execute the intent, detail down each intent
function executeIntent(monster) {
  const intent = monster.currentIntent;

  switch (intent.type) {
    case 'attack':
      monsterAttack(monster, intent);
      break;

    case 'debuff':
      applyMonsterDebuff(monster, intent);
      break;

    case 'buff':
      applyMonsterBuff(monster, intent);
      break;
  }
}


function monsterAttack(monster, intent) {
  const damage = intent.value;
  const blocked = Math.min(state.player.block, damage);
  const actualDamage = damage - blocked;

  state.player.block -= blocked;
  state.player.currentHealth -= actualDamage;
  if (actualDamage > 0) state.playerJustTookDamage = true;
  state.playerDamageAmount = actualDamage;

  console.log(`${monster.name} attacks for ${damage}! Blocked ${blocked}, took ${actualDamage} damage.`);

  // Handle monster gaining block during attack (e.g., Thrash)
  if (intent.blockGain) {
    monster.block += intent.blockGain;
    console.log(`  ${monster.name} gained ${intent.blockGain} block!`);
  }

  // Handle adding curse cards during attacks (e.g., Flame Tackle, Sear)
  if (intent.addCard) {
    state.discardPile.push(...Array(intent.addCardAmount).fill(intent.addCard));
    console.log(`  Added ${intent.addCardAmount} ${intent.addCard} to discard!`);
  }
}

function applyMonsterDebuff(monster, intent) {
  // Add curse cards into state.player.discardPile
  if (intent.addCard) {
  for (let i = 0; i < intent.addCardAmount; i++) {
    state.discardPile.push(intent.addCard);
  }
}
}

function applyMonsterBuff(monster, intent) {
  if (intent.blockGain) {
  monster.block += intent.blockGain;
  }
}


/* ---------------------------WIN/LOSE CHECKS ---------------------------*/
function isGameWon() {
  return state.player.level >= WIN_LEVEL;
}

function isPlayerDead() {
  return state.player.currentHealth <= 0;
}

function isMonsterDead() {
  return state.monster.health <= 0;
}

/* ---------------------------TURN FUNCTIONS ---------------------------*/
function monsterTurn() {
  state.currentTurn = "monster";
  console.log("=== MONSTER TURN ===");

  executeIntent(state.monster);

  if (isPlayerDead()) {
    state.gamePhase = "defeat";
    console.log("GAME OVER!");
    return;
  }

  state.monster.currentIntent = monsterIntent(state.monster);
  startPlayerTurn();
}

function startPlayerTurn() {
  state.currentTurn = "player";
  state.player.block = 0;
  state.player.currentEnergy = state.player.maxEnergy;
  drawCards(HAND_SIZE);
  console.log("=== YOUR TURN ===");
}

function endPlayerTurn() {
  discardHand();
  console.log("=== END TURN ===");
  monsterTurn();
}

// Called from cards.js when monster dies
function handleMonsterDefeated() {
  state.player.level += 1;
  console.log(`Victory! Now level ${state.player.level}`);

  if (isGameWon()) {
    state.gamePhase = "gameWon";
    console.log("YOU CONQUERED THE SPIRE!");
  } else {
    state.gamePhase = "victory";
    console.log("Monster defeated! Click continue to proceed.");
  }
}



/* ---------------------------EXPORTS ---------------------------*/
export {
  MONSTER_DATA,
  getMonsterDifficulty,
  isGameWon,
  isPlayerDead,
  isMonsterDead,
  startPlayerTurn,
  endPlayerTurn,
  handleMonsterDefeated,
};