import { Attack } from "../Interfaces/Attack.js";
import { GameManager } from '../GameManager.js';
import { helper } from "../helpers/helper.js";

export class ShotgunAttack extends Attack {
    constructor(scene, board) {
        super(
            {
                name: "Shotgun Attack",
                description: "A spread and deadly attack using Shotgun.",
                key: "shotgun",
                lvl: 1,
                cooldown: 3,
                damage: 100
            },
            scene,
            board
        );
    }

    getTargetableCells(currentCell) {

        let targetable_cells = [];
        targetable_cells = currentCell.getNeighbors(4, '@');
        return targetable_cells;
    }

    Execute(current, target) {
        // Phaser
        if (!helper.CellsInclude(this.getTargetableCells(current), target)) {
            return;
        }
        GameManager.UIManager.UIAttackSelect.WeaponIcon.play(this.iconkey)
        this.cooldown = 0;
        // console.log(target);

        if (target.hasChild) {
            // console.log(`${target.child?.constructor?.name}`);
            this.scene.time.delayedCall(200, () => {
                // Code to run after 1 second (1000 ms)
                this.scene.cameras.main.shake(200, 0.002); // subtle shake on enter
                
                target.child.takeDamage(this.damage * this.lvl)
                var targets = target.getNeighbors(1,']')
                targets.forEach(t => {
                    t.child?.takeDamage(this.damage * this.lvl)
                });
                // console.log(`${target.child?.constructor?.name || "Unknown"}: ${target.child?.hp ?? 0}`);

            }, [], this.scene);
        }
    }
}