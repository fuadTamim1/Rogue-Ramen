import { gameConfig } from './config.js';
import { Cell } from './Cell.js';
import { GameManager } from './GameManager.js';

export class Board {
    static preloadAssets(scene) {
        const assets = gameConfig.board.assets;
        scene.load.spritesheet('cell', assets.cell, { frameWidth: 32, frameHeight: 32 });
    }

    constructor(scene, w, h) {
        this.scene = scene;
        this.screenWidth = scene.cameras.main.width;
        this.screenHeight = scene.cameras.main.height;
        this.cells = this.generate(w, h);
    }

    generate(w, h) {
        const cells = [];
        const startX = (this.screenWidth / 2) - ((w * gameConfig.board.cellSize + gameConfig.board.gap * (w - 1)) / 2);
        const startY = (this.screenHeight / 2) - ((h * gameConfig.board.cellSize + gameConfig.board.gap * (h - 1)) / 2);

        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                const x = startX + (gameConfig.board.cellSize + gameConfig.board.gap) * i;
                const y = startY + (gameConfig.board.cellSize + gameConfig.board.gap) * j;

                const cell = new Cell(this.scene, x, y, i, j);
                cells.push(cell);
            }
        }


        return cells;
    }

    setConfig(width, height) {
        this.removeBoard();
        this.cells = this.generate(width, height);
        console.log(this.cells)
    }

    getCells(withoutPlayerCell = false) {
        let cells = this.board.cells; // Flattens 2D array to 1D

        if (withoutPlayerCell) {
            const playerPos = GameManager.player.getPosition();
            cells = cells.filter(cell => cell.position.x !== playerPos.x || cell.position.y !== playerPos.y);
        }

        return cells;
    }

    getCell(x, y) {
        return this.cells.find((c) => c.position.x === x && c.position.y === y);
    }

    getCellsCount = () => cells.length;
    areCellsEqual(a, b) {
        return a.boardX === b.boardX && a.boardY === b.boardY;
    }

    getRandomCell(empty = false) {
        const validCells = this.cells.filter((c) => !(c.hasChild || c.hasObstacle) == empty);
        const randomCell = validCells[Math.floor(Math.random() * validCells.length)];
        return randomCell;
    }

    getBoardWidth() {
        const MaxX = Math.max(...this.cells.map((c) => c.position.x));
        return MaxX + 1
    }

    getBoardHight() {
        const MaxY = Math.max(...this.cells.map((c) => c.position.y));
        return MaxY + 1
    }

    HighlightCell(x, y, color) {
        return this.getCell(x, y).setTint(color);
    }

    HighlightCells(cells, color) {
        return cells.forEach((c) => c.setTint(color));
    }

    clearHighlight() {
        return this.cells.forEach(cell => { cell.clearTint() });
    }

    resetBoard() {
        for (let cell of this.cells) {
            cell.isActivated = false;
            cell.hasObstacle = false;
            cell.child = false;
            cell.clearTint();
        }
    }

    removeBoard() {
        for (let cell of this.cells) {
            if (cell && cell.active) {
                cell.destroy();
            }
        }
        this.cells = []
    }
}
