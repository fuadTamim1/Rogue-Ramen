import { GameManager } from "../GameManager.js";
import { AttackManager } from "../managers/AttackManager.js";

export class UIAttackBar extends Phaser.GameObjects.Container {
    static BUTTON_SCALE = 2; // Your original scale constant

    static DEFAULT_STYLE = {
        // Sizing (compatible with your BUTTON_SCALE)
        buttonSize: 48,      // Base icon size (before scale)
        buttonSpacing: 70 * UIAttackBar.BUTTON_SCALE,   // Scaled spacing

        // Backgrounds
        barBgColor: 0x222222,
        barBgAlpha: 0.7,
        buttonBgColor: 0x444444,
        buttonBgAlpha: 0.8,
        buttonBgRadius: 10,

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
        const bgWidth = totalWidth + this.style.padding * 10;
        const bgHeight = this.style.buttonSize * UIAttackBar.BUTTON_SCALE + this.style.padding * 2;

        this.bg = this.scene.add.graphics()
            .fillStyle(this.style.barBgColor, this.style.barBgAlpha)
            .fillRoundedRect(
                -bgWidth / 2, -bgHeight / 2,
                bgWidth, bgHeight,
                this.style.buttonBgRadius
            );
        this.add(this.bg);
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
            const bg = this.scene.add.graphics()
                .fillStyle(this.style.buttonBgColor, this.style.buttonBgAlpha)
                .fillRoundedRect(
                    -this.style.buttonSize / 2 * UIAttackBar.BUTTON_SCALE - 5,
                    -this.style.buttonSize / 2 * UIAttackBar.BUTTON_SCALE - 5,
                    this.style.buttonSize * UIAttackBar.BUTTON_SCALE + 10,
                    this.style.buttonSize * UIAttackBar.BUTTON_SCALE + 10,
                    this.style.buttonBgRadius
                );

            // Attack icon (using your exact scaling)
            const icon = this.scene.add.image(0, 0, 'atlas', attack.icon)
                .setScale(UIAttackBar.BUTTON_SCALE)
                .setInteractive({
                    useHandCursor: true,
                    hitArea: new Phaser.Geom.Rectangle(
                        -25, -20,
                        100, 80
                    ),
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains
                });

            // Label (position adjusted for scale)
            const label = this.scene.add.text(
                0,
                this.style.buttonSize / 2 * UIAttackBar.BUTTON_SCALE + 8,
                attack.name,
                {
                    fontFamily: 'Arial',
                    fontSize: '16px',
                    color: '#FFFFFF'
                }
            ).setOrigin(0.5);

            container.add([bg, icon, label]);
            this.setupButtonInteractions(icon, container, attack);
            this.add(container);
            this.buttons.push(container);
        });
    }

    setupButtonInteractions(icon, container, attack) {
        icon.on('pointerover', () => {
            this.scene.tweens.add({
                targets: container,
                scale: this.style.hoverScale / UIAttackBar.BUTTON_SCALE,
                duration: this.style.tweenDuration
            });
        });

        icon.on('pointerout', () => {
            this.scene.tweens.add({
                targets: container,
                scale: 1,
                duration: this.style.tweenDuration
            });
        });

        icon.on('pointerdown', () => {
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
        this.removeAll(true);  // Destroys all children (buttons + bg)
        this.buttons = [];

        // Recreate UI
        this.createBackground();
        this.createButtons();
    }

}