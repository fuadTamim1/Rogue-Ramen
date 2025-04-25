import { gameConfig } from './config.js';
import { Cell } from './Cell.js';
import { GameManager } from './GameManager.js';

export class Board extends Phaser.GameObjects.Container {
    static preloadAssets(scene) {
    }

    constructor(scene, w, h) {
        super(scene)
        this.scene = scene;
        this.screenWidth = scene.cameras.main.width;
        this.screenHeight = scene.cameras.main.height;
        this.cells = []
        this.scene.add.existing(this)
        this.setDepth(1)
    }

    generate(w, h) {
        const cells = [];
        const yOffset = (this.screenHeight / 2) + gameConfig.board.hight;
        const startX = (this.screenWidth / 2) - ((w * gameConfig.board.cellSize + gameConfig.board.gap * (w - 1)) / 2);
        const startY = yOffset - ((h * gameConfig.board.cellSize + gameConfig.board.gap * (h - 1)) / 2);
        const outer_boarder = 8;

        const boardWidth = w * gameConfig.board.cellSize + gameConfig.board.gap * (w - 1);
        const boardHeight = h * gameConfig.board.cellSize + gameConfig.board.gap * (h - 1);

        const panelWidth = boardWidth + outer_boarder * 2;
        const panelHeight = boardHeight + outer_boarder * 2;


        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                const x = startX + (gameConfig.board.cellSize + gameConfig.board.gap) * i;
                const y = startY + (gameConfig.board.cellSize + gameConfig.board.gap) * j;

                const cell = new Cell(this.scene, x, y, i, j, (i + j) % 2 == 0 ? 'cell_1' : 'cell_0');
                // cell.setTint(cell.color)
                cells.push(cell);
            }
        }

        this.panel = this.scene.ui.createNineSlice({
            x: ((this.screenWidth / 2) - (gameConfig.board.cellSize + gameConfig.board.gap) / 2) + 2,
            y: (yOffset - (gameConfig.board.cellSize + gameConfig.board.gap) / 2),
            key: 'board_bg',
            width: panelWidth,
            height: panelHeight + 2,
            leftWidth: 8,
            rightWidth: 8,
            topHeight: 8,
            bottomHeight: 8,
        })

        this.panel.setOrigin(0.5, 0.5)
        this.panel.setDepth(0)
        return cells;
    }

    setConfig(width, height) {
        this.removeBoard();
        this.cells = this.generate(width, height);
        this.add(this.cells);
        console.log(this.cells)
    }

    getCells(withoutPlayerCell = false) {
        let cells = this.cells; // Flattens 2D array to 1D

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

    HighlightCell(x, y, color, texture = null) {
        const cell = this.getCell(x, y);
        cell.setTint(color);
        cell.setTexture(texture);
        return cell;
    }

    HighlightCells(cells, color, texture = null) {
        return cells.forEach((c) => { c.setTint(color); c.setTexture(texture || c.orginaltexture) });
    }

    clearHighlight() {
        return this.cells.forEach(cell => {
            cell.setTexture(cell.orginaltexture)
            cell.clearTint()
        });
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
        this.remove(this.cells);
        if (this.panel) {
            this.panel.destroy()
        }
        this.cells = []
    }
}
