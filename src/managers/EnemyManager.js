import { AStar } from "../AI/pathfinding.js";
import { GameManager } from "../GameManager.js";

export class enemyManager {

    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        GameManager.events.on('newMove', (moveCount) => moveCount % 2 == 1 ? this.RunEnemiesTurn() : false);
    }

    async RunEnemiesTurn() {
        for (const enemy of this.enemies) {
            if (enemy && enemy.StartTurn) {
                try {
                    await enemy.StartTurn();
                } catch (error) {
                    console.error("Enemy StartTurn error:", error);
                }
            }
        }
        GameManager.incrementMove(); // Only after all are done
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    getEnemiesCount(checkIfReadyForAttack = true) {
        if (checkIfReadyForAttack)
            return this.enemies.filter((e) => e.targetSquare !== null).length;
        else
            return this.enemies.length;
    }

    getEnemiesCountByDistance(targetCell, range) {
        this.enemies.filter(element =>
            AStar.getPathDistance(element.getCurrentCell(), targetCell) < range
        );
    }
}