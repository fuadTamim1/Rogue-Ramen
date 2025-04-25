export class AnimationHandler {
    constructor(sprite, scene, config) {
        this.sprite = sprite; // Phaser.GameObjects.Sprite (Player or Enemy)
        this.scene = scene;
        this.config = Object.assign({
            idleKey: 'idle',
            moveKey: 'move',
            deathKey: 'death',
            attackKeys: [], // e.g., ['knife', 'pistol'] for Player, ['stick'] for Enemy
            fallbackFrame: 'character aniamtion export #Idle 0.aseprite',
            attackAnimationSource: 'ui' // 'sprite' (play on sprite), 'ui' (play on UIPlayer/UIEnemy.WeaponIcon)
        }, config);

        this.state = 'idle';
        this.isAnimating = false;

        // Bind animation complete listener
        this.sprite.on('animationcomplete', this.handleAnimationComplete, this);
    }

    setState(state, attackKey = null) {
        if (this.isAnimating && state !== 'dying') return; // Prevent interrupting animations (except death)
        this.state = state;

        switch (state) {
            case 'idle':
                this.playIdle();
                break;
            case 'moving':
                this.playMove();
                break;
            case 'attacking':
                if (attackKey) {
                    this.playAttack(attackKey);
                }
                break;
            case 'dying':
                this.playDeath();
                break;
        }
    }

    playIdle() {
        if (this.scene.anims.exists(this.config.idleKey)) {
            this.sprite.play(this.config.idleKey, true);
        } else {
            console.warn(`Idle animation '${this.config.idleKey}' not found, using fallback frame`);
            this.sprite.setFrame(this.config.fallbackFrame);
        }
        this.isAnimating = false;
    }

    playMove() {
        if (this.scene.anims.exists(this.config.moveKey)) {
            this.sprite.play(this.config.moveKey, true);
            this.isAnimating = true;
        } else {
            console.warn(`Move animation '${this.config.moveKey}' not found`);
            this.playIdle();
        }
    }

    playAttack(attackKey) {
        if (this.config.attackAnimationSource === 'ui') {
            // Defer to UIPlayer/UIEnemy.WeaponIcon (handled externally)
            this.isAnimating = true;
        } else if (this.scene.anims.exists(attackKey)) {
            this.sprite.play(attackKey, true);
            this.isAnimating = true;
        } else {
            console.warn(`Attack animation '${attackKey}' not found`);
            this.playIdle();
        }
    }

    playDeath() {
        if (this.scene.anims.exists(this.config.deathKey)) {
            this.sprite.play(this.config.deathKey, false);
            this.isAnimating = true;
        } else {
            console.warn(`Death animation '${this.config.deathKey}' not found`);
            this.sprite.emit('animationcomplete'); // Trigger completion immediately
        }
    }

    handleAnimationComplete(animation) {
        if (animation.key === this.config.moveKey || this.config.attackKeys.includes(animation.key) || animation.key === this.config.deathKey) {
            if (this.state !== 'dying') {
                this.setState('idle');
            } else {
                this.isAnimating = false;
                this.sprite.emit('deathcomplete'); // Custom event for die()
            }
        }
    }

    destroy() {
        this.sprite.off('animationcomplete', this.handleAnimationComplete, this);
    }
}