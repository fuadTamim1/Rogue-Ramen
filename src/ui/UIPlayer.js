import { gameConfig } from "../config.js";
import { GameManager } from "../GameManager.js";
import { UIEntity } from "../Interfaces/UIEntity.js";

export class UIPlayer extends UIEntity {
    constructor(scene) {
        super(scene);
    }

    createUI() {
        // Create the sprite using scene.add, then add it to the container
        super.createUI();
    }

    showWeapon(attackIcon = null) {
        super.showWeapon(GameManager.currentAttack.icon);
    }

    hideWeapon() {
        super.hideWeapon();
    }
}