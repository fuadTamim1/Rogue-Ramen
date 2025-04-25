import { gameConfig } from "../config.js";

export class UIEntity extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);
        this.scene = scene;
 // Health bar configuration
 this.cellWidth = 10;
 this.cellHeight = 10;
 this.maxColumns = 5;
 this.maxRows = 2;
        this.createUI();
    }

    createUI() {

        this.createWeaponUI();
    }

    createWeaponUI() {
        this.WeaponIcon = this.scene.add.sprite(0, -100, 'shadow');
        this.WeaponIcon = this.scene.add.sprite(0, -100, 'knife');
        this.WeaponIcon.setDisplaySize(
            gameConfig.board.cellSize * 3,
            gameConfig.board.cellSize * 3
        );

        this.add(this.WeaponIcon); // Add to container
        this.setDepth(200);
        this.hideWeapon()
    }


    createHealthBarUI(health, maxHealth) {
        // Create container for health bar
        this.healthBarContainer = this.scene.ui.createContainer(
            0,
            20,
            this.cellWidth * this.maxColumns,
            this.cellHeight * this.maxRows,
            {
                backgroundColor: "#242424",
                backgroundAlpha: 0.7
            }
        );
    
        // Create grid for health cells
        this.healthBarGrid = this.scene.ui.createGrid(
            0,
            0,
            {
                rows: this.maxRows,
                cols: this.maxColumns,
                cellWidth: this.cellWidth,
                cellHeight: this.cellHeight,
                spacingX: 2,
                spacingY: 2
            }
        );
    
        this.healthBarContainer.add(this.healthBarGrid);
        this.add(this.healthBarContainer);
            
        // Initialize health display
        this.updateHealthBar(health, maxHealth);
    }
    
    updateHealthBar(currentHealth, maxHealth) {
        // Clear existing cells and any warning text
        this.healthBarGrid.clearCells();
        const existingText = this.healthBarContainer.list.find(obj => obj instanceof Phaser.GameObjects.Text);
        if (existingText) existingText.destroy();
    
        const maxPossibleHealth = this.maxColumns * this.maxRows;
        const displayHealth = Math.min(maxHealth, maxPossibleHealth);
        const fullHearts = Math.min(currentHealth, displayHealth);
        const emptyHearts = displayHealth - fullHearts;
    
        // Create health cells
        for (let i = 0; i < maxPossibleHealth; i++) {
            const color = i < fullHearts ? 0x00ff28 : 0xff0000;
            const heart = this.scene.add.rectangle(
                0, 0,
                this.healthBarGrid.config.cellWidth - 4,
                this.healthBarGrid.config.cellHeight - 4,
                color
            );
    
            const row = Math.floor(i / this.maxColumns);
            const col = i % this.maxColumns;
            this.healthBarGrid.addToCell(row, col, heart);
        }
    
        // Show warning if health exceeds max display
        if (maxHealth > maxPossibleHealth) {
            const warningText = this.scene.ui.createText(
                0,
                this.healthBarContainer.height / 2 + 10,
                `+${maxHealth - maxPossibleHealth}`,
                {
                    fontSize: '10px',
                    color: '#ff0000'
                }
            ).setOrigin(0.5, 0);
            this.healthBarContainer.add(warningText);
        }
    }


    showWeapon(attackIcon = null) {
        if (attackIcon) {
            this.WeaponIcon.setTexture(attackIcon);
        }
        this.WeaponIcon.setVisible(true)
    }

    hideWeapon() {
        this.WeaponIcon.setVisible(false)
    }
}
