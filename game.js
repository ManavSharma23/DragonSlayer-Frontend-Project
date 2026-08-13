let xp = 0;
let health = 100;
let gold = 100;

let current_weapon = 0;
let current_page = 0;
let current_health_page = 0;
let current_weapon_equipped = 0;
let fight;
let monster_health;

const go_to_store = document.querySelector("#button1");
const go_to_cave = document.querySelector("#button2");
const fight_dragon = document.querySelector("#button3");
const go_to_inventory = document.querySelector("#button4");

const text = document.querySelector("#text");

const xptext = document.querySelector("#XPtext");
const healthtext = document.querySelector("#Healthtext");
const goldtext = document.querySelector("#Goldtext");

const monstername = document.querySelector("#MonsterName");
const monsterhealth = document.querySelector("#monsterhealth");
const monsterdamage = document.querySelector("#monsterdamage");

const monster_stats = document.querySelector("#monster_stats");

const locations = [
    {
        name: "Town Square",
        "Button Text": ["Go to Store", "Go to Cave", "Fight Dragon", "Inventory"],
        "button_functions": [goStore, goCave, goFight, goInventory],
        text: "You Are In the Town Square."
    },
    {
        name: "store",
        "Button Text": ["Buy 10 Health (10 Gold)", "Buy Weapons", "Go to Town Square", "Inventory"],
        "button_functions": [buyHealth, buyWeapons, goTown, goInventory],
        text: "Welcome To Dragonaise Summersville.\nThe Store of Enchantments and Honor.\n\nWhat would you like to buy?",
    },
    {
        name: "Cave",
        "Button Text": ["Fight Slime", "Fight FangBeast", "Fight Ogre", "Town Square"],
        "button_functions": [fightSlime, fightFangBeast, fightOgre, goTown],
        text: "You Enter the Cave. You See some monsters!!\nWho are you going to fight?",
    },
    {
        name: "Fight",
        "Button Text": ["Attack", "Defend", "Run Away", "Inventory"],
        "button_functions": [goAttack, doDefence, goTown, goInventory],
        text: "You are fighting a monster!\nWhat would you like to do?",
    },
    {
        name: "Inventory",
        "Button Text": ["Use Portions", "Change Weapon", "Go Back", "Town Square"],
        "button_functions": [increaseHealth, changeWeapon, goBack, goTown],
        text: "Welcome To Inventory:\n",
    }
];

function update(locations) {
    go_to_store.innerText = locations["Button Text"][0];
    go_to_cave.innerText = locations["Button Text"][1];
    fight_dragon.innerText = locations["Button Text"][2];
    go_to_inventory.innerText = locations["Button Text"][3];
    text.innerText = locations.text;

    go_to_store.onclick = locations["button_functions"][0];
    go_to_cave.onclick = locations["button_functions"][1];
    fight_dragon.onclick = locations["button_functions"][2];
    go_to_inventory.onclick = locations["button_functions"][3];
    go_to_inventory.style.display = "inline-block";

    previous_location = current_location;
    current_location = locations;
}

let current_location = locations[0];
let previous_location = null;

let inventory = [
    {
        category: "Portions",
        name: "Asmodeuce Elixer",
        quantity: 1,
        health_increase: 30,
        intro_text: "This crimson elixir was once reserved for his most loyal followers.\nIts origin is shrouded in mystery, the potion is said to mend flesh and restore vitality.\nThose who consume it often speak of hearing a faint voice calling from the abyss."
    },
    {
        category: "Portions",
        name: "Sweat Of Arceus",
        quantity: 1,
        health_increase: 15,
        intro_text: "Few dare question how this sacred liquid was obtained, and fewer still wish to know.\nDespite its unusual origin, the Sweat Of Arceus possesses extraordinary healing properties.\nThose who consume it often swear they hear distant cries from the heavens."
    },
    {
        category: "weapon",
        name: "Knife",
        price: 0,
        damage: 10,
        status: "Equipped",
        intro_text: "A simple blade carried by countless travelers and forgotten mercenaries.\nThough unremarkable in appearance, its edge has tasted both victory and despair.\nMany legendary warriors began their journey with nothing more than this faithful knife."
    }
];

const Weapons = [
    {
        name: "Dagger Of Doom",
        price: 25,
        damage: 30,
        intro_text: "Forged in the shadows of a forgotten age, the Dagger Of Doom is said to hunger for battle.\nIts cursed edge has ended the lives of countless warriors, and even now, the blade radiates\nan unsettling presence. Few possess the courage to wield such a weapon.\n",
        status: "Unequipped"
    },
    {
        name: "Hammer of Labryinth",
        price: 50,
        damage: 40,
        intro_text: "Forged within the depths of the ancient Labyrinth, this mighty hammer once belonged to a giant king.\nIts thunderous blows have crushed countless foes, leaving only shattered armor in their wake.\nEven now, warriors speak its name with awe and fear.\n",
        status: "Unequipped"
    },
    {
        name: "Staff of Ages",
        price: 70,
        damage: 50,
        intro_text: "Crafted by the sages of a forgotten era, the Staff of Ages holds the wisdom of centuries.\nLegends say it channels the power of time itself, granting its bearer unmatched mastery.\nMany have sought its secrets, but few have proven worthy.\n",
        status: "Unequipped"
    },
    {
        name: "Dark Matter Sword",
        price: 110,
        damage: 80,
        intro_text: "Born from the remnants of a fallen star, the Dark Matter Sword defies the laws of nature.\nIts blade is said to cut through steel, magic, and even the fabric of reality itself.\nThose who wield it command a power feared by gods and mortals alike.\n",
        status: "Unequipped"
    }
];

const store_weapons = [
    {
        page_number: 1,
        "Button Text": ["Next", "Buy", "Leave Store"],
        "button_functions": [goNext, goBuy, goLeave]
    },
    {
        page_number: 2,
        "Button Text": ["Previous", "Next", "Buy", "Leave Store"],
        "button_functions": [goPrevious, goNext, goBuy, goLeave]
    },
    {
        page_number: 3,
        "Button Text": ["Previous", "Next", "Buy", "Leave Store"],
        "button_functions": [goPrevious, goNext, goBuy, goLeave]
    },
    {
        page_number: 4,
        "Button Text": ["Previous", "Buy", "Leave Store"],
        "button_functions": [goPrevious, goBuy, goLeave]
    }
];

function goNext() {}
function goPrevious() {}
function goBuy() {}
function goLeave() {}

