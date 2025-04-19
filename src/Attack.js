// Attack.js
import { GameManager } from "./GameManager.js";
import { getIconFrame } from "./helpers/CreateAnimation.js";

export class Attack {
    static groupedAnimations = null;  // Will store animation frame data

    constructor(name, description, iconAnimationName, lvl, cool_time, damage, rangeType, scene, board) {
        this.name = name;
        this.description = description;
        this.lvl = lvl;
        this.cool_time = cool_time;
        this.scene = scene;
        this.board = board;
        this.cool_time_value = 0;

        // Automatically get icon frame from animation name
        this.icon = this.resolveIcon(iconAnimationName);
    }

    resolveIcon(animationName) {
        if (!Attack.groupedAnimations) {
            console.error('Animation data not loaded! Call Attack.setAnimationData() first');
            return 'missing-icon';
        }

        const frame = getIconFrame(Attack.groupedAnimations, animationName);

        if (!frame) {
            console.warn(`Icon for animation "${animationName}" not found`);
            return 'missing-icon';
        }

        return frame;
    }

    static setAnimationData(groupedAnimations) {
        Attack.groupedAnimations = groupedAnimations;
    }

    getTargetableCells() {
        const playerCell = GameManager.player.getCurrentCell();
        let targetable_cells = [];
        if (GameManager.board.getCell(playerCell.boardX + 1, playerCell.boardY))
            targetable_cells.push(GameManager.board.getCell(playerCell.boardX + 1, playerCell.boardY));
        return targetable_cells;
    }

    Execute(cell) {
        // Phaser
        // GameManager.UIManager.show()
    }
}