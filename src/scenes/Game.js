
// Import the DialogSystem class at the top of your Start.js file
import { DialogSystem } from '../addons/DialogSystem/DialogSystem.js';
import { SciFiTheme } from '../addons/DialogSystem/DialogThemes.js';
import { Board } from '../Board.js';
import { Player } from '../Player.js';
import { KnifeGuy } from '../Enimies/KnifeGuy.js';
import { gameConfig } from '../config.js';
import { AStar } from '../AI/pathfinding.js';
import { GameManager } from '../GameManager.js';
import { KnifeAttack } from '../attacks/KnifeAttack.js';
import { PistolAttack } from '../attacks/PistolAttack.js';
import { UIAttackBar } from '../ui/UIAttackBar.js';
import { UIAttackSelect } from '../ui/UIAttackSelect.js';
import { enemyManager } from '../managers/EnemyManager.js';
import { SpriteLoader } from '../addons/sprite/SpriteLoader.js';
import { ShotgunAttack } from '../attacks/ShotgunAttack.js';
import { SniperAttack } from '../attacks/SniperAttack.js';
import { GrendadeAttack } from '../attacks/GrenadeAttack.js';
import { PhaserUI } from '../../libs/PhaserUI.js';
import { LevelManager } from '../managers/LevelManager.js';
import { WaveManager } from '../managers/WaveManager.js';
import { level1 } from '../data/levels.js';
import { UIShop } from '../ui/UIShop.js';
import { Item, ShopManager } from '../managers/ShopManager.js';

/**
 * 
   this.player.attacks = [
            new KnifeAttack(this, this.board),
            new PistolAttack(this, this.board),
            new ShotgunAttack(this, this.board),
            new SniperAttack(this, this.board),
            new GrendadeAttack(this, this.board)
        ];

        GameManager.UIManager.UIAttackBar.refresh()
 */

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {

        this.load.setBaseURL(gameConfig.baseURL ?? './');

        Board.preloadAssets(this);
        Player.preloadAssets(this);

        this.spriteManager = new SpriteLoader(this);
        this.spriteManager.preloadSheets(gameConfig.sheets)

        this.load.spritesheet('knifeGuy', gameConfig.entites.assets.knifeGuy, { frameWidth: 32, frameHeight: 32 })
    }



    create() {

        GameManager.scene = this;

        this.ui = new PhaserUI(this);



        this.shopManager = new ShopManager(this);

        // Add items to shop
        const healthPotion = new Item(
            "Health Potion",
            "knife_icon",
            50,
            () => { /* Add health logic */ }
        );

        const reloadPotion = new Item(
            "Reload Potion",
            "sniper_icon",
            25,
            () => { /* Add health logic */ }
        );

        this.shopManager.addItem(healthPotion)
        this.shopManager.addItem(reloadPotion)

        const { width, height } = this.scale;

        // Background
        this.add.image(width / 2 - 1, height / 2 + 1, 'game_bg').setDisplaySize(width, height);

        // Worktop
        const worktopScale = 3.00;
        const worktop = this.add.image(0, 30, 'worktop').setDisplaySize(494 * worktopScale, 112 * worktopScale).setOrigin(0, 0);

        const chairs = this.add.image(0, 200, 'chairs').setDisplaySize(83 * worktopScale, 53 * worktopScale).setOrigin(0, 0);

        const cola = this.add.image(860, 80, 'cola').setDisplaySize(53 * worktopScale, 22 * worktopScale).setOrigin(0, 0);


        this.spriteManager.createAnimations(gameConfig.sheets);
        GameManager.spriteManager = this.spriteManager;


        this.setupBoard();
        this.setupGameObjects();
        this.StartGame();

    }

    setupGameObjects() {
        GameManager.dialog = new DialogSystem(this, {
            width: 600,
            height: 150,
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height - 100,
            backgroundColor: 0x222222,
            borderColor: 0x00ff00,
            defaultFont: 'Pixelify Sans',
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
        this.player = new Player(this, 0, 0, this.board);

        GameManager.player = this.player;

        this.cursor = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            Q: Phaser.Input.Keyboard.KeyCodes.Q,
        });

        GameManager.enemyManager = new enemyManager(this);

        GameManager.LevelManager = new LevelManager(this, this.board);
        GameManager.WaveManager = new WaveManager(this, this.board);

        GameManager.UIManager.UIAttackSelect = new UIAttackSelect(this, 0, 0)
        GameManager.UIManager.UIAttackBar = new UIAttackBar(this, [])

    }

    setupBoard() {
        this.board = new Board(this, 8, 3);
        GameManager.board = this.board;
    }

    StartGame() {
        // In your game scene:

        this.cameras.main.y = 1000

        this.tweens.add({
            targets: this.cameras.main,
            y: 0,
            duration: 180,
            ease: "power2"
        })
        GameManager.LevelManager.startLevel(level1)
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

        if (Phaser.Input.Keyboard.JustDown(this.cursor.Q)) {
            GameManager.incrementMove()
        }
        if (GameManager.UIManager.UIAttackSelect)
            GameManager.UIManager.UIAttackSelect.update()


        if (GameManager.player)
            GameManager.player.update()
        // Game Loop
        if (GameManager.LevelManager.checkLevelComplete()) {
            console.log("level completed")
        } else {
            if (GameManager.WaveManager.isWaveDone()) {
                console.log(`wave ${GameManager.LevelManager.currentWave} completed`)
                GameManager.WaveManager.endWave()
                GameManager.LevelManager.goToNextWave()
            }
        }

    }
}