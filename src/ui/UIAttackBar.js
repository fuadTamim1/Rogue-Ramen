import { GameManager } from "../GameManager.js";
import { AttackManager } from "../managers/AttackManager.js";

export class UIAttackBar extends Phaser.GameObjects.Container {
    static BUTTON_SCALE = 2; // Your original scale constant

    static DEFAULT_STYLE = {
        // Sizing (compatible with your BUTTON_SCALE)
        buttonSize: 48,      // Base icon size (before scale)
        buttonSpacing: 70 * UIAttackBar.BUTTON_SCALE,   // Scaled spacing

        // Backgrounds
        barbtnColor: 0x222222,
        barbtnAlpha: 0.7,
        buttonbtnColor: 0x444444,
        buttonbtnAlpha: 0.8,
        buttonbtnRadius: 10,

        // Positioning
        bottomOffset: 100,
        padding: 20
    };

    constructor(scene, attacks) {
        const x = scene.cameras.main.centerX;
        const y = scene.cameras.main.height - UIAttackBar.DEFAULT_STYLE.bottomOffset;

        super(scene, x, y);
        this.scene = scene;
        this.attacks = attacks || [];
        this.buttons = [];

        // Style configuration (preserving your scale approach)
        this.style = {
            ...UIAttackBar.DEFAULT_STYLE,
            hoverScale: UIAttackBar.BUTTON_SCALE * 1.1,
            pressedScale: UIAttackBar.BUTTON_SCALE * 0.95,
            tweenDuration: 100
        };

        this.createBackground();
        this.createButtons();
        scene.add.existing(this);
    }

    createBackground() {
        const totalWidth = (this.attacks.length - 1) * this.style.buttonSpacing;
        const btnWidth = totalWidth + this.style.padding * 10;
        const btnHeight = this.style.buttonSize * UIAttackBar.BUTTON_SCALE + this.style.padding * 2;

        this.btn = this.scene.add.graphics()
            .fillStyle(this.style.barbtnColor, this.style.barbtnAlpha)
            .fillRoundedRect(
                -btnWidth / 2, -btnHeight / 2,
                btnWidth, btnHeight,
                this.style.buttonbtnRadius
            );
        this.add(this.btn);
    }

    createButtons() {
        const startX = -((this.attacks.length - 1) * this.style.buttonSpacing) / 2;

        this.attacks.forEach((attack, index) => {
            if (!attack.icon) {
                console.warn(`Attack ${attack.name} missing icon`);
                return;
            }

            const x = startX + index * this.style.buttonSpacing;
            const container = this.scene.add.container(x, 0);

            // Button background
            const btn = this.scene.add.graphics()
                .fillStyle(this.style.buttonbtnColor, this.style.buttonbtnAlpha)
                .fillRoundedRect(
                    -this.style.buttonSize / 2 * UIAttackBar.BUTTON_SCALE - 5,
                    -this.style.buttonSize / 2 * UIAttackBar.BUTTON_SCALE - 5,
                    this.style.buttonSize * UIAttackBar.BUTTON_SCALE + 10,
                    this.style.buttonSize * UIAttackBar.BUTTON_SCALE + 10,
                    this.style.buttonbtnRadius
                ).setInteractive({
                    useHandCursor: true,
                    hitArea: new Phaser.Geom.Rectangle(
                        -this.style.buttonSize / 2 * UIAttackBar.BUTTON_SCALE - 5,
                        -this.style.buttonSize / 2 * UIAttackBar.BUTTON_SCALE - 5,
                        this.style.buttonSize * UIAttackBar.BUTTON_SCALE + 10,
                        this.style.buttonSize * UIAttackBar.BUTTON_SCALE + 10,
                    ),
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains
                });

            // Attack icon (using your exact scaling)
            const icon = this.scene.add.image(0, 0, attack.icon)
                .setScale(UIAttackBar.BUTTON_SCALE * 2)
            // Label (position adjusted for scale)
            const label = this.scene.add.text(
                0,
                this.style.buttonSize / 2 * UIAttackBar.BUTTON_SCALE + 8,
                attack.name,
                {
                    fontFamily: 'Pixelify Sans',
                    fontSize: '16px',
                    color: '#FFFFFF'
                }
            ).setOrigin(0.5);

            container.add([btn, icon, label]);
            this.setupButtonInteractions(btn, container, attack);
            this.add(container);
            this.buttons.push(container);
        });
    }

    setupButtonInteractions(button, container, attack) {
        button.on('pointerover', () => {
            this.scene.tweens.add({
                targets: container,
                scale: this.style.hoverScale / UIAttackBar.BUTTON_SCALE,
                duration: this.style.tweenDuration
            });
        });

        button.on('pointerout', () => {
            this.scene.tweens.add({
                targets: container,
                scale: 1,
                duration: this.style.tweenDuration
            });
        });

        button.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: container,
                scale: this.style.pressedScale / UIAttackBar.BUTTON_SCALE,
                duration: this.style.tweenDuration,
                yoyo: true
            });

            try {
                AttackManager.enableAttackMode(attack)
                // console.log(attack)
            } catch (error) {
                console.error(`Attack error: ${error}`);
            }
        });
    }

    show() {
        this.active = true;
        this.setVisible(true)
        this.scene.tweens.add({
            targets: this,
            y: this.scene.cameras.main.height - UIAttackBar.DEFAULT_STYLE.bottomOffset,
            duration: 400,
            onComplete: () => {

            }
        });
    }


    hide() {
        this.active = false;
        this.scene.tweens.add({
            targets: this,
            y: 1000,
            duration: 400,
            onComplete: () => {
                this.setVisible(false)
            }
        });
    }

    updatePosition() {
        this.setPosition(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.height - this.style.bottomOffset
        );
    }

    handleResize() {
        this.updatePosition();
        this.removeAll(true);
        this.createBackground();
        this.createButtons();
    }

    refresh() {
        this.attacks = GameManager.player.attacks;

        // Remove previous buttons and background
        this.removeAll(true);  // Destroys all children (buttons + btn)
        this.buttons = [];

        // Recreate UI
        this.createBackground();
        this.createButtons();
    }

}