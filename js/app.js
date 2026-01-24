/*-------------------------------- Constants --------------------------------*/

const winLevel = 10;

const weapons = [
  { name: "Mace", dice: 6, count: 1 },
  { name: "Longsword", dice: 8, count: 1 },
  { name: "Pike", dice: 10, count: 1 },
  { name: "Greatsword", dice: 6, count: 2 },
  { name: "Legendary Blade", dice: 12, count: 1 },
];

/*---------------------------- Variables (state) ----------------------------*/

let playerLevel = 1;
let playerHealth = 3;
let energy = 3;
let playerWeapon = { name: "Rusty Dagger", dice: 4, count: 1 };
let currentMonster = null;

/*------------------------ Cached Element References ------------------------*/
const healthDisplay = document.querySelector("#health-display");
const levelDisplay = document.querySelector("#level-display");
const weaponDisplay = document.querySelector("#weapon-display");
const flipButton = document.querySelector("#flip-button");
const cardDisplay = document.querySelector("#card-display");
const actionButtons = document.querySelector("#action-buttons");

/*-------------------------------- General Functions --------------------------------*/
function init() {
  updateDisplay();
}

function updateDisplay() {
  healthDisplay.textContent = playerHealth;
  levelDisplay.textContent = playerLevel;
  weaponDisplay.textContent = `${playerWeapon.name} (${playerWeapon.count}d${playerWeapon.dice})`;
}

function flipCard() {
  flipButton.style.display = "none";
  let cardType;
  if (Math.random() < 0.7) {
    cardType = "monster";
  } else {
    cardType = "treasure";
  }
  if (cardType === "monster") {
    showMonster();
  } else {
    showTreasure();
  }
  console.log("Card flipped!");
}

/*-------------------------------- Monster Functions --------------------------------*/

function showMonster() {
  const monster = generateMonster();
  currentMonster = monster;
  cardDisplay.textContent = `A monster appears! Power: ${monster.power}`;
  actionButtons.innerHTML = `
  <button id = "fight-button">Fight (roll dice)</button>
  <button id = "flee-button">Flee</button>
  `;
  document.querySelector("#fight-button").addEventListener("click", fight);
  document.querySelector("#flee-button").addEventListener("click", flee);
  console.log(`A monster appeared Power: ${monster.power}`);
}

function fight() {
  actionButtons.innerHTML = "";
  let diceRoll = 0;
  for (let i = 0; i < playerWeapon.count; i++) {
    diceRoll += Math.floor(Math.random() * playerWeapon.dice) + 1;
  }
  const playerTotal = diceRoll + playerLevel;
  const monsterPower = currentMonster.power;

  console.log(`You rolled: ${diceRoll}`);

  if (playerTotal > monsterPower) {
    playerLevel++;
    cardDisplay.textContent = `Victory! You rolled ${diceRoll} and defeated the monster. You gain a level!`;
    checkWin();
    flipButton.style.display = "block";
  } else {
    playerHealth--;
    cardDisplay.textContent = `Defeated! You rolled ${diceRoll}. You lost a health!`;
    checkLose();
    flipButton.style.display = "block";
  }

  updateDisplay();
  currentMonster = null;
  flipButton.style.display = "block";
}

function flee() {
  actionButtons.innerHTML = "";
  cardDisplay.textContent = `You managed to fled from the monster safely. Nothing Happens`;
  currentMonster = null;
  flipButton.style.display = "block";
}

function generateMonster() {
  let minPower, maxPower;

  if (playerLevel <= 2) {
    minPower = 2;
    maxPower = 4;
  } else if (playerLevel <= 4) {
    minPower = 4;
    maxPower = 7;
  } else if (playerLevel <= 6) {
    minPower = 6;
    maxPower = 10;
  } else if (playerLevel <= 8) {
    minPower = 8;
    maxPower = 13;
  } else {
    minPower = 10;
    maxPower = 15;
  }

  const power =
    Math.floor(Math.random() * (maxPower - minPower + 1)) + minPower;

  return {
    power: power,
  };
}

/*-------------------------------- Treasure Functions --------------------------------*/

function showTreasure() {
  cardDisplay.textContent = `A treasure appears, it may be good or bad, we won't know!`;
  actionButtons.innerHTML = `
  <button id = "open-button">Open</button>
  <button id = "ignore-button">Ignore</button>
  `;
  document.querySelector("#open-button").addEventListener("click", openChest);
  document
    .querySelector("#ignore-button")
    .addEventListener("click", ignoreChest);
}

function openChest() {
  const outcome = Math.random();

  if (outcome < 0.6) {
    const newWeapon = weapons[Math.floor(Math.random() * weapons.length)];
    showWeaponChoice(newWeapon);
  } else if (outcome < 0.8) {
    handleGoodEffect();
    flipButton.disabled = false;
  } else {
    handleTrap();
    flipButton.disabled = false;
  }
}

function showWeaponChoice(newWeapon) {
  cardDisplay.textContent = `You found a ${newWeapon.name} (${newWeapon.count}d${newWeapon.dice})!`;

  actionButtons.innerHTML = `
    <p>Current weapon: ${playerWeapon.name} (${playerWeapon.count}d${playerWeapon.dice})</p>
    <button id="equip-btn">Equip ${newWeapon.name}</button>
    <button id="keep-btn">Keep ${playerWeapon.name}</button>
  `;

  document.querySelector("#equip-btn").addEventListener("click", () => {
    playerWeapon = newWeapon;
    updateDisplay();
    cardDisplay.textContent = `Equipped ${newWeapon.name}!`;
    actionButtons.innerHTML = "";
    flipButton.style.display = "block";
  });

  document.querySelector("#keep-btn").addEventListener("click", () => {
    cardDisplay.textContent = `Kept your ${playerWeapon.name}.`;
    actionButtons.innerHTML = "";
    flipButton.style.display = "block";
  });
}

function ignoreChest() {
  cardDisplay.textContent = `You ignored the treasure chest. Nothing happens.`;
  actionButtons.innerHTML = ``;
  flipButton.style.display = "block";
}

function handleGoodEffect() {
  const effect = Math.random();

  if (effect < 0.5) {
    // Health potion
    playerHealth++;
    cardDisplay.textContent = "Health Potion! Gained 1 health.";
    flipButton.style.display = "block";
  } else {
    // Level up potion
    playerLevel++;
    cardDisplay.textContent = "Experience Potion! Gained 1 level.";
    checkWin();
    flipButton.style.display = "block";
  }

  updateDisplay();
  actionButtons.innerHTML = "";
}

function handleTrap() {
  const trap = Math.random();

  if (trap < 0.33) {
    playerHealth--;
    cardDisplay.textContent = "Trap! Lost 1 health.";
    checkLose();
  } else if (trap < 0.66) {
    if (playerLevel > 1) {
      playerLevel--;
      cardDisplay.textContent = "Curse! Lost 1 level.";
      flipButton.style.display = "block";
    } else {
      cardDisplay.textContent = "Curse! But you're already level 1.";
      flipButton.style.display = "block";
    }
  } else {
    playerWeapon = { name: "Rusty Dagger", dice: 4, count: 1 };
    cardDisplay.textContent = "🔨 Your weapon broke! Back to Rusty Dagger.";
    flipButton.style.display = "block";
  }

  updateDisplay();
  actionButtons.innerHTML = "";
}

function checkWin() {
  if (playerLevel >= winLevel) {
    cardDisplay.textContent = `YOU WIN! Reached level ${winLevel}!`;
    flipButton.style.display = "none";
    actionButtons.innerHTML = `
      <button id = "restart-button">Play again</button>
      `;
    document
      .querySelector("#restart-button")
      .addEventListener("click", restart);
  }
}

function checkLose() {
  if (playerHealth <= 0) {
    cardDisplay.textContent = `GAME OVER! You lost all your health.`;
    flipButton.style.display = "none";
    actionButtons.innerHTML = `
      <button id = "restart-button">Play again</button>
      `;
    document
      .querySelector("#restart-button")
      .addEventListener("click", restart);
  }
}

function restart() {
  playerHealth = 3;
  playerLevel = 1;
  playerWeapon = { name: "Rusty Dagger", dice: 4, count: 1 };
  cardDisplay.textContent = "";
  actionButtons.innerHTML = "";
  flipButton.style.display = "block";

  updateDisplay();
}

/*----------------------------- Event Listeners -----------------------------*/
flipButton.addEventListener("click", flipCard);

/*-------------------------------- Initialize --------------------------------*/
init();

// more choices to fight the monster?
// maybe shuffle more cards in the deck?
// boss?
// more events or choices involved?
// unlocking certain cards?, event will add subsequent event card?
// if this card comes before hand, it benefits the user
// each card is a unique event

// slay the spire? attack acards 3 times?
// choose between 3 actions
// 3 turns, can use cards
