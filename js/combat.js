// Combat Engine: Damage calculations, crits, dodges, special attacks, defense, and rewards
import { gameState, MONSTERS } from "./state.js";
import { sounds } from "./audio.js";

export class CombatEngine {
    constructor() {
        this.activeMonster = null;
        this.bossChargeTurn = false;
        this.combatLogCallbacks = [];
        this.feedbackCallbacks = [];
    }

    onLog(cb) {
        this.combatLogCallbacks.push(cb);
    }

    onFeedback(cb) {
        this.feedbackCallbacks.push(cb);
    }

    log(message, type = "normal") {
        for (const cb of this.combatLogCallbacks) {
            cb(message, type);
        }
    }

    triggerFeedback(type, payload) {
        for (const cb of this.feedbackCallbacks) {
            cb(type, payload);
        }
    }

    startCombat(monsterId) {
        const template = MONSTERS.find(m => m.id === monsterId);
        if (!template) {
            console.error("Unknown monster:", monsterId);
            return null;
        }

        // Clone monster state
        this.activeMonster = {
            ...template,
            maxHealth: template.maxHealth,
            health: template.maxHealth,
            charged: false
        };

        gameState.state.inCombat = true;
        gameState.state.activeMonster = this.activeMonster;
        gameState.notify();

        if (this.activeMonster.isBoss) {
            sounds.playBossRoar();
            this.triggerFeedback("bossIntro", { monster: this.activeMonster });
            this.log(`[ALERT] THE APEX THREAT EMERGES: ${this.activeMonster.name}!`, "boss");
        } else {
            this.log(`A fierce ${this.activeMonster.name} emerges from the dark.`, "normal");
        }

        return this.activeMonster;
    }

    // Pure calculation helper for unit testing & game logic
    static calculatePlayerAttack(playerAtk, monsterDef, playerCritRate, monsterDodgeRate) {
        // Check monster dodge
        if (Math.random() < monsterDodgeRate) {
            return { dodged: true, isCrit: false, damage: 0 };
        }

        const isCrit = Math.random() < playerCritRate;
        const variance = 0.85 + Math.random() * 0.3; // 85% to 115%
        let rawDmg = playerAtk * variance;
        if (isCrit) {
            rawDmg *= 1.8;
        }

        const finalDmg = Math.max(1, Math.round(rawDmg - monsterDef * 0.5));
        return { dodged: false, isCrit, damage: finalDmg };
    }

    static calculateMonsterAttack(monsterAtk, playerDef, isDefending = false, isCharged = false, monsterCritRate = 0.1, playerDodgeRate = 0.1) {
        // Check player dodge
        if (!isCharged && Math.random() < playerDodgeRate) {
            return { dodged: true, isCrit: false, damage: 0, special: null };
        }

        let isCrit = Math.random() < monsterCritRate;
        let mult = 0.85 + Math.random() * 0.3;
        if (isCharged) {
            mult *= 2.2;
            isCrit = true; // Charged hits hurt badly
        }

        let rawDmg = monsterAtk * mult;
        if (isCrit && !isCharged) {
            rawDmg *= 1.6;
        }

        let defDeduction = playerDef;
        if (isDefending) {
            defDeduction *= 2.5; // Defending amplifies armor effect
            rawDmg *= 0.5; // Halves incoming base damage
        }

        const finalDmg = Math.max(1, Math.round(rawDmg - defDeduction));
        return { dodged: false, isCrit, damage: finalDmg, isCharged };
    }

    playerAttack() {
        if (!this.activeMonster || gameState.state.player.hp <= 0) return;

        const player = gameState.state.player;
        const weapon = gameState.getEquippedWeapon();
        const totalAtk = gameState.getTotalAttack();

        gameState.state.stats.turnsTaken += 1;

        // Player turn
        const attackResult = CombatEngine.calculatePlayerAttack(
            totalAtk,
            this.activeMonster.defense,
            player.critChance,
            this.activeMonster.dodgeChance
        );

        if (attackResult.dodged) {
            this.triggerFeedback("monsterDodge");
            this.log(`The ${this.activeMonster.name} gracefully evaded your ${weapon.name}!`, "dodge");
        } else {
            this.activeMonster.health = Math.max(0, this.activeMonster.health - attackResult.damage);
            gameState.state.stats.damageDealt += attackResult.damage;

            if (attackResult.isCrit) {
                sounds.playCritHit();
                this.triggerFeedback("screenShake", { heavy: true });
                this.triggerFeedback("damageNumber", {
                    target: "monster",
                    amount: attackResult.damage,
                    isCrit: true
                });
                this.log(`CRITICAL HIT: You strike ${this.activeMonster.name} for ${attackResult.damage} damage!`, "crit");
            } else {
                sounds.playSwordHit();
                this.triggerFeedback("screenShake", { heavy: false });
                this.triggerFeedback("damageNumber", {
                    target: "monster",
                    amount: attackResult.damage,
                    isCrit: false
                });
                this.log(`You strike ${this.activeMonster.name} with ${weapon.name} for ${attackResult.damage} damage.`, "damage-out");
            }
            this.triggerFeedback("monsterFlash");
        }

        gameState.notify();

        // Check if monster died
        if (this.activeMonster.health <= 0) {
            this.handleMonsterDeath();
            return;
        }

        // Monster retaliation
        setTimeout(() => {
            this.monsterTurn(false);
        }, 400);
    }

    playerDefend() {
        if (!this.activeMonster || gameState.state.player.hp <= 0) return;

        gameState.state.stats.turnsTaken += 1;
        sounds.playDefend();
        const armor = gameState.getEquippedArmor();
        this.log(`DEFENSIVE STANCE: You brace behind your ${armor.name}, mitigating incoming force.`, "defend");

        setTimeout(() => {
            this.monsterTurn(true);
        }, 350);
    }

    playerUsePotion(potionId) {
        if (!this.activeMonster || gameState.state.player.hp <= 0) return false;

        const potion = gameState.state.inventory.potions.find(p => p.id === potionId) || gameState.state.inventory.potions.find(p => p.quantity > 0);
        if (!potion || potion.quantity <= 0) {
            this.log("[WARNING] No healing draughts remaining!", "damage-in");
            return false;
        }

        const player = gameState.state.player;
        if (player.hp >= player.maxHp) {
            this.log("Your vitality is already fully replenished.", "heal");
            return false;
        }

        potion.quantity -= 1;
        const restored = gameState.healPlayer(potion.heal);
        sounds.playPotion();
        this.triggerFeedback("damageNumber", {
            target: "player",
            amount: restored,
            isCrit: false,
            isHeal: true
        });
        this.log(`POTION CONSUMED: Drank ${potion.name}, restoring ${restored} HP.`, "heal");

        setTimeout(() => {
            this.monsterTurn(false);
        }, 350);
        return true;
    }

    playerFlee() {
        if (!this.activeMonster) return false;

        if (this.activeMonster.isBoss) {
            this.log("[WARNING] You cannot flee from a Boss encounter.", "damage-in");
            return false;
        }

        // 60% chance to flee
        if (Math.random() < 0.6) {
            sounds.playFlee();
            this.log(`Retreated successfully back to town.`, "loot");
            this.endCombat(false);
            return true;
        } else {
            this.log(`Escape failed! The ${this.activeMonster.name} blocks your retreat.`, "damage-in");
            setTimeout(() => {
                this.monsterTurn(false);
            }, 350);
            return false;
        }
    }

    monsterTurn(isPlayerDefending) {
        if (!this.activeMonster || this.activeMonster.health <= 0 || gameState.state.player.hp <= 0) return;

        const player = gameState.state.player;
        const totalDef = gameState.getTotalDefense();

        // Boss special mechanism: Charge up fire breath if boss and low HP
        if (this.activeMonster.isBoss) {
            if (!this.activeMonster.charged && Math.random() < 0.35 && this.activeMonster.health < this.activeMonster.maxHealth * 0.75) {
                this.activeMonster.charged = true;
                this.triggerFeedback("bossCharging");
                this.log(`INCINERATION CHARGE: ${this.activeMonster.name} prepares a devastating fire attack! Defend!`, "boss");
                gameState.notify();
                return;
            }
        }

        const isCharged = this.activeMonster.charged;
        this.activeMonster.charged = false;

        const result = CombatEngine.calculateMonsterAttack(
            this.activeMonster.damage,
            totalDef,
            isPlayerDefending,
            isCharged,
            this.activeMonster.critChance,
            player.dodgeChance
        );

        if (result.dodged) {
            this.log(`EVADED: You dodged ${this.activeMonster.name}'s strike!`, "dodge");
        } else {
            player.hp = Math.max(0, player.hp - result.damage);
            this.triggerFeedback("playerFlash");
            this.triggerFeedback("screenShake", { heavy: result.isCrit || isCharged });
            this.triggerFeedback("damageNumber", {
                target: "player",
                amount: result.damage,
                isCrit: result.isCrit || isCharged
            });

            if (isCharged) {
                sounds.playSwordHit();
                this.log(`INFERNAL BREATH: ${this.activeMonster.name} inflicts ${result.damage} devastation!`, "damage-in");
            } else if (result.isCrit) {
                sounds.playSwordHit();
                this.log(`SAVAGE HIT: ${this.activeMonster.name} lands a heavy blow for ${result.damage} damage!`, "damage-in");
            } else if (isPlayerDefending) {
                this.log(`BLOCKED: Armor mitigated damage down to ${result.damage}.`, "defend");
            } else {
                sounds.playSwordHit();
                this.log(`The ${this.activeMonster.name} deals ${result.damage} damage.`, "damage-in");
            }
        }

        gameState.notify();

        if (player.hp <= 0) {
            sounds.playGameOver();
            this.log(`You have succumbed in battle to ${this.activeMonster.name}.`, "damage-in");
            this.triggerFeedback("gameOver", { killer: this.activeMonster.name });
            gameState.state.inCombat = false;
            gameState.notify();
        }
    }

    handleMonsterDeath() {
        const monster = this.activeMonster;
        sounds.playVictory();
        this.triggerFeedback("monsterFade");
        this.log(`TARGET DESTROYED: The ${monster.name} has been defeated.`, "loot");

        gameState.state.stats.monstersDefeated += 1;
        gameState.addGold(monster.goldReward);
        const levelUpInfo = gameState.addXp(monster.xpReward);

        sounds.playCoin();
        this.triggerFeedback("monsterDefeated", {
            monsterName: monster.name,
            goldReward: monster.goldReward,
            xpReward: monster.xpReward
        });
        this.log(`REWARDS: +${monster.goldReward} Gold  |  +${monster.xpReward} XP`, "loot");

        // Quest Progress Check
        const q = gameState.state.quest;
        if (q.active && !q.completed && q.target === monster.id) {
            q.current += 1;
            if (q.current >= q.required) {
                q.completed = true;
                gameState.addGold(q.rewardGold);
                gameState.addXp(q.rewardXp);
                this.log(`QUEST COMPLETE: "${q.title}" (+${q.rewardGold} Gold, +${q.rewardXp} XP)`, "loot");
            } else {
                this.log(`Quest Progress: ${q.title} (${q.current}/${q.required})`, "normal");
            }
        }

        // Random event roll: 20% wandering chest if not boss
        if (!monster.isBoss && Math.random() < 0.25) {
            const bonusGold = Math.floor(15 + Math.random() * 25);
            gameState.addGold(bonusGold);
            this.log(`Hidden Cache: Found +${bonusGold} Gold!`, "loot");
        }

        if (levelUpInfo.leveledUp) {
            sounds.playLevelUp();
            this.triggerFeedback("levelUpPopup", levelUpInfo);
            this.log(`LEVEL UP: Reached Level ${levelUpInfo.newLevel}. Stats increased.`, "loot");
        }

        if (monster.isBoss) {
            setTimeout(() => {
                this.triggerFeedback("victoryScreen", { stats: gameState.state.stats });
            }, 1000);
        }

        setTimeout(() => {
            this.endCombat(true);
        }, 1200);
    }

    endCombat(won = true) {
        this.activeMonster = null;
        gameState.state.inCombat = false;
        gameState.state.activeMonster = null;
        gameState.notify();
    }
}

export const combatEngine = new CombatEngine();
