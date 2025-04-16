import { gameConfig } from "./config.js";
import { GameManager } from "./GameManager.js";

export class Player {

    static preloadAssets(scene) {
        const assets = gameConfig.player.assets;
        scene.load.spritesheet('player', assets.player, { frameWidth: 32, frameHeight: 32 });
    }

    constructor(scene, x = 0, y = 0, board = null) {
        this.scene = scene;
        this.screenWidth = scene.cameras.main.width;
        this.screenHeight = scene.cameras.main.height;
        this.board = board; // Reference to the board
        this.x = x;
        this.y = y;
        this.facingRight = true;
        this.facingLeft = false;

        // state
        this.isMoving = false;

        // If we have a board reference, calculate the exact position
        if (board) {
            // Get the cell position
            const cell = board.cells[x][y];

            // Create the player sprite at the cell's position
            this.sprite = scene.add.sprite(
                cell.x,  // Use the cell's actual x position
                cell.y,  // Use the cell's actual y position
                'player'
            );
        } else {
            // Fallback if no board is provided
            const cellSize = gameConfig.board.cellSize;
            // Center of screen + grid offset
            this.sprite = scene.add.sprite(
                this.x * cellSize + cellSize / 2,
                this.y * cellSize + cellSize / 2,
                'player'
            );
        }

        this.sprite.setDisplaySize(gameConfig.board.cellSize * 0.75, gameConfig.board.cellSize * 0.75);

        // Create animations
        // this.createAnimations();

        // Play default animation
        // this.sprite.anims.play('player-idle-right');
    }

    createAnimations() {
        // Create animations if they don't exist
        if (!this.scene.anims.exists('player-idle-right')) {
            this.scene.anims.create({
                key: 'player-idle-right',
                frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });

            this.scene.anims.create({
                key: 'player-idle-left',
                frames: this.scene.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
                frameRate: 10,
                repeat: -1
            });

            // Add more animations as needed (walking, jumping, etc.)
        }
    }
    SetPosition(x, y) {
        this.x = x;
        this.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
    }
    TryMove(dir = 'r') {
        if (this.isMoving) return;
        dir = dir.toLowerCase();

        // Update facing direction first
        if (dir === 'r') {
            this.facingRight = true;
            // this.sprite.anims.play('player-idle-right', true);
        } else if (dir === 'l') {
            this.facingRight = false;
            // this.sprite.anims.play('player-idle-left', true);
        }

        // Calculate the next position
        let nextX = this.x;
        let nextY = this.y;

        switch (dir) {
            case 'r': nextX++; break;
            case 'l': nextX--; break;
            case 'u': nextY--; break;
            case 'd': nextY++; break;
        }

        // Check move validity conditions - easy to add more later
        let canMove = true;

        // Board boundary check
        if (this.board) {
            if (nextX < 0 || nextX >= this.board.cells.length ||
                nextY < 0 || nextY >= this.board.cells[0].length) {
                canMove = false;
            }
        }

        // Example: Add obstacle check 
        if (canMove && this.board && this.board.cells[nextX][nextY].hasObstacle) {
            canMove = false;
        }

        // Example: Add any other movement conditions
        if (canMove && this.board && this.board.cells[nextX][nextY].hasChild) {
            canMove = false;
        }

        // Finally move if all conditions pass
        if (canMove) {
            this.__move(dir);
        }
    }
    __move(dir) {
        console.log(GameManager.moveCount);
        console.log(`move from: {${this.x},${this.y}}`);

        switch (dir.toLowerCase()) {
            case 'u':
                this.y -= 1;
                break;
            case 'd':
                this.y += 1;
                break;
            case 'r':
                this.x += 1;
                break;
            case 'l':
                this.x -= 1;
                break;
        }
        GameManager.incrementMove();
        console.log(`move to: {${this.x},${this.y}}`);
        this.__UpdateSpritePosition();
        return;
    }

    __UpdateSpritePosition() {
        this.isMoving = true;
        // If we have a board reference, use the cell's position
        if (this.board && this.board.cells[this.x] && this.board.cells[this.x][this.y]) {
            const cell = this.board.cells[this.x][this.y];

            // Animate the movement to the cell's position
            this.scene.tweens.add({
                targets: this.sprite,
                x: cell.x,
                y: cell.y,
                duration: 200, // milliseconds
                ease: 'Power2',
                onComplete: () => {
                    this.isMoving = false;
                }
            });
        } else {
            // Fallback calculation
            const cellSize = gameConfig.board.cellSize;
            const startX = (this.screenWidth / 2) - ((this.board?.cells.length * cellSize) / 2);
            const startY = (this.screenHeight / 2) - ((this.board?.cells[0]?.length * cellSize) / 2);

            const newX = startX + this.x * cellSize + cellSize / 2;
            const newY = startY + this.y * cellSize + cellSize / 2;

            this.scene.tweens.add({
                targets: this.sprite,
                x: newX,
                y: newY,
                duration: 200,
                ease: 'Power2',
                onComplete: () => {
                    this.isMoving = false;
                }
            });
        }
    }

    TryUsePower() { }

    // others...
}