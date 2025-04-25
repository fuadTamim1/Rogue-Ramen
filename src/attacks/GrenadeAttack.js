import { Attack } from "../Interfaces/Attack.js";
import { GameManager } from '../GameManager.js';
import { helper } from "../helpers/helper.js";

export class GrendadeAttack extends Attack {
    constructor(scene, board, parent) {
        super(
            {
                name: "Grenade Attack",
                description: "A spread and deadly attack using Grenade.",
                key: "grenade",
                icon: 'grenade_icon',
                lvl: 1,
                cooldown: 3,
                damage: 2
            },
            scene,
            board,
            parent
        );
    }

    getTargetableCells(currentCell) {

        let targetable_cells = [];
        targetable_cells = GameManager.board.getCells(true);
        return targetable_cells;
    }

    getHitByCells(target) {
        return target.getNeighbors(3, '@');
    }

    Execute(current, target) {
        super.Execute(current, target);

        if (target.hasChild) {
            this.scene.time.delayedCall(200, () => {
                this.scene.cameras.main.shake(200, 0.002);

                target.child.takeDamage(this.damage * this.lvl)
                var targets = this.getHitByCells(target);
                targets.forEach(t => {
                    t.child?.takeDamage(this.damage * this.lvl)
                });
            }, [], this.scene);
        }
    }
}