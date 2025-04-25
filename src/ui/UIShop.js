export class UIShop extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 200, 120);
        if (scene?.add) {
            scene.add.existing(this);
        } else {
            console.warn('UIShop: scene.add not available. Container not added to scene.');
        }
        this.scene = scene;
        this.items = [];
        this.maxItems = 5;
        
        // Use scene.ui for UI components
        this.ui = this.scene.ui;
        
        this.createUI();
        this.setVisible(true);
        this.setDepth(1000);
    }

    createUI() {
        // Clear any existing elements
        this.removeAll(true);



        // Create coins display
        this.coinsText = this.ui.createText(-30, -100, "Coins: 0", {
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        });
        if (!this.coinsText) {
            console.error('UIShop: Failed to create coins text.');
            return;
        }
        this.coinsText.setOrigin(0.5);
        this.add(this.coinsText);

        // Create grid container for items
        this.gridContainer = this.ui.createContainer(0, 0, 700, 100, {
            backgroundColor: null
        });
        if (!this.gridContainer) {
            console.error('UIShop: Failed to create grid container.');
            return;
        }
        this.add(this.gridContainer);

        // // Add close button
        // this.closeButton = this.ui.createButton(350, -100, "X", {
        //     width: 40,
        //     height: 40,
        //     backgroundColor: 0xe74c3c,
        //     cornerRadius: 5,
        //     fontSize: '20px'
        // });
        // if (!this.closeButton) {
        //     console.error('UIShop: Failed to create close button.');
        //     return;
        // }
        // this.closeButton.on('click', () => this.toggle());
        // this.add(this.closeButton);
    }

    addItem(item, onClick) {
        if (this.items.length >= this.maxItems) {
            console.warn('UIShop: Maximum item limit reached (5 items).');
            return false;
        }

        // Create item container
        const itemContainer = this.ui.createContainer(0, 0, 130, 90, {
            backgroundColor: "#0000"
        });
        if (!itemContainer) {
            console.error('UIShop: Failed to create item container.');
            return false;
        }

        // Item icon
        const icon = this.scene.add.image(0, 0, item.icon)
            .setDisplaySize(150, 150);
        itemContainer.add(icon);

        // Item name
        const nameText = this.ui.createText(0, 20, item.name, {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        if (!nameText) {
            console.error('UIShop: Failed to create item name text.');
            itemContainer.destroy();
            return false;
        }
        nameText.setOrigin(0.5);
        itemContainer.add(nameText);

        // Item cost
        const costText = this.ui.createText(0, 35, `${item.cost} coins`, {
            fontSize: '14px',
            color: '#f1c40f',
            align: 'center'
        });
        if (!costText) {
            console.error('UIShop: Failed to create item cost text.');
            itemContainer.destroy();
            return false;
        }
        costText.setOrigin(0.5);
        itemContainer.add(costText);

        // Buy button
        const buyButton = this.ui.createButton(0, 55, "BUY", {
            width: 80,
            height: 20,
            backgroundColor: 0x27ae60,
            cornerRadius: 5,
            fontSize: '12px'
        });
        if (!buyButton) {
            console.error('UIShop: Failed to create buy button.');
            itemContainer.destroy();
            return false;
        }
        buyButton.on('click', () => {
            // this.scene.sound.play('click'); // Uncomment if sound is available
            onClick();
        });
        itemContainer.add(buyButton);

        // Add to items array and grid
        this.items.push({ item, container: itemContainer });
        this.gridContainer.add(itemContainer);

        // Update grid layout
        this.updateGridLayout();

        return true;
    }

    removeItem(itemId) {
        const index = this.items.findIndex(({ item }) => item.id === itemId);
        if (index === -1) {
            console.warn(`UIShop: Item with id ${itemId} not found.`);
            return false;
        }

        const { container } = this.items[index];
        container.destroy();
        this.items.splice(index, 1);

        // Update grid layout
        this.updateGridLayout();

        return true;
    }

    updateGridLayout() {
        const itemWidth = 130;
        const spacing = 20;
        const totalWidth = Math.min(this.items.length, this.maxItems) * (itemWidth + spacing) - spacing;
        const startX = -totalWidth / 2 + itemWidth / 2;

        this.items.forEach(({ container }, index) => {
            container.setPosition(startX + index * (itemWidth + spacing), 0);
        });
    }

    updateCoins(amount) {
        if (this.coinsText) {
            this.coinsText.setText(`Coins: ${amount}`);
        }
    }

    toggle() {
        this.setVisible(!this.visible);
        if (this.visible) this.setDepth(1000);
    }
}