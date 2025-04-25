import { GrendadeAttack } from "../attacks/GrenadeAttack.js";
import { KnifeAttack } from "../attacks/KnifeAttack.js"
import { PistolAttack } from "../attacks/PistolAttack.js";
import { ShotgunAttack } from "../attacks/ShotgunAttack.js";
import { SniperAttack } from "../attacks/SniperAttack.js";
import { Teleport } from "../attacks/Teleport.js";
import { GameManager } from "../GameManager.js"

/**
 * Avilable Attacks:
 * - KnifeAttack
 * - PistolAttack
 * Shop Items:
 * - ShotgunAttack
 * - SniperAttack
 * - GrendadeAttack
 * - Teleport
 * 
 * Avilable Enemies:
 * - KnifeGuy
 * - PistolGuy
 * - ShotgunGuy
 * - SniperGuy
 * - BatGuy
 * - Ninja (Katana + ninja rubber throwing)
 * 
 * Boss Fight:
 * $ THE SHEFF $
 */

export const level1 = {
    board: {
        width: 5,
        hight: 4,
    },
    player: { x: 0, y: 0 },

    waves: [
        {
            delay: 1000,
            enemies: [
                { type: "StickGuy" },
            ]
        }, {
            delay: 1000,
            enemies: [
                { type: "KnifeGuy" },
            ]
        }
    ],
    obsticals: [
        { type: "chair1", x: 1, y: 2 },
        { type: "chair2", x: 3, y: 4 },
    ],
    onStart() {
        const player = GameManager.player;

        GameManager.player.loadAttack(new KnifeAttack(GameManager.scene, GameManager.board, player));
        GameManager.player.loadAttack(new ShotgunAttack(GameManager.scene, GameManager.board, player));
        GameManager.player.loadAttack(new GrendadeAttack(GameManager.scene, GameManager.board, player));
        GameManager.player.loadAttack(new SniperAttack(GameManager.scene, GameManager.board, player));
        GameManager.player.loadAttack(new PistolAttack(GameManager.scene, GameManager.board, player));
        GameManager.player.loadAttack(new Teleport(GameManager.scene, GameManager.board, player));
    }
}

export const level2 = {
    board: {
        width: 5,
        hight: 4,
    },
    player: { x: 0, y: 0 },

    waves: [
        {
            delay: 1000,
            enemies: [
                { type: "KnifeGuy" },
                { type: "Sniper Guy" },
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
        GameManager.player.loadAttack(new KnifeAttack(GameManager.scene, GameManager.board));
        GameManager.player.loadAttack(new ShotgunAttack(GameManager.scene, GameManager.board));
        GameManager.player.loadAttack(new GrendadeAttack(GameManager.scene, GameManager.board));
        GameManager.player.loadAttack(new Teleport(GameManager.scene, GameManager.board));
    }
}