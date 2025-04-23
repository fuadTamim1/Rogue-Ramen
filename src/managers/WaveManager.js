import { spawnEnemy } from "../Factory.js";
import { GameManager } from "../GameManager.js";

export class WaveManager {
    constructor(scene, board) {
        this.scene = scene;
        this.board = board;
        this.isWaveRunning = false;
    }

    startWave(waveData) {
        this.scene.time.delayedCall(waveData.delay, () => {
            // enemy factory place enemy on the board
            waveData.enemies.forEach(enemyData => {
                const { x, y } = this.board.getRandomCell(true).position;
                const enemy = spawnEnemy({ type: enemyData.type, x: x, y: y });
                GameManager.enemyManager.addEnemy(enemy);
            });
            this.isWaveRunning = true;
        })
    }
    isWaveDone() {
        if(GameManager.enemyManager.getEnemiesCount(false) <= 0 && this.isWaveRunning) {
            return true;
        }else{
            return false;
        }
    }
    endWave() {
        this.isWaveRunning = false;
    }
}