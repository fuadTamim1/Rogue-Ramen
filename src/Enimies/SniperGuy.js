import { KnifeAttack } from '../attacks/KnifeAttack.js';
import { SniperAttack } from '../attacks/SniperAttack.js';
import { Entity } from '../Interfaces/Entity.js';

export class SniperGuy extends Entity {
    constructor(scene, x, y, board) {
        super(scene, x, y, board,'sniperGuy'); // Use appropriate texture key

        this.hp = 100;
        this.name = "enemy B";
        this.loadAttack(new SniperAttack(scene, board))
    }

    takeDamage(amount) {
        super.takeDamage(amount);
    }
}
