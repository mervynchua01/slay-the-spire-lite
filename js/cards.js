/* Handles everything related to cards: card definitions (data),deck operations (shuffle, draw, discard), and playing cards. Each card has a name, cost, type, description, and effect function. */

import { state, shuffleArray } from "./state.js";

/* ---------------------------CARD DATA ---------------------------*/
const ADDITIONAL_CARDS = {
  status: [
    {
      id: 'slimed',
      name: 'Slimed',
      cost: 1,
      type: 'status',
      damage: 0,
      block: 0,
      draw: 0,
      hpChange: 0,
      exhaust: true, // It removes itself when played
      description: 'Cost 1: Exhaust.'
    },
    {
      id: 'dazed',
      name: 'Dazed',
      cost: 999, 
      type: 'status',
      damage: 0,
      block: 0,
      draw: 0,
      hpChange: 0,
      ethereal: true, // Deletes itself if left in hand
      description: 'Unplayable. Ethereal.'
    },
    {
      id: 'burn',
      name: 'Burn',
      cost: 999,
      type: 'status',
      damage: 0,
      block: 0,
      draw: 0,
      hpChange: 0,
      endTurnDamage: 2, // New key for your turn-end logic
      description: 'Unplayable. At the end of your turn, take 2 damage.'
    }
  ],
  common: [
    {
      id: 'anger',
      name: 'Anger',
      cost: 0,
      type: 'attack',
      damage: 6,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 6 damage.'
    },
    {
      id: 'armaments',
      name: 'Armaments',
      cost: 1,
      type: 'skill',
      damage: 0,
      block: 5,
      draw: 1,
      hpChange: 0,
      description: 'Gain 5 Block. Draw 1 card.'
    },
    {
      id: 'body_slam',
      name: 'Body Slam',
      cost: 1,
      type: 'attack',
      damage: 0,
      block: 0,
      draw: 0,
      hpChange: 0,
      specialEffect: 'damage_equals_block',
      description: 'Deal damage equal to your current Block.'
    },
    {
      id: 'clothesline',
      name: 'Clothesline',
      cost: 2,
      type: 'attack',
      damage: 12,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 12 damage.'
    },
    {
      id: 'headbutt',
      name: 'Headbutt',
      cost: 1,
      type: 'attack',
      damage: 9,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 9 damage.'
    },
    {
      id: 'heavy_blade',
      name: 'Heavy Blade',
      cost: 2,
      type: 'attack',
      damage: 14,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 14 damage.'
    },
    {
      id: 'iron_wave',
      name: 'Iron Wave',
      cost: 1,
      type: 'attack',
      damage: 5,
      block: 5,
      draw: 0,
      hpChange: 0,
      description: 'Gain 5 Block. Deal 5 damage.'
    },
    {
      id: 'pommel_strike',
      name: 'Pommel Strike',
      cost: 1,
      type: 'attack',
      damage: 9,
      block: 0,
      draw: 1,
      hpChange: 0,
      description: 'Deal 9 damage. Draw 1 card.'
    },
    {
      id: 'shrug_it_off',
      name: 'Shrug It Off',
      cost: 1,
      type: 'skill',
      damage: 0,
      block: 8,
      draw: 1,
      hpChange: 0,
      description: 'Gain 8 Block. Draw 1 card.'
    },
    {
      id: 'true_grit',
      name: 'True Grit',
      cost: 1,
      type: 'skill',
      damage: 0,
      block: 7,
      draw: 0,
      hpChange: 0,
      description: 'Gain 7 Block.'
    },
    {
      id: 'strike',
      name: 'Strike',
      cost: 1,
      type: 'attack',
      damage: 6,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 6 damage.'
    },
    {
      id: 'defend',
      name: 'Defend',
      cost: 1,
      type: 'skill',
      damage: 0,
      block: 5,
      draw: 0,
      hpChange: 0,
      description: 'Gain 5 Block.'
    },
    {
      id: 'bash',
      name: 'Bash',
      cost: 2,
      type: 'attack',
      damage: 8,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 8 damage.'
    }
  ],

  uncommon: [
    {
      id: 'battle_trance',
      name: 'Battle Trance',
      cost: 0,
      type: 'skill',
      damage: 0,
      block: 0,
      draw: 3,
      hpChange: 0,
      description: 'Draw 3 cards.'
    },
    {
      id: 'blood_for_blood',
      name: 'Blood for Blood',
      cost: 4,
      type: 'attack',
      damage: 18,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 18 damage.'
    },
    {
      id: 'bloodletting',
      name: 'Bloodletting',
      cost: 0,
      type: 'skill',
      damage: 0,
      block: 0,
      draw: 0,
      hpChange: -3,
      description: 'Lose 3 HP.'
    },
    {
      id: 'burning_pact',
      name: 'Burning Pact',
      cost: 1,
      type: 'skill',
      damage: 0,
      block: 0,
      draw: 2,
      hpChange: 0,
      description: 'Draw 2 cards.'
    },
    {
      id: 'carnage',
      name: 'Carnage',
      cost: 2,
      type: 'attack',
      damage: 20,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 20 damage.'
    },
    {
      id: 'dropkick',
      name: 'Dropkick',
      cost: 1,
      type: 'attack',
      damage: 5,
      block: 0,
      draw: 1,
      hpChange: 0,
      description: 'Deal 5 damage. Draw 1 card.'
    },
    {
      id: 'flame_barrier',
      name: 'Flame Barrier',
      cost: 2,
      type: 'skill',
      damage: 0,
      block: 12,
      draw: 0,
      hpChange: 0,
      description: 'Gain 12 Block.'
    },
    {
      id: 'ghostly_armor',
      name: 'Ghostly Armor',
      cost: 1,
      type: 'skill',
      damage: 0,
      block: 10,
      draw: 0,
      hpChange: 0,
      description: 'Gain 10 Block.'
    },
    {
      id: 'hemokinesis',
      name: 'Hemokinesis',
      cost: 1,
      type: 'attack',
      damage: 15,
      block: 0,
      draw: 0,
      hpChange: -2,
      description: 'Lose 2 HP. Deal 15 damage.'
    },
    {
      id: 'power_through',
      name: 'Power Through',
      cost: 1,
      type: 'skill',
      damage: 0,
      block: 15,
      draw: 0,
      hpChange: 0,
      description: 'Gain 15 Block.'
    },
    {
      id: 'rampage',
      name: 'Rampage',
      cost: 1,
      type: 'attack',
      damage: 8,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 8 damage.'
    },
    {
      id: 'reckless_charge',
      name: 'Reckless Charge',
      cost: 0,
      type: 'attack',
      damage: 7,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 7 damage.'
    },
    {
      id: 'sever_soul',
      name: 'Sever Soul',
      cost: 2,
      type: 'attack',
      damage: 16,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 16 damage.'
    },
    {
      id: 'uppercut',
      name: 'Uppercut',
      cost: 2,
      type: 'attack',
      damage: 13,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 13 damage.'
    },
    {
      id: 'second_wind',
      name: 'Second Wind',
      cost: 1,
      type: 'skill',
      damage: 0,
      block: 5,
      draw: 0,
      hpChange: 0,
      description: 'Gain 5 Block.'
    }
  ],

  rare: [
    {
      id: 'bludgeon',
      name: 'Bludgeon',
      cost: 3,
      type: 'attack',
      damage: 32,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 32 damage.'
    },
    {
      id: 'brutality',
      name: 'Brutality',
      cost: 0,
      type: 'power',
      damage: 0,
      block: 0,
      draw: 1,
      hpChange: -1,
      specialEffect: 'start_of_turn',
      description: 'At the start of your turn, lose 1 HP and draw 1 card.'
    },
    {
      id: 'feed',
      name: 'Feed',
      cost: 1,
      type: 'attack',
      damage: 10,
      block: 0,
      draw: 0,
      hpChange: 0,
      specialEffect: 'gain_max_hp_3_on_kill',
      description: 'Deal 10 damage. If this kills an enemy, raise your Max HP by 3.'
    },
    {
      id: 'fiend_fire',
      name: 'Fiend Fire',
      cost: 2,
      type: 'attack',
      damage: 7,
      block: 0,
      draw: 0,
      hpChange: 0,
      specialEffect: 'damage_per_card_in_hand',
      description: 'Deal 7 damage for each card in your hand.'
    },
    {
      id: 'immolate',
      name: 'Immolate',
      cost: 2,
      type: 'attack',
      damage: 21,
      block: 0,
      draw: 0,
      hpChange: 0,
      description: 'Deal 21 damage.'
    },
    {
      id: 'impervious',
      name: 'Impervious',
      cost: 2,
      type: 'skill',
      damage: 0,
      block: 30,
      draw: 0,
      hpChange: 0,
      description: 'Gain 30 Block.'
    },
    {
      id: 'offering',
      name: 'Offering',
      cost: 0,
      type: 'skill',
      damage: 0,
      block: 0,
      draw: 3,
      hpChange: -6,
      description: 'Lose 6 HP. Draw 3 cards.'
    },
    {
      id: 'reaper',
      name: 'Reaper',
      cost: 2,
      type: 'attack',
      damage: 4,
      block: 0,
      draw: 0,
      hpChange: 0,
      specialEffect: 'heal_for_damage_dealt',
      description: 'Deal 4 damage. Heal HP equal to damage dealt.'
    }
  ]
};

// Flat lookup: cardId -> cardData
const CARD_LOOKUP = {};
[...ADDITIONAL_CARDS.common, ...ADDITIONAL_CARDS.uncommon, ...ADDITIONAL_CARDS.rare, ...ADDITIONAL_CARDS.status].forEach(card => {
  CARD_LOOKUP[card.id] = card;
});


// Additional card rewards
function generateCardReward() {
  const rewards = [];

  for (let i = 0; i < 3; i++) {
    const roll = Math.random();

    if (roll < 0.75) {
      rewards.push(ADDITIONAL_CARDS.common[Math.floor(Math.random() * ADDITIONAL_CARDS.common.length)]);
    } else if (roll < 0.95) {
      rewards.push(ADDITIONAL_CARDS.uncommon[Math.floor(Math.random() * ADDITIONAL_CARDS.uncommon.length)]);
    } else {
      rewards.push(ADDITIONAL_CARDS.rare[Math.floor(Math.random() * ADDITIONAL_CARDS.rare.length)]);
    }
  }

  return rewards;
}

/* ---------------------------SHUFFLE LOGIC ---------------------------*/
function shuffleDiscardIntoDraw() {
  state.drawPile = [...state.discardPile];
  state.discardPile = [];
  shuffleArray(state.drawPile);
  console.log(`Shuffled ${state.drawPile.length} cards from discard into draw pile`);
}

/* ---------------------------DRAW LOGIC ---------------------------*/

function drawCards(n) {
  for (let i = 0; i < n; i++) {
    if (state.drawPile.length === 0) {
      if (state.discardPile.length === 0) {
        console.log("No cards to draw!");
        break;
      }
      shuffleDiscardIntoDraw();
    }
    state.hand.push(state.drawPile.pop());
  }
}


/* ---------------------------PLAY CARD LOGIC ---------------------------*/
function playCard(handIndex, target = state.monster) {
  const cardId = state.hand[handIndex];
  const cardData = CARD_LOOKUP[cardId];

  // Check energy
  if (state.player.currentEnergy < cardData.cost) {
    console.log(`Not enough energy to play ${cardData.name}`);
    return false;
  }

  // Deduct energy
  state.player.currentEnergy -= cardData.cost;

  // Apply card effects from data
  if (cardData.damage > 0) {
    const blocked = Math.min(target.block || 0, cardData.damage);
    const actualDamage = cardData.damage - blocked;

    if (target.block) {
      target.block -= blocked;
    }
    target.health -= actualDamage;
    if (actualDamage > 0) state.monsterJustTookDamage = true;
    state.monsterDamageAmount = actualDamage;
    console.log(
      `Dealt ${cardData.damage} damage (${blocked} blocked, ${actualDamage} actual)`,
    );
  }
  if (cardData.block > 0) {
    state.player.block += cardData.block;
  }
  if (cardData.draw > 0) {
    drawCards(cardData.draw);
  }
  if (cardData.hpChange !== 0) {
    state.player.currentHealth += cardData.hpChange;
  }

  // Move card from hand to discard
  state.hand.splice(handIndex, 1);
  state.discardPile.push(cardId);

  console.log(`Played ${cardData.name} (cost: ${cardData.cost})`);
  return true;
}

/* ---------------------------DISCARD LOGIC ---------------------------*/
function discardHand() {
  state.discardPile.push(...state.hand);
  state.hand = [];
  console.log("Discarded hand");
}

/* ---------------------------HELPER FUNCTIONS ---------------------------*/
function getCardData(cardId) {
  return CARD_LOOKUP[cardId];
}

/* ---------------------------EXPORTS ---------------------------*/
export {
  drawCards,
  playCard,
  discardHand,
  getCardData,
  generateCardReward,
};
