
// Import the DialogSystem class at the top of your Start.js file
import { DialogSystem } from '../addons/DialogSystem/DialogSystem.js';
import { Board } from '../Board.js';
import { Player } from '../Player.js';
import { KnifeGuy } from '../Enimies/KnifeGuy.js';
import { gameConfig } from '../config.js';
import { AStar } from '../AI/pathfinding.js';
import { GameManager } from '../GameManager.js';

export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
        this.cells = [[]];
    }

    preload() {
        Board.preloadAssets(this);
        Player.preloadAssets(this);
        this.load.spritesheet('knifeGuy', gameConfig.entites.assets.knifeGuy, { frameWidth: 32, frameHeight: 32 })
    }

    create() {
        // this.cameras.main.setRenderToTexture('PixelatedFX');
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
        this.cursor = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.board = new Board(this, 8, 8);
        this.player = new Player(this, 0, 0, this.board);
        this.enimes = [];
        this.enimes.push(new KnifeGuy(this, 2, 1, this.board));
        this.enimes.push(new KnifeGuy(this, 4, 3, this.board));

        // console.log(this.board)

        GameManager.events.on('newMove', (moveCount) => {
            this.board.cells.forEach(row => row.forEach(cell => { !cell.hasObstacle ? cell.clearTint() : false }));
            if (this.enimes[0])
                var path = AStar.findPath(this.board.cells[this.enimes[0].boardX][this.enimes[0].boardY], this.board.cells[this.player.x][this.player.y], this.board.cells);
            var path2 = AStar.findPath(this.board.cells[this.enimes[1].boardX][this.enimes[1].boardY], this.board.cells[this.player.x][this.player.y], this.board.cells);
            console.log(path)
            if (path) {
                path.forEach(cell => {
                    cell.setTint(0x00ffff); // for example, show path
                });
                this.enimes[0].moveTo(path[1].boardX, path[1].boardY)
            } else {
                console.log("No path found");
            }

            if (path2) {
                path2.forEach(cell => {
                    cell.setTint(0x0000ff); // for example, show path
                });
                this.enimes[1].moveTo(path2[1].boardX, path2[1].boardY)
            } else {
                console.log("No path found");
            }
        });

    }
    removeEnemy(enemy) {
        const index = this.enimes.indexOf(enemy);
        if (index > -1) {
            this.enimes.splice(index, 1);
        }
    }

    update() {
        if (this.cursor.up.isDown || this.cursor.W.isDown) {
            this.player.TryMove('u');
        } else if (this.cursor.down.isDown || this.cursor.S.isDown) {
            this.player.TryMove('d');
        } else if (this.cursor.right.isDown || this.cursor.D.isDown) {
            this.player.TryMove('r');
        } else if (this.cursor.left.isDown || this.cursor.A.isDown) {
            this.player.TryMove('l');
        }


    }
}