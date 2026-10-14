// Game State Management & Save/Load with localStorage

export const SAVE_KEY = "dragonslayer_save_v1";

export const INITIAL_WEAPONS = [
    {
        id: "knife",
        name: "Knife",
        price: 0,
        damage: 10,
        category: "weapon",
        status: "Equipped",
        intro_text: "A simple blade carried by countless travelers. Unremarkable, but faithful."
    },
    {
        id: "dagger",
        name: "Dagger Of Doom",
        price: 25,
        damage: 25,
        category: "weapon",
        status: "Unequipped",
        intro_text: "Forged in shadowy depths, its cursed edge radiates an unsettling thirst for battle."
    },
    {
        id: "hammer",
        name: "Hammer of Labyrinth",
        price: 50,
        damage: 42,
        category: "weapon",
        status: "Unequipped",
        intro_text: "Once wielded by a giant king, its thunderous blows crush steel and bone alike."
    },
    {
        id: "staff",
        name: "Staff of Ages",
        price: 75,
        damage: 65,
        category: "weapon",
        status: "Unequipped",
        intro_text: "Infused with the knowledge of ancient sages, channeling destructive arcane surges."
    },
    {
        id: "darkmatter",
        name: "Dark Matter Sword",
        price: 120,
        damage: 95,
        category: "weapon",
        status: "Unequipped",
        intro_text: "Forged from a fallen dark star, cutting through armor and magical barriers effortlessly."
    }
];

export const INITIAL_ARMORS = [
    {
        id: "cloth_tunic",
        name: "Cloth Tunic",
        price: 0,
        defense: 2,
        category: "armor",
        status: "Equipped",
        intro_text: "Simple woven linen that offers minimal resistance against claws."
    },
    {
        id: "leather_armor",
        name: "Hardened Leather",
        price: 30,
        defense: 6,
        category: "armor",
        status: "Unequipped",
        intro_text: "Reinforced beast hide offering agility and sturdy defense."
    },
    {
        id: "chainmail",
        name: "Dwarven Chainmail",
        price: 65,
        defense: 12,
        category: "armor",
        status: "Unequipped",
        intro_text: "Interlocking rings of tempered steel, crafted to resist heavy piercing strikes."
    },
    {
        id: "dragon_scale",
        name: "Dragon-Forged Plate",
        price: 110,
        defense: 22,
        category: "armor",
        status: "Unequipped",
        intro_text: "Impenetrable mythical plate armor imbued with heat resistance."
    }
];

export const POTIONS_CATALOG = [
    {
        id: "potion_minor",
        category: "potions",
        name: "Minor Healing Draught",
        price: 15,
        heal: 25,
        quantity: 2,
        intro_text: "A sweet herbal concoction that soothes burns and stitches minor cuts."
    },
    {
        id: "potion_major",
        category: "potions",
        name: "Asmodeus Elixir",
        price: 35,
        heal: 60,
        quantity: 1,
        intro_text: "A crimson elixir whispered to mend shattered flesh and reinvigorate the soul."
    },
    {
        id: "potion_divine",
        category: "potions",
        name: "Sweat Of Arceus",
        price: 65,
        heal: 120,
        quantity: 0,
        intro_text: "A divine vial pulsing with radiance, restoring overwhelming vitality."
    }
];

export const MONSTERS = [
    {
        id: "slime",
        name: "Toxic Slime",
        level: 1,
        maxHealth: 35,
        health: 35,
        damage: 12,
        defense: 1,
        xpReward: 15,
        goldReward: 12,
        critChance: 0.05,
        dodgeChance: 0.08,
        sprite: "slime",
        description: "A caustic gelatinous glob that dissolves flesh and rusted weaponry."
    },
    {
        id: "fangbeast",
        name: "Fang Beast",
        level: 2,
        maxHealth: 70,
        health: 70,
        damage: 24,
        defense: 3,
        xpReward: 35,
        goldReward: 28,
        critChance: 0.1,
        dodgeChance: 0.12,
        sprite: "fangbeast",
        description: "A ferocious predatory hound with razor-sharp mandibles and blinding agility."
    },
    {
        id: "ogre",
        name: "The Ogre Of Despair",
        level: 3,
        maxHealth: 140,
        health: 140,
        damage: 48,
        defense: 7,
        xpReward: 75,
        goldReward: 65,
        critChance: 0.15,
        dodgeChance: 0.05,
        sprite: "ogre",
        description: "A hulking brute wielding a colossal tree-trunk club with crushing fury."
    },
    {
        id: "dragon",
        name: "Dragon Of Zandarious",
        level: 5,
        maxHealth: 320,
        health: 320,
        damage: 80,
        defense: 12,
        xpReward: 200,
        goldReward: 250,
        critChance: 0.2,
        dodgeChance: 0.1,
        isBoss: true,
        sprite: "dragon",
        description: "Ancient apex terror of the skies whose burning breath has reduced empires to ash."
    }
];

export function createInitialState() {
    return {
        player: {
            name: "Dragon Slayer",
            level: 1,
            xp: 0,
            xpNext: 40,
            hp: 100,
            maxHp: 100,
            gold: 100,
            baseAttack: 5,
            baseDefense: 2,
            critChance: 0.12,
            dodgeChance: 0.1
        },
        inventory: {
            weapons: JSON.parse(JSON.stringify(INITIAL_WEAPONS)),
            armors: JSON.parse(JSON.stringify(INITIAL_ARMORS)),
            potions: JSON.parse(JSON.stringify(POTIONS_CATALOG))
        },
        stats: {
            monstersDefeated: 0,
            goldEarned: 100,
            damageDealt: 0,
            turnsTaken: 0,
            potionsConsumed: 0
        },
        quest: {
            active: true,
            title: "Clear the Infestation",
            target: "slime",
            targetName: "Toxic Slime",
            current: 0,
            required: 3,
            rewardGold: 50,
            rewardXp: 40,
            completed: false
        },
        currentLocation: "town",
        inCombat: false,
        activeMonster: null
    };
}

export class GameState {
    constructor() {
        this.state = createInitialState();
        this.listeners = [];
    }

    reset() {
        this.state = createInitialState();
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        for (const fn of this.listeners) {
            fn(this.state);
        }
    }

    getEquippedWeapon() {
        return this.state.inventory.weapons.find(w => w.status === "Equipped") || this.state.inventory.weapons[0];
    }

    getEquippedArmor() {
        return this.state.inventory.armors.find(a => a.status === "Equipped") || this.state.inventory.armors[0];
    }

    getTotalAttack() {
        const weapon = this.getEquippedWeapon();
        return this.state.player.baseAttack + (weapon ? weapon.damage : 0);
    }

    getTotalDefense() {
        const armor = this.getEquippedArmor();
        return this.state.player.baseDefense + (armor ? armor.defense : 0);
    }

    addXp(amount) {
        const p = this.state.player;
        p.xp += amount;
        let leveledUp = false;
        let levelsGained = 0;

        while (p.xp >= p.xpNext) {
            p.xp -= p.xpNext;
            p.level += 1;
            p.xpNext = Math.floor(p.xpNext * 1.6);
            p.maxHp += 20;
            p.hp = p.maxHp;
            p.baseAttack += 5;
            p.baseDefense += 3;
            p.critChance = Math.min(0.4, p.critChance + 0.02);
            p.dodgeChance = Math.min(0.35, p.dodgeChance + 0.015);
            leveledUp = true;
            levelsGained++;
        }

        this.notify();
        return { leveledUp, levelsGained, newLevel: p.level };
    }

    addGold(amount) {
        this.state.player.gold += amount;
        if (amount > 0) {
            this.state.stats.goldEarned += amount;
        }
        this.notify();
    }

    healPlayer(amount) {
        const p = this.state.player;
        const previous = p.hp;
        p.hp = Math.min(p.maxHp, p.hp + amount);
        this.notify();
        return p.hp - previous;
    }
}

export const gameState = new GameState();
