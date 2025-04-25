
// config.js
export const gameConfig = {
    // Board settings
    baseURL: './',
    board: {
        cellSize: 75,
        gap: 4,
        hight: 100,
        colors: {
            default: 0xffffff,
            hover: 0xaaaaaa,
            active: 0x00ff00
        },
        assets: {
            cell: '/assets/cell.png',
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
            {
                key: 'game_bg', path: '/assets/scene/bg.png', single: true
            },
            {
                key: 'cell_0', path: '/assets/cell_black.png', single: true
            },
            {
                key: 'cell_1', path: '/assets/cell_white.png', single: true
            },
            {
                key: 'cell_hover', path: '/assets/cell_hover.png', single: true
            },
            {
                key: 'cell_target', path: '/assets/cell_target.png', single: true
            },
            {
                key: 'board_bg', path: '/assets/scene/board.png', single: true
            },
            {
                key: 'worktop', path: '/assets/scene/worktop.png', single: true
            },
            {
                key: 'chairs', path: '/assets/scene/chears.png', single: true
            },
            {
                key: 'cola', path: '/assets/scene/cola.png', single: true
            },
            {
                key: 'shadow', path: '/assets/scene/shadow.png', single: true
            },
            {
                key: 'teleport', path: '/assets/teleport_icon.png', single: true
            },
            {
                key: 'transition', path: '/assets/transition.png', single: true
            },
            {
                key: 'knife_icon', path: '/assets/UI/icons/knife.png', single: true
            },
            {
                key: 'pistol_icon', path: '/assets/UI/icons/pistol.png', single: true
            },
            {
                key: 'shotgun_icon', path: '/assets/UI/icons/shotgun.png', single: true
            },
            {
                key: 'sniper_icon', path: '/assets/UI/icons/sniper.png', single: true
            },
            {
                key: 'stick_icon', path: '/assets/UI/icons/stick.png', single: true
            },
            {
                key: 'katana_icon', path: '/assets/UI/icons/katana.png', single: true
            },
            {
                key: 'grenade_icon', path: '/assets/UI/icons/grenade.png', single: true
            },
            {
                key: 'tooltip_bg', path: '/assets/UI/ItemBox.png', single: true
            },
            {
                key: 'attack_bar_bg', path: '/assets/UI/cards/card_background.png', single: true
            },
            {
                key: 'attack_icon_bg', path: '/assets/UI/cards/card.png', single: true
            },
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
            {
                key: 'shotgun',
                type: 'json',
                prefix: '11111111111111 #shotgun ',
                image: '/assets/spritesheets/shotgun.png',
                json: '/assets/jsons/shotgun.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: false
            },
            {
                key: 'sniper',
                type: 'json',
                prefix: '11111111111111 #Sniper ',
                image: '/assets/spritesheets/sniper.png',
                json: '/assets/jsons/sniper.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: false
            },
            {
                key: 'grenade',
                type: 'json',
                prefix: '11111111111111 #grenade ',
                image: '/assets/spritesheets/grenade.png',
                json: '/assets/jsons/grenade.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: false
            },
            {
                key: 'teleport_out',
                type: 'json',
                prefix: '11111111111111 #teleport_out ',
                image: '/assets/spritesheets/teleport_out.png',
                json: '/assets/jsons/teleport_out.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: false
            },
            {
                key: 'teleport_in',
                type: 'json',
                prefix: '11111111111111 #teleport_in ',
                image: '/assets/spritesheets/teleport_in.png',
                json: '/assets/jsons/teleport_in.json',
                start: 0,
                end: 10,
                frameRate: 10,
                loop: false
            },
            // Enemies
            // Character 1
            {
                key: 'stick_guy_idle',
                type: 'json',
                prefix: '#idle ',
                image: '/assets/spritesheets/enemies/character_1/idle.png',
                json: '/assets/spritesheets/enemies/character_1/idle.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: false
            },
            {
                key: 'stick_guy_move',
                type: 'json',
                prefix: '#move ',
                image: '/assets/spritesheets/enemies/character_1/move.png',
                json: '/assets/spritesheets/enemies/character_1/move.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: false
            },
            {
                key: 'stick_guy_death',
                type: 'json',
                prefix: '#death ',
                image: '/assets/spritesheets/enemies/character_1/death.png',
                json: '/assets/spritesheets/enemies/character_1/death.json',
                start: 0,
                end: 5,
                frameRate: 10,
                loop: false
            },
            {
                key: 'stick',
                type: 'json',
                prefix: '#stick ',
                image: '/assets/spritesheets/enemies/character_1/stick.png',
                json: '/assets/spritesheets/enemies/character_1/stick.json',
                start: 0,
                end: 6,
                frameRate: 10,
                loop: false
            },
            // the assets is so messy but here where Im put  all animations and sprites and it loaded using custom script 
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