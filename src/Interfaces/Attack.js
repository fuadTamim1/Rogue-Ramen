// Attack.js
import { GameManager } from "../GameManager.js";
import { helper } from "../helpers/helper.js";

export class Attack {
    static groupedAnimations = null;  // Will store animation frame data

    constructor(data, scene, board) {
        this.name = data.name;
        this.description = data.description;
        this.lvl = data.lvl;
        this.cooldown = data.cooldown;
        this.cooldown_max = data.cooldown; // if cooldown equal cooldown_max it can attack otherwise it can't and must wait until it reachges again.
        this.scene = scene;
        this.board = board;
        this.damage = data.damage;

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

    Execute(current, target) {
        // Phaser
        if (!helper.CellsInclude(this.getTargetableCells(current), target)) {
            return;
        }
        GameManager.UIManager.UIAttackSelect.WeaponIcon.play(this.iconkey)
        this.cooldown = 0;
        // console.log(target);

        if (target.hasChild) {
            // console.log(`${target.child?.constructor?.name}`);
            this.scene.time.delayedCall(200, () => {
                // Code to run after 1 second (1000 ms)
                this.scene.cameras.main.shake(200, 0.002); // subtle shake on enter

                target.child.takeDamage(this.damage * this.lvl)
                // console.log(`${target.child?.constructor?.name || "Unknown"}: ${target.child?.hp ?? 0}`);

            }, [], this.scene);
        }
    }
}