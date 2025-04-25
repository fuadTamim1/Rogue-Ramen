// Attack.js
import { GameManager } from "../GameManager.js";
import { helper } from "../helpers/helper.js";

export class Attack {
    static groupedAnimations = null;  // Will store animation frame data

    constructor(data, scene, board, parent) {
        this.name = data.name;
        this.description = data.description;
        this.lvl = data.lvl;
        this.cooldown = data.cooldown;
        this.cooldown_max = data.cooldown; // if cooldown equal cooldown_max it can attack otherwise it can't and must wait until it reachges again.
        this.scene = scene;
        this.board = board;
        this.damage = data.damage;

        this.parent = parent;
        this.delay = data.delay ?? 300;

        this.key = data.key;
        this.icon = data.icon
    }

    // resolveIcon(animationName) {
    //     const frame = GameManager.spriteManager.getFrameTexture(animationName);

    //     if (!frame) {
    //         console.warn(`Icon for animation "${animationName}" not found`);
    //         return 'missing-icon';
    //     }

    //     return frame;
    // }

    increaseCoolDown() {
        this.cooldown++;
        if (this.cooldown >= this.cooldown_max) {
            this.cooldown = this.cooldown_max;
        }
    }

    resetCoolDown() {
        this.cooldown = 0;
    }

    getTargetableCells(currentCell) {
        let targetable_cells = [];
        if (GameManager.board.getCell(currentCell.boardX + 1, currentCell.boardY))
            targetable_cells.push(GameManager.board.getCell(currentCell.boardX + 1, currentCell.boardY));
        return targetable_cells;
    }

    getHitByCells(target){
        return [target];
    }

    Execute(current, target) {
        // Phaser
        if (!helper.CellsInclude(this.getTargetableCells(current), target)) {
            return;
        }
        this.cooldown = 0;
        // console.log(target);

        const hitByCells = this.getHitByCells(target);
        GameManager.board.clearHighlight()
        GameManager.board.HighlightCells(hitByCells, 0xFFFFFF, 'cell_target')

       
    }
}