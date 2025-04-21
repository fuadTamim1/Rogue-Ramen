import { GameManager } from "../GameManager.js";
import { AttackManager } from "../managers/AttackManager.js";
import { gameConfig } from "../config.js";
export class UIAttackSelect extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.active = false;
        this.setVisible(this.active)
        this.createUI();
        this.setPosition(0, 0);


        scene.add.existing(this);
    }

    createUI() {
        this.label = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height - 200,
            "Select Where To Hit",
            {
                fontFamily: "Pixelify Sans",
                fontSize: '16px',
                color: '#FFFFFF'
            }
        ).setOrigin(0.5);
        this.exitButton = this.createButton(this.scene.cameras.main.width - 200, 80, 'Cancle', () => {
            // scene.events.emit('cancle-attack');
            AttackManager.exitAttackMode()
            this.hide()
        });

        const WeaponIconFrame = GameManager.spriteManager.getFrameTexture('knife', 0);
        this.WeaponIcon = this.scene.add.sprite(GameManager.player.getWorldPosition().x, GameManager.player.getWorldPosition().y - 100, 'atlas', WeaponIconFrame);
        this.WeaponIcon.setDisplaySize(
            gameConfig.board.cellSize * 2,
            gameConfig.board.cellSize * 2
        );

        // Pathfinding usage example
        GameManager.events.on('new_move_completed', () => {
            this.WeaponIcon.x = GameManager.player.getWorldPosition().x;
            this.WeaponIcon.y = GameManager.player.getWorldPosition().y - 100;
        });

        this.add([this.label, this.exitButton, this.WeaponIcon])
    }

    createButton(x, y, text, callback) {
        let btnBg = this.scene.add.rectangle(x, y, 180, 40, 0x444444, 1)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        let btnText = this.scene.add.text(x, y, text, {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        btnBg.on('pointerdown', callback);

        return this.scene.add.container(0, 0, [btnBg, btnText]);
    }

    update() {
        // if (GameManager.AttackMode) {
        //     const playerPos = GameManager.player.getWorldPosition();
        //     const pointer = this.scene.input.activePointer;
        //     let dirX = pointer.x - playerPos.x;
        //     let dirY = pointer.y - playerPos.y;
        //     let angle = Phaser.Math.RadToDeg(Math.atan2(-dirY, dirX));
        //     angle = (angle + 360) % 360;

        //     if (angle >= 315 || angle < 45) { angle = 0 } else
        //         if (angle >= 45 && angle < 135) { angle = 90 } else
        //             if (angle >= 135 && angle < 225) { angle = 180 } else
        //                 if (angle >= 225 && angle < 315) { angle = 270 }

        //     // console.log(angle)

        //     this.WeaponIcon.setRotation(Phaser.Math.DegToRad(90 - angle));
        // }
    }

    show() {
        this.active = true;
        this.setVisible(true)
        if (GameManager.currentAttack)
            this.WeaponIcon.setTexture(GameManager.currentAttack.key, 0)

        this.WeaponIcon.setDepth(10000)

        this.scene.tweens.add({
            targets: this.label,
            y: this.scene.cameras.main.height - 200,
            duration: 400,
            ease: 'Back.Out',
        });
        this.scene.tweens.add({
            targets: this.exitButton,
            y: 80,
            duration: 400,
            ease: 'Back.Out',
        });

        if (GameManager.currentAttack) {
            this.WeaponIcon.setTexture(GameManager.currentAttack.icon, 0);
        }
        this.scene.tweens.add({
            targets: this,
            y: 0,
            duration: 400,
            ease: 'Back.Out',
        });

    }


    hide() {
        this.active = false;
        this.scene.tweens.add({
            targets: this.label,
            y: 1000,
            duration: 400,
            ease: 'Back.In',
            onComplete: () => {
                this.setVisible(false)
            }
        });
        this.scene.tweens.add({
            targets: this.exitButton,
            y: -300,
            duration: 400,
            ease: 'Back.In',
            onComplete: () => {
                // this.setVisible(false)
            }
        });
    }
}