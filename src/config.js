
// config.js
export const gameConfig = {
    // Board settings
    board: {
        cellSize: 100,
        gap:0,
        colors: {
            default: 0xffffff,
            hover: 0xaaaaaa,
            active: 0x00ff00
        },
        assets: {
            cell: 'assets/cell2.png',
        }
    },
    // Player settings
    player: {
        assets: {
            player: 'assets/guy.png',
        }
    },
    entites: {
        assets: {
            knifeGuy: 'assets/knifeGuy.png'
        }
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