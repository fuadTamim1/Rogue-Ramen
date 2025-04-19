import { Attack } from "../Attack.js";
import { GameManager } from '../GameManager.js';

export class KnifeAttack extends Attack {
    constructor(scene, board) {
        super(
            "KnifeAttack",
            "A swift and deadly attack with a knife.",
            "Knife attack",
            1,
            1,
            scene, board);
    }

    Execute(cell) {
        if(cell.hasChild) {
            cell.child.takeDamage(20 * this.lvl)
            console.log(cell.child.hp ?? 0)
        }
    }
}