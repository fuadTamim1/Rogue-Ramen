import { UIShop } from "../ui/UIShop.js";

export class ShopManager {
    constructor(scene) {
        this.scene = scene;
        this.coins = 0;
        this.items = [];
        this.ui = new UIShop(scene);
    }

    addCoins(value) {
        this.coins += value;
        this.ui.updateCoins(this.coins);
    }

    buyItem(item) {
        if (this.coins >= item.cost) {
            this.coins -= item.cost;
            this.ui.updateCoins(this.coins);
            item.callback();
            this.removeItem(item);
            return true;
        }
        return false;
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            this.ui.removeItem(item);
        }
    }

    addItem(item) {
        this.items.push(item);
        this.ui.addItem(item, () => this.buyItem(item));
    }
}

export class Item {
    constructor(name, icon, cost, callback) {
        this.name = name;
        this.icon = icon;  // Fixed: was assigning callback to icon
        this.cost = cost;
        this.callback = callback;
    }
}