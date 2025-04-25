import { StickAttack } from '../attacks/StickAttack.js';
import { Entity } from '../Interfaces/Entity.js';

export class StickGuy extends Entity {
    constructor(scene, x, y, board) {
        super(scene, x, y, board,'stick_guy_idle'); // Use appropriate texture key

        this.hp = 2;
        this.name = "jone";
        this.loadAttack(new StickAttack(scene, board, this))
    }

    takeDamage(amount) {
        super.takeDamage(amount);
    }
}
