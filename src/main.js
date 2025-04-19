import { Start } from './scenes/Game.js';

const config = {
    type: Phaser.WEBGL,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
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
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
