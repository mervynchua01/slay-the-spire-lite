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
let playerWeapon = { name: "Rusty Dagger", dice: 4, count: 1 }; // remove the : after playerWeapon
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
  flipButton.disabled = true;
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
  } else {
    playerHealth--;
    cardDisplay.textContent = `Defeated! You rolled ${diceRoll}. You lost a health!`;
    checkLose();
  }

  updateDisplay();
  currentMonster = null;
  flipButton.disabled = false;
}

function flee() {
  actionButtons.innerHTML = "";
  cardDisplay.textContent = `You managed to fled from the monster safely. Nothing Happens`;
  currentMonster = null;
  flipButton.disabled = false;
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
  flipButton.disabled = true;
  cardDisplay.textContent = `A treasure appears, it may be good or bad, we won't know!`;
  actionButtons.innerHTML = `
  <button id = "open-button">Open</button>
  <button id = "ignore-button">Ignore</button>
  `;
  document.querySelector("#open-button").addEventListener("click", openChest);
  document.querySelector("#exit-button").addEventListener("click", ignoreChest);
  console.log(`A monster appeared Power: ${monster.power}`);
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
    flipButton.disabled = false;
  });

  document.querySelector("#keep-btn").addEventListener("click", () => {
    cardDisplay.textContent = `Kept your ${playerWeapon.name}.`;
    actionButtons.innerHTML = "";
  });
}

function ignoreChest() {
  cardDisplay.textContent = `You ignored the treasure chest. Nothing happens.`;
  actionButtons.innerHTML = ``;
  flipButton.disabled = false;
}

function handleGoodEffect() {
  const effect = Math.random();

  if (effect < 0.5) {
    // Health potion
    playerHealth++;
    cardDisplay.textContent = "Health Potion! Gained 1 health.";
  } else {
    // Level up potion
    playerLevel++;
    cardDisplay.textContent = "Experience Potion! Gained 1 level.";
    checkWin();
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
    } else {
      cardDisplay.textContent = "Curse! But you're already level 1.";
    }
  } else {
    playerWeapon = { name: "Rusty Dagger", dice: 4, count: 1 };
    cardDisplay.textContent = "🔨 Your weapon broke! Back to Rusty Dagger.";
  }

  updateDisplay();
  actionButtons.innerHTML = "";
}

function checkWin() {
  if (playerLevel >= winLevel) {
    cardDisplay.textContent = `YOU WIN! Reached level ${winLevel}!`;
    flipButton.disabled = true;
  }
}

function checkLose() {
  if (playerHealth <= 0) {
    cardDisplay.textContent = `GAME OVER! You lost all your health.`;
    flipButton.disabled = true;
  }
}

/*----------------------------- Event Listeners -----------------------------*/
flipButton.addEventListener("click", flipCard);

/*-------------------------------- Initialize --------------------------------*/
init();
