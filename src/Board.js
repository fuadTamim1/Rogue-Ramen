import { gameConfig } from './config.js';
import { Cell } from './Cell.js';

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
            cells[i] = [];
            for (let j = 0; j < h; j++) {
                const x = startX + (gameConfig.board.cellSize + gameConfig.board.gap) * i;
                const y = startY + (gameConfig.board.cellSize + gameConfig.board.gap) * j;

                const cell = new Cell(this.scene, x, y, i, j);
                cells[i][j] = cell;
            }
        }

        return cells;
    }

    __CreateCell(startX, startY, i, j) {
        const x = startX + (gameConfig.board.cellSize + gameConfig.board.gap) * i;
        const y = startY + (gameConfig.board.cellSize + gameConfig.board.gap) * j;

        const cell = this.scene.add.sprite(x, y, 'cell');
        cell.setDisplaySize(gameConfig.board.cellSize, gameConfig.board.cellSize);

        cell.isActivated = false;
        cell.child = null;

        Object.defineProperty(cell, 'hasChild', {
            get() {
                return this.child !== null;
            }
        });

        cell.hasObstacle = false;
        cell.position = { x: i, y: j };

        cell.getNeighbors

        getNeighbors = (target, grid) => {
            cells = [];
            for (let i = 0; i < grid.length; i++) {
                for (let i = 0; i < grid.length; i++) {
                    if (Math.abs(i) - Math.abs(j) == 0) continue;
                    cells.push(grid[i][j]);
                }
            }
            cells.push(grid[target.x + 1][target.y])
            return cells;
        }

        cell.setInteractive()
            .on('pointerdown', () => {
                console.log(`Cell at (${i}, ${j}) clicked`, cell);
                cell.isActivated = !cell.isActivated;
                cell.hasObstacle = cell.isActivated;
                cell.setTint(cell.isActivated ? 0xff0000 : 0xffffff);
                if (cell.hasChild) {
                    cell.child.die();
                }
            })
            .on('pointerover', () => this.TryHover(cell))
            .on('pointerout', () => this.TryUnhover(cell));

        return cell;
    }

    TryHover(cell) {
        if (!cell.isActivated) {
            cell.setTint(0xaaaaaa);
        }
    }

    TryUnhover(cell) {
        if (!cell.isActivated) {
            cell.clearTint();
        }
    }

    activateCell(x, y) {
        const cell = this.cells[x][y];
        cell.isActivated = true;
        cell.setTint(0x00ff00);
        return cell;
    }

    resetBoard() {
        for (let row of this.cells) {
            for (let cell of row) {
                cell.isActivated = false;
                cell.clearTint();
            }
        }
    }
}
