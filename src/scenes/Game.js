
// Import the DialogSystem class at the top of your Start.js file
import { DialogSystem } from '../addons/DialogSystem/DialogSystem.js';
import { SciFiTheme } from '../addons/DialogSystem/DialogThemes.js';
import { Board } from '../Board.js';
import { Player } from '../Player.js';
import { KnifeGuy } from '../Enimies/KnifeGuy.js';
import { gameConfig } from '../config.js';
import { AStar } from '../AI/pathfinding.js';
import { GameManager } from '../GameManager.js';
import { Attack } from '../Attack.js';
import { KnifeAttack } from '../attacks/KnifeAttack.js';
import { UIAttackBar } from '../ui/UIAttackBar.js';
import { UIAttackSelect } from '../ui/UIAttackSelect.js';
import { groupFramesByAnimation, createPhaserAnimations, getIconFrame } from '../helpers/CreateAnimation.js';
import { enemyManager } from '../managers/EnemyManager.js';

export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }
    
    preload() {
        Board.preloadAssets(this);
        Player.preloadAssets(this);
        this.load.json('asepriteData', '../../assets/assets.json');
        this.load.spritesheet('knifeGuy', gameConfig.entites.assets.knifeGuy, { frameWidth: 32, frameHeight: 32 })
        this.load.atlas('atlas', 'assets/assets.png', 'assets/assets.json')
        
    }
    
    create() {
        GameManager.scene = this;
        // getCacheData
        const asepriteJSON = this.cache.json.get('asepriteData');
        const grouped = groupFramesByAnimation(asepriteJSON);
        createPhaserAnimations(this, 'atlas', grouped);
        Attack.setAnimationData(grouped);

        this.setupBoard();
        this.setupGameObjects()
        this.lights.enable();
        this.lights.setAmbientColor(0xFFFF0F);
        var light = this.lights.addLight(400, 200, 1);
        // var light = this.lights.addLight(x, y, radius, color, intensity);
        

        GameManager.enemyManager = new enemyManager(this);
        GameManager.enemyManager.enimes = [];
        GameManager.enemyManager.enimes.push(new KnifeGuy(this, 3, 3, this.board));


        // Pathfinding usage example
        GameManager.events.on('newMove', (moveCount) => {
            this.board.clearHighlight();
            if (GameManager.enemyManager.enimes[0])
                var path = AStar.findPath(this.board.getCell(GameManager.enemyManager.enimes[0].boardX, GameManager.enemyManager.enimes[0].boardY), this.board.getCell(this.player.gridY, this.player.gridX), this.board.cells);
            if (path) {
                path.forEach(cell => {
                    cell.setTint(0x0000ff); // for example, show path
                });
                GameManager.enemyManager.enimes[0].moveTo(path[1].boardX, path[1].boardY)
            } else {
                console.log("No path found");
            }
        });


        this.player.attacks = [
            new KnifeAttack(this, this.board),
        ];

        GameManager.UIManager.UIAttackBar.refresh()
    }

    setupGameObjects() {

        GameManager.UIManager.UIAttackSelect = new UIAttackSelect(this, 0, 0)
        GameManager.UIManager.UIAttackBar = new UIAttackBar(this, [])

        GameManager.dialog = new DialogSystem(this, {
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

        GameManager.dialog.createStyle('sci-fi', SciFiTheme);
        this.player = new Player(this, 1, 1, this.board);

        GameManager.player = this.player;

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
    }

    setupBoard() {
        this.board = new Board(this, 5, 5);

        GameManager.board = this.board;
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

// // Show icon
// const knifeIconFrame = getIconFrame(grouped, 'Knife attack');
// this.add.image(50, 50, 'atlas', knifeIconFrame);
