# Roguelike Dungeon Card Game

![Game Screenshot](https://i.imgur.com/IqaUI48.jpeg)

A turn-based roguelike deck-building game inspired by Slay the Spire, built entirely with vanilla JavaScript, HTML, and CSS. This project demonstrates core game development concepts and software engineering principles without relying on frameworks or game engines.

**[Live Demo](https://mervynchua01.github.io/slay-the-spire-lite/)**

---

## Project Overview

This project explores the technical challenges of building a complex, stateful game system using fundamental web technologies. The goal was to push the boundaries of vanilla JavaScript to create an engaging roguelike experience with proper game architecture, state management, and UI rendering systems.

---

## Key Features

The game includes a turn-based card combat system with energy management, procedural generation of encounters and card rewards, and deck-building mechanics with strategic card selection. Players experience progressive difficulty scaling across 10 levels while the system maintains state persistence throughout game sessions. The codebase uses a modular architecture designed for maintainability and scalability.

## Slay the Spire - Quick How to Play Guide
Core Concept

* Deck-building roguelike where you climb a spire, fight monsters, and build your card deck as you go
* Every run is different - when you die, you start over from the beginning
* Goal: Reach to level 10

Basic Gameplay Loop

* Choose your path on the map after each fight
* Combat: Turn-based using cards from your deck
* Draw 5 cards per turn (usually)
* Start with 3 energy per turn to play cards 
* Attack cards deal damage, Skill cards do other stuff
* After fights: Pick 1 new card to add to your deck (or skip it)

Key Components to Know
* Card rarities: Common, Uncommon, and Rare cards - rarity affects when/where they show up as rewards
* Monster scaling: Enemies get tougher as you progress to higher floors/acts
* Monster intent: Enemies have patterns that wil be displayed on the Monsters

---

![Game Screenshot](https://i.imgur.com/2K3ImK9.jpeg)
![Game Screenshot](https://i.imgur.com/0ULVHxx.jpeg)


## Technical Implementation

### Architecture & Design Patterns

The project uses a modular structure with separated concerns across multiple JavaScript modules including state.js, ui.js, card.js, monster.js, and main.js. This creates a clean separation between game logic, rendering, and data management with a scalable file organization that supports future feature additions.

State management relies on a centralized system using object-based patterns with reactive state updates triggering UI re-renders. The system manages complex state transitions between combat phases including Player Turn, Monster Turn, and Victory/Defeat scenarios.

The game loop operates on an event-driven model with a turn-based system coordinating player actions, energy consumption, and monster AI. Phase management handles combat flow, card draw mechanics, and win/loss conditions seamlessly.

### Core Technical Challenges Solved

**Dynamic Card Rendering System**

The most complex aspect of the project involved rendering and managing card states dynamically. I built a flexible rendering pipeline for displaying 5-card hands from shuffled decks, implemented card interaction handlers with energy cost validation, and managed multiple card piles including draw pile, discard pile, hand, and exhaust pile with proper synchronization across all systems.

**Combat Calculation Engine**

The combat system features real-time damage and block calculation with proper turn sequencing and state cleanup including block reset, energy refresh, and card cycling. The monster intent system includes attack pattern logic that creates varied combat encounters.

**Procedural Systems**

Randomized monster encounters scale appropriately by player level while weighted card reward generation provides meaningful choices. The percentage-based RNG system ensures combat outcomes feel fair and strategic.

**UI State Synchronization**

I developed a custom render cycle ensuring the UI accurately reflects game state at all times. Loading screen transitions between game phases provide smooth gameplay flow while real-time health, energy, and block display updates keep players informed of their current status.

---

## Game Mechanics

Players begin with 3 HP at Level 1, starting with a deck of 10 cards consisting of 5 Strikes, 4 Defends, and 1 Bash. Each turn provides 3 energy for playing cards.

Combat follows a structured flow where players draw 5 cards at turn start and play cards that consume energy to attack or defend. After the player ends their turn, the monster executes its attack pattern. Victory grants either card rewards or healing options, and players progress through 10 levels working toward the final boss encounter.

---

## Technologies Used

- **JavaScript (ES6+)** - Core game logic and state management
- **HTML5** - Game structure and interface
- **CSS3** - Styling and visual presentation
- **GitHub Pages** - Deployment and hosting

---

## Getting Started

Clone the repository with `git clone [your-repo-url]` then open index.html in your browser, or visit the live demo link above.

---

## What I Learned

This project reinforced several key software engineering concepts including state management in complex, interactive applications without frameworks, and modular architecture with proper separation of concerns at scale. I gained hands-on experience with game loop patterns and turn-based system design while optimizing DOM manipulation for performance. The project required careful data structure selection for game mechanics using arrays, objects, and pile management systems. Debugging complex state transitions across multiple interconnected systems sharpened my problem-solving approach and attention to architectural detail.

---

## Future Enhancements

Planned additions include involving multiple monsters per battle (e.g. slimes or louse has a random encounter with multiple units), including more special effects such as buffs, and debuffs. Visual improvemants and drag handling animations.

---

## Attributions

* [Slay the Spire Wiki Database](https://slay-the-spire.fandom.com/wiki/Slay_the_Spire_Wiki)


---

## Connect

[Your LinkedIn] | [Your Portfolio] | [Your Email]

---

This project was built as a technical learning exercise to explore game development fundamentals and demonstrate proficiency in vanilla JavaScript without relying on frameworks or libraries.
