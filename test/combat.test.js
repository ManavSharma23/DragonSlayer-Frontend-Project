import test from "node:test";
import assert from "node:assert/strict";
import { CombatEngine } from "../js/combat.js";
import { createInitialState, GameState, MONSTERS } from "../js/state.js";

test("CombatEngine: calculatePlayerAttack returns positive damage on hit", () => {
    // 0% dodge, 0% crit for deterministic calculation
    const result = CombatEngine.calculatePlayerAttack(20, 5, 0, 0);
    assert.equal(result.dodged, false);
    assert.equal(result.isCrit, false);
    assert.ok(result.damage >= 1, "Damage should be at least 1");
});

test("CombatEngine: calculatePlayerAttack handles monster dodge", () => {
    // 100% dodge
    const result = CombatEngine.calculatePlayerAttack(20, 5, 0, 1.0);
    assert.equal(result.dodged, true);
    assert.equal(result.damage, 0);
});

test("CombatEngine: calculateMonsterAttack reduces damage when defending", () => {
    // Defending vs regular
    const normalAttack = CombatEngine.calculateMonsterAttack(40, 10, false, false, 0, 0);
    const defendedAttack = CombatEngine.calculateMonsterAttack(40, 10, true, false, 0, 0);

    assert.ok(
        defendedAttack.damage < normalAttack.damage,
        `Defended damage (${defendedAttack.damage}) should be less than regular damage (${normalAttack.damage})`
    );
});

test("GameState: addXp levels up player and increases stats", () => {
    const gs = new GameState();
    assert.equal(gs.state.player.level, 1);
    const initialMaxHp = gs.state.player.maxHp;
    const initialAtk = gs.state.player.baseAttack;

    const levelUp = gs.addXp(50); // XP needed is 40
    assert.equal(levelUp.leveledUp, true);
    assert.equal(gs.state.player.level, 2);
    assert.ok(gs.state.player.maxHp > initialMaxHp, "Max HP increased");
    assert.ok(gs.state.player.baseAttack > initialAtk, "Base attack increased");
});

test("GameState: healPlayer restores up to maxHp", () => {
    const gs = new GameState();
    gs.state.player.hp = 50;
    const healed = gs.healPlayer(30);
    assert.equal(healed, 30);
    assert.equal(gs.state.player.hp, 80);

    // Overheal cap check
    const overHeal = gs.healPlayer(100);
    assert.equal(overHeal, 20);
    assert.equal(gs.state.player.hp, 100);
});

test("Monsters catalog has correct bosses and monsters", () => {
    const dragon = MONSTERS.find(m => m.id === "dragon");
    assert.ok(dragon, "Dragon boss exists");
    assert.equal(dragon.isBoss, true);
    assert.ok(dragon.maxHealth >= 300, "Dragon has formidable HP");
});
