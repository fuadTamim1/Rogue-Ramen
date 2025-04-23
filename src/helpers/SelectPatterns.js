import { GameManager } from "../GameManager.js";

export const SelectPaterns = {
    plusShape(cell, length = 1) {
        const board = GameManager.board;
        const neighbors = [];
        const { x, y } = cell.position;

        for (let i = -length; i <= length; i++) {
            for (let j = -length; j <= length; j++) {
                if (i === 0 || j === 0) {
                    if (board.getCell(x + i, y + j)) {
                        const neighbor = board.getCell(x + i, y + j);
                        neighbors.push(neighbor);
                    }
                }
            }
        }


        return neighbors;
    }
    ,
    SquareShape(cell, length = 3) {
        const board = GameManager.board;
        const neighbors = [];
        const { x, y } = cell.position;

        for (let i = -length; i <= length; i++) {
            for (let j = -length; j <= length; j++) {
                if (Math.fround((i)) * Math.fround((i)) + Math.fround((j)) * Math.fround((j)) <= length) {
                    if (board.getCell(x + i, y + j)) {
                        const neighbor = board.getCell(x + i, y + j);
                        neighbors.push(neighbor);
                    }
                }
            }
        }
        return neighbors;
    },
    LineShape(cell, target, length = 3) {
        const board = GameManager.board;
        const neighbors = [];
        const { x, y } = cell.position;

        let mode = 'hori';

        if (target.position.x - cell.position.x == 0) {
            mode = 'hori';
        } else if (target.position.y - cell.position.y == 0) {
            mode = 'vert';
        }

        for (let i = -length; i <= length; i++) {
            if (mode == 'hori')
                var neighbor = board.getCell(x + i, y);
            else
                var neighbor = board.getCell(x, y + i);

            if (neighbor)
                neighbors.push(neighbor);

            return neighbors;
        }
    },
    LineGroupShape(from, to) {
        const board = GameManager.board;
        const neighbors = [];

        if (!from || !to) return neighbors;

        const fromX = from.boardX;
        const fromY = from.boardY;
        const toX = to.boardX;
        const toY = to.boardY;

        // Horizontal
        if (fromY === toY) {
            const y = fromY;

            if (fromX < toX) {
                for (let x = fromX + 1; x < GameManager.board.getBoardWidth(); x++) {
                    const cell = board.getCell(x, y);
                    if (cell) neighbors.push(cell);
                }
            } else {
                for (let x = fromX - 1; x >= 0; x--) {
                    const cell = board.getCell(x, y);
                    if (cell) neighbors.push(cell);
                }
            }
        }

        // Vertical
        else if (fromX === toX) {
            const x = fromX;

            if (fromY < toY) {
                for (let y = fromY + 1; y < GameManager.board.getBoardHight(); y++) {
                    const cell = board.getCell(x, y);
                    if (cell) neighbors.push(cell);
                }
            } else {
                for (let y = fromY - 1; y >= 0; y--) {
                    const cell = board.getCell(x, y);
                    if (cell) neighbors.push(cell);
                }
            }
        }

        return neighbors;
    }





}