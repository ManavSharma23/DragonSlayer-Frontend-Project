# DragonSlayer RPG 🐉

A modernized, dark fantasy turn-based RPG web application built with **modular Vanilla JavaScript (ES modules)**, **HTML5**, and **CSS3**.

---

## 🎮 Features Implemented

### 1. Visual Design & Aesthetics
- **Dark Fantasy Theme:** Rich deep navy and charcoal palette accented with luminous gold and crimson borders.
- **Typography:** Pixel & fantasy Google Fonts (`Press Start 2P`, `MedievalSharp`, and `Inter`).
- **Dynamic Location Backdrops:** Atmospheric ambient lighting for Town Square, Summersville Store, Caverns, and Dragon's Lair.
- **Pixel / Vector Monster Art:** Custom animated SVG sprites for **Slime**, **Fang Beast**, **Ogre**, and the **Dragon of Zandarious**.
- **Fixed Top HUD:**
  - Character level badge
  - Animated HP and XP progress bars
  - Gold counter
  - Equipped weapon and armor slots with hover tooltips

### 2. Combat Feedback & Animations
- **Visual Effects:** Screen shake on heavy impacts, red flash damage indicator on monster sprites, and death fade-outs.
- **Floating Numbers:** Floating damage and healing indicators with critical hit styling.
- **Color-Coded Scrolling Combat Log:** Red for incoming damage, pink for outgoing damage, gold for crits and loot, green for healing, purple for dodges, and cyan for quests.
- **Sound Effects (Web Audio API Synthesizer):** Sword hit, critical hit, shield block, coin collection, potion drinking, level up, boss roar, and game over—plus mute toggle button (🔊 / 🔇).
- **Boss Intro Screen:** Dark pulsing overlay with "BOSS FIGHT" presentation and enlarged boss HP bar.

### 3. Gameplay Depth & Mechanics
- **Leveling & Stat Growth:** Dynamic XP thresholds, Max HP scaling, base attack and defense bonuses, and crit/dodge scaling upon level up.
- **Combat Variety:** Critical hit rate, dodge/miss calculations, shield defending (reducing damage by ~60%), and fleeing.
- **Dragon Boss Abilities:** Multi-turn charged attack with infernal fire breath warning.
- **Shop & Inventory:** Full store selling potions, tiered weapons, and armor that dynamically grey out if gold is insufficient.
- **Random Events & Quests:** Active quests (e.g., "Clear the Infestation") with gold/XP rewards, plus random treasure chests.

### 4. Polish & Architecture
- **Save & Load:** Automatic and manual state persistence via `localStorage`.
- **Main Menu:** Start screen with "New Adventure" and "Continue Game".
- **Keyboard Shortcuts:** Press `1`, `2`, `3`, `4` on your keyboard for rapid actions.
- **Mobile Responsive:** Flex/grid layouts with large touch targets formatted for smartphones and desktop screens.
- **Modular JavaScript:**
  - `game.js` - Main entry point
  - `js/state.js` - Centralized reactive game state, leveling math, and storage
  - `js/combat.js` - Turn calculations, crits, dodges, and boss mechanics
  - `js/shop.js` - Equipment and potion logic
  - `js/ui.js` - HUD, modal management, log, and feedback renderer
  - `js/audio.js` - Web Audio API sound synthesizers
  - `js/sprites.js` - Vector pixel art sprites
- **Automated Tests:** Built-in unit tests in `test/combat.test.js`.

---

## 🚀 How to Run Locally

Because the project uses standard **ES Modules** (`import` / `export`), it needs to be served via any local HTTP server (browsers block local file imports over `file://` for CORS security).

### Option 1: Python (Recommended - No install required)
Run this command from inside the `DragonSlayer-RPG` directory:
```bash
python3 -m http.server 8080
```
Then open your browser to:
👉 **[http://localhost:8080](http://localhost:8080)**

---

### Option 2: Node.js (npx serve)
```bash
npx -y serve .
```

---

### Option 3: VS Code / IDE Live Server
If you use VS Code or PyCharm / WebStorm:
- Right-click [index.html](file:///Users/nehasharma/DragonSlayer-RPG/index.html) and select **"Open with Live Server"** or click the **Browser Preview** icon.

---

## 🧪 Running Unit Tests
To run the automated combat and leveling tests:
```bash
npm test
```
All tests run with Node's native test runner (`node --test`).
