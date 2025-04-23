import { Attack } from "../Interfaces/Attack.js";
import { GameManager } from '../GameManager.js';

export class GrendaeAttack extends Attack {
    constructor(scene, board) {
        super(
            {
                name: "Grenade Attack",
                description: "A spread and deadly attack using Grenade.",
                key: "grenade",
                lvl: 1,
                cooldown: 4,
                damage: 150
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

    Execute(current,target) {
        super.Execute(current,target);
    }
}