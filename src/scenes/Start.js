
// Import the DialogSystem class at the top of your Start.js file
import { DialogSystem } from '../addons/DialogSystem/DialogSystem.js';

export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
        this.cells = [[]];
    }

    preload() {
        this.load.spritesheet('cell', 'assets/cell.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {

        // Create dialog system
        this.dialog = new DialogSystem(this, {
            width: 600,
            height: 150,
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height - 100,
            backgroundColor: 0x222222,
            borderColor: 0x00ff00,
            defaultFont: 'Arial',
            defaultFontSize: 20,
            defaultColor: '#FFFFFF',
            typewriterSpeed: 30,
            soundEnabled: true,
            typingSound: null,
            closeButton: true,
            animationIn: 'slide',
            animationOut: 'fade'
        });
        
        // Create custom styles
        this.dialog.createStyle('sci-fi', {
            backgroundColor: 0x0000AA,
            borderColor: 0x00AAFF,
            borderThickness: 3,
            borderRadius: 0,
            defaultColor: '#00FFFF',
            defaultFont: 'Courier New',
            typewriterSpeed: 20
        });

        // Create button to trigger dialog
        const button1 = this.add.text(100, 100, 'Show Sci-fi Dialog', { backgroundColor: '#333' })
            .setInteractive()
            .setPadding(10)
            .on('pointerup', () => {
                // Apply style and show dialog
                this.dialog.applyStyle('sci-fi');
                this.dialog.show([
                    { 
                        text: "Greetings, Commander. I've detected an anomaly in sector 7.", 
                        name: "A.I.",
                        nameColor: "#00AFFF",
                        portrait: "portrait1"
                    },
                    { 
                        text: "This could be the alien signal we've been searching for. Shall I initiate scan protocol?",
                        color: "#AAFFFF",
                        portrait: "portrait1",
                        highlightWords: [
                            { word: "alien signal", color: "#FF00FF" }
                        ]
                    }
                ]);
            });



        for (let i = 0; i < 3; i++) {
            this.cells[i] = [];
            for (let j = 0; j < 3; j++) {
                let cell = this.add.sprite(640 + 32 * i, 360 + 32 * j, 'cell');
    
                // Custom properties
                cell.isActivated = false;
                cell.hasChild = false;
                cell.position = { x: i, y: j };
    
                this.cells[i][j] = cell;
    
                cell.setInteractive()
                    .on('pointerdown', () => {
                        console.log(`Cell at (${i}, ${j}) clicked`, cell);
                        cell.isActivated = true;
                        cell.setTint(0x00ff00);
                    })
                    .on('pointerover', () => this.TryHover(cell))
                    .on('pointerout', () => this.TryUnhover(cell));
            }
        }
    }
    
    TryHover(cell) {
        if (!cell.isActivated) {
            cell.setTint(0x999999);
        }
    }
    
    TryUnhover(cell) {
        if (!cell.isActivated) {
            cell.clearTint();
        }
    }
    
    update() {

    }
}