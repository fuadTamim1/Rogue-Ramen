import { gameConfig } from "./config.js";
import { GameManager } from "./GameManager.js";
import { helper } from "./helpers/helper.js";
import { SelectPaterns } from "./helpers/SelectPatterns.js";
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
            GameManager.player.TryAttack(GameManager.currentAttack, this);
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

    getNeighbors(range = 1, type = '+') {
        let neighbors = [];
        switch (type) {
            case '+':
                neighbors = SelectPaterns.plusShape(this, range)
                break;
            case '@':
                neighbors = SelectPaterns.SquareShape(this, range)
                break;
            case ']':
                neighbors = SelectPaterns.LineShape(this, GameManager.player.getCurrentCell(), range)
            case '[':
                neighbors = SelectPaterns.LineGroupShape(this, GameManager.player.getCurrentCell())
            default:
                neighbors = SelectPaterns.plusShape(this)
                break;
        }

        helper.removeCell(this, neighbors);

        neighbors.forEach((neighbor) => {
            if (neighbor && neighbor.hasObstacle)
                helper.removeCell(neighbor, neighbors);

        });


        return neighbors;
    }

}
