import { Attack } from "../Interfaces/Attack.js";
import { GameManager } from '../GameManager.js';
import { helper } from "../helpers/helper.js";
import { SelectPaterns } from "../helpers/SelectPatterns.js";
import { gameConfig } from "../config.js";

export class SniperAttack extends Attack {
    constructor(scene, board, parent) {
        super(
            {
                name: "Sniper Attack",
                description: "A spread and deadly attack using Shotgun.",
                key: "sniper",
                icon: "sniper_icon",
                lvl: 1,
                cooldown: 0,
                damage: 4,
                delay: 500,
            },
            scene,
            board,
            parent
        );


    }

    getTargetableCells(currentCell) {

        let targetable_cells = [];
        targetable_cells = currentCell.getNeighbors(8, '+');
        return targetable_cells;
    }

    getHitByCells(target) {
        if (this.parent)
            return SelectPaterns.LineGroupShape(this.parent.getCurrentCell(), target);
        else {
            return [target];
        }
    }

    Execute(current, target) {
        super.Execute(current, target);
        var targets = this.getHitByCells(target);
        this.scene.time.delayedCall(200, () => {
            this.scene.cameras.main.shake(200, 0.002);


            target?.child?.takeDamage(this.damage * this.lvl)

            GameManager.board.HighlightCells(targets, 0xF0FFF0, 'cell_hover');
            targets?.forEach(t => {
                t?.child?.takeDamage(this.damage * this.lvl)
                GameManager.board.HighlightCell(t.boardX, t.boardY, 0xFF0000, 'cell_target');
            });
            this.scene.time.delayedCall(200, () => {
                GameManager.board.clearHighlight();
            }, [], this.scene);
        }, [], this.scene);
        
    }
}