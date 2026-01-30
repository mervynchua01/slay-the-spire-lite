/*Handles all DOM manipulation and visual updates. Renders player stats, monster stats, the hand of cards, and pile counts. This file is purely presentational - it reads state but doesn't modify game logic. */

import { state } from "./state.js";
import { generateCardReward, getCardData } from "./cards.js";
import { MONSTER_DATA } from "./combat.js";

/* ---------------------------CARD ICONS ---------------------------*/
function getCardIcon(cardId) {
  const icons = {
    strike: "⚔️",
    defend: "🛡️",
    bash: "💥",
  };
  return icons[cardId] || "📜";
}

function formatIntent(intent) {
  if (!intent) return "";

  const icon = intent.intentIcon || "❓";

  switch (intent.type) {
    case "attack":
      return `${icon} ${intent.name}: ${intent.value}`;

    case "debuff":
      return `${icon} ${intent.name}`;

    case "buff":
      if (intent.blockGain) {
        return `${icon} ${intent.name}: Block ${intent.blockGain}`;
      }
      return `${icon} ${intent.name}`;

    default:
      return `${icon} ${intent.name}`;
  }
}

/* ---------------------------RENDER FUNCTIONS ---------------------------*/
function renderPlayerStats() {
  const playerNameEl = document.querySelector("#player-name");
  const playerLevelEl = document.querySelector("#player-level");
  const playerHealthEl = document.querySelector("#player-health");
  const playerHealthTextEl = playerHealthEl.querySelector(".health-text");
  const playerHealthFillEl = document.querySelector("#player-health-fill");
  const playerEnergyEl = document.querySelector("#player-energy");
  const playerBlockEl = document.querySelector("#player-block");

  playerNameEl.textContent = state.player.name;
  playerLevelEl.textContent = state.player.level;

  const currentHP = Math.max(0, state.player.currentHealth);
  const maxHP = state.player.maxHealth;
  playerHealthTextEl.textContent = `${currentHP}/${maxHP}`;

  const healthPercent = (currentHP / maxHP) * 100;
  playerHealthFillEl.style.width = `${healthPercent}%`;

  playerEnergyEl.innerHTML = `<span class="energy-value-inner">⚡ ${state.player.currentEnergy}/${state.player.maxEnergy}</span>`;
  playerBlockEl.innerHTML = `<img src="assets/Icon_Block.png" alt="Block" style="width: 16px; height: 16px; vertical-align: middle;"> ${state.player.block}`;
}

function renderMonsterStats() {
  const monsterIntentEl = document.querySelector("#monster-intent");
  const monsterSpriteEl = document.querySelector("#monster-sprite");
  const monsterNameEl = document.querySelector("#monster-name");
  const monsterHealthEl = document.querySelector("#monster-health");
  const monsterHealthTextEl = monsterHealthEl.querySelector(".health-text");
  const monsterHealthFillEl = document.querySelector("#monster-health-fill");
  const monsterBlockEl = document.querySelector("#monster-block");

  monsterSpriteEl.textContent = state.monster.sprite;
  monsterNameEl.textContent = state.monster.name;

  const currentHP = Math.max(0, state.monster.health);
  const maxHP = state.monster.maxHealth;
  monsterHealthTextEl.textContent = `${currentHP}/${maxHP}`;

  const healthPercent = (currentHP / maxHP) * 100;
  monsterHealthFillEl.style.width = `${healthPercent}%`;

  monsterIntentEl.textContent = formatIntent(state.monster.currentIntent);

  if (state.monster.block > 0) {
    monsterBlockEl.innerHTML = `<img src="assets/Icon_Block.png" alt="Block" style="width: 16px; height: 16px; vertical-align: middle;"> ${state.monster.block}`;
    monsterBlockEl.style.display = "block";
  } else {
    monsterBlockEl.style.display = "none";
  }
}

function renderHand() {
  const handEl = document.querySelector("#hand");
  handEl.innerHTML = "";

  state.hand.forEach((cardId, index) => {
    const cardData = getCardData(cardId);

    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.dataset.index = index;
    cardEl.dataset.type = cardData.type;

    if (cardData.type === "status") {
      cardEl.classList.add("status-card");
    }

    cardEl.innerHTML = `
      <div class="card-cost">${cardData.cost}</div>
      <div class="card-name">${cardData.name}</div>
      <div class="card-art">${getCardIcon(cardId)}</div>
      <div class="card-description">${cardData.description}</div>
    `;

    handEl.appendChild(cardEl);
  });
}

function renderPiles() {
  const drawPileEl = document.querySelector("#draw-pile");
  const discardPileEl = document.querySelector("#discard-pile");

  drawPileEl.textContent = `Draw: ${state.drawPile.length}`;
  discardPileEl.textContent = `Discard: ${state.discardPile.length}`;
}

/* ---------------------------PHASE OVERLAY RENDERING ---------------------------*/
function renderPhaseOverlay() {
  const overlay = document.querySelector("#phase-overlay");
  const victoryOverlay = document.querySelector("#victory-overlay");
  const title = document.querySelector("#phase-title");
  const subtitle = document.querySelector("#phase-subtitle");
  const button = document.querySelector("#btn-phase-action");

  button.className = "phase-button";

  switch (state.gamePhase) {
    case "victory":
      renderVictoryOverlay();
      break;

    case "defeat":
      overlay.classList.remove("hidden");
      title.textContent = "Defeat";
      subtitle.textContent = "Your journey ends here...";
      button.textContent = "Try Again";
      button.classList.add("defeat");
      break;

    case "gameWon":
      overlay.classList.remove("hidden");
      title.textContent = "Victory!";
      subtitle.textContent = "You conquered the Spire!";
      button.textContent = "Play Again";
      button.classList.add("game-won");
      break;

    case "combat":
    default:
      overlay.classList.add("hidden");
      victoryOverlay.classList.add("hidden");
      break;
  }
}

function renderVictoryOverlay() {
  const victoryOverlay = document.querySelector("#victory-overlay");
  const cardsRewardRow = document.querySelector("#cards-reward");
  const title = document.querySelector("#victory-title");
  const subtitle = document.querySelector("#victory-subtitle");
  const subsubtitle = document.querySelector("#victory-subsubtitle");
  const button = document.querySelector("#btn-victory-action");

  victoryOverlay.classList.remove("hidden");
  title.textContent = "Victory!";
  subtitle.textContent = `Level ${state.player.level} | HP: ${state.player.currentHealth}/${state.player.maxHealth}`;
  subsubtitle.textContent = 'Choose a card reward!';
  button.textContent = "Skip rewards";
  button.classList.add("victory");

  cardsRewardRow.innerHTML = "";

  const rewardCards = generateCardReward();

  rewardCards.forEach((cardData) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.dataset.cardId = cardData.id;
    cardDiv.dataset.type = cardData.type;
    if (cardData.type === "status") {
      cardDiv.classList.add("status-card");
    }
    cardDiv.innerHTML = `
      <div class="card-cost">${cardData.cost}</div>
      <div class="card-name">${cardData.name}</div>
      <div class="card-art">${getCardIcon(cardData.id)}</div>
      <div class="card-description">${cardData.description}</div>
    `;
    cardsRewardRow.appendChild(cardDiv);
  });
}

/* ---------------------------INPUT BLOCKING ---------------------------*/
function updateInputState() {
  const handEl = document.querySelector("#hand");
  const endTurnBtn = document.querySelector("#btn-end-turn");
  const footerEl = document.querySelector(".battle-footer");

  if (state.gamePhase !== "combat") {
    handEl.classList.add("disabled");
    endTurnBtn.classList.add("disabled");
    footerEl.classList.add("disabled");
  } else {
    handEl.classList.remove("disabled");
    endTurnBtn.classList.remove("disabled");
    footerEl.classList.remove("disabled");
  }
}

/* ---------------------------SPRITE SHAKE ---------------------------*/
const SHAKE_DURATION_MS = 400;

function triggerSpriteShake(which) {
  const selector = which === "player" ? "#player-sprite-wrapper" : "#monster-sprite-wrapper";
  const el = document.querySelector(selector);
  if (!el) return;
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), SHAKE_DURATION_MS);
}

const DAMAGE_NUMBER_DURATION_MS = 800;

function showDamageNumber(which, amount) {
  const wrapperId = which === "player" ? "#player-sprite-wrapper" : "#monster-sprite-wrapper";
  const wrapper = document.querySelector(wrapperId);
  if (!wrapper || amount <= 0) return;

  const el = document.createElement("div");
  el.className = "damage-number";
  el.textContent = amount;
  wrapper.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, DAMAGE_NUMBER_DURATION_MS);
}



/* ---------------------------MASTER RENDER ---------------------------*/
function renderCombatScreen() {
  renderPlayerStats();
  renderMonsterStats();
  renderHand();
  renderPiles();
  console.log("Combat screen rendered");
}

function renderGameState() {
  renderCombatScreen();

  renderPhaseOverlay();
  updateInputState();

  console.log(`Game state rendered: ${state.gamePhase}`);
}

/* ---------------------------EXPORTS ---------------------------*/
export {
  renderCombatScreen,
  renderGameState,
  triggerSpriteShake,
  showDamageNumber,
};
