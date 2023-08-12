import { ImageAsset, Size, SpriteFrame, Texture2D, screen, Prefab, AudioClip, Material, TextAsset, Vec3, tween } from "cc";
import { ResourceUtils } from './ResourceUtils';

class Functions {
    /*---------------------------------------- */

    public static getSizeWindow(): Size {
        let newH: number = 0;
        let newW: number = 0;
        let scaleW = screen.windowSize.width / 720;
        let scaleH = screen.windowSize.height / 1280;
        if (scaleW > scaleH) {
            newW = screen.windowSize.width / scaleH;
            newH = 1280;
        }
        else {
            newH = screen.windowSize.height / scaleW;
            newW = 720;
        }

        return new Size(newW, newH);
    }

    public static getSpriteFrameFromImageAsset(imageAsset: ImageAsset): SpriteFrame {
        let spriteFrame = new SpriteFrame();
        let texture = new Texture2D();
        texture.image = imageAsset;
        spriteFrame.texture = texture;

        return spriteFrame;
    }

    /**
     * @description format time
     * Ex: 60s -> 1:00
     * @param time 
     * @returns string
     */
    public static customFormatTime(time: number): string {
        let minutes: number = Math.floor(time / 60);
        let remainingSeconds: number = time % 60;
        let formattedTime: string = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

        return formattedTime;
    }

    /*------------------------------------------------------------ */

    public static async getPrefab(path: string, onProgress?: (finished: number, total: number) => void): Promise<Prefab> {
        try {
            return await ResourceUtils.loadPrefab(path, onProgress);
        } catch (error) {
            console.error('Failed to load prefab:', error);
            throw error;
        }
    }

    public static async getAudio(path: string, onProgress?: (finished: number, total: number) => void): Promise<AudioClip> {
        try {
            return await ResourceUtils.loadAudio(path, onProgress);
        } catch (error) {
            console.error('Failed to load audio:', error);
            throw error;
        }
    }

    public static async getSprite(path: string, onProgress?: (finished: number, total: number) => void): Promise<SpriteFrame> {
        try {
            return await ResourceUtils.loadSprite(path, onProgress);
        } catch (error) {
            console.error('Failed to load sprite:', error);
            throw error;
        }
    }

    public static async getDirSprite(dirPath: string, onProgress?: (finished: number, total: number) => void): Promise<SpriteFrame[]> {
        try {
            return await ResourceUtils.loadDirSprite(dirPath, onProgress);
        } catch (error) {
            console.error('Failed to load sprite:', error);
            throw error;
        }
    }

    public static async getImageAsset(path: string, onProgress?: (finished: number, total: number) => void): Promise<ImageAsset> {
        try {
            return await ResourceUtils.loadImageAsset(path, onProgress);
        } catch (error) {
            console.error('Failed to load image:', error);
            throw error;
        }
    }

    public static async getSpriteFrameFromUrl(url: string): Promise<SpriteFrame> {
        try {
            return await ResourceUtils.loadImageFromURL(url);
        } catch (error) {
            console.error('Failed to load image:', error);
            throw error;
        }
    }

    public static async getImageAssetFromURL(url: string): Promise<SpriteFrame> {
        try {
            return await ResourceUtils.loadImageAssetFromURL(url);
        } catch (error) {
            console.error('Failed to load image:', error);
            throw error;
        }
    }

    public static async getMaterial(path: string, onProgress?: (finished: number, total: number) => void): Promise<Material> {
        try {
            return await ResourceUtils.loadMaterial(path, onProgress);
        } catch (error) {
            console.error('Failed to load material:', error);
            throw error;
        }
    }

    public static async getFileText(path: string, onProgress?: (finished: number, total: number) => void): Promise<TextAsset> {
        try {
            return await ResourceUtils.loadFileText(path, onProgress);
        } catch (error) {
            console.error('Failed to load text:', error);
            throw error;
        }
    }

    /*-------------------------------------------------------------- */

    public static tweenConfig(current: Vec3, target: Vec3, type: "by" | "to", time: number, onProgress?: (progress: Vec3) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            if (type == "by") {
                tween(current)
                    .by(time, target, {
                        onUpdate(target: Vec3, ratio) {
                            onProgress(target);
                        },
                    })
                    .call(() => {
                        resolve();
                    })
                    .start();
            }

            if (type == "to") {
                tween(current)
                    .to(time, target, {
                        onUpdate(target: Vec3, ratio) {
                            onProgress(target);
                        },
                    })
                    .call(() => {
                        resolve();
                    })
                    .start();
            }
        });
    }
}

export { Functions };