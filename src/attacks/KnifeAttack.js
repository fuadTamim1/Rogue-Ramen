import { Attack } from "../Interfaces/Attack.js";
import { GameManager } from '../GameManager.js';

export class KnifeAttack extends Attack {
    constructor(scene, board) {
        super(
            {
                name: "Knife Attack",
                description: "A swift and deadly attack with a knife.",
                key: "knife",
                lvl: 1,
                cooldown: 2,
                damage: 20
            },
            scene,
            board
        );
    }

    getTargetableCells(currentCell) {
        let targetable_cells = [];
        targetable_cells = currentCell.getNeighbors();
        return targetable_cells;
    }

    Execute(current,target) {
        super.Execute(current,target);
    }
}