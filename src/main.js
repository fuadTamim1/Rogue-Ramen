import { Game } from './scenes/Game.js';
import { MainMenu } from './scenes/MainMenu.js';

const config = {
    type: Phaser.WEBGL,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1480,
    height: 820,
    backgroundColor: '#000000',
    pixelArt: true,
    roundPixels: true,    // Avoids sub-pixel rendering
    antialias: false,     // Disables anti-aliasing
    // If using WebGL:
    render: {
        antialias: false,
        roundPixels: true,
    },
    boardCellSize: 64,
    scene: [
        MainMenu,
        Game,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
