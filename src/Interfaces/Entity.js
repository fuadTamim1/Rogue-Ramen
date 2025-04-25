import { EnemyAI } from "../AI/EnemyAI.js";
import { AStar } from "../AI/pathfinding.js";
import { gameConfig } from "../config.js";
import { GameManager } from "../GameManager.js";
import { Game } from "../scenes/Game.js";
import { UIEnemy } from "../ui/UIEnemy.js";

export class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, i, j, board, texture) {
        // Get cell coordinates and position
        const cell = GameManager.board.getCell(i, j);
        super(scene, cell.position.x, cell.position.y, texture); // Center of cell
        this.scene = scene;

        // Store grid position
        this.board = board;
        this.boardX = i;
        this.boardY = j;
        this.setPosition(cell.x, cell.y)

        this.setDepth(2);
        this.ui = new UIEnemy(scene);
        // Set origin to bottom center (0.5, 1)
        this.setOrigin(0.5, .75);
        this.setDepth(10)

        const scale = 4; // Must be integer (1, 2, 3, etc.)

        this.setScale(scale);
        scene.add.existing(this);

        GameManager.events.on('newMove', (moveCount) => {
            // if (moveCount % 2 != 0) ;
            this.update()

        });

        this.idle_key = 'stick_guy_idle'
        this.move_key = 'stick_guy_move'
        this.death_key = 'stick_guy_death'

        // Health & state
        this.maxhp = 2;
        this.hp = this.maxhp;

        // Mark cell as occupied
        cell.child = this;
        this.attacks = [];
        this.targetSquare = null;
        this.currentAttack = null;

        this.ui.createHealthBarUI(this.hp, this.maxhp);
        this.on('animationcomplete', this.handleAnimationComplete, this);

        // Set AI for Entity
        this.ai = new EnemyAI(this)
        this.update()
    }


    playIdle() {
        // Check if animation exists (Phaser 3.88 compatible check)
        if (this.scene.anims.anims.entries.hasOwnProperty('idle')) {
            this.play('idle', true);
        } else {
            console.warn('Idle animation not found, using fallback frame');
            // Use direct frame reference
            this.setFrame('character aniamtion export #Idle 0.aseprite');
        }
    }

    handleAnimationComplete(animation) {
        // When movement or attack animations complete, go back to idle
        if (animation.key === 'move' || animation.key === 'Knife attack' || animation.key === "teleport_out") {
            this.playIdle();
        }
    }

        update() {
            this.ui.setPosition(this.x, this.y);
            const player = GameManager.player.getWorldPosition();;
            let dirX = player.x - this.x;
            let dirY = player.y - this.y;
            let angle = Phaser.Math.RadToDeg(Math.atan2(-dirY, dirX));
            angle = (angle + 360) % 360;


            // console.log(angle)

            this.ui.WeaponIcon.setFlipX(!(angle >= 270 || angle < 90));
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
            this.ui.updateHealthBar(this.hp, this.maxhp)
            this.scene.tweens.add({
                targets: this,
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
            this.ui.destroy();
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
                console.log(this.targetSquare);
                await this.currentAttack.Execute(this.getCurrentCell(), this.targetSquare);
                this.ui.WeaponIcon.play(this.currentAttack.key);
                this.scene.time.delayedCall(700, () => {
                    this.ui.hideWeapon()
                })
                this.targetSquare = null;
                this.currentAttack = null;
                return;
            }
            // ✅ If can attack now, set target and highlight
            if (this.ai.canAttack(GameManager.player)) {

                this.targetSquare = GameManager.player.getCurrentCell();
                // GameManager.board.HighlightCell(this.targetSquare.boardX, this.targetSquare.boardY, 0xFF00FF, '');
                this.ui.showWeapon(this.currentAttack.icon)
                // console.log(`ready to attack: cell{${this.targetSquare.boardX}, ${this.targetSquare.boardY}}`);
                return;
            }
            // if (GameManager.enemyManager.getEnemiesCount({ checkIfReadyForAttack: true }) > 0 ||
            //     (GameManager.enemyManager.getEnemiesCountByDistance(GameManager.player.getCurrentCell(), 2) > 0 && AStar.getPathDistance(this.getCurrentCell(), GameManager.player.getCurrentCell()) >= 1)) {
            //     return;
            // }

            console.warn("dis", AStar.getPathDistance(this.getCurrentCell(), GameManager.player.getCurrentCell()))
            if (AStar.getPathDistance(this.getCurrentCell(), GameManager.player.getCurrentCell()) > 6 || AStar.getPathDistance(this.getCurrentCell(), GameManager.player.getCurrentCell()) <= 3) {
                const rand = Math.round(Math.random() * 3);
                if (rand < 2)
                    return;
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
