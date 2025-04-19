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
        this.exitButton = this.createButton(this.scene.cameras.main.width - 100, 80, 'Cancle', () => {
            // scene.events.emit('cancle-attack');
            AttackManager.exitAttackMode()
            this.hide()
        });
        this.add([this.label,this.exitButton])
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

    show() {
        this.active = true;
        this.setVisible(true)
        this.scene.tweens.add({
            targets: this,
            y: 0,
            duration: 400,
            ease: 'Back.Out',
            onComplete: () => {
                
            }
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