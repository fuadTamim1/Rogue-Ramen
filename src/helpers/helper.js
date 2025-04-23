import { GameManager } from "../GameManager.js"

export const helper = {
    getDistance(A, B) {

    }
    ,
    areCellsEqual(a, b) {
        GameManager.board.areCellsEqual(a, b);
    }
    ,
    CellsInclude(cells, target) {
        return cells.some(cell =>
            cell.boardX === target.boardX && cell.boardY === target.boardY
        );
    },

    removeCell(cell,cells) {
        const index = cells.indexOf(cell);
        if (index > -1) {
            cells.splice(index, 1);
        }
    }
}