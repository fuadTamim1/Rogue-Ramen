import { Attack } from "../Interfaces/Attack.js";
import { GameManager } from '../GameManager.js';

export class PistolAttack extends Attack {
    constructor(scene, board) {
        super(
            {
                name: "Pistol Attack",
                description: "A swift and deadly attack with a pistol.",
                key: "pistol",
                lvl: 1,
                cooldown: 2,
                damage: 60
            },
            scene,
            board
        );
    }
    getTargetableCells(currentCell) {

        let targetable_cells = [];
        targetable_cells = currentCell.getNeighbors(2);
        return targetable_cells;
    }

    Execute(current, target) {
        super.Execute(current,target);
    }
}