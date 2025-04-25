export class PhaserUI {
    constructor(scene) {
        if (!scene || typeof scene !== 'object') {
            console.warn('PhaserUI: Invalid scene provided. UI functionality may be limited.');
            this.scene = null;
        } else {
            this.scene = scene;
        }
    }

    createButton(x, y, text, config = {}) {
        if (!this.scene) {
            console.warn('PhaserUI.createButton: No valid scene available.');
            return null;
        }
        return new Button(this.scene, x, y, text, config);
    }

    createText(x, y, text, style = {}) {
        if (!this.scene) {
            console.warn('PhaserUI.createText: No valid scene available.');
            return null;
        }
        return new UIText(this.scene, x, y, text, style);
    }

    createContainer(x, y, width, height, config = {}) {
        if (!this.scene) {
            console.warn('PhaserUI.createContainer: No valid scene available.');
            return null;
        }
        return new UIContainer(this.scene, x, y, width, height, config);
    }

    createScrollableContainer(x, y, width, height, config = {}) {
        if (!this.scene) {
            console.warn('PhaserUI.createScrollableContainer: No valid scene available.');
            return null;
        }
        return new ScrollableContainer(this.scene, x, y, width, height, config);
    }

    // Add this method inside the PhaserUI class definition
    createTooltip(target, text, config = {}) {
        if (!this.scene) {
            console.warn('PhaserUI.createTooltip: No valid scene available.');
            return null;
        }
        return new Tooltip(this.scene, target, text, config);
    }

    createPanel(x, y, width, height, config = {}) {
        if (!this.scene) {
            console.warn('PhaserUI.createPanel: No valid scene available.');
            return null;
        }
        return new Panel(this.scene, x, y, width, height, config);
    }

    // Add createGrid to PhaserUI class (insert this method inside the PhaserUI class definition)
    createGrid(x, y, config = {}) {
        if (!this.scene) {
            console.warn('PhaserUI.createGrid: No valid scene available.');
            return null;
        }
        return new Grid(this.scene, x, y, config);
    }

    // Replace the createNineSlice method inside the PhaserUI class
    createNineSlice(...args) {
        if (!this.scene) {
            console.warn('PhaserUI.createNineSlice: No valid scene available.');
            return null;
        }

        let x, y, texture, frame, width, height, config = {};

        // Handle object-based argument
        if (args.length === 1 && typeof args[0] === 'object') {
            const obj = args[0];
            x = obj.x || 0;
            y = obj.y || 0;
            texture = obj.key || obj.texture;
            frame = obj.frame || null;
            width = obj.width || 100;
            height = obj.height || 100;
            config = {
                leftWidth: obj.leftWidth || 10,
                rightWidth: obj.rightWidth || 10,
                topHeight: obj.topHeight || 10,
                bottomHeight: obj.bottomHeight || 10,
                interactive: obj.interactive || false,
                originX: obj.originX !== undefined ? obj.originX : 0.5,
                originY: obj.originY !== undefined ? obj.originY : 0.5
            };
        }
        // Handle separate arguments
        else {
            [x = 0, y = 0, texture, frame, width = 100, height = 100, config = {}] = args;
            config = Object.assign({
                leftWidth: 10,
                rightWidth: 10,
                topHeight: 10,
                bottomHeight: 10,
                interactive: false,
                originX: 0.5,
                originY: 0.5
            }, config);
        }

        if (!texture) {
            console.warn('PhaserUI.createNineSlice: No valid texture provided.');
            return null;
        }

        return new NineSlice(this.scene, x, y, texture, frame, width, height, config);
    }

    addToScene(gameObject) {
        if (!this.scene?.add) {
            console.warn('PhaserUI.addToScene: scene.add not available.');
            return false;
        }
        if (gameObject) {
            this.scene.add.existing(gameObject);
            return true;
        }
        return false;
    }
}
class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, config = {}) {
        super(scene, x, y);
        this.scene = scene;

        this.config = Object.assign({
            width: 100,
            height: 40,
            backgroundColor: 0x444444,
            backgroundColorHover: 0x666666,
            backgroundColorPressed: 0x222222,
            backgroundColorDisabled: 0x888888,
            backgroundAlpha: 1,
            backgroundTexture: '',
            cornerRadius: 10,
            fontSize: '16px',
            fontColor: '#ffffff',
            fontColorHover: '#ffffff',
            fontColorPressed: '#ffffff',
            fontColorDisabled: '#aaaaaa',
            fontFamily: 'Arial',
            padding: 10,
            interactive: true,
            // New: Custom NineSlice margins
            leftWidth: 8,
            rightWidth: 8,
            topHeight: 8,
            bottomHeight: 8
        }, config);

        this.isHovered = false;
        this.isPressed = false;
        this.isDisabled = false;

        this.createButton();
        if (this.scene?.add) {
            this.scene.add.existing(this);
        } else {
            console.warn('Button: scene.add not available.');
        }
    }

    createButton() {
        // Check if texture exists
        const textureExists = this.config.backgroundTexture && this.config.backgroundTexture !== '' && this.scene.textures.exists(this.config.backgroundTexture);

        // Create background (NineSlice if valid texture, Graphics otherwise)
        if (textureExists) {
            this.background = this.scene.ui.createNineSlice({
                x: 0,
                y: 0,
                key: this.config.backgroundTexture,
                width: this.config.width,
                height: this.config.height,
                leftWidth: this.config.leftWidth,
                rightWidth: this.config.rightWidth,
                topHeight: this.config.topHeight,
                bottomHeight: this.config.bottomHeight
            });
            if (!this.background) {
                console.error(`Button: Failed to create NineSlice for texture ${this.config.backgroundTexture}. Using fallback.`);
                this.background = this.scene.add.graphics();
            }
        } else {
            if (this.config.backgroundTexture && this.config.backgroundTexture !== '') {
                console.warn(`Button: Texture ${this.config.backgroundTexture} not found. Using solid color.`);
            }
            this.background = this.scene.add.graphics();
        }
        this.add(this.background);

        // Create text
        this.text = this.scene.ui.createText(0, 0, this.config.text || '', {
            fontSize: this.config.fontSize,
            color: this.config.fontColor,
            fontFamily: this.config.fontFamily,
            align: 'center',
            wordWrap: { width: this.config.width - this.config.padding * 2 }
        });
        if (!this.text) {
            console.error('Button: Failed to create text.');
        } else {
            this.text.setOrigin(0.5);
            this.add(this.text);
        }

        this.updateButtonAppearance();

        if (this.config.interactive) {
            this.setInteractive({
                useHandCursor: true,
                hitArea: new Phaser.Geom.Rectangle(
                    -this.config.width / 2,
                    -this.config.height / 2,
                    this.config.width,
                    this.config.height
                ),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
            });

            this.on('pointerover', () => {
                this.isHovered = true;
                this.updateButtonAppearance();
            });

            this.on('pointerout', () => {
                this.isHovered = false;
                this.isPressed = false;
                this.updateButtonAppearance();
            });

            this.on('pointerdown', () => {
                this.isPressed = true;
                this.updateButtonAppearance();
            });

            this.on('pointerup', () => {
                if (this.isPressed) {
                    this.isPressed = false;
                    this.updateButtonAppearance();
                    this.emit('click');
                }
            });
        }
    }

    updateButtonAppearance() {
        const textureExists = this.config.backgroundTexture && this.config.backgroundTexture !== '' && this.scene.textures.exists(this.config.backgroundTexture);

        if (textureExists && this.background instanceof Phaser.GameObjects.NineSlice) {
            // Apply subtle tint only for state changes (avoid blackening)
            const tint = this.isDisabled ? 0x888888 :
                         this.isPressed ? 0xbbbbbb :
                         this.isHovered ? 0xdddddd :
                         0xffffff; // White (no tint) for normal state
            this.background.clearTint().setTint(tint);
            this.background.setAlpha(this.config.backgroundAlpha);
        } else {
            // Use Graphics with solid color
            this.background.clear();
            const bgColor = this.isDisabled ? this.config.backgroundColorDisabled :
                            this.isPressed ? this.config.backgroundColorPressed :
                            this.isHovered ? this.config.backgroundColorHover :
                            this.config.backgroundColor;

            this.background.fillStyle(bgColor, this.config.backgroundAlpha);
            this.background.fillRoundedRect(
                -this.config.width / 2,
                -this.config.height / 2,
                this.config.width,
                this.config.height,
                this.config.cornerRadius
            );
        }

        // Update text color
        if (this.text) {
            const textColor = this.isDisabled ? this.config.fontColorDisabled :
                             this.isPressed ? this.config.fontColorPressed :
                             this.isHovered ? this.config.fontColorHover :
                             this.config.fontColor;
            this.text.setColor(textColor);
        }
    }

    setDisabled(disabled) {
        this.isDisabled = disabled;
        this.updateButtonAppearance();
        this.setInteractive(!disabled);
    }

    setText(newText) {
        if (this.text) {
            this.text.setText(newText);
        }
    }
}

class UIText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style = {}) {
        const defaultStyle = {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'left'
        };
        const mergedStyle = Object.assign({}, defaultStyle, style);

        super(scene, x, y, text, mergedStyle);
        this.scene = scene;
    }
}

class UIContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, config = {}) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.config = Object.assign({
            backgroundColor: null,
            backgroundAlpha: 1,
            cornerRadius: 0,
            padding: { left: 10, right: 10, top: 10, bottom: 10 }
        }, config);

        this.background = scene.add.graphics();
        this.add(this.background);
        this.redraw();
    }

    redraw() {
        this.background.clear();
        if (this.config.backgroundColor !== null) {
            this.background.fillStyle(this.config.backgroundColor, this.config.backgroundAlpha);
            this.background.fillRoundedRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height,
                this.config.cornerRadius
            );
        }
    }

    setBackgroundColor(color, alpha = 1) {
        this.config.backgroundColor = color;
        this.config.backgroundAlpha = alpha;
        this.redraw();
        return this;
    }
}

class Scrollbar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, orientation = 'vertical', config = {}) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.orientation = orientation;
        this.config = Object.assign({
            trackColor: 0x888888,
            trackAlpha: 0.5,
            thumbColor: 0xaaaaaa,
            thumbAlpha: 1,
            thumbCornerRadius: 4,
            thumbMinSize: 20
        }, config);

        this.track = scene.add.graphics();
        this.add(this.track);

        this.thumb = scene.add.graphics();
        this.add(this.thumb);

        this.thumbSize = Math.max(
            this.config.thumbMinSize,
            this.orientation === 'vertical' ? this.height * 0.2 : this.width * 0.2
        );

        this.isDragging = false;
        this.value = 0;

        this.redraw();

        this.thumb.setInteractive(
            new Phaser.Geom.Rectangle(
                this.orientation === 'vertical' ? -width / 2 : -this.thumbSize / 2,
                this.orientation === 'vertical' ? -this.thumbSize / 2 : -height / 2,
                this.orientation === 'vertical' ? width : this.thumbSize,
                this.orientation === 'vertical' ? this.thumbSize : height
            ),
            Phaser.Geom.Rectangle.Contains
        );

        scene.input.setDraggable(this.thumb);
        this.thumb.on('dragstart', this.onThumbDragStart, this);
        this.thumb.on('drag', this.onThumbDrag, this);
        this.thumb.on('dragend', this.onThumbDragEnd, this);
    }

    redraw() {
        this.track.clear();
        this.thumb.clear();

        this.track.fillStyle(this.config.trackColor, this.config.trackAlpha);
        this.track.fillRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.config.thumbCornerRadius
        );

        this.thumb.fillStyle(this.config.thumbColor, this.config.thumbAlpha);
        if (this.orientation === 'vertical') {
            const thumbY = -this.height / 2 + this.value * (this.height - this.thumbSize);
            this.thumb.fillRoundedRect(
                -this.width / 2,
                thumbY,
                this.width,
                this.thumbSize,
                this.config.thumbCornerRadius
            );
        } else {
            const thumbX = -this.width / 2 + this.value * (this.width - this.thumbSize);
            this.thumb.fillRoundedRect(
                thumbX,
                -this.height / 2,
                this.thumbSize,
                this.height,
                this.config.thumbCornerRadius
            );
        }
    }

    onThumbDragStart(pointer) {
        this.isDragging = true;
        this.dragStartPosition = this.orientation === 'vertical' ? pointer.y : pointer.x;
        this.thumbStartPosition = this.value * (this.orientation === 'vertical' ? this.height : this.width - this.thumbSize);
    }

    onThumbDrag(pointer) {
        if (!this.isDragging) return;
        const delta = (this.orientation === 'vertical' ? pointer.y : pointer.x) - this.dragStartPosition;
        const maxTravel = this.orientation === 'vertical' ? this.height : this.width - this.thumbSize;
        const newPosition = Phaser.Math.Clamp(this.thumbStartPosition + delta, 0, maxTravel);
        this.value = newPosition / maxTravel;
        this.redraw();
        this.emit('change', this.value);
    }

    onThumbDragEnd() {
        this.isDragging = false;
    }

    setValue(value) {
        this.value = Phaser.Math.Clamp(value, 0, 1);
        this.redraw();
        return this;
    }
}

class ScrollableContainer extends UIContainer {
    constructor(scene, x, y, width, height, config = {}) {
        super(scene, x, y, width, height, config);
        this.scrollConfig = Object.assign({
            scrollDirection: 'vertical',
            scrollbarThickness: 10,
            scrollbarPadding: 2,
            showScrollbarY: true,
            scrollbarTrackColor: 0x888888,
            scrollbarThumbColor: 0xaaaaaa,
            contentWidth: width,
            contentHeight: height,
            maskContent: true
        }, config);

        this.contentContainer = new Phaser.GameObjects.Container(scene, 0, 0);
        this.add(this.contentContainer);

        if (this.scrollConfig.scrollDirection === 'vertical') {
            this.vScrollbar = new Scrollbar(
                scene,
                this.width / 2 - this.scrollConfig.scrollbarThickness / 2 - this.scrollConfig.scrollbarPadding,
                0,
                this.scrollConfig.scrollbarThickness,
                this.height,
                'vertical',
                {
                    trackColor: this.scrollConfig.scrollbarTrackColor,
                    thumbColor: this.scrollConfig.scrollbarThumbColor
                }
            );
            this.vScrollbar.visible = this.scrollConfig.showScrollbarY;
            this.vScrollbar.on('change', this.onVerticalScroll, this);
            this.add(this.vScrollbar);
        }

        if (this.scrollConfig.maskContent) {
            this.contentMask = scene.add.graphics();
            this.contentMask.fillStyle(0xffffff);
            this.contentMask.fillRect(
                -this.width / 2 + this.config.padding.left,
                -this.height / 2 + this.config.padding.top,
                this.width - this.config.padding.left - this.config.padding.right -
                (this.vScrollbar ? this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0),
                this.height - this.config.padding.top - this.config.padding.bottom
            );
            this.contentContainer.setMask(new Phaser.Display.Masks.GeometryMask(scene, this.contentMask));
        }

        this.contentSize = { width: this.scrollConfig.contentWidth, height: this.scrollConfig.contentHeight };
        this.contentContainer.x = -this.width / 2 + this.config.padding.left;
        this.contentContainer.y = -this.height / 2 + this.config.padding.top;
    }

    add(gameObject) {
        if (gameObject) {
            this.contentContainer.add(gameObject);
            this.calculateContentSize();
        }
        return this;
    }

    calculateContentSize() {
        if (this.contentContainer.list.length === 0) return;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        this.contentContainer.list.forEach(child => {
            if (!child.getBounds) return;
            const bounds = child.getBounds();
            minX = Math.min(minX, bounds.left - this.contentContainer.x);
            minY = Math.min(minY, bounds.top - this.contentContainer.y);
            maxX = Math.max(maxX, bounds.right - this.contentContainer.x);
            maxY = Math.max(maxY, bounds.bottom - this.contentContainer.y);
        });
        if (minX !== Infinity && maxX !== -Infinity) {
            this.contentSize.width = maxX - minX + this.config.padding.left + this.config.padding.right;
        }
        if (minY !== Infinity && maxY !== -Infinity) {
            this.contentSize.height = maxY - minY + this.config.padding.top + this.config.padding.bottom;
        }
        this.updateScrollbarsVisibility();
    }

    updateScrollbarsVisibility() {
        if (this.vScrollbar) {
            const visibleHeight = this.height - this.config.padding.top - this.config.padding.bottom;
            this.vScrollbar.visible = this.scrollConfig.showScrollbarY && this.contentSize.height > visibleHeight;
            if (this.scrollConfig.maskContent) {
                this.updateContentMask();
            }
        }
    }

    updateContentMask() {
        if (!this.contentMask) return;
        this.contentMask.clear();
        this.contentMask.fillStyle(0xffffff);
        this.contentMask.fillRect(
            -this.width / 2 + this.config.padding.left,
            -this.height / 2 + this.config.padding.top,
            this.width - this.config.padding.left - this.config.padding.right -
            (this.vScrollbar && this.vScrollbar.visible ? this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0),
            this.height - this.config.padding.top - this.config.padding.bottom
        );
    }

    onVerticalScroll(value) {
        const visibleHeight = this.height - this.config.padding.top - this.config.padding.bottom;
        const scrollRange = Math.max(0, this.contentSize.height - visibleHeight);
        this.contentContainer.y = -this.height / 2 + this.config.padding.top - (scrollRange * value);
        this.emit('scroll', { y: value });
    }

    setContentSize(width, height) {
        this.contentSize.width = width;
        this.contentSize.height = height;
        this.updateScrollbarsVisibility();
        return this;
    }
}

class Panel extends UIContainer {
    constructor(scene, x, y, width, height, config = {}) {
        super(scene, x, y, width, height, config);
        this.panelConfig = Object.assign({
            body: {
                backgroundColor: null,
                padding: { left: 10, right: 10, top: 10, bottom: 10 }
            }
        }, config);

        this.body = new ScrollableContainer(
            scene,
            0,
            0,
            this.width,
            this.height,
            {
                backgroundColor: this.panelConfig.body.backgroundColor,
                padding: this.panelConfig.body.padding,
                scrollDirection: 'vertical'
            }
        );
        this.add(this.body);
    }

    add(gameObject) {
        if (gameObject) {
            this.body.add(gameObject);
        }
        return this;
    }
}

class Grid extends Phaser.GameObjects.Container {
    constructor(scene, x, y, config = {}) {
        super(scene, x, y);
        this.scene = scene;
        this.cells = [];

        this.config = Object.assign({
            rows: 1,
            cols: 5,
            cellWidth: 130,
            cellHeight: 90,
            spacingX: 20,
            spacingY: 20,
            backgroundColor: null,
            backgroundAlpha: 1,
            cornerRadius: 0,
            // Support legacy 'columns' and 'cellPadding' for UIPlayer
            columns: config.cols || 5,
            cellPadding: null
        }, config);

        // Map columns to cols if provided
        if (config.columns !== undefined) {
            this.config.cols = config.columns;
        }

        // Map cellPadding to spacingX/spacingY if provided
        if (config.cellPadding) {
            this.config.spacingX = config.cellPadding.x !== undefined ? config.cellPadding.x : this.config.spacingX;
            this.config.spacingY = config.cellPadding.y !== undefined ? config.cellPadding.y : this.config.spacingY;
        }

        this.createGrid();
    }

    createGrid() {
        const { rows, cols, cellWidth, cellHeight, spacingX, spacingY, backgroundColor, backgroundAlpha, cornerRadius } = this.config;

        // Calculate total grid dimensions
        const totalWidth = cols * cellWidth + (cols - 1) * spacingX;
        const totalHeight = rows * cellHeight + (rows - 1) * spacingY;

        // Create background if specified
        if (backgroundColor !== null) {
            const background = this.scene.add.graphics();
            background.fillStyle(backgroundColor, backgroundAlpha);
            background.fillRoundedRect(
                -totalWidth / 2,
                -totalHeight / 2,
                totalWidth,
                totalHeight,
                cornerRadius
            );
            this.add(background);
        }

        // Create grid cells
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cellX = -totalWidth / 2 + col * (cellWidth + spacingX) + cellWidth / 2;
                const cellY = -totalHeight / 2 + row * (cellHeight + spacingY) + cellHeight / 2;

                const cellContainer = new Phaser.GameObjects.Container(this.scene, cellX, cellY);
                this.cells.push(cellContainer);
                this.add(cellContainer);
            }
        }
    }

    getCell(row, col) {
        const index = row * this.config.cols + col;
        return this.cells[index] || null;
    }

    addToCell(row, col, gameObject) {
        const cell = this.getCell(row, col);
        if (cell && gameObject) {
            cell.add(gameObject);
            return true;
        }
        console.warn(`Grid: Invalid cell at row ${row}, col ${col} or gameObject is null.`);
        return false;
    }

    clearCell(row, col) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.removeAll(true);
            return true;
        }
        return false;
    }

    clearCells(startRow = 0, startCol = 0, endRow = null, endCol = null) {
        const { rows, cols } = this.config;
        const effectiveEndRow = endRow !== null ? Math.min(endRow, rows - 1) : rows - 1;
        const effectiveEndCol = endCol !== null ? Math.min(endCol, cols - 1) : cols - 1;

        let cleared = false;
        for (let row = Math.max(0, startRow); row <= effectiveEndRow; row++) {
            for (let col = Math.max(0, startCol); col <= effectiveEndCol; col++) {
                if (this.clearCell(row, col)) {
                    cleared = true;
                }
            }
        }

        if (!cleared) {
            console.warn(`Grid: No cells cleared in range (${startRow},${startCol}) to (${effectiveEndRow},${effectiveEndCol}).`);
        }
        return cleared;
    }
}

// NineSlice class (unchanged, included for reference)
class NineSlice extends Phaser.GameObjects.NineSlice {
    constructor(scene, x, y, texture, frame, width, height, config = {}) {
        const sliceConfig = Object.assign({
            leftWidth: 10,
            rightWidth: 10,
            topHeight: 10,
            bottomHeight: 10,
            interactive: false,
            originX: 0.5,
            originY: 0.5
        }, config);

        super(scene, x, y, texture, frame, width, height,
            sliceConfig.leftWidth, sliceConfig.rightWidth,
            sliceConfig.topHeight, sliceConfig.bottomHeight);

        this.scene = scene;
        if (this.scene?.add) {
            this.scene.add.existing(this);
        } else {
            console.warn('NineSlice: scene.add not available. NineSlice not added to scene.');
        }

        this.setOrigin(sliceConfig.originX, sliceConfig.originY);

        if (sliceConfig.interactive) {
            this.setInteractive({ useHandCursor: true });
        }
    }

    setSize(width, height) {
        this.resize(width, height);
        return this;
    }
}




// Add this class after the existing classes (e.g., after NineSlice)
class Tooltip extends Phaser.GameObjects.Container {
    constructor(scene, target, text, config = {}) {
        super(scene, 0, 0);
        this.scene = scene;
        this.target = target;
        this.visible = false;
        this.setDepth(1000);

        this.config = Object.assign({
            backgroundTexture: 'tooltip_bg',
            backgroundFrame: null,
            backgroundWidth: 150,
            backgroundHeight: 50,
            leftWidth: 8,
            rightWidth: 8,
            topHeight: 8,
            bottomHeight: 8,
            padding: 10,
            fontSize: '14px',
            fontColor: '#ffffff',
            fontFamily: 'Arial',
            offsetX: 10,
            offsetY: 10,
            followCursor: true
        }, config);

        this.createTooltip();
        this.setupEvents();

        if (this.scene?.add) {
            this.scene.add.existing(this);
        } else {
            console.warn('Tooltip: scene.add not available. Tooltip not added to scene.');
        }
    }

    createTooltip() {
        // Create background using NineSlice
        this.background = this.scene.ui.createNineSlice({
            x: 0,
            y: 0,
            key: this.config.backgroundTexture,
            frame: this.config.backgroundFrame,
            width: this.config.backgroundWidth,
            height: this.config.backgroundHeight,
            leftWidth: this.config.leftWidth,
            rightWidth: this.config.rightWidth,
            topHeight: this.config.topHeight,
            bottomHeight: this.config.bottomHeight
        });

        if (!this.background) {
            console.error('Tooltip: Failed to create background.');
            return;
        }
        this.add(this.background);

        // Create text
        this.text = this.scene.ui.createText(0, 0, this.config.text || '', {
            fontSize: this.config.fontSize,
            color: this.config.fontColor,
            fontFamily: this.config.fontFamily,
            align: 'center',
            wordWrap: { width: this.config.backgroundWidth - this.config.padding * 2 }
        });

        if (!this.text) {
            console.error('Tooltip: Failed to create text.');
            this.background.destroy();
            return;
        }
        this.text.setOrigin(0.5);
        this.add(this.text);
    }

    setupEvents() {
        if (!this.target || !this.target.setInteractive) {
            console.warn('Tooltip: Invalid target for interaction.');
            return;
        }

        this.target.setInteractive({ useHandCursor: true });

        this.target.on('pointerover', (pointer) => {
            this.setVisible(true);
            this.updatePosition(pointer);
        });

        this.target.on('pointerout', () => {
            this.setVisible(false);
        });

        if (this.config.followCursor) {
            this.target.on('pointermove', (pointer) => {
                this.updatePosition(pointer);
            });
        }
    }

    updatePosition(pointer) {
        let x = this.config.followCursor ? pointer.worldX + this.config.offsetX : this.target.x;
        let y = this.config.followCursor ? pointer.worldY + this.config.offsetY : this.target.y + this.target.height / 2;

        // Ensure tooltip stays within screen bounds
        const bounds = this.scene.cameras.main;
        const halfWidth = this.config.backgroundWidth / 2;
        const halfHeight = this.config.backgroundHeight / 2;

        x = Phaser.Math.Clamp(x, bounds.x + halfWidth, bounds.x + bounds.width - halfWidth);
        y = Phaser.Math.Clamp(y, bounds.y + halfHeight, bounds.y + bounds.height - halfHeight);

        this.setPosition(x, y);
    }

    setText(newText) {
        if (this.text) {
            this.text.setText(newText);
        }
    }
}