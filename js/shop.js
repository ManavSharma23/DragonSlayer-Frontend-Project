// Shop & Inventory logic: buying/selling/equipping weapons, armors, and potions
import { gameState } from "./state.js";
import { sounds } from "./audio.js";

export class ShopInventoryManager {
    static buyPotion(potionId) {
        const potion = gameState.state.inventory.potions.find(p => p.id === potionId);
        if (!potion) return { success: false, message: "Potion not found." };

        if (gameState.state.player.gold < potion.price) {
            return { success: false, message: "Not enough gold!" };
        }

        gameState.addGold(-potion.price);
        potion.quantity += 1;
        sounds.playCoin();
        gameState.notify();
        return { success: true, message: `Purchased 1x ${potion.name}!` };
    }

    static buyWeapon(weaponId) {
        const weapon = gameState.state.inventory.weapons.find(w => w.id === weaponId);
        if (!weapon) return { success: false, message: "Weapon not found." };

        if (weapon.owned) {
            return { success: false, message: "You already own this weapon!" };
        }

        if (gameState.state.player.gold < weapon.price) {
            return { success: false, message: "Not enough gold!" };
        }

        gameState.addGold(-weapon.price);
        weapon.owned = true;
        sounds.playCoin();
        gameState.notify();
        return { success: true, message: `Purchased ${weapon.name}!` };
    }

    static buyArmor(armorId) {
        const armor = gameState.state.inventory.armors.find(a => a.id === armorId);
        if (!armor) return { success: false, message: "Armor not found." };

        if (armor.owned) {
            return { success: false, message: "You already own this armor!" };
        }

        if (gameState.state.player.gold < armor.price) {
            return { success: false, message: "Not enough gold!" };
        }

        gameState.addGold(-armor.price);
        armor.owned = true;
        sounds.playCoin();
        gameState.notify();
        return { success: true, message: `Purchased ${armor.name}!` };
    }

    static equipWeapon(weaponId) {
        const weapons = gameState.state.inventory.weapons;
        const target = weapons.find(w => w.id === weaponId);
        if (!target) return false;

        weapons.forEach(w => {
            if (w.status === "Equipped") w.status = "Unequipped";
        });
        target.status = "Equipped";
        sounds.playButtonClick();
        gameState.notify();
        return true;
    }

    static equipArmor(armorId) {
        const armors = gameState.state.inventory.armors;
        const target = armors.find(a => a.id === armorId);
        if (!target) return false;

        armors.forEach(a => {
            if (a.status === "Equipped") a.status = "Unequipped";
        });
        target.status = "Equipped";
        sounds.playButtonClick();
        gameState.notify();
        return true;
    }

    static usePotion(potionId) {
        const potion = gameState.state.inventory.potions.find(p => p.id === potionId);
        if (!potion || potion.quantity <= 0) {
            return { success: false, message: "You don't have any left!" };
        }

        const player = gameState.state.player;
        if (player.hp >= player.maxHp) {
            return { success: false, message: "Your health is already full!" };
        }

        potion.quantity -= 1;
        const restored = gameState.healPlayer(potion.heal);
        gameState.state.stats.potionsConsumed += 1;
        sounds.playPotion();
        gameState.notify();

        return {
            success: true,
            message: `Consumed ${potion.name}, restoring ${restored} HP!`,
            restored
        };
    }
}
