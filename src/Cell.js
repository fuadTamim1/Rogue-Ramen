import { gameConfig } from "./config.js";
import { GameManager } from "./GameManager.js";
import { AttackManager } from "./managers/AttackManager.js";

export class Cell extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, boardX, boardY) {
        super(scene, x, y, 'cell');
        this.setOrigin(0.5);
        this.scene = scene;
        this.boardX = boardX;
        this.boardY = boardY;

        this.setDisplaySize(gameConfig.board.cellSize, gameConfig.board.cellSize);
        this.setInteractive();

        this.isActivated = false;
        this.child = null;
        this.hasObstacle = false;

        scene.add.existing(this);

        this.on('pointerdown', () => this.handleClick());
        this.on('pointerover', () => this.handleHover(1));
        this.on('pointerout', () => this.handleHover(0));
    }

    update() {
        if (this.hasObstacle) {
            this.setTint(0xff0000)
        }
    }

    get hasChild() {
        return this.child !== null;
    }

    get position() {
        return { x: this.boardX, y: this.boardY };
    }

    handleClick() {
        if (GameManager.AttackMode && GameManager.targetableCells.includes(this) && GameManager.currentAttack) {
            this.setTint(0xff0000);
            GameManager.currentAttack.Execute(this);
            GameManager.AttackMode = false;
            // or
            // this.scene.cameras.main.flash(300, 255, 0, 10); // red flash
            this.scene.tweens.add({
                targets: this,
                scale: 1.4,
                duration: 100,
                yoyo: true,
                ease: 'Quad.easeInOut',
                onComplete: () => {
                    AttackManager.exitAttackMode()
                }
            });
        }
    }

    handleHover(state) {
        if (GameManager.AttackMode && GameManager.targetableCells.includes(this)) {

            if (!this.hasObstacle) {
                if (state) {
                    this.setTint(0xaaffff);
                } else {
                    this.setTint(0x00FF00);
                }
            }
        }
    }

    getNeighbors() {
        const board = GameManager.board;
        const neighbors = [];
        const { x, y } = this.position;
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 }   // right
        ];

        for (let dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            if (board.getCell(nx, ny) && !board.getCell(nx, ny).hasObstacle) {
                const neighbor = board.getCell(nx, ny);
                if (neighbor && !neighbor.hasObstacle)
                    neighbors.push(neighbor);
            }
        }

        return neighbors;
    }

}
