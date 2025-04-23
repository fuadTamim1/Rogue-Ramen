/* TODO:
 - Make AI Object that entity can use to make desciotions
 - Conect With Other entities to make sure there is no conflict with there desciotions [like going to same cell]
 - Ability to play with intlgenense of AI based in simple rules eg.[ attacks rate, plans, check if feature cell may be a threate]
 */

import { GameManager } from "../GameManager.js";
import { AStar } from "./pathfinding.js";

export class EnemyAI {
   constructor(entity) {
      this.entity = entity;
      this.diff = 0; // diff levels => 0 -> easy, 1 -> medium, 2 -> hard
   }

   update(player) {
      if (!this.entity.currentAttack) {
         this.chooseAttack()
      }
      // const dis = (AStar.getDistance(this.entity.getCurrentCell(), player.getCurrentCell()) > -1)

      // canAttack(target) {
      //    const attack = this.entity.currentAttack;
      //    const fromCell = this.entity.getCurrentCell();

      //    if (attack) {
      //       const targetableCells = attack.getTargetableCells(fromCell);
      //       const targetCell = target.getCurrentCell();
      //       return targetableCells.includes(targetCell);
      //    }

      //    return false;
      // }
   }

   canMove(targetCell) {
      return (AStar.getPathDistance(this.entity.getCurrentCell(), targetCell) > 1);
   }

   canAttack(target) {
      const attack = this.entity.currentAttack;
      const fromCell = this.entity.getCurrentCell();
      if(attack.cooldown < attack.cooldown_max) return false;
      if (attack) {
         const targetableCells = attack.getTargetableCells(fromCell);
         const targetCell = target.getCurrentCell();

         
         return targetableCells.some(cell =>
            cell.boardX === targetCell.boardX && cell.boardY === targetCell.boardY
         );

      }

      return false;
   }


   chooseAttack() {
      if (this.entity.attacks[0])
         this.entity.currentAttack = this.entity.attacks[0];
      // else
      //    console.log('no attack availabe');
   }

   findPlayer() {
      var path = AStar.findPath(
         this.entity.getCurrentCell(),
         GameManager.player.getCurrentCell());
      if (path) {
         return path;
      } else {
         // console.log("No path found");
         return [];
      }
   }
}