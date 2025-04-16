export const GameManager = {
    moveCount: 0,
    events: new Phaser.Events.EventEmitter(),

    incrementMove() {
        this.moveCount++;
        this.events.emit('newMove', this.moveCount);
        console.log("Moves:", this.moveCount);
    },

    reset() {
        this.moveCount = 0;
    }
};
