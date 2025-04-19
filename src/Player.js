import { gameConfig } from "./config.js";
import { GameManager } from "./GameManager.js";

export class Player extends Phaser.GameObjects.Sprite {

    static preloadAssets(scene) {
        const assets = gameConfig.player.assets;
        // The atlas is already loaded in the scene's preload method
        // We can keep the original spritesheet as fallback
        scene.load.spritesheet('player', assets.player, { frameWidth: 50, frameHeight: 40 });
    }

    constructor(scene, x = 0, y = 0, board = null) {
        // Calculate initial position
        let initialX, initialY;
        // In Player constructor
        scene.time.delayedCall(100, () => this.playIdle());
        if (board && board.getCell(x, y)) {
            // Get the cell position
            const cell = board.getCell(x, y);
            initialX = cell.x;
            initialY = cell.y;
        } else {
            // Fallback if no board is provided
            const cellSize = gameConfig.board.cellSize;
            initialX = x * cellSize + cellSize / 2;
            initialY = y * cellSize + cellSize / 2;
        }

        super(scene, initialX, initialY, 'atlas');
        // Set origin to bottom center (0.5, 1)
        this.setOrigin(0.5, .75);

        // Add this sprite to the scene
        scene.add.existing(this);

        // Store references and properties
        this.scene = scene;
        this.screenWidth = scene.cameras.main.width;
        this.screenHeight = scene.cameras.main.height;
        this.board = board; // Reference to the board
        this.boardX = x;
        this.boardY = y;
        this.facingRight = true;
        this.facingLeft = false;
        this.attacks = [];
        this.isMoving = false;

        const scale = 3; // Must be integer (1, 2, 3, etc.)
        this.setDisplaySize(
            gameConfig.board.cellSize * scale,
            gameConfig.board.cellSize * scale
        );

        // Disable smoothing (if using WebGL)
        this.setTexture('atlas', 'character aniamtion export #Idle 0.aseprite');
        this.setScale(scale); // Alternative to setDisplaySize
        // Set up animation completion listener once
        this.on('animationcomplete', this.handleAnimationComplete, this);

        // Explicitly start the idle animation - make sure this matches your atlas frame tag
        this.playIdle();
    }

    playIdle() {
        // First check if texture is ready
        if (!this.scene.textures.exists('atlas')) {
            console.warn('Atlas texture not ready yet');
            return;
        }

        // Check if animation exists (Phaser 3.88 compatible check)
        if (this.scene.anims.anims.entries.hasOwnProperty('Idle')) {
            this.play('Idle', true);
        } else {
            console.warn('Idle animation not found, using fallback frame');
            // Use direct frame reference
            this.setFrame('character aniamtion export #Idle 0.aseprite');
        }
    }

    handleAnimationComplete(animation) {
        // When movement or attack animations complete, go back to idle
        if (animation.key === 'mvoe' || animation.key === 'Knife attack') {
            this.playIdle();
        }
    }

    SetPosition(x, y) {
        this.boardX = x;
        this.boardY = y;
        this.x = x;
        this.y = y;
    }

    TryMove(dir = 'r') {
        if (this.isMoving) return;
        dir = dir.toLowerCase();

        // Update facing direction first


        // Calculate the next position
        let nextX = this.boardX;
        let nextY = this.boardY;

        switch (dir) {
            case 'r': nextX++; break;
            case 'l': nextX--; break;
            case 'u': nextY--; break;
            case 'd': nextY++; break;
        }

        // Check move validity conditions - easy to add more later
        let canMove = GameManager.allowToMove;
        if (canMove)
            if (dir === 'r') {
                this.facingRight = true;
                this.setFlipX(false);  // Use flip instead of separate animations
            } else if (dir === 'l') {
                this.facingRight = false;
                this.setFlipX(true);  // Flip the sprite horizontally
            }
        // Board boundary check
        if (this.board) {
            if (!this.board.getCell(this.boardX, this.boardY)) {
                canMove = false;
            }
            if (!(nextX >= 0 && nextX < this.board.getBoardWidth() && nextY >= 0 && nextY < this.board.getBoardHigh())) {
                canMove = false;
            }
        }

        // Example: Add obstacle check 
        if (canMove && this.board && this.board.getCell(nextX, nextY) && this.board.getCell(nextX, nextY).hasObstacle) {
            canMove = false;

        }

        if (canMove && this.board && this.board.getCell(nextX, nextY) && this.board.getCell(nextX, nextY).hasChild) {
            canMove = false;
        }

        // Finally move if all conditions pass
        if (canMove) {
            // Play walking animation before movement
            if (this.scene.anims.exists('mvoe')) {
                this.play('mvoe', true);
            } else {
                console.warn("Animation 'mvoe' not found!");
            }
            this.__move(dir);
        }
    }

    __move(dir) {
        console.log(`move ${dir} from: (${this.boardX}, ${this.boardY})`);

        switch (dir.toLowerCase()) {
            case 'u':
                this.boardY -= 1;
                break;
            case 'd':
                this.boardY += 1;
                break;
            case 'r':
                this.boardX += 1;
                console.log(`move right`);

                break;
            case 'l':
                this.boardX -= 1;
                break;
        }
        console.log(`move from: (${this.boardX}, ${this.boardY})`);

        GameManager.incrementMove();
        this.__UpdateSpritePosition();
        return;
    }

    __UpdateSpritePosition() {
        this.isMoving = true;
        // If we have a board reference, use the cell's position
        if (this.board && this.board.getCell(this.boardX, this.boardY)) {
            const cell = this.board.getCell(this.boardX, this.boardY);

            // Animate the movement to the cell's position using Phaser's built-in tween
            this.scene.tweens.add({
                targets: this,
                x: cell.x,
                y: cell.y,
                duration: 400, // milliseconds
                ease: 'Power2',
                onComplete: () => {
                    this.isMoving = false;
                    // We don't need to manually set the animation here
                    // The animation complete handler will take care of that
                }
            });
        } else {
            console.warn("fallback player")
            // Fallback calculation
            const cellSize = gameConfig.board.cellSize;
            const startX = (this.screenWidth / 2) - ((this.board?.getBoardWidth() * cellSize) / 2);
            const startY = (this.screenHeight / 2) - ((this.board?.getBoardHigh() * cellSize) / 2);

            const newX = startX + this.boardX * cellSize + cellSize / 2;
            const newY = startY + this.boardY * cellSize + cellSize / 2;

            this.scene.tweens.add({
                targets: this,
                x: newX,
                y: newY,
                duration: 200,
                ease: 'Power2',
                onComplete: () => {
                    this.isMoving = false;
                    // We don't need to manually set the animation here
                    // The animation complete handler will take care of that
                }
            });
        }
    }

    getPosition() {
        return { x: this.boardX, y: this.boardY };
    }

    getCurrentCell() {
        return this.board.getCell(this.boardX, this.boardY);
    }

    TryUsePower() {
        // Play attack animation
        if (this.scene.anims.exists('Knife attack')) {
            this.play('Knife attack', true);
            // No need to add listener here, we've set up the global listener in constructor
        } else {
            console.warn("Animation 'Knife attack' not found!");
        }
    }
}