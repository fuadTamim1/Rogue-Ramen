import { GameManager } from "../GameManager.js";

export class LevelManager {
    constructor(scene, board) {
        this.scene = scene;
        this.board = board;
        this.currentWave = 0;
        this.currentLevel = null;
    }

    startLevel(levelData) {
        const { width, hight } = levelData.board;
        const { x, y } = levelData.player;
        this.board.setConfig(width, hight);
        this.currentLevel = levelData;
        GameManager.player.SetPosition(x, y);
        levelData.onStart();
        GameManager.WaveManager.startWave(levelData.waves[0])
    }
    goToNextWave() {
        if (this.currentLevel.waves[++this.currentWave])
            GameManager.WaveManager.startWave(this.currentLevel.waves[this.currentWave])
    }
    checkLevelComplete() {
        if (this.currentLevel && this.currentLevel.waves && this.currentWave >= this.currentLevel.waves.length - 1) {
            if (GameManager.WaveManager.isWaveDone()) {
                this.goToShop();
            }
        }
    }

    goToShop() { 
        this.scene.add.tween({
            targets: this.scene.shopManager.ui,
            x: 1480 / 2,
            duration: 1000,
            ease: 'power2',
            onComplete() {

            }
        })
    }
    restartLevel() { }
}