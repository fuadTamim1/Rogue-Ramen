import { Attack } from "../Interfaces/Attack.js";
import { GameManager } from '../GameManager.js';
import { helper } from "../helpers/helper.js";

export class Teleport extends Attack {
    constructor(scene, board, parent) {
        super(
            {
                name: "Teleport",
                description: "A usful techince to escape",
                key: "teleport",
                icon: "teleport_icon",
                lvl: 1,
                cooldown: 3,
                damage: 2,
                delay: 1000
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

    Execute(current, target) {
        super.Execute(current, target);

        this.scene.time.delayedCall(200, () => {
            if (!target.hasChild && current.child) {
                const child = current.child;
                child.play("teleport_in")
                this.scene.time.delayedCall(500, () => {
                    child.play("teleport_out")
                    child.SetPosition(target.boardX, target.boardY);
                })
            }
        }, [], this.scene);
    }
}