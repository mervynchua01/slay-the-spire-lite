/* The top of the dependency chain. Initializes the game, sets up event listeners, and coordinates between all modules. Handles user input (card clicks, end turn, abandon run) and triggers appropriate responses.*/

import { state, resetGame, resetCombat } from "./state.js";
import { playCard } from "./cards.js";
import {
  getMonsterDifficulty,
  startPlayerTurn,
  endPlayerTurn,
  isMonsterDead,
  handleMonsterDefeated,
} from "./combat.js";
import { renderGameState, triggerSpriteShake, showDamageNumber } from "./ui.js";

/* ---------------------------GAME INITIALIZATION ---------------------------*/
function initGame() {
  console.log("GAME START");

  resetCombat(getMonsterDifficulty(state.player.level));

  startPlayerTurn();

  renderGameState();
}

/* ---------------------------EVENT HANDLERS ---------------------------*/
function handleCardClick(event) {
  if (state.gamePhase !== "combat") return;

  if (!event.target.closest(".card")) return;

  const cardEl = event.target.closest(".card");

  const cardIndex = parseInt(cardEl.dataset.index);

  const success = playCard(cardIndex);

  if (!success) return;

    if (state.monsterJustTookDamage) {
      triggerSpriteShake("monster");
      showDamageNumber("monster", state.monsterDamageAmount);
      state.monsterJustTookDamage = false;
      state.monsterDamageAmount = 0;
    }

  if (isMonsterDead()) {
    handleMonsterDefeated();
  }

  renderGameState();
}

function handleCardRewardClick(event) {
  const cardEl = event.target.closest(".card");
  if (!cardEl) return;

  const selectedCardId = cardEl.dataset.cardId;

  state.playerDeck.push(selectedCardId);

  resetCombat(getMonsterDifficulty(state.player.level));
  startPlayerTurn();
  renderGameState();
}

function handleVictorySkipRewards() {
  if (state.gamePhase !== "victory") return;

  resetCombat(getMonsterDifficulty(state.player.level));
  startPlayerTurn();
  renderGameState();
}

function handleEndTurn() {
  if (state.gamePhase !== "combat") return;

  if (state.currentTurn !== "player") {
    console.log("Not your turn!");
    return;
  }

  endPlayerTurn();

    if (state.playerJustTookDamage) {
      triggerSpriteShake("player");
      showDamageNumber("player", state.playerDamageAmount);
      state.playerJustTookDamage = false;
    state.playerDamageAmount = 0;
  }

  renderGameState();
}

function handleAbandonRun() {
  const confirmed = confirm("Are you sure you want to abandon this run?");

  if (confirmed) {
    console.log("=== RUN ABANDONED ===");
    resetGame();
    initGame();
  }
}

function handlePhaseAction() {
  console.log(`=== PHASE ACTION: ${state.gamePhase} ===`);

  switch (state.gamePhase) {
    case "victory":
      resetCombat(getMonsterDifficulty(state.player.level));
      startPlayerTurn();
      break;

    case "defeat":
    case "gameWon":
      resetGame();
      resetCombat(getMonsterDifficulty(state.player.level));
      startPlayerTurn();
      break;

    default:
      console.log("No action for current phase");
      return;
  }

  renderGameState();
}

/* ---------------------------EVENT LISTENERS ---------------------------*/
function attachEventListeners() {
  const handEl = document.querySelector("#hand");
  handEl.addEventListener("click", handleCardClick);

  const cardRewardEl = document.querySelector("#cards-reward");
  cardRewardEl.addEventListener("click", handleCardRewardClick);

  const victorySkipBtn = document.querySelector("#btn-victory-action");
  victorySkipBtn.addEventListener("click", handleVictorySkipRewards);

  const endTurnBtn = document.querySelector("#btn-end-turn");
  endTurnBtn.addEventListener("click", handleEndTurn);

  const abandonBtn = document.querySelector("#btn-abandon");
  abandonBtn.addEventListener("click", handleAbandonRun);

  const phaseActionBtn = document.querySelector("#btn-phase-action");
  phaseActionBtn.addEventListener("click", handlePhaseAction);

  console.log("Event listeners attached");
}

/* ---------------------------INITIALIZE ON PAGE LOAD ---------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing game...");
  attachEventListeners();
  initGame();
});
