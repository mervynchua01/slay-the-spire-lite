/* The top of the dependency chain. Initializes the game, sets up event listeners, and coordinates between all modules. Handles user input (card clicks, end turn, abandon run) and triggers appropriate responses.*/

import { state, resetGame, resetCombat, STARTER_DECK } from "./state.js";
import { playCard } from "./cards.js";
import {
  getMonsterDifficulty,
  startPlayerTurn,
  endPlayerTurn,
  isMonsterDead,
  handleMonsterDefeated,
} from "./combat.js";
import { renderGameState } from "./ui.js";

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

  // Get card index from data attribute
  const cardIndex = parseInt(cardEl.dataset.index);

  // Play the card
  const success = playCard(cardIndex);

  if (!success) return;

  // Check if monster died from this card
  if (isMonsterDead()) {
    handleMonsterDefeated();
  }

  renderGameState();
}

function handleCardRewardClick(event) {
  const cardEl = event.target.closest(".card");
  if (!cardEl) return;

  const selectedCardId = cardEl.dataset.cardId;

  STARTER_DECK.push(selectedCardId);

  // Reset combat and continue
  resetCombat(getMonsterDifficulty(state.player.level));
  startPlayerTurn();
  renderGameState();
}

function handleEndTurn() {
  // Block input during non-combat phases
  if (state.gamePhase !== "combat") return;

  // Check if it's player's turn
  if (state.currentTurn !== "player") {
    console.log("Not your turn!");
    return;
  }

  // End player turn (this triggers enemy turn automatically)
  endPlayerTurn();

  // Re-render after enemy turn completes
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
  // Hand container - delegate card clicks
  const handEl = document.querySelector("#hand");
  handEl.addEventListener("click", handleCardClick);

  const cardRewardEl = document.querySelector("#cards-reward");
  cardRewardEl.addEventListener("click", handleCardRewardClick);

  // End Turn button
  const endTurnBtn = document.querySelector("#btn-end-turn");
  endTurnBtn.addEventListener("click", handleEndTurn);

  // Abandon Run button
  const abandonBtn = document.querySelector("#btn-abandon");
  abandonBtn.addEventListener("click", handleAbandonRun);

  // Phase action button (Continue, Try Again, Play Again)
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
