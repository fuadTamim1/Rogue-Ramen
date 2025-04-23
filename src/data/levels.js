import { KnifeAttack } from "../attacks/KnifeAttack.js"
import { ShotgunAttack } from "../attacks/ShotgunAttack.js";
import { GameManager } from "../GameManager.js"

export const level1 = {
    board: {
        width: 5,
        hight:5,
    },
    player: { x: 1, y: 3 },
    
    waves: [
        {
            delay: 1000,
            enemies: [
                { type: "KnifeGuy" },
                { type: "KnifeGuy" },
            ]
        }, {
            delay: 1000,
            enemies: [
                { type: "KnifeGuy" },
                { type: "KnifeGuy" },
                { type: "KnifeGuy" },
            ]
        }
    ],
    obsticals: [
        { type: "chair1", x: 1, y: 2 },
        { type: "chair2", x: 3, y: 4 },
    ],
    onStart() {
        GameManager.player.loadAttack(new KnifeAttack(GameManager.scene,GameManager.board));
        GameManager.player.loadAttack(new ShotgunAttack(GameManager.scene,GameManager.board));
    }
}