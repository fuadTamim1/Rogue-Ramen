import { Attack } from "../Attack.js";
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
    getTargetableCells() {
        const playerCell = GameManager.player.getCurrentCell();
        let targetable_cells = [];
        targetable_cells = playerCell.getNeighbors();
        return targetable_cells;
    }

    Execute(cell) {
        super.Execute(cell);
    }
}