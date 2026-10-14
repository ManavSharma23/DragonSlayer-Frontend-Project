// UI Controller: Renders HUD, Duel Arena, Battlers, 2x2 Action Bar, Modals, and Tooltips
import { gameState } from "./state.js";
import { combatEngine } from "./combat.js";
import { ShopInventoryManager } from "./shop.js";
import { sounds } from "./audio.js";
import { SPRITES } from "./sprites.js";

export class UIController {
    constructor() {
        this.cacheElements();
        this.bindEvents();
    }

    cacheElements() {
        this.gameCard = document.getElementById("game-card");
        this.locationBackdrop = document.getElementById("location-backdrop");
        this.hudLevel = document.getElementById("hud-level");
        this.hudHpFill = document.getElementById("hud-hp-fill");
        this.hudHpText = document.getElementById("hud-hp-text");
        this.hudXpFill = document.getElementById("hud-xp-fill");
        this.hudXpText = document.getElementById("hud-xp-text");
        this.hudGoldText = document.getElementById("hud-gold-text");
        this.hudWeaponText = document.getElementById("hud-weapon-text");
        this.hudArmorText = document.getElementById("hud-armor-text");
        this.muteToggleBtn = document.getElementById("btn-mute-toggle");

        this.stageArea = document.getElementById("stage-area");
        this.locationTag = document.getElementById("location-tag");
        this.questPill = document.getElementById("quest-pill");

        // Duel Stage elements
        this.townScene = document.getElementById("town-scene");
        this.duelStage = document.getElementById("duel-stage");
        this.playerBattler = document.getElementById("player-battler");
        this.monsterBattler = document.getElementById("monster-battler");
        this.playerSpriteNode = document.getElementById("player-sprite-node");
        this.monsterSpriteNode = document.getElementById("monster-sprite-node");

        this.duelPlayerName = document.getElementById("duel-player-name");
        this.duelPlayerHpFill = document.getElementById("duel-player-hp-fill");
        this.duelPlayerHpText = document.getElementById("duel-player-hp-text");

        this.duelMonsterName = document.getElementById("duel-monster-name");
        this.duelMonsterHpFill = document.getElementById("duel-monster-hp-fill");
        this.duelMonsterHpText = document.getElementById("duel-monster-hp-text");
        this.duelBossBadge = document.getElementById("duel-boss-badge");

        this.logContainer = document.getElementById("log-container");
        this.actionButtonsGrid = document.getElementById("action-buttons-grid");
        this.logDrawer = document.getElementById("log-sidebar-drawer");
        this.logToggleBtn = document.getElementById("btn-log-toggle");
        this.logCloseBtn = document.getElementById("btn-close-log-drawer");
        this.screenWarningBanner = document.getElementById("screen-warning-banner");
        this.screenWarningText = document.getElementById("screen-warning-text");

        this.bossIntroOverlay = document.getElementById("boss-intro-overlay");
        this.bossIntroBtn = document.getElementById("boss-intro-engage-btn");

        this.levelUpToast = document.getElementById("level-up-toast");
        this.levelUpText = document.getElementById("level-up-text");

        this.uiTooltip = document.getElementById("ui-tooltip");
        this.tooltipTitle = document.getElementById("tooltip-title");
        this.tooltipDesc = document.getElementById("tooltip-desc");
        this.tooltipStat = document.getElementById("tooltip-stat");

        // Modals
        this.startModal = document.getElementById("modal-start");
        this.startBtnNew = document.getElementById("btn-new-game");

        this.shopModal = document.getElementById("modal-shop");
        this.shopList = document.getElementById("shop-item-list");

        this.inventoryModal = document.getElementById("modal-inventory");
        this.inventoryList = document.getElementById("inventory-item-list");

        this.gameOverModal = document.getElementById("modal-gameover");
        this.gameOverStats = document.getElementById("gameover-stats");
        this.retryBtn = document.getElementById("btn-retry");

        this.victoryModal = document.getElementById("modal-victory");
        this.victoryStats = document.getElementById("victory-stats");
        this.playAgainBtn = document.getElementById("btn-play-again");

        // Combat Reward Popup
        this.combatRewardPopup = document.getElementById("combat-reward-popup");
        this.rewardMonsterName = document.getElementById("reward-monster-name");
        this.rewardGoldValue = document.getElementById("reward-gold-value");
        this.rewardXpValue = document.getElementById("reward-xp-value");

        // Potion Select Modal
        this.potionSelectModal = document.getElementById("modal-potion-select");
        this.potionSelectList = document.getElementById("potion-select-list");
        this.potionSelectCloseBtn = document.getElementById("btn-close-potion-select");
    }

    bindEvents() {
        // State subscription
        gameState.subscribe(() => {
            this.renderHUD();
            this.renderStage();
            this.renderActionButtons();
        });

        // Combat log callback
        combatEngine.onLog((msg, type) => {
            this.appendLog(msg, type);
        });

        // Combat visual feedback callback
        combatEngine.onFeedback((type, payload) => {
            this.handleFeedback(type, payload);
        });

        // Audio mute toggle
        if (this.muteToggleBtn) {
            this.muteToggleBtn.addEventListener("click", () => {
                const isMuted = sounds.toggleMute();
                const label = document.getElementById("audio-label");
                if (label) {
                    label.textContent = isMuted ? "AUDIO OFF" : "AUDIO ON";
                } else {
                    this.muteToggleBtn.textContent = isMuted ? "AUDIO OFF" : "AUDIO ON";
                }
            });
        }

        // Log drawer toggle button (in top HUD near audio)
        if (this.logToggleBtn) {
            this.logToggleBtn.addEventListener("click", () => {
                if (this.logDrawer) {
                    const isOpen = this.logDrawer.classList.toggle("open");
                    this.logToggleBtn.classList.toggle("active", isOpen);
                    sounds.playButtonClick();
                }
            });
        }

        if (this.logCloseBtn) {
            this.logCloseBtn.addEventListener("click", () => {
                if (this.logDrawer) {
                    this.logDrawer.classList.remove("open");
                    if (this.logToggleBtn) this.logToggleBtn.classList.remove("active");
                }
            });
        }

        // Keyboard shortcuts (1, 2, 3, 4)
        window.addEventListener("keydown", (e) => {
            if (["1", "2", "3", "4"].includes(e.key)) {
                const idx = parseInt(e.key, 10) - 1;
                const buttons = this.actionButtonsGrid.querySelectorAll(".action-btn");
                if (buttons[idx] && !buttons[idx].disabled) {
                    buttons[idx].click();
                }
            }
        });

        // Start modal button
        if (this.startBtnNew) {
            this.startBtnNew.addEventListener("click", () => {
                gameState.reset();
                this.hideModal(this.startModal);
                this.appendLog("A new warrior awakens in the realm of Geblery.", "normal");
                sounds.playButtonClick();
            });
        }

        // Retry & Play Again
        if (this.retryBtn) {
            this.retryBtn.addEventListener("click", () => {
                this.hideModal(this.gameOverModal);
                gameState.reset();
                this.setLocation("town");
            });
        }

        if (this.playAgainBtn) {
            this.playAgainBtn.addEventListener("click", () => {
                this.hideModal(this.victoryModal);
                gameState.reset();
                this.setLocation("town");
            });
        }

        // Boss intro button
        if (this.bossIntroBtn) {
            this.bossIntroBtn.addEventListener("click", () => {
                this.bossIntroOverlay.classList.remove("active");
            });
        }

        // Close modal buttons
        document.querySelectorAll(".close-modal-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const modal = e.target.closest(".modal-overlay");
                if (modal) this.hideModal(modal);
            });
        });

        // Potion select close button
        if (this.potionSelectCloseBtn) {
            this.potionSelectCloseBtn.addEventListener("click", () => {
                this.hideModal(this.potionSelectModal);
            });
        }

        // Tooltip listeners
        document.addEventListener("mousemove", (e) => {
            if (this.uiTooltip.style.display === "block") {
                this.uiTooltip.style.left = `${e.clientX + 14}px`;
                this.uiTooltip.style.top = `${e.clientY + 14}px`;
            }
        });
    }

    showTooltip(title, desc, stat, x, y) {
        this.tooltipTitle.textContent = title;
        this.tooltipDesc.textContent = desc;
        this.tooltipStat.textContent = stat;
        this.uiTooltip.style.display = "block";
        this.uiTooltip.style.left = `${x + 14}px`;
        this.uiTooltip.style.top = `${y + 14}px`;
    }

    hideTooltip() {
        this.uiTooltip.style.display = "none";
    }

    showModal(modal) {
        if (modal) modal.classList.add("active");
    }

    hideModal(modal) {
        if (modal) modal.classList.remove("active");
    }

    setLocation(locKey) {
        gameState.state.currentLocation = locKey;
        this.gameCard.className = `loc-${locKey}`;
        sounds.playButtonClick();
        gameState.notify();
    }

    renderHUD() {
        const p = gameState.state.player;
        this.hudLevel.textContent = p.level;

        // Health Bar
        const hpPercent = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
        this.hudHpFill.style.width = `${hpPercent}%`;
        this.hudHpText.textContent = `${p.hp}/${p.maxHp}`;

        // XP Bar
        const xpPercent = Math.max(0, Math.min(100, (p.xp / p.xpNext) * 100));
        this.hudXpFill.style.width = `${xpPercent}%`;
        this.hudXpText.textContent = `${p.xp}/${p.xpNext}`;

        // Gold
        this.hudGoldText.textContent = p.gold;

        // Equipped Gear
        const weapon = gameState.getEquippedWeapon();
        const armor = gameState.getEquippedArmor();
        this.hudWeaponText.textContent = weapon ? weapon.name : "None";
        this.hudArmorText.textContent = armor ? armor.name : "None";

        // Setup HUD slot tooltips
        const weaponSlot = document.getElementById("hud-weapon-slot");
        if (weaponSlot && weapon) {
            weaponSlot.onmouseenter = (e) => this.showTooltip(weapon.name, weapon.intro_text, `Damage: +${weapon.damage}`, e.clientX, e.clientY);
            weaponSlot.onmouseleave = () => this.hideTooltip();
        }

        const armorSlot = document.getElementById("hud-armor-slot");
        if (armorSlot && armor) {
            armorSlot.onmouseenter = (e) => this.showTooltip(armor.name, armor.intro_text, `Defense: +${armor.defense}`, e.clientX, e.clientY);
            armorSlot.onmouseleave = () => this.hideTooltip();
        }

        // Quest Pill
        const q = gameState.state.quest;
        if (q.active) {
            this.questPill.textContent = q.completed ? "QUEST COMPLETED" : `QUEST: ${q.title} (${q.current}/${q.required})`;
        }
    }

    renderStage() {
        const monster = gameState.state.activeMonster;
        const loc = gameState.state.currentLocation;
        const p = gameState.state.player;

        if (monster && gameState.state.inCombat) {
            this.townScene.style.display = "none";
            this.duelStage.style.display = "flex";
            this.locationTag.innerHTML = `ARENA: ${monster.name.toUpperCase()}`;

            // Render Player Battler
            this.playerSpriteNode.innerHTML = SPRITES.player;
            this.duelPlayerName.textContent = p.name;
            const playerHpPercent = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
            this.duelPlayerHpFill.style.width = `${playerHpPercent}%`;
            this.duelPlayerHpText.textContent = `${p.hp} / ${p.maxHp} HP`;

            // Render Monster Battler
            this.monsterSpriteNode.innerHTML = SPRITES[monster.sprite] || "";
            if (monster.isBoss) {
                this.monsterSpriteNode.classList.add("boss-scale");
                this.duelBossBadge.style.display = "inline-block";
            } else {
                this.monsterSpriteNode.classList.remove("boss-scale");
                this.duelBossBadge.style.display = "none";
            }

            this.duelMonsterName.textContent = monster.name;
            const monsterHpPercent = Math.max(0, Math.min(100, (monster.health / monster.maxHealth) * 100));
            this.duelMonsterHpFill.style.width = `${monsterHpPercent}%`;
            this.duelMonsterHpText.textContent = `${monster.health} / ${monster.maxHealth} HP`;
        } else {
            this.duelStage.style.display = "none";
            this.townScene.style.display = "flex";

            if (loc === "town") {
                this.locationTag.innerHTML = `TOWN SQUARE OF GEBLERY`;
                document.getElementById("town-title").textContent = "Town of Geblery";
                document.getElementById("town-desc").textContent = "The ancient garrison stands resilient amidst desolate crags. Prepare your armaments before venturing beyond the gates.";
            } else if (loc === "store") {
                this.locationTag.innerHTML = `DRAGONAISE SUMMERSVILLE`;
                document.getElementById("town-title").textContent = "Armory & Alchemy";
                document.getElementById("town-desc").textContent = "Ancient armaments and restorative draughts lining dark tempered shelves.";
            } else if (loc === "cave") {
                this.locationTag.innerHTML = `FORBIDDEN CAVERNS`;
                document.getElementById("town-title").textContent = "The Dark Caverns";
                document.getElementById("town-desc").textContent = "Subterranean depths shudder with hollow tremors. Formidable beasts prowl in the dark.";
            }
        }
    }

    getActionIllusSvg(type) {
        if (type === "sword") {
            return `
            <svg viewBox="0 0 44 44" class="btn-illus-svg">
                <defs>
                    <linearGradient id="bladeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#94a3b8"/>
                        <stop offset="45%" stop-color="#ffffff"/>
                        <stop offset="55%" stop-color="#cbd5e1"/>
                        <stop offset="100%" stop-color="#64748b"/>
                    </linearGradient>
                    <linearGradient id="goldHilt" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#fef08a"/>
                        <stop offset="50%" stop-color="#d4af37"/>
                        <stop offset="100%" stop-color="#78350f"/>
                    </linearGradient>
                </defs>
                <path d="M 6 8 L 10 6 L 30 26 L 26 30 Z" fill="url(#bladeGrad)" stroke="#475569" stroke-width="0.8"/>
                <polygon points="6,8 8,4 10,6" fill="#ffffff" stroke="#475569" stroke-width="0.8"/>
                <line x1="8" y1="6" x2="27" y2="25" stroke="#38bdf8" stroke-width="0.8"/>
                <path d="M 23 33 L 33 23 L 35 25 L 25 35 Z" fill="url(#goldHilt)" stroke="#451a03" stroke-width="0.8"/>
                <line x1="28" y1="28" x2="36" y2="36" stroke="#582910" stroke-width="3.5" stroke-linecap="round"/>
                <circle cx="37" cy="37" r="2.8" fill="url(#goldHilt)" stroke="#451a03" stroke-width="0.8"/>
            </svg>`;
        }
        if (type === "shield") {
            return `
            <svg viewBox="0 0 44 44" class="btn-illus-svg">
                <defs>
                    <linearGradient id="shieldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#f1f5f9"/>
                        <stop offset="50%" stop-color="#94a3b8"/>
                        <stop offset="100%" stop-color="#334155"/>
                    </linearGradient>
                    <linearGradient id="shieldTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#38bdf8"/>
                        <stop offset="70%" stop-color="#0284c7"/>
                        <stop offset="100%" stop-color="#082f49"/>
                    </linearGradient>
                    <linearGradient id="shieldBronze" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#e2e8f0"/>
                        <stop offset="60%" stop-color="#94a3b8"/>
                        <stop offset="100%" stop-color="#475569"/>
                    </linearGradient>
                </defs>
                <path d="M 8 9 C 14 7, 30 7, 36 9 C 36 23, 29 33, 22 39 C 15 33, 8 23, 8 9 Z" fill="url(#shieldRim)" stroke="#1e293b" stroke-width="1.2"/>
                <path d="M 11 11 C 16 9.5, 22 9.5, 22 9.5 L 22 36 C 17 31, 11 23, 11 11 Z" fill="url(#shieldBronze)"/>
                <path d="M 22 9.5 C 22 9.5, 28 9.5, 33 11 C 33 23, 27 31, 22 36 Z" fill="url(#shieldTeal)"/>
                <line x1="22" y1="9.5" x2="22" y2="36" stroke="#0f172a" stroke-width="1"/>
                <circle cx="12" cy="13" r="1.2" fill="#ffffff"/>
                <circle cx="32" cy="13" r="1.2" fill="#ffffff"/>
                <circle cx="22" cy="35" r="1.2" fill="#ffffff"/>
            </svg>`;
        }
        if (type === "potion") {
            return `
            <svg viewBox="0 0 44 44" class="btn-illus-svg">
                <defs>
                    <radialGradient id="potionLiquidRed" cx="35%" cy="40%" r="65%">
                        <stop offset="0%" stop-color="#f87171"/>
                        <stop offset="45%" stop-color="#dc2626"/>
                        <stop offset="100%" stop-color="#580808"/>
                    </radialGradient>
                </defs>
                <polygon points="19,5 25,5 26,11 18,11" fill="#b45309" stroke="#78350f" stroke-width="0.8"/>
                <rect x="18" y="11" width="8" height="6" fill="#e2e8f0" opacity="0.5"/>
                <rect x="16" y="10" width="12" height="2" rx="1" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.8"/>
                <circle cx="22" cy="27" r="13" fill="url(#potionLiquidRed)" stroke="#cbd5e1" stroke-width="1.2"/>
                <ellipse cx="22" cy="20" rx="9" ry="2.5" fill="#fca5a5" opacity="0.6"/>
                <path d="M 14 24 Q 13 32 18 36" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8"/>
                <circle cx="28" cy="28" r="1.2" fill="#ffffff" opacity="0.7"/>
            </svg>`;
        }
        if (type === "boot") {
            return `
            <svg viewBox="0 0 44 44" class="btn-illus-svg">
                <defs>
                    <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#a2623a"/>
                        <stop offset="50%" stop-color="#783c18"/>
                        <stop offset="100%" stop-color="#451e08"/>
                    </linearGradient>
                </defs>
                <path d="M 16 8 L 26 9 L 24 23 L 34 27 C 37 29, 36 34, 33 35 L 13 35 C 11 35, 10 32, 12 30 L 16 23 Z" fill="url(#leatherGrad)" stroke="#2b1103" stroke-width="1.2"/>
                <path d="M 11 35 L 34 35 C 36 35, 36 38, 34 38 L 11 38 C 9 38, 9 35, 11 35 Z" fill="#1c0b02"/>
                <line x1="16" y1="14" x2="25" y2="15" stroke="#d4af37" stroke-width="1.5"/>
                <circle cx="21" cy="14.5" r="1.5" fill="#fef08a"/>
                <line x1="15" y1="20" x2="24" y2="21" stroke="#d4af37" stroke-width="1.5"/>
                <circle cx="20" cy="20.5" r="1.5" fill="#fef08a"/>
                <path d="M 28 12 Q 34 10 32 16 Q 30 14 28 12 Z" fill="#38bdf8" opacity="0.85"/>
            </svg>`;
        }
        return "";
    }

    renderActionButtons() {
        this.actionButtonsGrid.innerHTML = "";
        const loc = gameState.state.currentLocation;
        const inCombat = gameState.state.inCombat;

        let buttons = [];

        if (inCombat) {
            const hasPotions = gameState.state.inventory.potions.some(p => p.quantity > 0);
            buttons = [
                {
                    label: "ATTACK",
                    prefixSymbol: "✕",
                    illusType: "sword",
                    class: "btn-attack",
                    shortcut: "1",
                    action: () => {
                        this.animateLunge("player");
                        combatEngine.playerAttack();
                    }
                },
                {
                    label: "DEFEND",
                    prefixSymbol: "🛡️",
                    illusType: "shield",
                    class: "btn-defend",
                    shortcut: "2",
                    action: () => combatEngine.playerDefend()
                },
                {
                    label: "USE POTION",
                    prefixSymbol: "🧪",
                    illusType: "potion",
                    class: "btn-potion",
                    shortcut: "3",
                    disabled: !hasPotions,
                    action: () => this.openPotionSelectModal()
                },
                {
                    label: "RUN",
                    prefixSymbol: "✦",
                    illusType: "boot",
                    class: "btn-flee",
                    shortcut: "4",
                    action: () => {
                        const escaped = combatEngine.playerFlee();
                        if (escaped) this.setLocation("town");
                    }
                }
            ];
        } else if (loc === "town") {
            buttons = [
                {
                    label: "GO TO STORE",
                    icon: "💰",
                    shortcut: "1",
                    action: () => this.setLocation("store")
                },
                {
                    label: "GO TO CAVE",
                    icon: "⛰️",
                    shortcut: "2",
                    action: () => this.setLocation("cave")
                },
                {
                    label: "FIGHT DRAGON",
                    icon: "🐉",
                    class: "btn-boss",
                    shortcut: "3",
                    action: () => {
                        this.setLocation("dragon");
                        combatEngine.startCombat("dragon");
                    }
                },
                {
                    label: "INVENTORY",
                    icon: "🎒",
                    shortcut: "4",
                    action: () => this.openInventoryModal()
                }
            ];
        } else if (loc === "store") {
            buttons = [
                {
                    label: "BROWSE SHOP",
                    icon: "🛒",
                    shortcut: "1",
                    action: () => this.openShopModal()
                },
                {
                    label: "INVENTORY",
                    icon: "🎒",
                    shortcut: "2",
                    action: () => this.openInventoryModal()
                },
                {
                    label: "RETURN TO TOWN",
                    icon: "🏰",
                    shortcut: "3",
                    action: () => this.setLocation("town")
                },
                {
                    label: "REST (+HP)",
                    icon: "✨",
                    shortcut: "4",
                    action: () => {
                        gameState.healPlayer(30);
                        this.appendLog("Rested at the store bench, restoring 30 HP.", "heal");
                    }
                }
            ];
        } else if (loc === "cave") {
            buttons = [
                {
                    label: "FIGHT SLIME",
                    icon: "🟢",
                    shortcut: "1",
                    action: () => combatEngine.startCombat("slime")
                },
                {
                    label: "FIGHT BEAST",
                    icon: "🐺",
                    shortcut: "2",
                    action: () => combatEngine.startCombat("fangbeast")
                },
                {
                    label: "FIGHT OGRE",
                    icon: "👹",
                    shortcut: "3",
                    action: () => combatEngine.startCombat("ogre")
                },
                {
                    label: "RETURN TO TOWN",
                    icon: "🏰",
                    shortcut: "4",
                    action: () => this.setLocation("town")
                }
            ];
        }

        buttons.forEach(btnInfo => {
            const btn = document.createElement("button");
            btn.className = `action-btn ${btnInfo.class || ""}`;
            btn.disabled = !!btnInfo.disabled;
            const illus = btnInfo.illusType ? this.getActionIllusSvg(btnInfo.illusType) : (btnInfo.icon ? `<span class="btn-emoji-icon">${btnInfo.icon}</span>` : "");
            btn.innerHTML = `
                <div class="btn-illus-anchor">${illus}</div>
                <div class="btn-title-cluster">
                    ${btnInfo.prefixSymbol ? `<span class="btn-prefix-mark">${btnInfo.prefixSymbol}</span>` : ""}
                    <span class="btn-label-text">${btnInfo.label}</span>
                </div>
                <div class="btn-gem-bracket">
                    <span class="btn-diamond-gem ${btnInfo.class === 'btn-boss' ? 'gem-red' : ''}"></span>
                </div>
                <span class="key-badge">${btnInfo.shortcut}</span>
            `;
            btn.onclick = () => {
                sounds.playButtonClick();
                btnInfo.action();
            };
            this.actionButtonsGrid.appendChild(btn);
        });
    }

    animateLunge(target) {
        if (target === "player" && this.playerBattler) {
            this.playerBattler.classList.remove("lunge-right");
            void this.playerBattler.offsetWidth;
            this.playerBattler.classList.add("lunge-right");
            setTimeout(() => this.playerBattler.classList.remove("lunge-right"), 400);
        } else if (target === "monster" && this.monsterBattler) {
            this.monsterBattler.classList.remove("lunge-left");
            void this.monsterBattler.offsetWidth;
            this.monsterBattler.classList.add("lunge-left");
            setTimeout(() => this.monsterBattler.classList.remove("lunge-left"), 400);
        }
    }

    showScreenWarning(text) {
        if (!this.screenWarningBanner) return;
        const cleanText = text.replace(/^\[(WARNING|ALERT)\]\s*/i, '');
        if (this.screenWarningText) {
            this.screenWarningText.textContent = cleanText;
        }
        this.screenWarningBanner.style.display = "flex";
        this.screenWarningBanner.style.opacity = "1";
        this.screenWarningBanner.style.transform = "translateX(-50%) translateY(0)";

        if (this._warningTimeout) clearTimeout(this._warningTimeout);
        this._warningTimeout = setTimeout(() => {
            this.screenWarningBanner.style.opacity = "0";
            this.screenWarningBanner.style.transform = "translateX(-50%) translateY(-10px)";
            setTimeout(() => {
                this.screenWarningBanner.style.display = "none";
            }, 300);
        }, 3200);
    }

    appendLog(msg, type = "normal") {
        const row = document.createElement("div");
        row.className = "log-entry";
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        row.innerHTML = `<span class="log-system-badge">LISTEN</span><span class="log-time-text">[${time}]</span><span class="log-msg ${type}">${msg}</span>`;
        if (this.logContainer) {
            this.logContainer.appendChild(row);
            this.logContainer.scrollTop = this.logContainer.scrollHeight;
        }

        // Show warnings (e.g. "[WARNING] You cannot flee from a Boss encounter", alerts, etc.) on the main screen
        if (msg.includes("[WARNING]") || msg.includes("[ALERT]") || type === "damage-in" && msg.toLowerCase().includes("cannot flee")) {
            this.showScreenWarning(msg);
        }
    }

    handleFeedback(type, payload) {
        if (type === "screenShake") {
            this.gameCard.classList.remove("shake-light", "shake-heavy");
            void this.gameCard.offsetWidth; // trigger reflow
            this.gameCard.classList.add(payload.heavy ? "shake-heavy" : "shake-light");
            setTimeout(() => this.gameCard.classList.remove("shake-light", "shake-heavy"), 450);
        } else if (type === "monsterFlash") {
            this.monsterSpriteNode.classList.remove("flash-red");
            void this.monsterSpriteNode.offsetWidth;
            this.monsterSpriteNode.classList.add("flash-red");
        } else if (type === "playerFlash") {
            this.playerSpriteNode.classList.remove("flash-red");
            void this.playerSpriteNode.offsetWidth;
            this.playerSpriteNode.classList.add("flash-red");
            this.animateLunge("monster");
        } else if (type === "monsterFade") {
            this.monsterBattler.classList.add("monster-fade-out");
            setTimeout(() => {
                this.monsterBattler.classList.remove("monster-fade-out");
            }, 750);
        } else if (type === "damageNumber") {
            this.spawnDamageNumber(payload.target, payload.amount, payload.isCrit, payload.isHeal);
        } else if (type === "bossIntro") {
            this.bossIntroOverlay.classList.add("active");
        } else if (type === "levelUpPopup") {
            this.levelUpText.textContent = `Level ${payload.newLevel} Reached! Max HP & Combat Ratings Increased.`;
            this.levelUpToast.classList.add("active");
            setTimeout(() => this.levelUpToast.classList.remove("active"), 3500);
        } else if (type === "gameOver") {
            const st = gameState.state.stats;
            this.gameOverStats.innerHTML = `
                <p>Killed by: <strong>${payload.killer}</strong></p>
                <p>Monsters Defeated: <strong>${st.monstersDefeated}</strong></p>
                <p>Total Gold Earned: <strong>${st.goldEarned} Gold</strong></p>
                <p>Turns Taken: <strong>${st.turnsTaken}</strong></p>
            `;
            this.showModal(this.gameOverModal);
        } else if (type === "monsterDefeated") {
            this.showCombatRewardPopup(payload.monsterName, payload.goldReward, payload.xpReward);
        } else if (type === "victoryScreen") {
            const st = gameState.state.stats;
            this.victoryStats.innerHTML = `
                <p>The Dragon of Zandarious has fallen.</p>
                <p>Monsters Slain: <strong>${st.monstersDefeated}</strong></p>
                <p>Total Gold Hoarded: <strong>${st.goldEarned} Gold</strong></p>
                <p>Total Damage Dealt: <strong>${st.damageDealt}</strong></p>
                <p>Turns to Victory: <strong>${st.turnsTaken}</strong></p>
            `;
            this.showModal(this.victoryModal);
        }
    }

    showCombatRewardPopup(monsterName, goldReward, xpReward) {
        if (!this.combatRewardPopup) return;

        // Fill in values
        this.rewardMonsterName.textContent = `${monsterName} Defeated`;
        this.rewardGoldValue.textContent = `+${goldReward}`;
        this.rewardXpValue.textContent = `+${xpReward}`;

        // Show popup
        this.combatRewardPopup.classList.add("show");

        // Auto-dismiss after 2.8 seconds
        clearTimeout(this._rewardPopupTimer);
        this._rewardPopupTimer = setTimeout(() => {
            this.combatRewardPopup.classList.remove("show");
        }, 2800);
    }

    openPotionSelectModal() {
        const potions = gameState.state.inventory.potions;

        // Build potion list UI
        this.potionSelectList.innerHTML = "";
        potions.forEach(potion => {
            const outOfStock = potion.quantity <= 0;
            const item = document.createElement("div");
            item.className = `potion-select-item${outOfStock ? " disabled" : ""}`;

            item.innerHTML = `
                <span class="potion-item-emoji">🧪</span>
                <div class="potion-item-info">
                    <div class="potion-item-name">${potion.name}</div>
                    <div class="potion-item-heal">Restores ${potion.heal} HP</div>
                </div>
                <span class="potion-item-qty ${outOfStock ? "" : "in-stock"}">x${potion.quantity}</span>
            `;

            if (!outOfStock) {
                item.addEventListener("click", () => {
                    this.hideModal(this.potionSelectModal);
                    combatEngine.playerUsePotion(potion.id);
                });
            }
            this.potionSelectList.appendChild(item);
        });

        this.showModal(this.potionSelectModal);
    }

    spawnDamageNumber(target, amount, isCrit, isHeal = false) {
        const num = document.createElement("div");
        num.className = `floating-number ${isHeal ? "floating-heal" : isCrit ? "floating-crit" : "floating-damage"}`;
        num.textContent = isHeal ? `+${amount}` : isCrit ? `-${amount} CRIT!` : `-${amount}`;

        // Get the battler plate (name/HP box) which sits at the very top of each character card
        const battler = target === "monster" 
            ? document.getElementById("monster-battler")
            : document.getElementById("player-battler");

        if (battler) {
            const plate = battler.querySelector(".battler-plate");
            const rect = (plate || battler).getBoundingClientRect();
            // Position cleanly ABOVE the character box, matching Image 3
            const centerX = rect.left + (rect.width / 2);
            const topY = rect.top - 45;
            num.style.left = `${centerX + (Math.random() * 16 - 8)}px`;
            num.style.top = `${topY + (Math.random() * 10 - 5)}px`;
            num.style.transform = "translateX(-50%)";
        } else {
            num.style.left = target === "monster" ? "75%" : "25%";
            num.style.top = "35%";
            num.style.transform = "translateX(-50%)";
        }

        document.body.appendChild(num);
        setTimeout(() => num.remove(), 1000);
    }

    openShopModal() {
        if (!this.shopTabCategory) {
            this.shopTabCategory = "potions";
        }

        const shopTabPotions = document.getElementById("shop-tab-potions");
        const shopTabWeapons = document.getElementById("shop-tab-weapons");
        const shopTabArmor = document.getElementById("shop-tab-armor");
        const previewPane = document.getElementById("shop-preview-pane");

        // Bind tab click listeners only once
        const bindTab = (el, category) => {
            if (el && !el.dataset.bound) {
                el.dataset.bound = "true";
                el.addEventListener("click", () => {
                    this.shopTabCategory = category;
                    this.selectedShopItem = null;
                    this.openShopModal();
                });
            }
        };
        bindTab(shopTabPotions, "potions");
        bindTab(shopTabWeapons, "weapons");
        bindTab(shopTabArmor, "armor");

        // Sync active tab state
        if (shopTabPotions) shopTabPotions.classList.toggle("active", this.shopTabCategory === "potions");
        if (shopTabWeapons) shopTabWeapons.classList.toggle("active", this.shopTabCategory === "weapons");
        if (shopTabArmor) shopTabArmor.classList.toggle("active", this.shopTabCategory === "armor");

        this.shopList.innerHTML = "";
        const playerGold = gameState.state.player.gold;

        const potionIcons = {
            potion_minor: "🧪",
            potion_major: "🏺",
            potion_divine: "🪽"
        };

        const weaponIcons = {
            dagger: "🗡️",
            hammer: "🔨",
            staff: "🪄",
            darkmatter: "⚔️"
        };

        // ── Render the bottom preview panel ──────────────────────────────────
        const renderPreview = (item) => {
            if (!item) {
                previewPane.classList.add("hidden");
                return;
            }

            previewPane.classList.remove("hidden");

            const isPotion = item.category === "potions" || item.heal !== undefined;
            const isWeapon = item.category === "weapon" || (item.damage !== undefined && item.defense === undefined);
            const isArmor = item.category === "armor" || item.defense !== undefined;

            let icon = "✨";
            let typeLabel = "Item";
            let statLabel = "Power";
            let statVal = "";
            let statusText = "";

            if (isPotion) {
                icon = potionIcons[item.id] || "🧪";
                typeLabel = "Consumable Elixir";
                statLabel = "Restoration";
                statVal = `+${item.heal} HP`;
                statusText = `In Pack: ${item.quantity}`;
            } else if (isWeapon) {
                icon = weaponIcons[item.id] || "⚔️";
                typeLabel = "Offensive Weapon";
                statLabel = "Attack Damage";
                statVal = `+${item.damage} ATK`;
                statusText = item.owned ? "✅ Owned" : "Not Owned";
            } else if (isArmor) {
                icon = "🛡️";
                typeLabel = "Protective Armor";
                statLabel = "Defense Rating";
                statVal = `+${item.defense} DEF`;
                statusText = item.owned ? "✅ Owned" : "Not Owned";
            }

            const canAfford = playerGold >= item.price;
            const alreadyOwned = (isWeapon || isArmor) && item.owned;
            const disableBuy = alreadyOwned || !canAfford;
            const btnLabel = alreadyOwned
                ? "✦ ALREADY OWNED"
                : canAfford
                    ? `🪙 BUY NOW  (${item.price} GOLD)`
                    : `🔒 NEED ${item.price - playerGold} MORE GOLD`;

            previewPane.innerHTML = `
                <div class="preview-body">
                    <div class="preview-left-col">
                        <div class="preview-header">
                            <div class="preview-icon-large">${icon}</div>
                            <div class="preview-title-box">
                                <span class="preview-category-badge">${typeLabel}</span>
                                <span class="preview-name">${item.name}</span>
                            </div>
                        </div>
                        <div class="preview-quote-box">
                            <span class="preview-quote-text">"${item.intro_text || 'An armament forged with forgotten craftsmanship.'}"</span>
                        </div>
                    </div>
                    <div class="preview-right-col">
                        <div class="preview-stats-list">
                            <div class="preview-stat-row">
                                <span class="preview-stat-label">${statLabel}</span>
                                <span class="preview-stat-val val-gold">${statVal}</span>
                            </div>
                            <div class="preview-stat-row">
                                <span class="preview-stat-label">Price</span>
                                <span class="preview-stat-val val-gold">🪙 ${item.price} Gold</span>
                            </div>
                            <div class="preview-stat-row">
                                <span class="preview-stat-label">Status</span>
                                <span class="preview-stat-val" style="color: ${alreadyOwned ? '#4ade80' : '#cbd5e1'};">${statusText}</span>
                            </div>
                        </div>
                        <div class="preview-buy-action">
                            <button class="shop-buy-pill" id="preview-buy-btn" ${disableBuy ? "disabled" : ""}>
                                ${btnLabel}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const buyBtn = document.getElementById("preview-buy-btn");
            if (buyBtn && !disableBuy) {
                buyBtn.onclick = () => {
                    let res;
                    if (isPotion) res = ShopInventoryManager.buyPotion(item.id);
                    else if (isWeapon) res = ShopInventoryManager.buyWeapon(item.id);
                    else if (isArmor) res = ShopInventoryManager.buyArmor(item.id);
                    this.appendLog(res.message, res.success ? "loot" : "damage-in");
                    this.selectedShopItem = item;
                    this.openShopModal();
                };
            }
        };

        // ── Item row builder helper ────────────────────────────────────────────
        const buildRow = (item, iconStr, statStr) => {
            const isSelected = this.selectedShopItem && this.selectedShopItem.id === item.id;
            const row = document.createElement("div");
            row.className = `shop-row-card ${isSelected ? "selected-item" : ""}`;
            const priceOrStatus = (item.owned !== undefined)
                ? (item.owned ? "OWNED" : `${item.price} 🪙`)
                : `${item.price} 🪙`;

            row.innerHTML = `
                <div class="shop-item-left">
                    <div class="shop-item-icon-box"><span>${iconStr}</span></div>
                    <div class="shop-item-details">
                        <span class="shop-item-name">${item.name.toUpperCase()}</span>
                        <span class="shop-item-stat">${statStr}</span>
                    </div>
                </div>
                <div class="shop-click-hint">
                    <span>${priceOrStatus}</span>
                    <span style="font-size:16px;">›</span>
                </div>
            `;
            row.onclick = () => {
                this.selectedShopItem = item;
                this.openShopModal();
            };
            return row;
        };

        // ── Render items based on active tab ──────────────────────────────────
        if (this.shopTabCategory === "potions") {
            gameState.state.inventory.potions.forEach(p => {
                const statStr = `Restores <span class="stat-num">${p.heal} HP</span> &nbsp;|&nbsp; Owned: ${p.quantity}`;
                this.shopList.appendChild(buildRow(p, potionIcons[p.id] || "🧪", statStr));
            });
        } else if (this.shopTabCategory === "weapons") {
            gameState.state.inventory.weapons
                .filter(w => w.id !== "knife")
                .forEach(w => {
                    const statStr = `Damage: <span class="stat-num">+${w.damage}</span> &nbsp;|&nbsp; Status: ${w.owned ? "Owned" : "Not Owned"}`;
                    this.shopList.appendChild(buildRow(w, weaponIcons[w.id] || "⚔️", statStr));
                });
        } else {
            // armor tab
            gameState.state.inventory.armors
                .filter(a => a.id !== "cloth_tunic")
                .forEach(a => {
                    const statStr = `Defense: <span class="stat-num">+${a.defense}</span> &nbsp;|&nbsp; Status: ${a.owned ? "Owned" : "Not Owned"}`;
                    this.shopList.appendChild(buildRow(a, "🛡️", statStr));
                });
        }

        renderPreview(this.selectedShopItem || null);
        this.showModal(this.shopModal);
    }

    openInventoryModal() {
        this.inventoryList.innerHTML = "";

        // Helper to create Section Titles
        const createSectionTitle = (title, icon) => {
            const wrap = document.createElement("div");
            wrap.className = "inv-section-title-bar";
            wrap.innerHTML = `
                <div class="inv-section-title-text">
                    <span>${icon}</span>
                    <span>${title}</span>
                </div>
                <div class="inv-section-line"></div>
            `;
            return wrap;
        };

        // Custom Bottle SVGs matching the screenshot
        const getPotionSvg = (color) => {
            let liquidGrad, glowColor;
            if (color === "red") {
                liquidGrad = `<radialGradient id="liqRed" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stop-color="#f87171"/>
                    <stop offset="50%" stop-color="#dc2626"/>
                    <stop offset="100%" stop-color="#7f1d1d"/>
                </radialGradient>`;
                glowColor = "#ef4444";
            } else if (color === "purple") {
                liquidGrad = `<radialGradient id="liqPurp" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stop-color="#c084fc"/>
                    <stop offset="50%" stop-color="#9333ea"/>
                    <stop offset="100%" stop-color="#581c87"/>
                </radialGradient>`;
                glowColor = "#a855f7";
            } else {
                liquidGrad = `<radialGradient id="liqBlue" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stop-color="#7dd3fc"/>
                    <stop offset="50%" stop-color="#0284c7"/>
                    <stop offset="100%" stop-color="#0369a1"/>
                </radialGradient>`;
                glowColor = "#38bdf8";
            }

            return `
            <svg viewBox="0 0 60 70" style="width: 38px; height: 44px; filter: drop-shadow(0 0 6px ${glowColor});">
                <defs>${liquidGrad}</defs>
                <!-- Cork Stopper -->
                <polygon points="26,8 34,8 36,16 24,16" fill="#d97706" stroke="#92400e" stroke-width="1.5"/>
                <!-- Bottle Neck -->
                <rect x="25" y="16" width="10" height="10" rx="1" fill="#e2e8f0" opacity="0.4"/>
                <rect x="23" y="15" width="14" height="3" rx="1.5" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
                <!-- Bottle Body / Flask -->
                <path d="M 26 26 C 22 30 14 38 14 50 C 14 62 21 66 30 66 C 39 66 46 62 46 50 C 46 38 38 30 34 26 Z" 
                      fill="${color === 'red' ? 'url(#liqRed)' : (color === 'purple' ? 'url(#liqPurp)' : 'url(#liqBlue)')}" 
                      stroke="#cbd5e1" stroke-width="1.8"/>
                <!-- Glass Specular Highlight -->
                <path d="M 20 40 Q 18 52 24 58" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.75"/>
                <ellipse cx="38" cy="42" rx="2" ry="4" fill="#ffffff" opacity="0.6"/>
            </svg>`;
        };

        // 1. CONSUMABLES SECTION
        this.inventoryList.appendChild(createSectionTitle("CONSUMABLES", "⚗️"));

        const potionThemeMap = {
            potion_minor: { color: "red", rowClass: "inv-row-red", boxClass: "icon-box-red" },
            potion_major: { color: "purple", rowClass: "inv-row-purple", boxClass: "icon-box-purple" },
            potion_divine: { color: "blue", rowClass: "inv-row-blue", boxClass: "icon-box-blue" }
        };

        gameState.state.inventory.potions.forEach(potion => {
            const theme = potionThemeMap[potion.id] || { color: "red", rowClass: "inv-row-red", boxClass: "icon-box-red" };
            const row = document.createElement("div");
            row.className = `inv-item-row ${theme.rowClass}`;
            
            const canUse = potion.quantity > 0;
            row.innerHTML = `
                <div class="inv-item-left">
                    <div class="inv-icon-box ${theme.boxClass}">
                        ${getPotionSvg(theme.color)}
                    </div>
                    <div class="inv-item-details">
                        <span class="inv-item-title">${potion.name} (x${potion.quantity})</span>
                        <span class="inv-item-desc">Restores <span class="stat-highlight">${potion.heal} HP.</span></span>
                    </div>
                </div>
                <button class="inv-pill-btn" ${!canUse ? "disabled" : ""}>
                    <span>⚗️</span>
                    <span>USE</span>
                </button>
            `;

            const btn = row.querySelector("button");
            btn.onclick = () => {
                const res = ShopInventoryManager.usePotion(potion.id);
                this.appendLog(res.message, res.success ? "heal" : "damage-in");
                this.openInventoryModal();
            };
            this.inventoryList.appendChild(row);
        });

        // 2. WEAPONS SECTION
        this.inventoryList.appendChild(createSectionTitle("WEAPONS", "⚔️"));

        const getWeaponSvg = (id) => {
            if (id === "knife" || id === "dagger") {
                return `
                <svg viewBox="0 0 50 50" style="width: 32px; height: 32px; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.6));">
                    <!-- Blade -->
                    <path d="M 14 12 L 34 16 L 38 20 L 26 28 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2"/>
                    <line x1="14" y1="12" x2="38" y2="20" stroke="#38bdf8" stroke-width="1.2"/>
                    <!-- Guard -->
                    <line x1="22" y1="23" x2="31" y2="32" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
                    <!-- Handle & Pommel -->
                    <line x1="26" y1="27" x2="36" y2="37" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
                    <circle cx="38" cy="39" r="2.5" fill="#ffd700"/>
                </svg>`;
            }
            return `<span style="font-size: 24px;">⚔️</span>`;
        };

        gameState.state.inventory.weapons.forEach(w => {
            if (!w.owned && w.id !== "knife") return;
            const isEquipped = w.status === "Equipped";
            const row = document.createElement("div");
            row.className = `inv-item-row ${isEquipped ? "inv-row-gold" : "inv-row-standard"}`;

            row.innerHTML = `
                <div class="inv-item-left">
                    <div class="inv-icon-box ${isEquipped ? "icon-box-gold" : ""}">
                        ${getWeaponSvg(w.id)}
                    </div>
                    <div class="inv-item-details">
                        <span class="inv-item-title">${w.name} ${isEquipped ? '<span class="inv-equipped-tag">[EQUIPPED]</span>' : ''}</span>
                        <span class="inv-item-desc">Attack: <span class="stat-highlight">+${w.damage}</span></span>
                    </div>
                </div>
                <button class="inv-pill-btn ${isEquipped ? "inv-pill-equipped" : ""}">
                    <span>${isEquipped ? "🛡️" : "⚔️"}</span>
                    <span>${isEquipped ? "EQUIPPED" : "EQUIP"}</span>
                </button>
            `;

            const btn = row.querySelector("button");
            if (!isEquipped) {
                btn.onclick = () => {
                    ShopInventoryManager.equipWeapon(w.id);
                    this.appendLog(`Equipped ${w.name}.`, "loot");
                    this.openInventoryModal();
                };
            }
            this.inventoryList.appendChild(row);
        });

        // 3. ARMOR SECTION
        this.inventoryList.appendChild(createSectionTitle("ARMOR", "🛡️"));

        gameState.state.inventory.armors.forEach(a => {
            if (!a.owned && a.id !== "cloth_tunic") return;
            const isEquipped = a.status === "Equipped";
            const row = document.createElement("div");
            row.className = `inv-item-row ${isEquipped ? "inv-row-gold" : "inv-row-standard"}`;

            row.innerHTML = `
                <div class="inv-item-left">
                    <div class="inv-icon-box ${isEquipped ? "icon-box-gold" : ""}">
                        <span style="font-size: 24px;">🛡️</span>
                    </div>
                    <div class="inv-item-details">
                        <span class="inv-item-title">${a.name} ${isEquipped ? '<span class="inv-equipped-tag">[EQUIPPED]</span>' : ''}</span>
                        <span class="inv-item-desc">Defense: <span class="stat-highlight">+${a.defense}</span></span>
                    </div>
                </div>
                <button class="inv-pill-btn ${isEquipped ? "inv-pill-equipped" : ""}">
                    <span>🛡️</span>
                    <span>${isEquipped ? "EQUIPPED" : "EQUIP"}</span>
                </button>
            `;

            const btn = row.querySelector("button");
            if (!isEquipped) {
                btn.onclick = () => {
                    ShopInventoryManager.equipArmor(a.id);
                    this.appendLog(`Equipped ${a.name}.`, "loot");
                    this.openInventoryModal();
                };
            }
            this.inventoryList.appendChild(row);
        });

        this.showModal(this.inventoryModal);
    }
}
