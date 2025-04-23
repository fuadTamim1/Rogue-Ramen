import { GameManager } from "../GameManager.js";

export const AStar = {
    getDistance(a, b) {
        const dx = Math.abs(a.position.x - b.position.x);
        const dy = Math.abs(a.position.y - b.position.y);
        return dx + dy;
    },

    getPathDistance(start, target, grid = GameManager.board.cells) {
        const path = this.findPath(start, target, grid);
        if (!path || path.length === 0) return -1; // or null/undefined if preferred
        return path.length - 1; // number of steps, not including the starting cell
    },

    findPath(start, target, grid = GameManager.board.cells) {
        if (!target) return null;

        const openList = [];
        const closedList = [];
        const cameFrom = new Map();

        const getDistance = (a, b) => {
            const dx = Math.abs(a.position.x - b.position.x);
            const dy = Math.abs(a.position.y - b.position.y);
            return dx + dy; // Manhattan distance (good for grid-based movement)
        };

        start.gCost = 0;
        start.hCost = getDistance(start, target);
        start.fCost = start.gCost + start.hCost;

        openList.push(start);

        while (openList.length > 0) {
            // Sort openList by fCost, then hCost for tie-breaker
            openList.sort((a, b) => a.fCost - b.fCost || a.hCost - b.hCost);
            const current = openList.shift();

            if (current === target) {
                // Reconstruct path
                const path = [];
                let temp = target;
                while (cameFrom.has(temp)) {
                    path.push(temp);
                    temp = cameFrom.get(temp);
                }
                path.push(start);
                return path.reverse(); // Return full path from start to target
            }

            closedList.push(current);

            const neighbors = current.getNeighbors();
            for (let neighbor of neighbors) {
                if (closedList.includes(neighbor) || neighbor.hasObstacle) continue;

                const tentativeGCost = current.gCost + getDistance(current, neighbor);
                const isBetterPath = !openList.includes(neighbor) || tentativeGCost < neighbor.gCost;

                if (isBetterPath) {
                    cameFrom.set(neighbor, current);
                    neighbor.gCost = tentativeGCost;
                    neighbor.hCost = getDistance(neighbor, target);
                    neighbor.fCost = neighbor.gCost + neighbor.hCost;

                    if (!openList.includes(neighbor)) {
                        openList.push(neighbor);
                    }
                }
            }
        }

        return null; // No path found
    }
};
