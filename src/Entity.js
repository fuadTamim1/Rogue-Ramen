import { gameConfig } from "./config.js";
import { GameManager } from "./GameManager.js";

export class Entity extends Phaser.GameObjects.Container {
    constructor(scene, i, j, board, texture) {
        // Get cell coordinates and position
        const cell = board.cells[i][j];
        super(scene, cell.x, cell.y); // Center of cell
        this.scene = scene;

        // Store grid position
        this.board = board;
        this.boardX = i;
        this.boardY = j;

        // Create internal sprite and add to container
        this.sprite = scene.add.sprite(0, 0, texture);
        this.sprite.setDisplaySize(
            gameConfig.board.cellSize * 0.75,
            gameConfig.board.cellSize * 0.75
        );
        this.sprite.setOrigin(0.5);
        this.add(this.sprite);

        // Optional: add HP bar or other children here

        // Add container to scene and enable physics
        scene.add.existing(this);

        GameManager.events.on('newMove', (moveCount) => {
            // if (moveCount % 2 != 0) ;
        });

        // Health & state
        this.hp = 100;

        // Mark cell as occupied
        cell.child = this;

        // tween scal up down idle
        this.scene.tweens.add({
            targets: this.sprite,
            scaleY: 1.2,
            y:  -5,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    SetPosition(x, y) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 300,
            ease: 'Power2',
        });
    }
    getBoardPosition() {
        return { i: this.boardX, j: this.boardY };
    }
    moveTo(i, j) {
        if (!this.board.cells[i] || !this.board.cells[i][j]) return;
        const targetCell = this.board.cells[i][j];
        const currentCell = this.board.cells[this.boardX][this.boardY];
        if (!targetCell.hasChild) {
            // Update cell states
            currentCell.child = null;

            targetCell.child = this;

            // Update board reference
            this.boardX = i;
            this.boardY = j;

            // Move container
            this.SetPosition(targetCell.x, targetCell.y);
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.die();
        }
    }

    getCurrentCell() {
        return this.board.cells[this.boardX][this.boardY];
    }

    die() {
        this.scene.removeEnemy(this);
        const cell = this.getCurrentCell()
        cell.child = null;

        this.destroy(); // Destroys container and all children
    }

    update() {
        // Add any logic here if needed
    }
}
