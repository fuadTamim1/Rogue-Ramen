import { GameManager } from "../GameManager.js";

export class LevelManager {
    constructor(scene, board) {
        this.scene = scene;
        this.board = board;
        this.currentWave = 0;
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
    checkLevelComplete() { return false }
    restartLevel() { }
}