import { Entity } from '../Entity.js';

export class KnifeGuy extends Entity {
    constructor(scene, x, y, board) {
        super(scene, x, y, board,'knifeGuy'); // Use appropriate texture key

        this.speed = 100;
        

    }

    takeDamage(amount) {
        super.takeDamage(amount);
    }
}
