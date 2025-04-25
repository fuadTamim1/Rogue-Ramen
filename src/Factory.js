import { KnifeGuy } from "./Enimies/KnifeGuy.js";
import { SniperGuy } from "./Enimies/SniperGuy.js";
import { StickGuy } from "./Enimies/StickGuy.js";
import { GameManager } from "./GameManager.js";

export function spawnEnemy({ type, x, y }) {
    switch (type) {
        case "KnifeGuy":
            return new KnifeGuy(GameManager.scene, x, y, GameManager.board)
        case "StickGuy":
            return new StickGuy(GameManager.scene, x, y, GameManager.board)
        case "SniperGuy":
            return new SniperGuy(GameManager.scene, x, y, GameManager.board)
        default:
            console.warn(`${type} is not a valid type.`)
            return null;
    }
}

// to do
// spawn obsticals