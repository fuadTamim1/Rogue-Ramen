import { GameManager } from "../GameManager.js";


export const AttackManager = {
    enableAttackMode(Attack) {
        if (Attack.cooldown >= Attack.cooldown_max) {
            GameManager.AttackMode = true;
            GameManager.allowToMove = false;
            GameManager.currentAttack = Attack;
            GameManager.UIManager.UIAttackSelect.show()
            if (GameManager.currentAttack.key != 'teleport')
                GameManager.player.ui.showWeapon();
            const board = GameManager.board;

            board.clearHighlight();
            GameManager.UIManager.UIAttackBar.hide()

            const targetable_cells = Attack.getTargetableCells(GameManager.player.getCurrentCell())
            targetable_cells.forEach(cell => {
                board.HighlightCell(cell.boardX, cell.boardY, 0x00FF00, 'cell_hover')
            });
            GameManager.targetableCells = targetable_cells;
            AttackManager.CameraAttackMode(true);
        } else {
            // show refuse behaivoir
        }
    },

    exitAttackMode() {
        GameManager.allowToMove = true;
        GameManager.currentAttack = null;
        GameManager.board.clearHighlight()
        GameManager.UIManager.UIAttackBar.show()
        GameManager.UIManager.UIAttackSelect.hide()
        GameManager.player.ui.hideWeapon();
        GameManager.AttackMode = false;
        GameManager.targetableCells = [];
        AttackManager.CameraAttackMode(false);

    },

    CameraAttackMode(state) {
        const scene = GameManager.scene;
        const camera = scene?.cameras.main;
        if (!camera) return;

        if (state) {
            // console.log("Timer scale: " + scene.time.timeScale);
            scene.tweens.add({
                targets: camera,
                duration: 400,
                zoom: 1.1,
                ease: 'Sine.easeInOut'
            });

            // Optionally slow down time
            scene.time.timeScale = 0.6;

        } else {
            scene.time.timeScale = 1;
            scene.tweens.add({
                targets: camera,
                duration: 400,
                zoom: 1,
                ease: 'Sine.easeInOut'
            });
        }
    }

}