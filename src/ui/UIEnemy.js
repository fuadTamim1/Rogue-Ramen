import { UIEntity } from "../Interfaces/UIEntity.js";

export class UIEnemy extends UIEntity {
    constructor(scene) {
        super(scene);
    }

    createUI() {
        // Create the sprite using scene.add, then add it to the container
        super.createUI();
    }

    showWeapon(attackIcon = null) {
        super.showWeapon(attackIcon);
    }

    hideWeapon() {
        super.hideWeapon();
    }
}