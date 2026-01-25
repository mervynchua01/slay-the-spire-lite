import { state } from "./game.js";

/*-------------------------------- Card Database --------------------------------*/

const CARD_DATA = {
  strike: {
    name: "Strike",
    cost: 1,
    type: "attack",
    description: "Deal 6 damage",
    effect: (target) => {
      target.currentHealth -= 6;
    },
  },
  defend: {
    name: "Defend",
    cost: 1,
    type: "skill",
    description: "Gain 5 block",
    effect: () => {
      state.player.block += 5;
    },
  },
  bash: {
    name: "Bash",
    cost: 2,
    type: "attack",
    description: "Deal 8 damage",
    effect: (target) => {
      target.currentHealth -= 8;
    },
  },
};

/*-------------------------------- Shuffle Logic --------------------------------*/

function shuffleCards(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shuffleDiscardIntoDraw() {
  state.drawPile = [...state.discardPile];
  state.discardPile = [];
  shuffleCards(state.drawPile);

  console.log(
    `Shuffled ${state.drawPile.length} cards from discard into draw pile`,
  );
}

/*-------------------------------- Draw Logic --------------------------------*/

function drawCard() {
  if (state.drawPile.length === 0) {
    if (state.discardPile.length === 0) {
      console.log("No cards to draw!");
      return null;
    }
    shuffleDiscardIntoDraw();
  }

  const drawnCard = state.drawPile.pop();
  state.hand.push(drawnCard);

  console.log(`Drew ${drawnCard}`);
  return drawnCard;
}

function drawMultipleCards(amount) {
  const drawnCards = [];
  for (let i = 0; i < amount; i++) {
    const card = drawCard();
    if (card) {
      drawnCards.push(card);
    }
  }
  return drawnCards;
}

/*-------------------------------- Play Card Logic --------------------------------*/

function playCard(handIndex, target = state.monster) {
  const cardId = state.hand[handIndex];
  const cardData = CARD_DATA[cardId];

  // Check energy
  if (state.player.currentEnergy < cardData.cost) {
    console.log(`Not enough energy to play ${cardData.name}`);
    return false;
  }

  // Play the card
  state.player.currentEnergy -= cardData.cost;
  cardData.effect(target);
  state.hand.splice(handIndex, 1);
  state.discardPile.push(cardId);

  console.log(`Played ${cardData.name} (cost: ${cardData.cost})`);
  return true;
}

/*-------------------------------- Discard Logic --------------------------------*/

function discardHand() {
  state.discardPile.push(...state.hand);
  state.hand = [];

  console.log("Discarded hand");
}

/*-------------------------------- Helper Functions --------------------------------*/

function getCardData(cardId) {
  return CARD_DATA[cardId];
}

/*-------------------------------- Exports --------------------------------*/

export {
  CARD_DATA,
  drawCard,
  drawMultipleCards,
  playCard,
  discardHand,
  shuffleDiscardIntoDraw,
  getCardData,
};
