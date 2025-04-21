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
    events: new Phaser.Events.EventEmitter(),
    UIManager: {
        UIAttackBar: null,
        UIAttackSelect: null,
    },
    spriteManager: null,
    DialogSystem: null,
    incrementMove() {
        this.moveCount++;
        this.events.emit('newMove', this.moveCount);
    },

    reset() {
        this.moveCount = 0;
    }
};
