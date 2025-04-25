import { Attack } from "../Interfaces/Attack.js";
import { GameManager } from '../GameManager.js';
import { helper } from "../helpers/helper.js";

export class ShotgunAttack extends Attack {
    constructor(scene, board, parent) {
        super(
            {
                name: "Shotgun Attack",
                description: "A spread and deadly attack using Shotgun.",
                key: "shotgun",
                icon: "shotgun_icon",
                lvl: 1,
                cooldown: 3,
                damage: 3
            },
            scene,
            board,
            parent,

        );
    }

    getTargetableCells(currentCell) {

        let targetable_cells = [];
        targetable_cells = currentCell.getNeighbors(4, '@');
        return targetable_cells;
    }

    getHitByCells(target) {
        return target.getNeighbors(1, ']');
    }

    Execute(current, target) {
        super.Execute(current, target);

        this.scene.time.delayedCall(200, () => {
            this.scene.cameras.main.shake(200, 0.002);

            var targets = this.getHitByCells(target);
            console.log(targets);
            target.child?.takeDamage(this.damage * this.lvl)
            targets.forEach(t => {
                t.child?.takeDamage(this.damage * this.lvl)
            });
        }, [], this.scene);
    }
}