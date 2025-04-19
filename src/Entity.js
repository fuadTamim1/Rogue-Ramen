import { gameConfig } from "./config.js";
import { GameManager } from "./GameManager.js";

export class Entity extends Phaser.GameObjects.Container {
    constructor(scene, i, j, board, texture) {
        // Get cell coordinates and position
        const cell = GameManager.board.getCell(i,j);
        super(scene, cell.position.x, cell.position.y); // Center of cell
        this.scene = scene;

        // Store grid position
        this.board = board;
        this.boardX = i;
        this.boardY = j;
        this.setPosition(cell.x,cell.y)
        // Create internal sprite and add to container
        this.sprite = scene.add.sprite(0,0, texture);
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
        if (!this.board.getCell(i, j)) return;
        const targetCell = this.board.getCell(i, j);
        const currentCell = this.board.getCell(this.boardX, this.boardY);
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
        return this.board.getCell(this.boardX,this.boardY);
    }

    die() {
        GameManager.enemyManager.removeEnemy(this);
        const cell = this.getCurrentCell()
        cell.child = null;

        this.destroy(); // Destroys container and all children
    }

    update() {
        // Add any logic here if needed
    }
}
