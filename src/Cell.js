import { gameConfig } from "./config.js";
import { GameManager } from "./GameManager.js";
import { helper } from "./helpers/helper.js";
import { SelectPaterns } from "./helpers/SelectPatterns.js";
import { AttackManager } from "./managers/AttackManager.js";

export class Cell extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, boardX, boardY, cell_texture = "cell_1") {
        super(scene, x, y, cell_texture);
        this.setOrigin(0.5);
        this.scene = scene;
        this.boardX = boardX;
        this.boardY = boardY;
        // this.color = 0xFFFFFF;
        this.setDisplaySize(gameConfig.board.cellSize, gameConfig.board.cellSize);
        this.setInteractive();
        this.setDepth(1)

        this.isActivated = false;
        this.child = null;
        this.hasObstacle = false;

        this.orginaltexture = cell_texture;
        this.orginalColor = "#FFFFFF";
        this.Oriscale = this.scale;

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
        if (this.hoverTween) {
            this.hoverTween.stop();
            this.hoverTween = null;
            this.setScale(this.Oriscale)
        }
        if (GameManager.AttackMode && GameManager.targetableCells.includes(this) && GameManager.currentAttack) {
            this.setTint(0xff0000);
            GameManager.player.TryAttack(GameManager.currentAttack, this);
            // or
            // this.scene.cameras.main.flash(300, 255, 0, 10); // red flash

            this.scene.tweens.add({
                targets: this,
                scale: this.Oriscale * 0.8,
                duration: 100,
                yoyo: true,
                ease: 'Quad.easeInOut',
            });
        }
    }

    handleHover(state) {
        if (GameManager.AttackMode && GameManager.targetableCells.includes(this)) {
            const damgeableCells = GameManager.currentAttack.getHitByCells(this);
            if (!this.hasObstacle) {
                if (state) {
                    this.setTint(0xFF0000)
                    if (damgeableCells) {
                        damgeableCells.forEach((c) => {
                            c.resetTexutre()
                            c.setTexture("cell_target");
                        });
                    }
                    if (!this.hoverTween)
                        this.hoverTween = this.scene.tweens.add({
                            targets: this,
                            scale: this.Oriscale * 0.95,
                            yoyo: true,
                            loop: -1,
                        })
                } else {
                    if (damgeableCells) {
                        damgeableCells.forEach((c) => {
                            if (GameManager.targetableCells.includes(c)) {
                                c.resetTexutre()
                                c.setTexture("cell_hover");
                            } else {
                                c.resetTexutre()
                            }
                        });
                    }
                    if (this.hoverTween) {
                        this.hoverTween.stop();
                        this.hoverTween = null;
                        this.setScale(this.Oriscale)
                    }
                    console.log(state)
                    this.clearTint()

                }
            }
        }
    }

    resetTexutre() {
        this.clearTint()
        this.setTexture(this.orginaltexture);
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
            case 'o':
                neighbors = SelectPaterns.topHarm(this, 8);
                // console.log(neighbors);
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
