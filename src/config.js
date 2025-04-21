
// config.js
export const gameConfig = {
    // Board settings
    baseURL: 'Rogue-Ramen/',
    board: {
        cellSize: 100,
        gap: 5,
        colors: {
            default: 0xffffff,
            hover: 0xaaaaaa,
            active: 0x00ff00
        },
        assets: {
            cell: '/assets/cell2.png',
        }
    },
    // Player settings
    player: {
        assets: {
            player: '/assets/guy.png',
        }
    },
    entites: {
        assets: {
            knifeGuy: '/assets/knifeGuy.png'
        }
    },
    sheets: {
        frameWidth: 53,
        frameHeight: 43,
        assets: [
            // {
            //     key: 'idle', path: '/assets/spritesheets/idle.png', frameWidth: 48, 
            //     frameHeight: 43, frameRate: 9, loop: 1
            // },
            {
                key: 'idle',
                type: 'json',
                prefix: '11111111111111 #Idle ',
                image: '/assets/spritesheets/idle.png',
                json: '/assets/jsons/idle.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: true
            },
            {
                key: 'move',
                type: 'json',
                prefix: '11111111111111 #move ',
                image: '/assets/spritesheets/move.png',
                json: '/assets/jsons/move.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: true
            },
            {
                key: 'knife',
                type: 'json',
                prefix: '11111111111111 #knife ',
                image: '/assets/spritesheets/knife.png',
                json: '/assets/jsons/knife.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: false
            },
            {
                key: 'pistol',
                type: 'json',
                prefix: '11111111111111 #pistol ',
                image: '/assets/spritesheets/pistol.png',
                json: '/assets/jsons/pistol.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: false
            },
            // {
            //     key: 'move', path: '/assets/spritesheets/move.png', frameWidth: 52.7, // 👈 Correct per-sheet value
            //     frameHeight: 46,
            //     frameRate: 6
            // },
            // { key: 'knife', path: '/assets/spritesheets/knife.png', frameRate: 6 },
            // { key: 'pistol', path: '/assets/spritesheets/pistol.png' },
            // { key: 'shotgun', path: '/assets/sprites/shotgun.png' },
            // { key: 'sniper', path: '/assets/sprites/sniper.png' },
            // { key: 'teleporte in', path: '/assets/sprites/teleporte_in.png' },
            // { key: 'teleporte_out', path: '/assets/sprites/teleporte_out.png' },
            // { key: 'healing', path: '/assets/sprites/healing.png' },
            // { key: 'grenade', path: '/assets/sprites/grenade.png' },
        ]
    },
    // Game settings
    game: {
        difficulty: 'medium',
        startingLives: 3,
        scoreMultiplier: 1.5
    },
    // UI settings
    ui: {
        fontSize: 24,
        fontFamily: 'Arial',
        buttonColor: 0x3498db
    }
};