import { gameConfig } from "./config.js";

export class Cell extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, boardX, boardY) {
        super(scene, x, y, 'cell');
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
        this.isActivated = !this.isActivated;
        this.hasObstacle = this.isActivated;
        this.setTint(this.isActivated ? 0xff0000 : 0xffffff);
        if (this.hasChild) {
            this.child.die();
        }
        this.scene.tweens.add({
            targets: this,
            scale: 1.4,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeInOut'
        });

    }


    handleHover(state) {
        if (!this.hasObstacle) {
            if (state) {
                this.setTint(0xaaaaaa);
            } else {
                this.setTint(0xffffff);
            }
        }
    }

    getNeighbors = function (grid) {
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
            if (grid[nx]?.[ny] && !grid[nx][ny].hasObstacle) {
                neighbors.push(grid[nx][ny]);
            }
        }

        return neighbors;
    };

}
