import { GameManager } from "../GameManager.js";
import { AttackManager } from "../managers/AttackManager.js";
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
        this.setDepth(0)


        scene.add.existing(this);
    }

    createUI() {
        this.label = this.scene.ui.createText(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height - 200,
            "Select Where To Hit",
            {
                fontFamily: "Pixelify Sans",
                fontSize: '16px',
                color: '#FFFFFF'
            }
        ).setOrigin(0.5).setDepth(100);
        this.exitButton = this.createButton(this.scene.cameras.main.width - 200, 80, 'Cancle', () => {
            // scene.events.emit('cancle-attack');
            AttackManager.exitAttackMode()
            this.hide()
        });

        const WeaponIconFrame = GameManager.spriteManager.getFrameTexture('knife', 0);

        // this.WeaponIcon.setDepth(200)

       

        // Pathfinding usage example
        GameManager.events.on('new_move_completed', () => {
            // this.WeaponIcon.x = GameManager.player.getWorldPosition().x;
            // this.WeaponIcon.y = GameManager.player.getWorldPosition().y - 100;
        });

        this.add([this.label, this.exitButton])
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
        if (GameManager.AttackMode) {
            const playerPos = GameManager.player.getWorldPosition();
            const pointer = this.scene.input.activePointer;
            let dirX = pointer.x - playerPos.x;
            let dirY = pointer.y - playerPos.y;
            let angle = Phaser.Math.RadToDeg(Math.atan2(-dirY, dirX));
            angle = (angle + 360) % 360;


            // console.log(angle)

            GameManager.player.ui.WeaponIcon.setFlipX(!(angle >= 270 || angle < 90));
        }
    }

    show() {
        this.active = true;
        this.setVisible(true)
        

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