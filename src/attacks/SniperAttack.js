import { Attack } from "../Interfaces/Attack.js";
import { GameManager } from '../GameManager.js';
import { helper } from "../helpers/helper.js";
import { SelectPaterns } from "../helpers/SelectPatterns.js";
import { gameConfig } from "../config.js";

export class SniperAttack extends Attack {
    constructor(scene, board) {
        super(
            {
                name: "Sniper Attack",
                description: "A spread and deadly attack using Shotgun.",
                key: "sniper",
                lvl: 1,
                cooldown: 0,
                damage: 1
            },
            scene,
            board
        );
    }

    getTargetableCells(currentCell) {

        let targetable_cells = [];
        targetable_cells = currentCell.getNeighbors(8, '+');
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

        // console.log(`${target.child?.constructor?.name}`);
        this.scene.time.delayedCall(200, () => {
            // Code to run after 1 second (1000 ms)
            this.scene.cameras.main.shake(200, 0.002); // subtle shake on enter


            target?.child?.takeDamage(this.damage * this.lvl)
   
            var targets = SelectPaterns.LineGroupShape(current, target);
            GameManager.board.HighlightCells(targets, 0xF0FFF0);

            // console.log(targets);
            targets?.forEach(t => {
                t.child?.takeDamage(this.damage * this.lvl)
                GameManager.board.HighlightCell(t.boardX, t.boardY, 0xFF0000);
            });


            // console.log(`${target.child?.constructor?.name || "Unknown"}: ${target.child?.hp ?? 0}`);

        }, [], this.scene);
    }
}