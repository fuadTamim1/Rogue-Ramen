export function groupFramesByAnimation(data) {
    const grouped = {};

    for (const key in data.frames) {
        const match = key.match(/#(.+?) (\d+)/);
        if (!match) continue;

        const animationName = match[1].trim(); // e.g., "Idle", "Knife attack"
        const frameIndex = parseInt(match[2], 10);

        if (!grouped[animationName]) {
            grouped[animationName] = [];
        }

        grouped[animationName][frameIndex] = {
            name: key,
            ...data.frames[key]
        };
    }

    return grouped;
}

export function createPhaserAnimations(scene, textureKey, groupedAnimations) {
    for (const [animName, frames] of Object.entries(groupedAnimations)) {
        if (!frames || frames.length === 0) {
            console.warn(`No frames found for animation: ${animName}`);
            continue;
        }

        const validFrames = frames
            .filter(frame => frame !== undefined)
            .map(frame => {
                if (!scene.textures.getFrame(textureKey, frame.name)) {
                    console.warn(`Frame not found: ${frame.name}`);
                    return null;
                }
                return {
                    key: textureKey,
                    frame: frame.name
                };
            })
            .filter(Boolean);

        if (validFrames.length === 0) {
            console.error(`No valid frames found for animation: ${animName}`);
            continue;
        }

        scene.anims.create({
            key: animName,
            frames: validFrames,
            frameRate: 10,
            repeat: animName === 'Idle' ? -1 : 0
        });

        console.log(`Created animation: ${animName} with ${validFrames.length} frames`);
    }
}

export function getIconFrame(groupedFrames, animName) {
    if (!groupedFrames[animName] || groupedFrames[animName].length === 0) {
        console.warn(`No frames found for animation: ${animName}`);
        return null;
    }
    // Return the first frame's name
    return groupedFrames[animName][0].name; 
}

// new Aniam system
