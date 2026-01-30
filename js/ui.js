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

  // Format based on intent type
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
  const playerEnergyEl = document.querySelector("#player-energy");
  const playerBlockEl = document.querySelector("#player-block");

  playerNameEl.textContent = state.player.name;
  playerLevelEl.textContent = state.player.level;
  playerHealthEl.textContent = `${Math.max(0, state.player.currentHealth)}/${state.player.maxHealth}`;
  playerEnergyEl.textContent = `⚡ ${state.player.currentEnergy}/${state.player.maxEnergy}`;
  playerBlockEl.textContent = `🛡️ ${state.player.block}`;
}

function renderMonsterStats() {
  const monsterIntentEl = document.querySelector("#monster-intent");
  const monsterSpriteEl = document.querySelector("#monster-sprite");
  const monsterNameEl = document.querySelector("#monster-name");
  const monsterHealthEl = document.querySelector("#monster-health");
  const monsterBlockEl = document.querySelector("#monster-block");

  monsterSpriteEl.textContent = state.monster.sprite;
  monsterNameEl.textContent = state.monster.name;
  monsterHealthEl.textContent = `${Math.max(0, state.monster.health)}/${state.monster.maxHealth}`;
  monsterIntentEl.textContent = formatIntent(state.monster.currentIntent);

  // Display monster block if > 0
  if (state.monster.block > 0) {
    monsterBlockEl.textContent = `🛡️ ${state.monster.block}`;
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

    // Add status card class for special styling
    if (cardData.type === 'status') {
      cardEl.classList.add('status-card');
    }

    cardEl.innerHTML = `
      <div class="card-cost">${cardData.cost}</div>
      <div class="card-name">${cardData.name}</div>
      <div class="card-art">${getCardIcon(cardId)}</div>
      <div class="card-type">${cardData.type}</div>
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



  // Reset button classes
  button.className = "phase-button";

  switch (state.gamePhase) {
    case "victory":
      renderVictoryOverlay()
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
  const button = document.querySelector("#btn-victory-action");

  victoryOverlay.classList.remove("hidden");
      title.textContent = "Victory!";
      subtitle.textContent = `Level ${state.player.level} | HP: ${state.player.currentHealth}/${state.player.maxHealth}`;
      button.textContent = "Continue";
      button.classList.add("victory");

      cardsRewardRow.innerHTML = "";

      const rewardCards = generateCardReward();

      rewardCards.forEach((cardData) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.dataset.cardId = cardData.id;
        cardDiv.dataset.type = cardData.type;
        cardDiv.innerHTML = `
          <div class="card-cost">${cardData.cost}</div>
          <div class="card-name">${cardData.name}</div>
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
export { renderCombatScreen, renderGameState };
