import { KnifeAttack } from '../attacks/KnifeAttack.js';
import { Entity } from '../Interfaces/Entity.js';

export class KnifeGuy extends Entity {
    constructor(scene, x, y, board) {
        super(scene, x, y, board,'knifeGuy'); // Use appropriate texture key

        this.hp = 2;
        this.name = "enemy A";
        this.loadAttack(new KnifeAttack(scene, board, this))
    }

    takeDamage(amount) {
        super.takeDamage(amount);
    }
}
