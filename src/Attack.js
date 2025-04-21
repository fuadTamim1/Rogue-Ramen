// Attack.js
import { GameManager } from "./GameManager.js";

export class Attack {
    static groupedAnimations = null;  // Will store animation frame data

    constructor(data, scene, board) {
        this.name = data.name;
        this.description = data.description;
        this.lvl = data.lvl;
        this.cooldown = data.cooldown;
        this.scene = scene;
        this.board = board;
        this.damage = data.damage;
        this.cool_time_value = 0;

        this.iconkey = data.key;
        this.icon = this.resolveIcon(data.key);
    }

    resolveIcon(animationName) {
        const frame = GameManager.spriteManager.getFrameTexture(animationName);

        if (!frame) {
            console.warn(`Icon for animation "${animationName}" not found`);
            return 'missing-icon';
        }

        return frame;
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
        GameManager.UIManager.UIAttackSelect.WeaponIcon.play(GameManager.currentAttack.iconkey)

        if (cell.hasChild) {
            this.scene.time.delayedCall(200, () => {
                // Code to run after 1 second (1000 ms)
                this.scene.cameras.main.shake(200, 0.002); // subtle shake on enter
                cell.child.takeDamage(this.damage * this.lvl)
                console.log(cell.child?.hp || 0)
            }, [], this.scene);
        }

    }
}