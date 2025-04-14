/**
 * DialogSystem - A customizable dialog system for Phaser games
 * Features:
 * - Animated text display (typewriter effect)
 * - Character portraits
 * - Customizable colors, fonts, and animations
 * - Multiple dialog styles (bubble, window, etc.)
 * - Sound effects for text
 * - Support for word highlighting and special effects
 */

export class DialogSystem {
    /**
     * @param {Phaser.Scene} scene - The scene this dialog system belongs to
     * @param {Object} config - Configuration options
     */
    constructor(scene, config = {}) {
        this.scene = scene;
        
        // Default configuration
        this.config = {
            width: config.width || 600,
            height: config.height || 150,
            x: config.x || (scene.cameras.main.width / 2),
            y: config.y || (scene.cameras.main.height - 100),
            padding: config.padding || 20,
            borderRadius: config.borderRadius || 10,
            borderColor: config.borderColor || 0x000000,
            borderThickness: config.borderThickness || 2,
            backgroundColor: config.backgroundColor || 0x000000,
            backgroundAlpha: config.backgroundAlpha || 0.7,
            portraitSize: config.portraitSize || 100,
            defaultFont: config.defaultFont || 'Arial',
            defaultFontSize: config.defaultFontSize || 24,
            defaultColor: config.defaultColor || '#FFFFFF',
            typewriterSpeed: config.typewriterSpeed || 30, // ms per character
            animationIn: config.animationIn || 'fade', // 'fade', 'slide', 'scale'
            animationOut: config.animationOut || 'fade',
            soundEnabled: config.soundEnabled || false,
            typingSound: config.typingSound || null,
            autoClose: config.autoClose || false,
            autoCloseDelay: config.autoCloseDelay || 3000,
            closeButton: config.closeButton || false,
            closeButtonConfig: config.closeButtonConfig || {}
        };
        
        // Initialize dialog components
        this.dialogContainer = null;
        this.background = null;
        this.textObject = null;
        this.portraitImage = null;
        this.nameTag = null;
        this.closeBtn = null;
        
        // Dialog state
        this.isActive = false;
        this.isTyping = false;
        this.currentText = '';
        this.targetText = '';
        this.textQueue = [];
        this.textIndex = 0;
        this.typewriterTimer = null;
        this.currentConfig = {};
        this.allTextDisplayed = false;
        
        // Special effect tracking
        this.textEffects = [];
        this.highlightedWords = [];
        
        // Create container
        this._createDialogContainer();
    }
    
    /**
     * Creates the dialog container and adds it to the scene
     * @private
     */
    _createDialogContainer() {
        // Create container
        this.dialogContainer = this.scene.add.container(this.config.x, this.config.y);
        this.dialogContainer.setDepth(1000); // Make sure dialog is on top
        
        // Create background
        this.background = this.scene.add.graphics();
        this.dialogContainer.add(this.background);
        
        // Create text object
        this.textObject = this.scene.add.text(
            -this.config.width / 2 + this.config.padding + (this.config.portraitSize / 2),
            -this.config.height / 2 + this.config.padding,
            '',
            {
                fontFamily: this.config.defaultFont,
                fontSize: this.config.defaultFontSize,
                color: this.config.defaultColor,
                wordWrap: { width: this.config.width - (this.config.padding * 2) - this.config.portraitSize }
            }
        );
        this.dialogContainer.add(this.textObject);
        
        // Create name tag
        this.nameTag = this.scene.add.text(
            -this.config.width / 2 + this.config.padding,
            -this.config.height / 2 - 30,
            '',
            {
                fontFamily: this.config.defaultFont,
                fontSize: this.config.defaultFontSize,
                color: this.config.defaultColor,
                backgroundColor: '#000000'
            }
        );
        this.nameTag.setPadding(5);
        this.nameTag.setVisible(false);
        this.dialogContainer.add(this.nameTag);
        
        // Add close button if enabled
        if (this.config.closeButton) {
            const btnConfig = this.config.closeButtonConfig;
            this.closeBtn = this.scene.add.text(
                this.config.width / 2 - 30,
                -this.config.height / 2 + 10,
                'X',
                {
                    fontFamily: btnConfig.fontFamily || this.config.defaultFont,
                    fontSize: btnConfig.fontSize || 20,
                    color: btnConfig.color || '#FFFFFF'
                }
            );
            this.closeBtn.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.close())
                .on('pointerover', () => this.closeBtn.setColor('#FF0000'))
                .on('pointerout', () => this.closeBtn.setColor('#FFFFFF'));
            this.dialogContainer.add(this.closeBtn);
        }
        
        // Initially hide dialog
        this.dialogContainer.setVisible(false);
        
        // Add click listener to container for continuing dialogs
        this.scene.input.on('pointerdown', this._handleClick, this);
    }
    
    /**
     * Handles click events on the dialog
     * @private
     */
    _handleClick() {
        if (!this.isActive) return;
        
        if (this.isTyping && !this.allTextDisplayed) {
            // Skip typewriter and show all text immediately
            this._completeTypewriter();
        } else if (this.textQueue.length > 0) {
            // Show next message in queue
            this._showNextText();
        } else {
            // Close dialog if no more text
            this.close();
        }
    }
    
    /**
     * Updates the background graphic
     * @private
     */
    _updateBackground() {
        this.background.clear();
        
        // Draw border
        this.background.lineStyle(
            this.config.borderThickness,
            this.config.borderColor,
            1
        );
        
        // Draw background
        this.background.fillStyle(
            this.config.backgroundColor,
            this.config.backgroundAlpha
        );
        
        // Draw rounded rectangle
        this.background.fillRoundedRect(
            -this.config.width / 2,
            -this.config.height / 2,
            this.config.width,
            this.config.height,
            this.config.borderRadius
        );
        
        this.background.strokeRoundedRect(
            -this.config.width / 2,
            -this.config.height / 2,
            this.config.width,
            this.config.height,
            this.config.borderRadius
        );
    }
    
    /**
     * Sets a portrait image for the dialog
     * @param {string} key - The key of the preloaded image to use as portrait
     * @param {Object} config - Configuration for the portrait
     */
    setPortrait(key, config = {}) {
        if (this.portraitImage) {
            this.portraitImage.destroy();
        }
        
        const size = config.size || this.config.portraitSize;
        const x = config.x || (-this.config.width / 2 + (size / 2) + this.config.padding);
        const y = config.y || 0;
        
        this.portraitImage = this.scene.add.image(x, y, key);
        this.portraitImage.setDisplaySize(size, size);
        
        if (config.frame !== undefined) {
            this.portraitImage.setFrame(config.frame);
        }
        
        this.dialogContainer.add(this.portraitImage);
        
        // Adjust text position if portrait is displayed
        if (this.textObject) {
            this.textObject.setX(-this.config.width / 2 + (size + 10) + this.config.padding);
            this.textObject.setWordWrapWidth(this.config.width - (this.config.padding * 2) - size - 10);
        }
        
        return this;
    }
    
    /**
     * Shows dialog with the specified text and options
     * @param {string|Array} text - Text to display or array of text objects
     * @param {Object} config - Custom configuration for this specific dialog
     */
    show(text, config = {}) {
        // Merge configs
        this.currentConfig = { ...this.config, ...config };
        
        // Reset state
        this.isActive = true;
        this.textQueue = [];
        this.allTextDisplayed = false;
        
        // Update background with new config
        this._updateBackground();
        
        // Process the text queue
        if (Array.isArray(text)) {
            this.textQueue = [...text];
        } else {
            this.textQueue.push({ text, ...config });
        }
        
        // Set name if provided
        if (config.name) {
            this.nameTag.setText(config.name);
            this.nameTag.setVisible(true);
            
            if (config.nameColor) {
                this.nameTag.setColor(config.nameColor);
            }
        } else {
            this.nameTag.setVisible(false);
        }
        
        // Show dialog with animation
        this.dialogContainer.setVisible(true);
        this._animateIn();
        
        // Show first text in queue
        if (this.textQueue.length > 0) {
            this._showNextText();
        }
        
        return this;
    }
    
    /**
     * Shows the next text in the queue
     * @private
     */
    _showNextText() {
        if (this.textQueue.length === 0) return;
        
        const textItem = this.textQueue.shift();
        this.targetText = textItem.text;
        
        // Apply text style
        const textStyle = {
            fontFamily: textItem.font || this.currentConfig.defaultFont,
            fontSize: textItem.fontSize || this.currentConfig.defaultFontSize,
            color: textItem.color || this.currentConfig.defaultColor,
            wordWrap: { width: textItem.width }
        };
        
        // Add more text styles if provided
        if (textItem.bold) textStyle.fontStyle = 'bold';
        if (textItem.italic) textStyle.fontStyle = textStyle.fontStyle ? `${textStyle.fontStyle} italic` : 'italic';
        if (textItem.underline) textStyle.underline = true;
        if (textItem.stroke) {
            textStyle.stroke = textItem.stroke;
            textStyle.strokeThickness = textItem.strokeThickness || 1;
        }
        if (textItem.shadow) {
            textStyle.shadow = true;
            textStyle.shadowColor = textItem.shadowColor || '#000000';
            textStyle.shadowBlur = textItem.shadowBlur || 0;
            textStyle.shadowOffsetX = textItem.shadowOffsetX || 2;
            textStyle.shadowOffsetY = textItem.shadowOffsetY || 2;
        }
        
        this.textObject.setStyle(textStyle);
        
        // Reset text
        this.currentText = '';
        this.textObject.setText('');
        this.textIndex = 0;
        
        // Reset effects
        this.textEffects = textItem.effects || [];
        this.highlightedWords = textItem.highlightWords || [];
        
        // Start typewriter effect
        this.isTyping = true;
        this.allTextDisplayed = false;
        this._typewriterEffect();
        
        // Update portrait if provided
        if (textItem.portrait) {
            this.setPortrait(textItem.portrait, textItem.portraitConfig || {});
        }
        
        // Set name if provided for this individual text item
        if (textItem.name) {
            this.nameTag.setText(textItem.name);
            this.nameTag.setVisible(true);
            
            if (textItem.nameColor) {
                this.nameTag.setColor(textItem.nameColor);
            }
        }
    }
    
    /**
     * Implements the typewriter text effect
     * @private
     */
    _typewriterEffect() {
        // Clear any existing timer
        if (this.typewriterTimer) {
            this.scene.time.removeEvent(this.typewriterTimer);
        }
        
        // Create a timer to show text character by character
        this.typewriterTimer = this.scene.time.addEvent({
            delay: this.currentConfig.typewriterSpeed,
            callback: () => {
                if (this.textIndex < this.targetText.length) {
                    // Add next character
                    this.currentText += this.targetText.charAt(this.textIndex);
                    this.textObject.setText(this.currentText);
                    this.textIndex++;
                    
                    // Play sound if enabled
                    if (this.currentConfig.soundEnabled && this.currentConfig.typingSound) {
                        // Only play sound for visible characters (not spaces)
                        if (this.targetText.charAt(this.textIndex - 1).trim() !== '') {
                            this.scene.sound.play(this.currentConfig.typingSound);
                        }
                    }
                    
                    // Apply text effects
                    this._applyTextEffects();
                } else {
                    // Text is complete
                    this.isTyping = false;
                    this.allTextDisplayed = true;
                    this.scene.time.removeEvent(this.typewriterTimer);
                    
                    // Auto close if enabled
                    if (this.currentConfig.autoClose) {
                        this.scene.time.delayedCall(
                            this.currentConfig.autoCloseDelay,
                            () => {
                                if (this.textQueue.length > 0) {
                                    this._showNextText();
                                } else {
                                    this.close();
                                }
                            }
                        );
                    }
                }
            },
            callbackScope: this,
            loop: true
        });
    }
    
    /**
     * Completes the typewriter effect immediately
     * @private
     */
    _completeTypewriter() {
        if (!this.isTyping) return;
        
        // Stop the typewriter timer
        if (this.typewriterTimer) {
            this.scene.time.removeEvent(this.typewriterTimer);
        }
        
        // Show all text at once
        this.currentText = this.targetText;
        this.textObject.setText(this.currentText);
        
        // Apply effects to full text
        this._applyTextEffects(true);
        
        this.isTyping = false;
        this.allTextDisplayed = true;
    }
    
    /**
     * Applies text effects like highlighting, colors, etc.
     * @param {boolean} fullText - Whether to apply effects to the full text
     * @private
     */
    _applyTextEffects(fullText = false) {
        // Process highlight effects
        if (this.highlightedWords.length > 0) {
            // Create a temporary text object to get proper text measurements
            const tempText = new Phaser.GameObjects.Text(
                this.scene, 0, 0, this.currentText, this.textObject.style
            );
            
            this.highlightedWords.forEach(highlight => {
                const { word, color, backgroundColor } = highlight;
                let startIndex = 0;
                let wordIndex;
                
                // Find all occurrences of the word
                while ((wordIndex = this.currentText.indexOf(word, startIndex)) !== -1) {
                    if (fullText || wordIndex < this.textIndex) {
                        this.textObject.setColor(color, wordIndex, wordIndex + word.length);
                        
                        if (backgroundColor) {
                            // TODO: Add background highlight with graphics
                        }
                    }
                    startIndex = wordIndex + word.length;
                }
            });
            
            tempText.destroy();
        }
        
        // Apply other text effects from this.textEffects here
        // Examples include shaking, waving, etc.
    }
    
    /**
     * Animates the dialog in with the configured animation
     * @private
     */
    _animateIn() {
        // Reset dialog to initial state
        this.dialogContainer.setAlpha(1);
        this.dialogContainer.setScale(1);
        
        switch (this.currentConfig.animationIn) {
            case 'fade':
                this.dialogContainer.setAlpha(0);
                this.scene.tweens.add({
                    targets: this.dialogContainer,
                    alpha: 1,
                    duration: 300,
                    ease: 'Power2'
                });
                break;
                
            case 'slide':
                const originalY = this.dialogContainer.y;
                this.dialogContainer.y = originalY + 100;
                this.scene.tweens.add({
                    targets: this.dialogContainer,
                    y: originalY,
                    duration: 300,
                    ease: 'Back.out'
                });
                break;
                
            case 'scale':
                this.dialogContainer.setScale(0.5);
                this.scene.tweens.add({
                    targets: this.dialogContainer,
                    scale: 1,
                    duration: 300,
                    ease: 'Back.out'
                });
                break;
        }
    }
    
    /**
     * Animates the dialog out with the configured animation
     * @private
     */
    _animateOut(onComplete) {
        switch (this.currentConfig.animationOut) {
            case 'fade':
                this.scene.tweens.add({
                    targets: this.dialogContainer,
                    alpha: 0,
                    duration: 300,
                    ease: 'Power2',
                    onComplete
                });
                break;
                
            case 'slide':
                this.scene.tweens.add({
                    targets: this.dialogContainer,
                    y: this.dialogContainer.y + 100,
                    duration: 300,
                    ease: 'Back.in',
                    onComplete
                });
                break;
                
            case 'scale':
                this.scene.tweens.add({
                    targets: this.dialogContainer,
                    scale: 0.5,
                    alpha: 0,
                    duration: 300,
                    ease: 'Back.in',
                    onComplete
                });
                break;
                
            default:
                if (onComplete) onComplete();
                break;
        }
    }
    
    /**
     * Adds text to the queue
     * @param {string|Object} text - Text to add or text config object
     */
    addText(text) {
        if (typeof text === 'string') {
            this.textQueue.push({ text });
        } else {
            this.textQueue.push(text);
        }
        
        // If dialog is active but not currently typing, and this is the first item,
        // automatically start showing the next text
        if (this.isActive && !this.isTyping && this.textQueue.length === 1) {
            this._showNextText();
        }
        
        return this;
    }
    
    /**
     * Closes the dialog
     */
    close() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.isTyping = false;
        
        // Stop any timers
        if (this.typewriterTimer) {
            this.scene.time.removeEvent(this.typewriterTimer);
        }
        
        // Animate out
        this._animateOut(() => {
            this.dialogContainer.setVisible(false);
            this.textObject.setText('');
            this.currentText = '';
            this.targetText = '';
            this.textQueue = [];
        });
        
        return this;
    }
    
    /**
     * Updates dialog size and position
     * @param {Object} config - New configuration options
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        
        // Update position
        this.dialogContainer.setPosition(this.config.x, this.config.y);
        
        // Update background
        this._updateBackground();
        
        // Update text position
        const portraitOffset = this.portraitImage ? this.config.portraitSize + 10 : 0;
        this.textObject.setX(-this.config.width / 2 + this.config.padding + portraitOffset);
        this.textObject.setY(-this.config.height / 2 + this.config.padding);
        this.textObject.setWordWrapWidth(this.config.width - (this.config.padding * 2) - portraitOffset);
        
        return this;
    }
    
    /**
     * Creates a custom dialog style
     * @param {string} name - Name of the style
     * @param {Object} config - Style configuration
     */
    createStyle(name, config) {
        // Store the style for later use
        if (!this.styles) this.styles = {};
        this.styles[name] = config;
        return this;
    }
    
    /**
     * Applies a predefined style to the dialog
     * @param {string} name - Name of the style to apply
     */
    applyStyle(name) {
        if (!this.styles || !this.styles[name]) {
            console.warn(`Dialog style '${name}' not found`);
            return this;
        }
        
        this.updateConfig(this.styles[name]);
        return this;
    }
    
    /**
     * Returns whether the dialog is currently active
     * @return {boolean}
     */
    isDialogActive() {
        return this.isActive;
    }
}