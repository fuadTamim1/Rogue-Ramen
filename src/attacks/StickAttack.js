import { Attack } from "../Interfaces/Attack.js";
import { GameManager } from '../GameManager.js';

export class StickAttack extends Attack {
    constructor(scene, board, parent) {
        super(
            {
                name: "Stick Attack",
                description: "A swift and deadly attack with a stick.",
                key: "stick",
                icon: 'stick_icon',
                lvl: 1,
                cooldown: 2,
                damage: 1
            },
            scene,
            board,
            parent
        );
    }

    getTargetableCells(currentCell) {
        let targetable_cells = [];
        targetable_cells = currentCell.getNeighbors();
        return targetable_cells;
    }

    Execute(current,target) {
        super.Execute(current,target);

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