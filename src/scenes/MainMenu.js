import { PhaserUI } from "../../libs/PhaserUI.js";

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'Main Menu' });
    }

    preload() {
        // Load your background and any other assets here
        this.load.image('menuBg', '/assets/bg.png'); // replace with your image
        this.load.image('button', '/assets/UI/Button_52x14.png'); // basic button image
    }

    create() {
        this.setupUI();
    }

    setupUI() {
        this.ui = new PhaserUI(this);

        const { width, height } = this.scale;

        // Background
        this.add.image(width / 2, height / 2, 'menuBg').setDisplaySize(width, height);

        // Title
        this.ui.createText(width / 2, 100, 'Rogue Ramen', {
            fontSize: '5rem',
            fontFamily: 'Pixelify Sans',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Start Game Button
        const startBtn = this.ui.createButton(width / 2, height / 2, "Start Game", {
            fontSize: '2rem',
            fontFamily: 'Pixelify Sans',
            backgroundColor: 0x4a6fe3,       // Normal state color
            backgroundColorHover: 0x7a9bff,   // Hover state color
            backgroundColorPressed: 0x2a4fc3, // Pressed state color
            backgroundColorDisabled: 0x9ea8c7,//
        });


        // How To Play Button
        const howToPlayBtn = this.ui.createButton(width / 2, height / 2 + 100, "How To Play", {
            fontSize: '2rem',
            fontFamily: 'Pixelify Sans',
            backgroundColor: 0x4a6fe3,       // Normal state color
            backgroundColorHover: 0x7a9bff,   // Hover state color
            backgroundColorPressed: 0x2a4fc3, // Pressed state color
            backgroundColorDisabled: 0x9ea8c7,//
        });

        howToPlayBtn.on('pointerdown', () => {
            // Later you can show a panel or popup
            alert('Use mouse to select targets. Position yourself tactically to maximize sniper effect!');
        });

        const heightOfPanel = 50;
        const footer = this.ui.createContainer(width / 2, height - heightOfPanel / 2, width, heightOfPanel, {
            backgroundColor: 0xaaaaa0,            // Fill color (null for transparent)
            backgroundAlpha: 1,               // Fill opacity
            borderColor: '#FFFFFF',                // Border color
            borderThickness: 2,               // Border width
            borderAlpha: 1,                   // Border opacity
            cornerRadius: 0,
            opacity: 0.2,                // Border radius
            padding: {                        // Internal padding
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
            draggable: false,                 // Make container draggable
            clipContent: false                // Clip children to container bounds
        });

        const createdBy = this.ui.createText(20, height - heightOfPanel / 2 - 8, "Created By Fuad Al-Tamimi & Fares Al-Tamimi 🤍", {
            color: '#000000',
            fontSize: '1rem',
            fontFamily: 'Pixelify Sans',
            fontFamily: 'Pixelify Sans',
        })

        footer.add([createdBy]);

        // --------------------------------------------- ADD ANIMATION ---------------------------------------------------------------

        // Set initial alpha to 0 (fully transparent)
        startBtn.setAlpha(0);
        startBtn.y = 200;

        // Create fade-in tween
        this.tweens.add({
            targets: startBtn,
            alpha: 1,
            y: height / 2,
            duration: 500,
            ease: 'Power2'
        });

        howToPlayBtn.setAlpha(0);
        howToPlayBtn.y = 300;

        // Create fade-in tween
        this.tweens.add({
            targets: howToPlayBtn,
            alpha: 1,
            y: height / 2 + 100,
            duration: 500,
            ease: 'Power2'
        });

        this.camera = this.cameras.main;
        // this.camera.setZoom(1.1);
        // this.tweens.add({
        //     targets: camera,
        //     x:,
        //     y:0,
        //     duration:500,
        //     ease: 'cubic'
        // })
        this.worldCenterX = this.cameras.main.worldView.centerX;
        this.worldCenterY = this.cameras.main.worldView.centerY;
        this.cameras.main.shake(11200, 0.0012); // subtle shake on enter

        startBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: this.cameras.main,
                y: 1000,
                duration: 180,
                ease: "power2"
            })
            this.time.delayedCall(200, () => {
                this.scene.start('Game');
            })
        });
    }

    update() {
        // const pointer = this.input.activePointer;
        // pointer.positionToCamera(this.camera);

        // const { width, height } = this.scale;
        // const centerX = this.camera.scrollX + width / 2;
        // const centerY = this.camera.scrollY + height / 2;

        // const dx = pointer.x - centerX;
        // const dy = pointer.y - centerY;

        // const deadzone = 200;

        // const lerpSpeed = 0.02;

        // const maxSpeed = 10;

        // if (Math.abs(dx) > deadzone) {
        //     const moveX = Phaser.Math.Clamp(dx * lerpSpeed, -maxSpeed, maxSpeed);
        //     this.camera.scrollX += moveX;
        // }

        // if (Math.abs(dy) > deadzone) {
        //     const moveY = Phaser.Math.Clamp(dy * lerpSpeed, -maxSpeed, maxSpeed);
        //     this.camera.scrollY += moveY;
        // }

    }

}
