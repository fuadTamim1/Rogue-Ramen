import { EnemyAI } from "../AI/EnemyAI.js";
import { AStar } from "../AI/pathfinding.js";
import { gameConfig } from "../config.js";
import { GameManager } from "../GameManager.js";
import { Game } from "../scenes/Game.js";

export class Entity extends Phaser.GameObjects.Container {
    constructor(scene, i, j, board, texture) {
        // Get cell coordinates and position
        const cell = GameManager.board.getCell(i, j);
        super(scene, cell.position.x, cell.position.y); // Center of cell
        this.scene = scene;

        // Store grid position
        this.board = board;
        this.boardX = i;
        this.boardY = j;
        this.setPosition(cell.x, cell.y)
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
        this.attacks = [];
        this.targetSquare = null;
        this.currentAttack = null;

        // Set AI for Entity
        this.ai = new EnemyAI(this)

        this.update();
    }

    SetDiff(lvl) {
        this.ai.diff = lvl;
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

    loadAttack(Attack) {
        this.attacks.push(Attack);

        if (!this.currentAttack) {
            this.ai.chooseAttack()
        }
    }

    attack() {
        if (this.ai.canAttack()) {

        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.3,
            yoyo: true,
            repeat: 3,
            duration: 100
        });
        if (this.hp <= 0) {
            this.die();
        }
    }

    getCurrentCell() {
        return this.board.getCell(this.boardX, this.boardY);
    }

    die() {
        GameManager.enemyManager.removeEnemy(this);
        const cell = this.getCurrentCell()
        cell.child = null;

        this.destroy(); // Destroys container and all children
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

    async StartTurn() {
        this.ai.update(GameManager.player);

        // ✅ Properly wait for cooldowns
        for (const attack of this.attacks) {
            await attack.increaseCoolDown();
        }

        // ✅ If currently has a target and attack, execute it
        if (this.targetSquare && this.currentAttack) {
            // console.log(`{${this.currentAttack?.constructor?.name}} -> {${this.targetSquare?.constructor?.name}}`);
            await this.currentAttack.Execute(this.getCurrentCell(), this.targetSquare);
            this.targetSquare = null;
            this.currentAttack = null;
            return;
        }
        // ✅ If can attack now, set target and highlight
        if (this.ai.canAttack(GameManager.player)) {
            this.targetSquare = GameManager.player.getCurrentCell();
            GameManager.board.HighlightCell(this.targetSquare.boardX, this.targetSquare.boardY, 0xFF00FF);
            // console.log(`ready to attack: cell{${this.targetSquare.boardX}, ${this.targetSquare.boardY}}`);
            return;
        }
        if (GameManager.enemyManager.getEnemiesCount({ checkIfReadyForAttack: true }) > 0 ||
            (GameManager.enemyManager.getEnemiesCountByDistance(GameManager.player.getCurrentCell(), 2) > 0 && AStar.getPathDistance(this.getCurrentCell(), GameManager.player.getCurrentCell()) >= 1)) {
            return;
        }

        console.warn("dis", AStar.getPathDistance(this.getCurrentCell(), GameManager.player.getCurrentCell()))
        if (AStar.getPathDistance(this.getCurrentCell(), GameManager.player.getCurrentCell()) > 6 || AStar.getPathDistance(this.getCurrentCell(), GameManager.player.getCurrentCell()) <= 3) {
            const rand = Math.fround(Math.random() * 3);
           return rand === 2;
        }



        // ✅ If can move, move toward player
        if (this.ai.canMove(GameManager.player.getCurrentCell())) {
            const path = this.ai.findPlayer();
            if (path?.[1]) {
                await this.moveTo(path[1].boardX, path[1].boardY);
            }
        }
    }


}
