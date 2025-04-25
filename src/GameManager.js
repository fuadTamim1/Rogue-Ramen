export const GameManager = {
    player: null,
    board: null,
    enemyManager: [],
    moveCount: 0,
    AttackMode: false,
    allowToMove: true,
    currentAttack: null,
    targetableCells: [],
    scene: null,
    UIManager: {
        UIAttackBar: null,
        UIAttackSelect: null,
    },
    spriteManager: null,
    DialogSystem: null,
    LevelManager: null,
    WaveManager: null,
    shopManager: null,

    CurrentLevel: 0,

    incrementMove() {
        this.moveCount++;
        this.events.emit('newMove', this.moveCount);
    },
    
    events: new Phaser.Events.EventEmitter(),
    reset() {
        this.moveCount = 0;
    }
};
