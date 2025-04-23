/**
 * PhaserUI - A comprehensive UI library for Phaser 3
 * 
 * Features:
 * - Button components with hover, pressed, and disabled states
 * - Text components with various styling options
 * - Containers for organizing UI elements
 * - Grid layout system (columns & rows)
 * - Scrollbar and scrollable containers
 * - Panel components
 * - Tooltips
 * - Dropdown menus
 * - Input fields
 */

export class PhaserUI {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Creates a styled button with various states
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} text - Button text
     * @param {object} config - Button configuration
     * @returns {Button} - Button instance
     */
    createButton(x, y, text, config = {}) {
        return new Button(this.scene, x, y, text, config);
    }

    /**
     * Creates a styled text element
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} text - Text content
     * @param {object} style - Text style configuration
     * @returns {UIText} - Text instance
     */
    createText(x, y, text, style = {}) {
        return new UIText(this.scene, x, y, text, style);
    }

    /**
     * Creates a container for organizing UI elements
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Container width
     * @param {number} height - Container height
     * @param {object} config - Container configuration
     * @returns {UIContainer} - Container instance
     */
    createContainer(x, y, width, height, config = {}) {
        return new UIContainer(this.scene, x, y, width, height, config);
    }

    /**
     * Creates a grid layout for organizing elements in rows and columns
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Grid width
     * @param {number} height - Grid height
     * @param {object} config - Grid configuration
     * @returns {Grid} - Grid instance
     */
    createGrid(x, y, width, height, config = {}) {
        return new Grid(this.scene, x, y, width, height, config);
    }

    /**
     * Creates a scrollable container with scrollbar
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Container width
     * @param {number} height - Container height
     * @param {object} config - Scrollable container configuration
     * @returns {ScrollableContainer} - Scrollable container instance
     */
    createScrollableContainer(x, y, width, height, config = {}) {
        return new ScrollableContainer(this.scene, x, y, width, height, config);
    }

    /**
     * Creates a panel with optional header and footer
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Panel width
     * @param {number} height - Panel height
     * @param {object} config - Panel configuration
     * @returns {Panel} - Panel instance
     */
    createPanel(x, y, width, height, config = {}) {
        return new Panel(this.scene, x, y, width, height, config);
    }

    /**
     * Creates a tooltip that can be attached to any UI element
     * @param {object} target - Target UI element
     * @param {string} text - Tooltip text
     * @param {object} config - Tooltip configuration
     * @returns {Tooltip} - Tooltip instance
     */
    createTooltip(target, text, config = {}) {
        return new Tooltip(this.scene, target, text, config);
    }

    /**
     * Creates a dropdown menu
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {array} options - Dropdown options
     * @param {object} config - Dropdown configuration
     * @returns {Dropdown} - Dropdown instance
     */
    createDropdown(x, y, options, config = {}) {
        return new Dropdown(this.scene, x, y, options, config);
    }

    /**
     * Creates a text input field
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Input field width
     * @param {number} height - Input field height
     * @param {object} config - Input field configuration
     * @returns {InputField} - Input field instance
     */
    createInputField(x, y, width, height, config = {}) {
        return new InputField(this.scene, x, y, width, height, config);
    }
}

/**
 * Button component with various states (normal, hover, pressed, disabled)
 */
class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, config = {}) {
        super(scene, x, y);
        scene.add.existing(this);

        // Default configuration
        this.config = Object.assign({
            width: 200,
            height: 50,
            backgroundColor: 0x4a6fe3,
            backgroundColorHover: 0x7a9bff,
            backgroundColorPressed: 0x2a4fc3,
            backgroundColorDisabled: 0x9ea8c7,
            textColor: '#ffffff',
            textColorDisabled: '#cccccc',
            fontSize: 16,
            fontFamily: 'Arial',
            padding: 10,
            cornerRadius: 8,
            shadowColor: 0x000000,
            shadowBlur: 6,
            shadowOffsetX: 0,
            shadowOffsetY: 3,
            shadowAlpha: 0.3,
            enabled: true,
            fixedWidth: true,
            align: 'center'
        }, config);

        this.isPressed = false;
        this.isHovered = false;
        this.isDisabled = !this.config.enabled;

        // Create button background
        this.background = scene.add.graphics();
        this.add(this.background);

        // Create button text
        this.buttonText = scene.add.text(0, 0, text, {
            fontSize: this.config.fontSize,
            fontFamily: this.config.fontFamily,
            color: this.config.textColor,
            align: this.config.align
        });
        this.buttonText.setOrigin(0.5);
        this.add(this.buttonText);

        // Set interactive area
        this.setSize(this.config.width, this.config.height);
        this.setInteractive({ useHandCursor: true });

        // Add event listeners
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointerup', this.onPointerUp, this);

        // Initialize state
        this.updateButtonAppearance();
    }

    /**
     * Handle pointer over event
     */
    onPointerOver() {
        if (this.isDisabled) return;
        this.isHovered = true;
        this.updateButtonAppearance();

        // Emit hover event
        this.emit('hover', this);
    }

    /**
     * Handle pointer out event
     */
    onPointerOut() {
        if (this.isDisabled) return;
        this.isHovered = false;
        this.isPressed = false;
        this.updateButtonAppearance();

        // Emit hoverend event
        this.emit('hoverend', this);
    }

    /**
     * Handle pointer down event
     */
    onPointerDown() {
        if (this.isDisabled) return;
        this.isPressed = true;
        this.updateButtonAppearance();

        // Emit press event
        this.emit('press', this);
    }

    /**
     * Handle pointer up event
     */
    onPointerUp() {
        if (this.isDisabled) return;
        if (this.isPressed) {
            this.isPressed = false;
            this.updateButtonAppearance();

            // Emit click event
            this.emit('click', this);
        }
    }

    /**
     * Update button appearance based on current state
     */
    updateButtonAppearance() {
        this.background.clear();

        // Determine background color based on state
        let bgColor;
        let textColor;

        if (this.isDisabled) {
            bgColor = this.config.backgroundColorDisabled;
            textColor = this.config.textColorDisabled;
        } else if (this.isPressed) {
            bgColor = this.config.backgroundColorPressed;
            textColor = this.config.textColor;
        } else if (this.isHovered) {
            bgColor = this.config.backgroundColorHover;
            textColor = this.config.textColor;
        } else {
            bgColor = this.config.backgroundColor;
            textColor = this.config.textColor;
        }

        // Draw shadow (if not disabled)
        if (!this.isDisabled && this.config.shadowBlur > 0) {
            this.background.fillStyle(this.config.shadowColor, this.config.shadowAlpha);
            this.background.fillRoundedRect(
                this.config.shadowOffsetX,
                this.config.shadowOffsetY,
                this.config.width,
                this.config.height,
                this.config.cornerRadius
            );
        }

        // Draw background
        this.background.fillStyle(bgColor, 1);
        this.background.fillRoundedRect(
            0,
            0,
            this.config.width,
            this.config.height,
            this.config.cornerRadius
        );

        // Center the button background
        this.background.x = -this.config.width / 2;
        this.background.y = -this.config.height / 2;

        // Update text color
        this.buttonText.setColor(textColor);
    }

    /**
     * Set button text
     * @param {string} text - New button text
     */
    setText(text) {
        this.buttonText.setText(text);
        return this;
    }

    /**
     * Enable the button
     */
    enable() {
        this.isDisabled = false;
        this.setInteractive({ useHandCursor: true });
        this.updateButtonAppearance();
        return this;
    }

    /**
     * Disable the button
     */
    disable() {
        this.isDisabled = true;
        this.disableInteractive();
        this.updateButtonAppearance();
        return this;
    }
}

/**
 * Enhanced text component with additional styling options
 */
class UIText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style = {}) {
        // Default style
        const defaultStyle = {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'left',
            wordWrap: { width: 0, useAdvancedWrap: true }
        };

        // Merge default with provided style
        const mergedStyle = Object.assign({}, defaultStyle, style);

        super(scene, x, y, text, mergedStyle);
        scene.add.existing(this);

        this.padding = {
            left: style.paddingLeft || 0,
            right: style.paddingRight || 0,
            top: style.paddingTop || 0,
            bottom: style.paddingBottom || 0
        };

        // Apply padding
        this.setPadding(
            this.padding.left,
            this.padding.top,
            this.padding.right,
            this.padding.bottom
        );

        // Apply shadow if specified
        if (style.shadow) {
            this.setShadow(
                style.shadow.offsetX || 1,
                style.shadow.offsetY || 1,
                style.shadow.color || '#000000',
                style.shadow.blur || 1,
                style.shadow.stroke || false,
                style.shadow.fill || true
            );
        }
    }

    /**
     * Set text with a typewriter effect
     * @param {string} text - Text to display
     * @param {number} speed - Speed of the typewriter effect (ms per character)
     * @param {function} callback - Function to call when finished
     */
    typewrite(text, speed = 50, callback = null) {
        const originalText = text;
        let currentText = '';
        let currentIndex = 0;

        // Clear any existing timer
        if (this.typewriterTimer) {
            this.scene.time.removeEvent(this.typewriterTimer);
        }

        // Set text to empty
        this.setText('');

        // Create timer event
        this.typewriterTimer = this.scene.time.addEvent({
            delay: speed,
            callback: () => {
                currentText += originalText[currentIndex];
                this.setText(currentText);
                currentIndex++;

                if (currentIndex >= originalText.length) {
                    this.typewriterTimer.remove();
                    if (callback) callback();
                }
            },
            callbackScope: this,
            loop: true
        });

        return this;
    }
}

/**
 * Container component for organizing UI elements
 */
class UIContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, config = {}) {
        super(scene, x, y);
        scene.add.existing(this);

        this.width = width;
        this.height = height;

        // Default configuration
        this.config = Object.assign({
            backgroundColor: null,
            backgroundAlpha: 1,
            borderColor: null,
            borderThickness: 2,
            borderAlpha: 1,
            cornerRadius: 0,
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
            draggable: false,
            clipContent: false
        }, config);

        // Create background
        this.background = scene.add.graphics();
        this.add(this.background);

        // Draw background and border
        this.redraw();

        // Make container draggable if specified
        if (this.config.draggable) {
            this.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
            scene.input.setDraggable(this);

            // Handle drag events
            this.on('dragstart', this.onDragStart, this);
            this.on('drag', this.onDrag, this);
            this.on('dragend', this.onDragEnd, this);
        }

        // Enable clipping if specified
        if (this.config.clipContent) {
            this.mask = new Phaser.Display.Masks.GeometryMask(scene, scene.add.graphics({
                x: x - width / 2,
                y: y - height / 2
            }).fillRect(0, 0, width, height));
        }
    }

    /**
     * Redraw the container background and border
     */
    redraw() {
        this.background.clear();

        // Draw background if color is specified
        if (this.config.backgroundColor !== null) {
            this.background.fillStyle(this.config.backgroundColor, this.config.backgroundAlpha);
            if (this.config.cornerRadius > 0) {
                this.background.fillRoundedRect(
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height,
                    this.config.cornerRadius
                );
            } else {
                this.background.fillRect(
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height
                );
            }
        }

        // Draw border if color is specified
        if (this.config.borderColor !== null) {
            this.background.lineStyle(
                this.config.borderThickness,
                this.config.borderColor,
                this.config.borderAlpha
            );

            if (this.config.cornerRadius > 0) {
                this.background.strokeRoundedRect(
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height,
                    this.config.cornerRadius
                );
            } else {
                this.background.strokeRect(
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height
                );
            }
        }

        return this;
    }

    /**
     * Handle drag start event
     * @param {object} pointer - Pointer object
     */
    onDragStart(pointer) {
        this.emit('dragstart', pointer, this);
    }

    /**
     * Handle drag event
     * @param {object} pointer - Pointer object
     * @param {number} dragX - Drag X position
     * @param {number} dragY - Drag Y position
     */
    onDrag(pointer, dragX, dragY) {
        this.x = dragX;
        this.y = dragY;
        this.emit('drag', pointer, dragX, dragY, this);
    }

    /**
     * Handle drag end event
     * @param {object} pointer - Pointer object
     */
    onDragEnd(pointer) {
        this.emit('dragend', pointer, this);
    }

    /**
     * Set the background color
     * @param {number} color - Background color
     * @param {number} alpha - Background alpha
     */
    setBackgroundColor(color, alpha = 1) {
        this.config.backgroundColor = color;
        this.config.backgroundAlpha = alpha;
        this.redraw();
        return this;
    }

    /**
     * Set the border
     * @param {number} thickness - Border thickness
     * @param {number} color - Border color
     * @param {number} alpha - Border alpha
     */
    setBorder(thickness, color, alpha = 1) {
        this.config.borderThickness = thickness;
        this.config.borderColor = color;
        this.config.borderAlpha = alpha;
        this.redraw();
        return this;
    }

    /**
     * Resize the container
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        this.width = width;
        this.height = height;

        // Update mask if clipping is enabled
        if (this.config.clipContent) {
            this.mask.geometryMask.clear();
            this.mask.geometryMask.fillRect(
                this.x - width / 2,
                this.y - height / 2,
                width,
                height
            );
        }

        this.redraw();
        return this;
    }
}

/**
 * Grid layout system for organizing UI elements in rows and columns
 */
class Grid extends UIContainer {
    constructor(scene, x, y, width, height, config = {}) {
        super(scene, x, y, width, height, config);

        // Grid-specific configuration
        this.gridConfig = Object.assign({
            rows: 1,
            columns: 1,
            cellWidth: width / (config.columns || 1),
            cellHeight: height / (config.rows || 1),
            cellPadding: {
                x: 5,
                y: 5
            },
            cellAlignment: {
                horizontal: 'center', // 'left', 'center', 'right'
                vertical: 'middle'    // 'top', 'middle', 'bottom'
            }
        }, config);

        // Calculate actual cell dimensions
        this.calculateCellDimensions();

        // Create cells grid
        this.cells = [];
        for (let row = 0; row < this.gridConfig.rows; row++) {
            this.cells[row] = [];
            for (let col = 0; col < this.gridConfig.columns; col++) {
                this.cells[row][col] = {
                    content: null,
                    position: this.getCellPosition(row, col)
                };
            }
        }
    }

    /**
     * Calculate cell dimensions based on container size and grid configuration
     */
    calculateCellDimensions() {
        // Calculate available space for cells
        const availableWidth = this.width -
            this.config.padding.left -
            this.config.padding.right;

        const availableHeight = this.height -
            this.config.padding.top -
            this.config.padding.bottom;

        // Calculate cell dimensions
        this.gridConfig.cellWidth = availableWidth / this.gridConfig.columns;
        this.gridConfig.cellHeight = availableHeight / this.gridConfig.rows;
    }

    /**
     * Get cell position based on row and column
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {object} - Cell position (x, y)
     */
    getCellPosition(row, col) {
        // Calculate cell center position
        const cellX = -this.width / 2 +
            this.config.padding.left +
            (col + 0.5) * this.gridConfig.cellWidth;

        const cellY = -this.height / 2 +
            this.config.padding.top +
            (row + 0.5) * this.gridConfig.cellHeight;

        return { x: cellX, y: cellY };
    }

    /**
     * Add content to a specific cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {object} gameObject - Game object to add
     * @param {object} align - Cell alignment override
     */
    addToCell(row, col, gameObject, align = null) {
        // Check if cell exists
        if (row < 0 || row >= this.gridConfig.rows ||
            col < 0 || col >= this.gridConfig.columns) {
            console.warn('Cell position out of bounds:', row, col);
            return this;
        }

        // Remove existing content from the cell
        if (this.cells[row][col].content) {
            this.remove(this.cells[row][col].content);
        }

        // Add new content
        this.add(gameObject);
        this.cells[row][col].content = gameObject;

        // Position the game object
        const position = this.cells[row][col].position;
        gameObject.x = position.x;
        gameObject.y = position.y;

        return this;
    }

    /**
     * Remove content from a specific cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    removeFromCell(row, col) {
        // Check if cell exists
        if (row < 0 || row >= this.gridConfig.rows ||
            col < 0 || col >= this.gridConfig.columns) {
            console.warn('Cell position out of bounds:', row, col);
            return this;
        }

        // Remove content from the cell
        if (this.cells[row][col].content) {
            this.remove(this.cells[row][col].content);
            this.cells[row][col].content = null;
        }

        return this;
    }

    /**
     * Clear all cells
     */
    clearCells() {
        for (let row = 0; row < this.gridConfig.rows; row++) {
            for (let col = 0; col < this.gridConfig.columns; col++) {
                this.removeFromCell(row, col);
            }
        }

        return this;
    }

    /**
     * Resize the grid
     * @param {number} width - New width
     * @param {number} height - New height
     * @param {boolean} repositionContent - Whether to reposition cell content
     */
    resize(width, height, repositionContent = true) {
        // Call parent resize
        super.resize(width, height);

        // Recalculate cell dimensions
        this.calculateCellDimensions();

        // Reposition cell content if needed
        if (repositionContent) {
            for (let row = 0; row < this.gridConfig.rows; row++) {
                for (let col = 0; col < this.gridConfig.columns; col++) {
                    const cell = this.cells[row][col];
                    const position = this.getCellPosition(row, col);

                    // Update cell position
                    cell.position = position;

                    // Update content position if exists
                    if (cell.content) {
                        cell.content.x = position.x;
                        cell.content.y = position.y;
                    }
                }
            }
        }

        return this;
    }
}

/**
 * Scrollbar component
 */
class Scrollbar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, orientation = 'vertical', config = {}) {
        super(scene, x, y);
        scene.add.existing(this);

        this.width = width;
        this.height = height;
        this.orientation = orientation; // 'vertical' or 'horizontal'

        // Default configuration
        this.config = Object.assign({
            trackColor: 0x888888,
            trackAlpha: 0.5,
            thumbColor: 0xaaaaaa,
            thumbAlpha: 1,
            thumbCornerRadius: 4,
            thumbMinSize: 20,
            wheelEnabled: true,
            wheelSpeed: 0.1,
            trackCornerRadius: 4
        }, config);

        // Create track
        this.track = scene.add.graphics();
        this.add(this.track);

        // Create thumb
        this.thumb = scene.add.graphics();
        this.add(this.thumb);

        // Set thumb size (default 20% of track)
        this.thumbSize = Math.max(
            this.config.thumbMinSize,
            this.orientation === 'vertical' ? this.height * 0.2 : this.width * 0.2
        );

        // Interaction properties
        this.isDragging = false;
        this.dragStartPosition = 0;
        this.thumbStartPosition = 0;
        this.value = 0; // 0-1 representing scroll position

        // Draw track and thumb
        this.redraw();

        // Setup interaction
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

        // Setup thumb drag events
        this.thumb.on('dragstart', this.onThumbDragStart, this);
        this.thumb.on('drag', this.onThumbDrag, this);
        this.thumb.on('dragend', this.onThumbDragEnd, this);

        // Setup track click event
        this.track.setInteractive(
            new Phaser.Geom.Rectangle(
                -width / 2,
                -height / 2,
                width,
                height
            ),
            Phaser.Geom.Rectangle.Contains
        );

        this.track.on('pointerdown', this.onTrackClick, this);

        // Setup wheel event if enabled
        if (this.config.wheelEnabled) {
            scene.input.on('wheel', this.onWheel, this);
        }
    }

    /**
     * Redraw track and thumb
     */
    redraw() {
        // Clear graphics
        this.track.clear();
        this.thumb.clear();

        // Draw track
        this.track.fillStyle(this.config.trackColor, this.config.trackAlpha);
        if (this.config.trackCornerRadius > 0) {
            this.track.fillRoundedRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height,
                this.config.trackCornerRadius
            );
        } else {
            this.track.fillRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        }

        // Draw thumb
        this.thumb.fillStyle(this.config.thumbColor, this.config.thumbAlpha);

        // Position thumb based on orientation and value
        if (this.orientation === 'vertical') {
            const thumbY = -this.height / 2 + this.value * (this.height - this.thumbSize);

            if (this.config.thumbCornerRadius > 0) {
                this.thumb.fillRoundedRect(
                    -this.width / 2,
                    thumbY,
                    this.width,
                    this.thumbSize,
                    this.config.thumbCornerRadius
                );
            } else {
                this.thumb.fillRect(
                    -this.width / 2,
                    thumbY,
                    this.width,
                    this.thumbSize
                );
            }
        } else {
            const thumbX = -this.width / 2 + this.value * (this.width - this.thumbSize);

            if (this.config.thumbCornerRadius > 0) {
                this.thumb.fillRoundedRect(
                    thumbX,
                    -this.height / 2,
                    this.thumbSize,
                    this.height,
                    this.config.thumbCornerRadius
                );
            } else {
                this.thumb.fillRect(
                    thumbX,
                    -this.height / 2,
                    this.thumbSize,
                    this.height
                );
            }
        }
    }

    /**
     * Handle thumb drag start
     * @param {object} pointer - Pointer object
     */
    onThumbDragStart(pointer) {
        this.isDragging = true;

        if (this.orientation === 'vertical') {
            this.dragStartPosition = pointer.y;
            this.thumbStartPosition = this.value * (this.height - this.thumbSize);
        } else {
            this.dragStartPosition = pointer.x;
            this.thumbStartPosition = this.value * (this.width - this.thumbSize);
        }
    }

    /**
 * Handle thumb drag
 * @param {object} pointer - Pointer object
 */
    onThumbDrag(pointer) {
        if (!this.isDragging) return;

        let delta;
        let maxTravel;

        if (this.orientation === 'vertical') {
            delta = pointer.y - this.dragStartPosition;
            maxTravel = this.height - this.thumbSize;
        } else {
            delta = pointer.x - this.dragStartPosition;
            maxTravel = this.width - this.thumbSize;
        }

        // Calculate new thumb position
        const newPosition = Phaser.Math.Clamp(
            this.thumbStartPosition + delta,
            0,
            maxTravel
        );

        // Update value
        this.value = newPosition / maxTravel;

        // Redraw
        this.redraw();

        // Emit change event
        this.emit('change', this.value);
    }

    /**
     * Handle thumb drag end
     */
    onThumbDragEnd() {
        this.isDragging = false;
    }

    /**
     * Handle track click
     * @param {object} pointer - Pointer object
     */
    onTrackClick(pointer) {
        let clickPosition;
        let trackSize;

        if (this.orientation === 'vertical') {
            clickPosition = pointer.y - (this.y - this.height / 2);
            trackSize = this.height;
        } else {
            clickPosition = pointer.x - (this.x - this.width / 2);
            trackSize = this.width;
        }

        // Calculate new value
        this.value = Phaser.Math.Clamp(
            clickPosition / trackSize,
            0,
            1
        );

        // Redraw
        this.redraw();

        // Emit change event
        this.emit('change', this.value);
    }

    /**
     * Handle mouse wheel
     * @param {object} pointer - Pointer object
     * @param {object} gameObjects - Game objects
     * @param {number} deltaX - Delta X
     * @param {number} deltaY - Delta Y
     */
    onWheel(pointer, gameObjects, deltaX, deltaY) {
        // Only process wheel events when pointer is over relevant area
        const bounds = new Phaser.Geom.Rectangle(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );

        if (!bounds.contains(pointer.x, pointer.y)) return;

        // Calculate delta based on orientation
        const delta = this.orientation === 'vertical' ? deltaY : deltaX;

        // Update value
        this.value = Phaser.Math.Clamp(
            this.value + delta * this.config.wheelSpeed,
            0,
            1
        );

        // Redraw
        this.redraw();

        // Emit change event
        this.emit('change', this.value);
    }

    /**
     * Set scrollbar value
     * @param {number} value - Value (0-1)
     */
    setValue(value) {
        this.value = Phaser.Math.Clamp(value, 0, 1);
        this.redraw();
        return this;
    }
}

/**
 * Scrollable container component
 */
class ScrollableContainer extends UIContainer {
    constructor(scene, x, y, width, height, config = {}) {
        super(scene, x, y, width, height, config);

        // Default configuration
        this.scrollConfig = Object.assign({
            scrollDirection: 'vertical', // 'vertical', 'horizontal', 'both'
            scrollbarThickness: 10,
            scrollbarPadding: 2,
            showScrollbarX: true,
            showScrollbarY: true,
            scrollbarTrackColor: 0x888888,
            scrollbarThumbColor: 0xaaaaaa,
            contentWidth: width,
            contentHeight: height,
            wheelSpeed: 0.1,
            maskContent: true,
            autoContentSize: true
        }, config);

        // Create content container
        this.contentContainer = new Phaser.GameObjects.Container(scene, 0, 0);
        super.add(this.contentContainer);

        // Create scrollbars if needed
        if (this.scrollConfig.scrollDirection === 'vertical' ||
            this.scrollConfig.scrollDirection === 'both') {
            // Create vertical scrollbar
            this.vScrollbar = new Scrollbar(
                scene,
                this.width / 2 - this.scrollConfig.scrollbarThickness / 2 - this.scrollConfig.scrollbarPadding,
                0,
                this.scrollConfig.scrollbarThickness,
                this.height - (this.scrollConfig.scrollDirection === 'both' ?
                    this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0),
                'vertical',
                {
                    trackColor: this.scrollConfig.scrollbarTrackColor,
                    thumbColor: this.scrollConfig.scrollbarThumbColor,
                    wheelEnabled: true,
                    wheelSpeed: this.scrollConfig.wheelSpeed
                }
            );

            this.vScrollbar.visible = this.scrollConfig.showScrollbarY;
            this.vScrollbar.on('change', this.onVerticalScroll, this);
            super.add(this.vScrollbar);
        }

        if (this.scrollConfig.scrollDirection === 'horizontal' ||
            this.scrollConfig.scrollDirection === 'both') {
            // Create horizontal scrollbar
            this.hScrollbar = new Scrollbar(
                scene,
                0,
                this.height / 2 - this.scrollConfig.scrollbarThickness / 2 - this.scrollConfig.scrollbarPadding,
                this.width - (this.scrollConfig.scrollDirection === 'both' ?
                    this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0),
                this.scrollConfig.scrollbarThickness,
                'horizontal',
                {
                    trackColor: this.scrollConfig.scrollbarTrackColor,
                    thumbColor: this.scrollConfig.scrollbarThumbColor,
                    wheelEnabled: true,
                    wheelSpeed: this.scrollConfig.wheelSpeed
                }
            );

            this.hScrollbar.visible = this.scrollConfig.showScrollbarX;
            this.hScrollbar.on('change', this.onHorizontalScroll, this);
            super.add(this.hScrollbar);
        }

        // Create mask for content if needed
        if (this.scrollConfig.maskContent) {
            this.contentMask = scene.add.graphics();
            this.contentMask.fillStyle(0xffffff);
            this.contentMask.fillRect(
                -this.width / 2 + this.config.padding.left,
                -this.height / 2 + this.config.padding.top,
                this.width - this.config.padding.left - this.config.padding.right -
                (this.vScrollbar ? this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0),
                this.height - this.config.padding.top - this.config.padding.bottom -
                (this.hScrollbar ? this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0)
            );

            this.contentContainer.setMask(new Phaser.Display.Masks.GeometryMask(scene, this.contentMask));
        }

        // Set content size
        this.contentSize = {
            width: this.scrollConfig.contentWidth,
            height: this.scrollConfig.contentHeight
        };

        // Initialize content position
        this.contentContainer.x = -this.width / 2 + this.config.padding.left;
        this.contentContainer.y = -this.height / 2 + this.config.padding.top;
    }

    /**
     * Add game object to content container
     * @param {object} gameObject - Game object to add
     */
    add(gameObject) {
        this.contentContainer.add(gameObject);

        // Auto-calculate content size if needed
        if (this.scrollConfig.autoContentSize) {
            this.calculateContentSize();
        }

        return this;
    }

    /**
     * Remove game object from content container
     * @param {object} gameObject - Game object to remove
     * @param {boolean} destroyChild - Whether to destroy child
     */
    remove(gameObject, destroyChild = false) {
        this.contentContainer.remove(gameObject, destroyChild);

        // Auto-calculate content size if needed
        if (this.scrollConfig.autoContentSize) {
            this.calculateContentSize();
        }

        return this;
    }

    /**
     * Calculate content size based on children
     */
    calculateContentSize() {
        if (this.contentContainer.list.length === 0) return;

        // Get bounds of all children
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        this.contentContainer.list.forEach(child => {
            if (!child.getBounds) return;

            const bounds = child.getBounds();
            minX = Math.min(minX, bounds.left - this.contentContainer.x);
            minY = Math.min(minY, bounds.top - this.contentContainer.y);
            maxX = Math.max(maxX, bounds.right - this.contentContainer.x);
            maxY = Math.max(maxY, bounds.bottom - this.contentContainer.y);
        });

        // Set content size
        if (minX !== Infinity && maxX !== -Infinity) {
            this.contentSize.width = maxX - minX + this.config.padding.left + this.config.padding.right;
        }

        if (minY !== Infinity && maxY !== -Infinity) {
            this.contentSize.height = maxY - minY + this.config.padding.top + this.config.padding.bottom;
        }

        // Update scrollbars visibility based on content size
        this.updateScrollbarsVisibility();
    }

    /**
     * Update scrollbars visibility based on content size
     */
    updateScrollbarsVisibility() {
        // Get visible area size
        const visibleWidth = this.width - this.config.padding.left - this.config.padding.right -
            (this.vScrollbar && this.vScrollbar.visible ? this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0);

        const visibleHeight = this.height - this.config.padding.top - this.config.padding.bottom -
            (this.hScrollbar && this.hScrollbar.visible ? this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0);

        // Update vertical scrollbar visibility
        if (this.vScrollbar) {
            const showVertical = this.contentSize.height > visibleHeight;

            if (this.vScrollbar.visible !== showVertical && this.scrollConfig.showScrollbarY) {
                this.vScrollbar.visible = showVertical;

                // Update mask if needed
                if (this.scrollConfig.maskContent) {
                    this.updateContentMask();
                }
            }
        }

        // Update horizontal scrollbar visibility
        if (this.hScrollbar) {
            const showHorizontal = this.contentSize.width > visibleWidth;

            if (this.hScrollbar.visible !== showHorizontal && this.scrollConfig.showScrollbarX) {
                this.hScrollbar.visible = showHorizontal;

                // Update mask if needed
                if (this.scrollConfig.maskContent) {
                    this.updateContentMask();
                }
            }
        }
    }

    /**
     * Update content mask based on scrollbars visibility
     */
    updateContentMask() {
        if (!this.contentMask) return;

        this.contentMask.clear();
        this.contentMask.fillStyle(0xffffff);
        this.contentMask.fillRect(
            -this.width / 2 + this.config.padding.left,
            -this.height / 2 + this.config.padding.top,
            this.width - this.config.padding.left - this.config.padding.right -
            (this.vScrollbar && this.vScrollbar.visible ? this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0),
            this.height - this.config.padding.top - this.config.padding.bottom -
            (this.hScrollbar && this.hScrollbar.visible ? this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0)
        );
    }

    /**
     * Handle vertical scrolling
     * @param {number} value - Scroll value (0-1)
     */
    onVerticalScroll(value) {
        // Get visible area height
        const visibleHeight = this.height - this.config.padding.top - this.config.padding.bottom -
            (this.hScrollbar && this.hScrollbar.visible ? this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0);

        // Calculate vertical scroll range
        const scrollRange = Math.max(0, this.contentSize.height - visibleHeight);

        // Update content position
        this.contentContainer.y = -this.height / 2 + this.config.padding.top - (scrollRange * value);

        // Emit scroll event
        this.emit('scroll', { x: this.hScrollbar ? this.hScrollbar.value : 0, y: value });
    }

    /**
     * Handle horizontal scrolling
     * @param {number} value - Scroll value (0-1)
     */
    onHorizontalScroll(value) {
        // Get visible area width
        const visibleWidth = this.width - this.config.padding.left - this.config.padding.right -
            (this.vScrollbar && this.vScrollbar.visible ? this.scrollConfig.scrollbarThickness + this.scrollConfig.scrollbarPadding * 2 : 0);

        // Calculate horizontal scroll range
        const scrollRange = Math.max(0, this.contentSize.width - visibleWidth);

        // Update content position
        this.contentContainer.x = -this.width / 2 + this.config.padding.left - (scrollRange * value);

        // Emit scroll event
        this.emit('scroll', { x: value, y: this.vScrollbar ? this.vScrollbar.value : 0 });
    }

    /**
     * Set content size
     * @param {number} width - Content width
     * @param {number} height - Content height
     */
    setContentSize(width, height) {
        this.contentSize.width = width;
        this.contentSize.height = height;

        // Update scrollbars visibility
        this.updateScrollbarsVisibility();

        return this;
    }

    /**
     * Scroll to specific position
     * @param {number} x - Horizontal scroll position (0-1)
     * @param {number} y - Vertical scroll position (0-1)
     */
    scrollTo(x = null, y = null) {
        // Update horizontal scrollbar if needed
        if (x !== null && this.hScrollbar) {
            this.hScrollbar.setValue(x);
            this.onHorizontalScroll(x);
        }

        // Update vertical scrollbar if needed
        if (y !== null && this.vScrollbar) {
            this.vScrollbar.setValue(y);
            this.onVerticalScroll(y);
        }

        return this;
    }

    /**
     * Scroll to top
     */
    scrollToTop() {
        return this.scrollTo(null, 0);
    }

    /**
     * Scroll to bottom
     */
    scrollToBottom() {
        return this.scrollTo(null, 1);
    }

    /**
     * Scroll to left
     */
    scrollToLeft() {
        return this.scrollTo(0, null);
    }

    /**
     * Scroll to right
     */
    scrollToRight() {
        return this.scrollTo(1, null);
    }
}

/**
 * Panel component with header, body, and footer
 */
class Panel extends UIContainer {
    constructor(scene, x, y, width, height, config = {}) {
        super(scene, x, y, width, height, config);

        // Default configuration
        this.panelConfig = Object.assign({
            header: {
                height: 40,
                backgroundColor: 0x4a6fe3,
                textColor: '#ffffff',
                fontSize: 18,
                fontFamily: 'Arial',
                padding: 10,
                text: '',
                draggable: false
            },
            body: {
                backgroundColor: 0xf0f0f0,
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            footer: {
                height: 40,
                backgroundColor: 0xe0e0e0,
                visible: false,
                padding: 10
            },
            closeButton: {
                visible: false,
                size: 20,
                color: '#ffffff',
                hoverColor: '#ff0000'
            },
            resizable: false,
            minWidth: 100,
            minHeight: 100
        }, config);

        // Calculate content areas
        this.calculateAreas();

        // Create header if specified
        if (this.panelConfig.header.text || this.panelConfig.header.height > 0) {
            this.createHeader();
        }

        // Create body
        this.createBody();

        // Create footer if visible
        if (this.panelConfig.footer.visible) {
            this.createFooter();
        }

        // Make panel draggable if specified
        if (this.panelConfig.header.draggable) {
            this.header.setInteractive({ useHandCursor: true });
            scene.input.setDraggable(this.header);

            this.header.on('dragstart', this.onHeaderDragStart, this);
            this.header.on('drag', this.onHeaderDrag, this);
            this.header.on('dragend', this.onHeaderDragEnd, this);
        }

        // Make panel resizable if specified
        if (this.panelConfig.resizable) {
            this.createResizeHandle();
        }
    }

    /**
     * Calculate panel areas based on configuration
     */
    calculateAreas() {
        // Calculate header height
        this.headerHeight = this.panelConfig.header.text || this.panelConfig.header.height > 0 ?
            this.panelConfig.header.height : 0;

        // Calculate footer height
        this.footerHeight = this.panelConfig.footer.visible ?
            this.panelConfig.footer.height : 0;

        // Calculate body height
        this.bodyHeight = this.height - this.headerHeight - this.footerHeight;
    }

    /**
     * Create panel header
     */
    createHeader() {
        // Create header container
        this.header = new UIContainer(
            this.scene,
            0,
            -this.height / 2 + this.headerHeight / 2,
            this.width,
            this.headerHeight,
            {
                backgroundColor: this.panelConfig.header.backgroundColor,
                cornerRadius: this.config.cornerRadius > 0 ?
                    { tl: this.config.cornerRadius, tr: this.config.cornerRadius, bl: 0, br: 0 } : 0,
                padding: {
                    left: this.panelConfig.header.padding,
                    right: this.panelConfig.header.padding,
                    top: 0,
                    bottom: 0
                }
            }
        );

        super.add(this.header);

        // Create header text if specified
        if (this.panelConfig.header.text) {
            this.headerText = new UIText(
                this.scene,
                0,
                0,
                this.panelConfig.header.text,
                {
                    fontSize: this.panelConfig.header.fontSize,
                    fontFamily: this.panelConfig.header.fontFamily,
                    color: this.panelConfig.header.textColor,
                    align: 'center'
                }
            );

            this.headerText.setOrigin(0.5);
            this.header.add(this.headerText);
        }

        // Create close button if specified
        if (this.panelConfig.closeButton.visible) {
            this.createCloseButton();
        }
    }

    /**
     * Create close button
     */
    createCloseButton() {
        const size = this.panelConfig.closeButton.size;
        const halfSize = size / 2;

        // Create close button container
        this.closeButton = new Phaser.GameObjects.Container(
            this.scene,
            this.width / 2 - halfSize - this.panelConfig.header.padding,
            0
        );

        this.header.add(this.closeButton);

        // Create close button graphics
        this.closeButtonGraphics = this.scene.add.graphics();
        this.closeButton.add(this.closeButtonGraphics);

        // Draw close button
        this.closeButtonGraphics.lineStyle(2, 0xffffff);
        this.closeButtonGraphics.beginPath();
        this.closeButtonGraphics.moveTo(-halfSize, -halfSize);
        this.closeButtonGraphics.lineTo(halfSize, halfSize);
        this.closeButtonGraphics.moveTo(halfSize, -halfSize);
        this.closeButtonGraphics.lineTo(-halfSize, halfSize);
        this.closeButtonGraphics.strokePath();

        // Make close button interactive
        this.closeButton.setSize(size, size);
        this.closeButton.setInteractive({ useHandCursor: true });

        // Add event listeners
        this.closeButton.on('pointerover', () => {
            this.closeButtonGraphics.clear();
            this.closeButtonGraphics.lineStyle(2, this.panelConfig.closeButton.hoverColor);
            this.closeButtonGraphics.beginPath();
            this.closeButtonGraphics.moveTo(-halfSize, -halfSize);
            this.closeButtonGraphics.lineTo(halfSize, halfSize);
            this.closeButtonGraphics.moveTo(halfSize, -halfSize);
            this.closeButtonGraphics.lineTo(-halfSize, halfSize);
            this.closeButtonGraphics.strokePath();
        });

        this.closeButton.on('pointerout', () => {
            this.closeButtonGraphics.clear();
            this.closeButtonGraphics.lineStyle(2, this.panelConfig.closeButton.color);
            this.closeButtonGraphics.beginPath();
            this.closeButtonGraphics.moveTo(-halfSize, -halfSize);
            this.closeButtonGraphics.lineTo(halfSize, halfSize);
            this.closeButtonGraphics.moveTo(halfSize, -halfSize);
            this.closeButtonGraphics.lineTo(-halfSize, halfSize);
            this.closeButtonGraphics.strokePath();
        });

        this.closeButton.on('pointerdown', () => {
            this.emit('close');
        });
    }

    /**
     * Create panel body
     */
    createBody() {
        // Calculate body Y position
        const bodyY = -this.height / 2 + this.headerHeight + this.bodyHeight / 2;

        // Create body container
        this.body = new ScrollableContainer(
            this.scene,
            0,
            bodyY,
            this.width,
            this.bodyHeight,
            {
                backgroundColor: this.panelConfig.body.backgroundColor,
                cornerRadius: this.config.cornerRadius > 0 && this.headerHeight === 0 && this.footerHeight === 0 ?
                    this.config.cornerRadius : 0,
                padding: this.panelConfig.body.padding,
                scrollDirection: 'vertical'
            }
        );

        super.add(this.body);
    }

    /**
     * Create panel footer
     */
    createFooter() {
        // Create footer container
        this.footer = new UIContainer(
            this.scene,
            0,
            this.height / 2 - this.footerHeight / 2,
            this.width,
            this.footerHeight,
            {
                backgroundColor: this.panelConfig.footer.backgroundColor,
                cornerRadius: this.config.cornerRadius > 0 ?
                    { tl: 0, tr: 0, bl: this.config.cornerRadius, br: this.config.cornerRadius } : 0,
                padding: {
                    left: this.panelConfig.footer.padding,
                    right: this.panelConfig.footer.padding,
                    top: 0,
                    bottom: 0
                }
            }
        );

        super.add(this.footer);
    }

    /**
     * Create resize handle
     */
    createResizeHandle() {
        // Create resize handle
        const handleSize = 20;
        this.resizeHandle = this.scene.add.graphics();
        this.resizeHandle.fillStyle(0x000000, 0.5);
        this.resizeHandle.beginPath();
        this.resizeHandle.moveTo(0, 0);
        this.resizeHandle.lineTo(handleSize, 0);
        this.resizeHandle.lineTo(0, handleSize);
        this.resizeHandle.closePath();
        this.resizeHandle.fillPath();

        this.resizeHandle.x = this.width / 2 - handleSize;
        this.resizeHandle.y = this.height / 2 - handleSize;

        super.add(this.resizeHandle);

        // Make resize handle interactive
        this.resizeHandle.setInteractive(
            new Phaser.Geom.Triangle(0, 0, handleSize, 0, 0, handleSize),
            Phaser.Geom.Triangle.Contains
        );

        this.scene.input.setDraggable(this.resizeHandle);

        // Handle resize events
        this.resizeHandle.on('dragstart', this.onResizeStart, this);
        this.resizeHandle.on('drag', this.onResize, this);
        this.resizeHandle.on('dragend', this.onResizeEnd, this);
    }

    /**
     * Handle header drag start
     * @param {object} pointer - Pointer object
     */
    onHeaderDragStart(pointer) {
        this.dragStartPosition = { x: this.x, y: this.y };
        this.emit('dragstart', pointer, this);
    }

    /**
     * Handle header drag
     * @param {object} pointer - Pointer object
     * @param {number} dragX - Drag X position
     * @param {number} dragY - Drag Y position
     */
    onHeaderDrag(pointer, dragX, dragY) {
        this.x = dragX;
        this.y = dragY;
        this.emit('drag', pointer, dragX, dragY, this);
    }

    /**
     * Handle header drag end
     * @param {object} pointer - Pointer object
     */
    onHeaderDragEnd(pointer) {
        this.emit('dragend', pointer, this);
    }

    /**
     * Handle resize start
     * @param {object} pointer - Pointer object
     */
    onResizeStart(pointer) {
        this.resizeStartSize = { width: this.width, height: this.height };
        this.resizeStartPosition = { x: pointer.x, y: pointer.y };
        this.emit('resizestart', pointer, this);
    }

    /**
     * Handle resize
     * @param {object} pointer - Pointer object
     */
    onResize(pointer) {
        // Calculate new dimensions
        const deltaX = pointer.x - this.resizeStartPosition.x;
        const deltaY = pointer.y - this.resizeStartPosition.y;

        const newWidth = Math.max(this.resizeStartSize.width + deltaX, this.panelConfig.minWidth);
        const newHeight = Math.max(this.resizeStartSize.height + deltaY, this.panelConfig.minHeight);

        // Resize panel
        this.resize(newWidth, newHeight);

        this.emit('resize', pointer, newWidth, newHeight, this);
    }

    /**
     * Handle resize end
     * @param {object} pointer - Pointer object
     */
    onResizeEnd(pointer) {
        this.emit('resizeend', pointer, this);
    }

    /**
     * Resize panel
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        // Call parent resize
        super.resize(width, height);

        // Recalculate areas
        this.calculateAreas();

        // Resize and reposition header
        if (this.header) {
            this.header.resize(width, this.headerHeight);
            this.header.y = -this.height / 2 + this.headerHeight / 2;

            // Reposition close button if exists
            if (this.closeButton) {
                this.closeButton.x = width / 2 - this.panelConfig.closeButton.size / 2 - this.panelConfig.header.padding;
            }
        }

        // Resize and reposition body
        if (this.body) {
            this.body.resize(width, this.bodyHeight);
            this.body.y = -this.height / 2 + this.headerHeight + this.bodyHeight / 2;
        }

        // Resize and reposition footer
        if (this.footer) {
            this.footer.resize(width, this.footerHeight);
            this.footer.y = this.height / 2 - this.footerHeight / 2;
        }

        // Reposition resize handle
        if (this.resizeHandle) {
            this.resizeHandle.x = width / 2 - 20;
            this.resizeHandle.y = height / 2 - 20;
        }

        return this;
    }

    /**
     * Add game object to body
     * @param {object} gameObject - Game object to add
     */
    add(gameObject) {
        this.body.add(gameObject);
        return this;
    }

    /**
     * Add game object to header
     * @param {object} gameObject - Game object to add
     */
    addToHeader(gameObject) {
        if (!this.header) return this;
        this.header.add(gameObject);
        return this;
    }

    /**
         * Add game object to footer
         * @param {object} gameObject - Game object to add
         */
    addToFooter(gameObject) {
        if (!this.footer) return this;
        this.footer.add(gameObject);
        return this;
    }

    /**
     * Set header text
     * @param {string} text - New header text
     */
    setHeaderText(text) {
        if (!this.headerText) return this;
        this.headerText.setText(text);
        return this;
    }

    /**
     * Show panel
     */
    show() {
        this.visible = true;
        this.emit('show');
        return this;
    }

    /**
     * Hide panel
     */
    hide() {
        this.visible = false;
        this.emit('hide');
        return this;
    }
}

/**
* Tooltip component that can be attached to any UI element
*/
class Tooltip extends Phaser.GameObjects.Container {
    constructor(scene, target, text, config = {}) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this.target = target;

        // Default configuration
        this.config = Object.assign({
            backgroundColor: 0x333333,
            textColor: '#ffffff',
            padding: 8,
            fontSize: 14,
            fontFamily: 'Arial',
            cornerRadius: 6,
            arrowSize: 10,
            position: 'top', // 'top', 'bottom', 'left', 'right'
            offset: 5,
            delay: 500, // ms before showing
            duration: 0, // 0 = show until mouse out
            followCursor: false
        }, config);

        // Create tooltip background
        this.background = scene.add.graphics();
        this.add(this.background);

        // Create tooltip text
        this.tooltipText = new UIText(
            scene,
            0,
            0,
            text,
            {
                fontSize: this.config.fontSize,
                fontFamily: this.config.fontFamily,
                color: this.config.textColor,
                align: 'center',
                wordWrap: { width: 200 }
            }
        );

        this.tooltipText.setOrigin(0.5);
        this.add(this.tooltipText);

        // Calculate tooltip dimensions
        this.width = this.tooltipText.width + this.config.padding * 2;
        this.height = this.tooltipText.height + this.config.padding * 2;

        // Draw tooltip background
        this.drawBackground();

        // Setup tooltip show/hide behavior
        this.setupTooltipEvents();

        // Hide tooltip initially
        this.visible = false;
    }

    /**
     * Draw tooltip background with arrow
     */
    drawBackground() {
        this.background.clear();
        this.background.fillStyle(this.config.backgroundColor, 1);

        // Draw tooltip background
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        // Determine arrow position based on tooltip position
        let arrowX = 0;
        let arrowY = 0;

        if (this.config.position === 'top') {
            arrowY = halfHeight;
        } else if (this.config.position === 'bottom') {
            arrowY = -halfHeight;
        } else if (this.config.position === 'left') {
            arrowX = halfWidth;
        } else if (this.config.position === 'right') {
            arrowX = -halfWidth;
        }

        // Draw rounded rectangle
        this.background.fillRoundedRect(
            -halfWidth,
            -halfHeight,
            this.width,
            this.height,
            this.config.cornerRadius
        );

        // Draw arrow
        if (this.config.arrowSize > 0) {
            this.background.beginPath();

            if (this.config.position === 'top') {
                this.background.moveTo(-this.config.arrowSize, halfHeight);
                this.background.lineTo(0, halfHeight + this.config.arrowSize);
                this.background.lineTo(this.config.arrowSize, halfHeight);
            } else if (this.config.position === 'bottom') {
                this.background.moveTo(-this.config.arrowSize, -halfHeight);
                this.background.lineTo(0, -halfHeight - this.config.arrowSize);
                this.background.lineTo(this.config.arrowSize, -halfHeight);
            } else if (this.config.position === 'left') {
                this.background.moveTo(halfWidth, -this.config.arrowSize);
                this.background.lineTo(halfWidth + this.config.arrowSize, 0);
                this.background.lineTo(halfWidth, this.config.arrowSize);
            } else if (this.config.position === 'right') {
                this.background.moveTo(-halfWidth, -this.config.arrowSize);
                this.background.lineTo(-halfWidth - this.config.arrowSize, 0);
                this.background.lineTo(-halfWidth, this.config.arrowSize);
            }

            this.background.closePath();
            this.background.fillPath();
        }
    }

    /**
     * Setup tooltip show/hide events
     */
    setupTooltipEvents() {
        // Make sure target is interactive
        if (!this.target.input) {
            this.target.setInteractive();
        }

        // Tooltip show delay timer
        this.showTimer = null;

        // Add event listeners to target
        this.target.on('pointerover', this.onTargetPointerOver, this);
        this.target.on('pointerout', this.onTargetPointerOut, this);

        // Add pointer move event if tooltip follows cursor
        if (this.config.followCursor) {
            this.target.on('pointermove', this.onTargetPointerMove, this);
        }
    }

    /**
     * Handle target pointer over event
     * @param {object} pointer - Pointer object
     */
    onTargetPointerOver(pointer) {
        // Clear any existing timer
        if (this.showTimer) {
            this.scene.time.removeEvent(this.showTimer);
        }

        // Set up delay timer
        this.showTimer = this.scene.time.delayedCall(
            this.config.delay,
            () => {
                // Show tooltip
                this.show(pointer);
            },
            [],
            this
        );
    }

    /**
     * Handle target pointer out event
     */
    onTargetPointerOut() {
        // Clear timer
        if (this.showTimer) {
            this.scene.time.removeEvent(this.showTimer);
            this.showTimer = null;
        }

        // Hide tooltip
        this.hide();
    }

    /**
     * Handle target pointer move event
     * @param {object} pointer - Pointer object
     */
    onTargetPointerMove(pointer) {
        if (this.visible) {
            // Update tooltip position
            this.updatePosition(pointer);
        }
    }

    /**
     * Show tooltip
     * @param {object} pointer - Pointer object
     */
    show(pointer) {
        // Update tooltip position
        this.updatePosition(pointer);

        // Show tooltip
        this.visible = true;

        // Set up auto-hide timer if duration is set
        if (this.config.duration > 0) {
            this.scene.time.delayedCall(
                this.config.duration,
                this.hide,
                [],
                this
            );
        }

        // Emit show event
        this.emit('show');
    }

    /**
     * Hide tooltip
     */
    hide() {
        this.visible = false;

        // Emit hide event
        this.emit('hide');
    }

    /**
     * Update tooltip position
     * @param {object} pointer - Pointer object
     */
    updatePosition(pointer) {
        // Calculate position based on pointer or target
        let x, y;

        if (this.config.followCursor && pointer) {
            x = pointer.x;
            y = pointer.y;
        } else {
            const targetBounds = this.target.getBounds();
            x = targetBounds.centerX;
            y = targetBounds.centerY;
        }

        // Adjust position based on tooltip position
        const offset = this.config.offset + this.config.arrowSize / 2;

        if (this.config.position === 'top') {
            this.y = y - this.height / 2 - offset;
            this.x = x;
        } else if (this.config.position === 'bottom') {
            this.y = y + this.height / 2 + offset;
            this.x = x;
        } else if (this.config.position === 'left') {
            this.x = x - this.width / 2 - offset;
            this.y = y;
        } else if (this.config.position === 'right') {
            this.x = x + this.width / 2 + offset;
            this.y = y;
        }
    }

    /**
     * Set tooltip text
     * @param {string} text - New tooltip text
     */
    setText(text) {
        this.tooltipText.setText(text);

        // Recalculate tooltip dimensions
        this.width = this.tooltipText.width + this.config.padding * 2;
        this.height = this.tooltipText.height + this.config.padding * 2;

        // Redraw background
        this.drawBackground();

        return this;
    }
}

/**
* Dropdown menu component
*/
class Dropdown extends Phaser.GameObjects.Container {
    constructor(scene, x, y, options, config = {}) {
        super(scene, x, y);
        scene.add.existing(this);

        this.options = options || [];

        // Default configuration
        this.config = Object.assign({
            width: 200,
            buttonHeight: 40,
            itemHeight: 30,
            maxItems: 5, // Max visible items before scrolling
            backgroundColor: 0xffffff,
            backgroundColorHover: 0xf0f0f0,
            textColor: '#000000',
            textColorHover: '#4a6fe3',
            fontSize: 16,
            fontFamily: 'Arial',
            placeholder: 'Select an option',
            cornerRadius: 6,
            dropdownIcon: true,
            dropdownIconColor: 0x000000,
            scrollbarVisible: true,
            closeOnSelect: true
        }, config);

        // State variables
        this.isOpen = false;
        this.selectedIndex = -1;

        // Create dropdown button
        this.createButton();

        // Create dropdown list
        this.createList();

        // Close dropdown initially
        this.closeDropdown();

        // Add events for closing dropdown when clicking outside
        scene.input.on('pointerdown', this.onBackgroundClick, this);
    }

    /**
     * Create dropdown button
     */
    createButton() {
        // Create button container
        this.button = new UIContainer(
            this.scene,
            0,
            0,
            this.config.width,
            this.config.buttonHeight,
            {
                backgroundColor: this.config.backgroundColor,
                cornerRadius: this.config.cornerRadius,
                padding: {
                    left: 10,
                    right: 10,
                    top: 0,
                    bottom: 0
                }
            }
        );

        this.add(this.button);

        // Create button text
        this.buttonText = new UIText(
            this.scene,
            -this.config.width / 2 + 10,
            0,
            this.config.placeholder,
            {
                fontSize: this.config.fontSize,
                fontFamily: this.config.fontFamily,
                color: this.config.textColor
            }
        );

        this.buttonText.setOrigin(0, 0.5);
        this.button.add(this.buttonText);

        // Create dropdown icon if enabled
        if (this.config.dropdownIcon) {
            this.dropdownIcon = this.scene.add.graphics();
            this.dropdownIcon.fillStyle(this.config.dropdownIconColor, 1);
            this.dropdownIcon.beginPath();
            this.dropdownIcon.moveTo(-6, -3);
            this.dropdownIcon.lineTo(6, -3);
            this.dropdownIcon.lineTo(0, 3);
            this.dropdownIcon.closePath();
            this.dropdownIcon.fillPath();
            this.dropdownIcon.x = this.config.width / 2 - 20;

            this.button.add(this.dropdownIcon);
        }

        // Make button interactive
        this.button.setInteractive({ useHandCursor: true });

        // Add button event listeners
        this.button.on('pointerover', () => {
            this.button.setBackgroundColor(this.config.backgroundColorHover);
        });

        this.button.on('pointerout', () => {
            this.button.setBackgroundColor(this.config.backgroundColor);
        });

        this.button.on('pointerdown', this.onButtonClick, this);
    }

    /**
     * Create dropdown list
     */
    createList() {
        // Calculate max list height
        const maxHeight = Math.min(
            this.options.length,
            this.config.maxItems
        ) * this.config.itemHeight;

        // Create list container
        this.list = new ScrollableContainer(
            this.scene,
            0,
            this.config.buttonHeight / 2 + maxHeight / 2,
            this.config.width,
            maxHeight,
            {
                backgroundColor: this.config.backgroundColor,
                cornerRadius: this.config.cornerRadius,
                clipContent: true,
                scrollDirection: 'vertical',
                showScrollbarY: this.config.scrollbarVisible && this.options.length > this.config.maxItems
            }
        );

        this.add(this.list);

        // Create list items
        this.createListItems();
    }

    /**
     * Create list items
     */
    createListItems() {
        this.listItems = [];

        // Calculate the total height of all items
        const totalHeight = this.options.length * this.config.itemHeight;

        // Add each option as a list item
        this.options.forEach((option, index) => {
            const item = new UIContainer(
                this.scene,
                0,
                -totalHeight / 2 + index * this.config.itemHeight + this.config.itemHeight / 2,
                this.config.width,
                this.config.itemHeight,
                {
                    backgroundColor: null,
                    padding: {
                        left: 10,
                        right: 10,
                        top: 0,
                        bottom: 0
                    }
                }
            );

            // Create item text
            const itemText = new UIText(
                this.scene,
                -this.config.width / 2 + 10,
                0,
                option.text || option,
                {
                    fontSize: this.config.fontSize,
                    fontFamily: this.config.fontFamily,
                    color: this.config.textColor
                }
            );

            itemText.setOrigin(0, 0.5);
            item.add(itemText);

            // Store reference to text
            item.itemText = itemText;

            // Store option value if exists
            item.value = option.value !== undefined ? option.value : option;

            // Make item interactive
            item.setInteractive({ useHandCursor: true });

            // Add item event listeners
            item.on('pointerover', () => {
                item.setBackgroundColor(this.config.backgroundColorHover);
                itemText.setColor(this.config.textColorHover);
            });

            item.on('pointerout', () => {
                item.setBackgroundColor(null);
                itemText.setColor(this.config.textColor);
            });

            item.on('pointerdown', () => {
                this.selectItem(index);
            });

            this.list.add(item);
            this.listItems.push(item);
        });

        // Set content size
        this.list.setContentSize(
            this.config.width,
            totalHeight
        );
    }

    /**
     * Handle button click
     */
    onButtonClick() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    /**
     * Handle background click to close dropdown
     * @param {object} pointer - Pointer object
     */
    onBackgroundClick(pointer) {
        if (!this.isOpen) return;

        // Check if click is outside dropdown
        const boundsButton = this.button.getBounds();
        const boundsList = this.list.getBounds();

        if (!Phaser.Geom.Rectangle.Contains(boundsButton, pointer.x, pointer.y) &&
            !Phaser.Geom.Rectangle.Contains(boundsList, pointer.x, pointer.y)) {
            this.closeDropdown();
        }
    }

    /**
     * Open dropdown
     */
    openDropdown() {
        this.isOpen = true;
        this.list.visible = true;

        // Rotate dropdown icon if exists
        if (this.dropdownIcon) {
            this.dropdownIcon.angle = 180;
        }

        // Emit open event
        this.emit('open');
    }

    /**
     * Close dropdown
     */
    closeDropdown() {
        this.isOpen = false;
        this.list.visible = false;

        // Rotate dropdown icon if exists
        if (this.dropdownIcon) {
            this.dropdownIcon.angle = 0;
        }

        // Emit close event
        this.emit('close');
    }

    /**
     * Select item by index
     * @param {number} index - Item index
     */
    selectItem(index) {
        // Deselect previously selected item
        if (this.selectedIndex !== -1 && this.listItems[this.selectedIndex]) {
            this.listItems[this.selectedIndex].setBackgroundColor(null);
            this.listItems[this.selectedIndex].itemText.setColor(this.config.textColor);
        }

        // Update selected index
        this.selectedIndex = index;

        // Update button text
        const option = this.options[index];
        this.buttonText.setText(option.text || option);

        // Close dropdown if configured
        if (this.config.closeOnSelect) {
            this.closeDropdown();
        }

        // Emit change event
        this.emit('change', {
            index: index,
            value: this.listItems[index].value,
            text: option.text || option
        });
    }

    /**
     * Get selected value
     * @returns {*} Selected value
     */
    getValue() {
        if (this.selectedIndex === -1) return null;
        return this.listItems[this.selectedIndex].value;
    }

    /**
     * Get selected text
     * @returns {string} Selected text
     */
    getText() {
        if (this.selectedIndex === -1) return '';
        return this.buttonText.text;
    }

    /**
     * Set selected index
     * @param {number} index - Item index
     */
    setSelectedIndex(index) {
        if (index >= 0 && index < this.options.length) {
            this.selectItem(index);
        }
        return this;
    }

    /**
     * Set options
     * @param {array} options - New options
     */
    setOptions(options) {
        this.options = options || [];

        // Clear existing list items
        this.listItems.forEach(item => {
            this.list.remove(item, true);
        });

        this.listItems = [];

        // Reset selected index
        this.selectedIndex = -1;
        this.buttonText.setText(this.config.placeholder);

        // Create new list items
        this.createListItems();

        return this;
    }
}

/**
* Input field component
*/
class InputField extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, config = {}) {
        super(scene, x, y);
        scene.add.existing(this);

        this.width = width;
        this.height = height;

        // Default configuration
        this.config = Object.assign({
            backgroundColor: 0xffffff,
            backgroundColorFocus: 0xf0f0f0,
            borderColor: 0xcccccc,
            borderColorFocus: 0x4a6fe3,
            borderWidth: 2,
            textColor: '#000000',
            placeholderColor: '#999999',
            cursorColor: '#000000',
            fontSize: 16,
            fontFamily: 'Arial',
            placeholder: '',
            maxLength: 0, // 0 = unlimited
            padding: 10,
            cornerRadius: 4,
            type: 'text', // 'text', 'password', 'number'
            value: '',
            enabled: true
        }, config);

        // State variables
        this.isFocused = false;
        this.cursorPosition = 0;
        this.text = this.config.value;

        // Create background
        this.createBackground();

        // Create text
        this.createText();

        // Create cursor
        this.createCursor();

        // Make input field interactive
        this.setInteractive(
            new Phaser.Geom.Rectangle(
                -width / 2,
                -height / 2,
                width,
                height
            ),
            Phaser.Geom.Rectangle.Contains
        );

        // Add input field event listeners
        this.on('pointerdown', this.onPointerDown, this);

        // Set initial state
        if (!this.config.enabled) {
            this.disable();
        }
    }

    /**
     * Create input field background
     */
    createBackground() {
        this.background = this.scene.add.graphics();
        this.add(this.background);

        // Draw background
        this.drawBackground();
    }

    /**
     * Create input field text
     */
    createText() {
        // Create text
        this.inputText = new UIText(
            this.scene,
            -this.width / 2 + this.config.padding,
            0,
            this.text || this.config.placeholder,
            {
                fontSize: this.config.fontSize,
                fontFamily: this.config.fontFamily,
                color: this.text ? this.config.textColor : this.config.placeholderColor,
                maxLines: 1
            }
        );

        this.inputText.setOrigin(0, 0.5);
        this.add(this.inputText);
    }

    /**
     * Create cursor
     */
    createCursor() {
        this.cursor = this.scene.add.graphics();
        this.add(this.cursor);

        // Draw cursor
        this.drawCursor();

        // Create cursor blink animation
        this.cursorBlink = this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                this.cursor.visible = this.isFocused ? !this.cursor.visible : false;
            },
            loop: true
        });
    }

    /**
     * Draw input field background
     */
    drawBackground() {
        this.background.clear();

        // Draw background
        this.background.fillStyle(this.isFocused ? this.config.backgroundColorFocus : this.config.backgroundColor, 1);
        this.background.lineStyle(this.config.borderWidth, this.isFocused ? this.config.borderColorFocus : this.config.borderColor, 1);

        if (this.config.cornerRadius > 0) {
            this.background.fillRoundedRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height,
                this.config.cornerRadius
            );

            this.background.strokeRoundedRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height,
                this.config.cornerRadius
            );
        } else {
            this.background.fillRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );

            this.background.strokeRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        }
    }

    /**
     * Draw cursor
     */
    drawCursor() {
        this.cursor.clear();
        this.cursor.fillStyle(this.config.cursorColor, 1);

        // Calculate cursor position
        const textWidth = this.getTextWidth(this.text.substring(0, this.cursorPosition));

        this.cursor.fillRect(
            -this.width / 2 + this.config.padding + textWidth,
            -this.height / 4,
            2,
            this.height / 2
        );
    }

    /**
     * Get text width
     * @param {string} text - Text to measure
     * @returns {number} - Text width
     */
    getTextWidth(text) {
        // Create temporary text to measure width
        const tempText = new Phaser.GameObjects.Text(
            this.scene,
            0,
            0,
            text,
            {
                fontSize: this.config.fontSize,
                fontFamily: this.config.fontFamily
            }
        );

        const width = tempText.width;
        tempText.destroy();

        return width;
    }

    /**
     * Handle pointer down event
     */
    onPointerDown() {
        if (!this.config.enabled) return;

        this.focus();
    }

    /**
     * Focus input field
     */
    focus() {
        if (!this.config.enabled) return;

        this.isFocused = true;

        // Show cursor
        this.cursor.visible = true;

        // Update background
        this.drawBackground();

        // Set cursor position to end of text
        this.cursorPosition = this.text.length;
        this.drawCursor();

        // Add keyboard events
        this.addKeyboardEvents();

        // Emit focus event
        this.emit('focus');
    }

    /**
     * Blur input field
     */
    blur() {
        this.isFocused = false;

        // Hide cursor
        this.cursor.visible = false;

        // Update background
        this.drawBackground();

        // Remove keyboard events
        this.removeKeyboardEvents();

        // Emit blur event
        this.emit('blur');
    }

    /**
     * Add keyboard events
     */
    addKeyboardEvents() {
        // Remove any existing keyboard events
        this.removeKeyboardEvents();

        // Add keyboard event listeners
        this.keyboardEventHandler = this.handleKeyboardInput.bind(this);
        this.scene.input.keyboard.on('keydown', this.keyboardEventHandler);
    }

    /**
     * Remove keyboard events
     */
    removeKeyboardEvents() {
        if (this.keyboardEventHandler) {
            this.scene.input.keyboard.off('keydown', this.keyboardEventHandler);
            this.keyboardEventHandler = null;
        }
    }

    /**
     * Handle keyboard input
     * @param {object} event - Keyboard event
     */
    handleKeyboardInput(event) {
        if (!this.isFocused) return;

        // Handle key input
        switch (event.key) {
            case 'Backspace':
                if (this.cursorPosition > 0) {
                    // Remove character before cursor
                    this.text = this.text.substring(0, this.cursorPosition - 1) +
                        this.text.substring(this.cursorPosition);

                    // Move cursor back
                    this.cursorPosition--;

                    // Update text
                    this.updateText();
                }
                break;

            case 'Delete':
                if (this.cursorPosition < this.text.length) {
                    // Remove character after cursor
                    this.text = this.text.substring(0, this.cursorPosition) +
                        this.text.substring(this.cursorPosition + 1);

                    // Update text
                    this.updateText();
                }
                break;

            case 'ArrowLeft':
                // Move cursor left
                if (this.cursorPosition > 0) {
                    this.cursorPosition--;
                    this.drawCursor();
                }
                break;

            case 'ArrowRight':
                // Move cursor right
                if (this.cursorPosition < this.text.length) {
                    this.cursorPosition++;
                    this.drawCursor();
                }
                break;

            case 'Home':
                // Move cursor to start
                this.cursorPosition = 0;
                this.drawCursor();
                break;

            case 'End':
                // Move cursor to end
                this.cursorPosition = this.text.length;
                this.drawCursor();
                break;

            case 'Tab':
            case 'Enter':
                // Blur input field
                this.blur();
                break;

            default:
                // Add character
                if (event.key.length === 1) {
                    // Check max length
                    if (this.config.maxLength > 0 && this.text.length >= this.config.maxLength) {
                        return;
                    }

                    // Check input type
                    if (this.config.type === 'number' && !/^\d$/.test(event.key)) {
                        return;
                    }

                    // Insert character at cursor position
                    this.text = this.text.substring(0, this.cursorPosition) +
                        event.key +
                        this.text.substring(this.cursorPosition);

                    // Move cursor forward
                    this.cursorPosition++;

                    // Update text
                    this.updateText();
                }
                break;
        }
    }

    /**
     * Update text
     */
    updateText() {
        // Update text display
        this.inputText.setText(this.text || this.config.placeholder);
        this.inputText.setColor(this.text ? this.config.textColor : this.config.placeholderColor);

        // Update cursor position
        this.drawCursor();
    }

    /**
     * Set input field value
     * @param {string} value - New value
     */
    setValue(value) {
        this.text = String(value);
        this.cursorPosition = this.text.length;
        this.updateText();
        return this;
    }

    /**
     * Get input field value
     * @returns {string} Current value
     */
    getValue() {
        return this.text;
    }

    /**
     * Enable input field
     */
    enable() {
        this.config.enabled = true;
        this.setInteractive();
        this.drawBackground();
        return this;
    }

    /**
     * Disable input field
     */
    disable() {
        this.config.enabled = false;
        this.disableInteractive();
        this.blur();
        this.drawBackground();
        return this;
    }

    /**
     * Set placeholder text
     * @param {string} text - New placeholder text
     */
    setPlaceholder(text) {
        this.config.placeholder = text;
        if (!this.text) {
            this.inputText.setText(text);
        }
        return this;
    }

    /**
     * Set input type
     * @param {string} type - Input type ('text', 'password', 'number')
     */
    setType(type) {
        this.config.type = type;

        // Update display if password type
        if (type === 'password') {
            this.inputText.setText('*'.repeat(this.text.length));
        } else {
            this.inputText.setText(this.text);
        }
        return this;
    }

    /**
     * Set max length
     * @param {number} maxLength - Maximum input length
     */
    setMaxLength(maxLength) {
        this.config.maxLength = maxLength;

        // Truncate text if exceeds new max length
        if (maxLength > 0 && this.text.length > maxLength) {
            this.text = this.text.substring(0, maxLength);
            this.cursorPosition = Math.min(this.cursorPosition, maxLength);
            this.updateText();
        }
        return this;
    }

    /**
     * Clear input field
     */
    clear() {
        this.text = '';
        this.cursorPosition = 0;
        this.updateText();
        return this;
    }

    /**
     * Destroy input field
     */
    destroy() {
        // Remove keyboard events
        this.removeKeyboardEvents();

        // Remove cursor blink animation
        if (this.cursorBlink) {
            this.cursorBlink.destroy();
        }

        // Call parent destroy
        super.destroy();
    }
}

// // Export PhaserUI class
// export default PhaserUI;