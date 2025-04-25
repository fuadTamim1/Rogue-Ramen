import { GameManager } from "../GameManager.js";
import { AttackManager } from "../managers/AttackManager.js";

export class UIAttackBar extends Phaser.GameObjects.Container {
    static BUTTON_SCALE = 2;

    static DEFAULT_STYLE = {
        buttonSize: 48,
        buttonSpacing: 70 * UIAttackBar.BUTTON_SCALE,
        barbtnColor: 0x222222,
        barbtnAlpha: 0.7,
        buttonbtnColor: 0x444444,
        buttonbtnAlpha: 0.8,
        buttonbtnRadius: 10,
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

        this.ui = this.scene.ui;

        this.style = {
            ...UIAttackBar.DEFAULT_STYLE,
            hoverScale: UIAttackBar.BUTTON_SCALE * 1.1,
            pressedScale: UIAttackBar.BUTTON_SCALE * 0.95,
            tweenDuration: 100
        };

        this.createBackground();
        this.createButtons();
        if (this.scene?.add) {
            this.scene.add.existing(this);
        } else {
            console.warn('UIAttackBar: scene.add not available.');
        }
    }

    createBackground() {
        const totalWidth = (this.attacks.length - 1) * this.style.buttonSpacing;
        const btnWidth = totalWidth + this.style.padding * 10;
        const btnHeight = this.style.buttonSize * UIAttackBar.BUTTON_SCALE + this.style.padding * 2;

        this.bg = this.ui.createNineSlice({
            x: 0,
            y: 0,
            key: 'attack_bar_bg',
            width: btnWidth,
            height: btnHeight,
            leftWidth: 8,
            rightWidth: 8,
            topHeight: 8,
            bottomHeight: 8,
            backgroundColor: this.style.barbtnColor,
            backgroundAlpha: this.style.barbtnAlpha,
            cornerRadius: this.style.buttonbtnRadius
        });

        if (!this.bg) {
            console.error('UIAttackBar: Failed to create background.');
            return;
        }
        this.bg.setOrigin(0.5);
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

            // Create button container
            const button = this.ui.createButton(x, 0, '', {
                width: this.style.buttonSize * UIAttackBar.BUTTON_SCALE + 10,
                height: this.style.buttonSize * UIAttackBar.BUTTON_SCALE + 10,
                backgroundTexture: 'attack_icon_bg',
                cornerRadius: this.style.buttonbtnRadius
            });


            if (!button) {
                console.error(`UIAttackBar: Failed to create button for ${attack.name}`);
                return;
            }

            // Add attack icon
            const icon = this.scene.add.image(0, 0, attack.icon)
                .setScale(UIAttackBar.BUTTON_SCALE * 2);
            button.add(icon);

            // Add label
            const label = this.ui.createText(
                0,
                this.style.buttonSize / 2 * UIAttackBar.BUTTON_SCALE + 8,
                attack.name,
                {
                    fontFamily: 'Pixelify Sans',
                    fontSize: '16px',
                    color: '#FFFFFF'
                }
            );
            if (!label) {
                console.error(`UIAttackBar: Failed to create label for ${attack.name}`);
                return;
            }
            label.setOrigin(0.5);
            button.add(label);

            // Add tooltip
            const tooltipText = attack.description || `${attack.name}: Click to use`;
            const tooltip = this.ui.createTooltip(button, tooltipText, {
                backgroundTexture: 'tooltip_bg',
                backgroundWidth: 200,
                backgroundHeight: 60,
                fontSize: '14px'
            });
            if (!tooltip) {
                console.error(`UIAttackBar: Failed to create tooltip for ${attack.name}`);
            } else {
                this.add(tooltip);
            }

            this.setupButtonInteractions(button, attack);
            this.add(button);
            this.buttons.push({ container: button, tooltip });
        });
    }

    setupButtonInteractions(button, attack) {
        button.on('pointerover', () => {
            this.scene.tweens.add({
                targets: button,
                scale: this.style.hoverScale / UIAttackBar.BUTTON_SCALE,
                duration: this.style.tweenDuration
            });
        });

        button.on('pointerout', () => {
            this.scene.tweens.add({
                targets: button,
                scale: 1,
                duration: this.style.tweenDuration
            });
        });

        button.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: button,
                scale: this.style.pressedScale / UIAttackBar.BUTTON_SCALE,
                duration: this.style.tweenDuration,
                yoyo: true
            });

            try {
                AttackManager.enableAttackMode(attack);
            } catch (error) {
                console.error(`Attack error: ${error}`);
            }
        });
    }

    show() {
        this.active = true;
        this.setVisible(true);
        this.scene.tweens.add({
            targets: this,
            y: this.scene.cameras.main.height - UIAttackBar.DEFAULT_STYLE.bottomOffset,
            duration: 400
        });
    }

    hide() {
        this.active = false;
        this.scene.tweens.add({
            targets: this,
            y: 1000,
            duration: 400,
            onComplete: () => {
                this.setVisible(false);
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
        this.buttons = [];
        this.createBackground();
        this.createButtons();
    }

    refresh() {
        this.attacks = GameManager.player.attacks;
        this.removeAll(true);
        this.buttons = [];
        this.createBackground();
        this.createButtons();
    }
}