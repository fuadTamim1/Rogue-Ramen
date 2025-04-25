export class SpriteLoader {
    constructor(scene) {
        this.scene = scene;
    }

    preloadSheets(config) {
        config.assets.forEach((asset) => {
            if (asset.type === 'json') {
                // Handle Aseprite JSON
                if (asset.aseprite) {
                    this.scene.load.aseprite(asset.key, asset.image, asset.json);
                } else {
                    this.scene.load.atlas(asset.key, asset.image, asset.json);
                }
            } else {
                // PNG or regular spritesheet
                if (asset.single) {
                    this.scene.load.image(asset.key, asset.path);
                } else {
                    this.scene.load.spritesheet(asset.key, asset.path, {
                        frameWidth: asset.frameWidth || config.frameWidth,
                        frameHeight: asset.frameHeight || config.frameHeight
                    });
                }
            }
        });
    }

    createAnimations(config) {
        config.assets.forEach((asset) => {
            // Skip if animations already created
            if (asset.single || this.scene.anims.exists(asset.key)) return;

            // ✅ Aseprite: Let Phaser auto-create animations from tags
            if (asset.type === 'json' && asset.aseprite) {
                this.scene.anims.createFromAseprite(asset.key);
                return;
            }

            // ✅ JSON Atlas or Spritesheet
            if (asset.type === 'json') {
                this.scene.anims.create({
                    key: asset.key,
                    frames: this.scene.anims.generateFrameNames(asset.key, {
                        prefix: asset.prefix,
                        suffix: '.aseprite',
                        start: asset.start || 0,
                        end: asset.end,
                        zeroPad: asset.zeroPad || 0
                    }),
                    frameRate: asset.frameRate || 12,
                    repeat: asset.loop ? -1 : 0
                });
            } else {
                this.scene.anims.create({
                    key: asset.key,
                    frames: this.scene.anims.generateFrameNumbers(asset.key),
                    frameRate: asset.frameRate || 12,
                    repeat: asset.loop ? -1 : 0
                });
            }
        });
    }


    createAnimatedSprite(x, y, key, animationKey = null) {
        const sprite = this.scene.add.sprite(x, y, key);
        sprite.play(animationKey || key);
        return sprite;
    }

    getIcon(key, frame, x, y) {
        return this.scene.add.image(x, y, key, frame);
    }

    getFrameTexture(key, frame) {
        const texture = this.scene.textures.get(key);
        if (!texture) {
            console.warn(`Texture "${key}" not found.`);
            return null;
        }
        const f = texture.get(frame);
        if (!f) {
            console.warn(`Frame "${frame}" not found in "${key}".`);
            return null;
        }
        return f;
    }

    createSpriteOrImage({ x, y, key, frame = 0, animated = false, animationKey = null }) {
        if (animated) {
            const sprite = this.scene.add.sprite(x, y, key);
            sprite.play(animationKey || key);
            return sprite;
        } else {
            return this.scene.add.image(x, y, key, frame);
        }
    }
}
