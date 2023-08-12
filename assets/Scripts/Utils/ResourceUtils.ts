import { assetManager, AudioClip, ImageAsset, Prefab, resources, SpriteFrame, Texture2D, _decorator, Material, TextAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceUtils')
export class ResourceUtils {
    public static loadPrefab(path: string, onProgress?: (finished: number, total: number) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, Prefab, onProgress, (err, prefab: Prefab) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(prefab);
                }
            });
        });
    }
    public static loadAudio(path: string, onProgress?: (finished: number, total: number) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, AudioClip, onProgress, (err, audio: AudioClip) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(audio);
                }
            });
        });
    }

    public static loadSprite(path: string, onProgress?: (finished: number, total: number) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, ImageAsset, onProgress, (err, imageAsset: ImageAsset) => {
                if (err) {
                    reject(err);
                } else {
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = imageAsset;
                    spriteFrame.texture = texture;
                    resolve(spriteFrame);
                }
            });
        });
    }

    public static loadImageAsset(path: string, onProgress?: (finished: number, total: number) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, ImageAsset, onProgress, (err, imageAsset: ImageAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(imageAsset);
                }
            });
        });
    }

    public static loadDirSprite(dirPath: string, onProgress?: (finished: number, total: number) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.loadDir(dirPath, SpriteFrame, onProgress, (err, spriteFrameList: SpriteFrame[]) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(spriteFrameList);
                }
            });
        });
    }

    public static loadImageFromURL(remoteUrl: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // Remote texture url with file extensions
            assetManager.loadRemote<ImageAsset>(remoteUrl, { ext: ".png" }, function (err, imageAsset: ImageAsset) {

                if (err) {
                    reject(err);
                }
                else {
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = imageAsset;
                    spriteFrame.texture = texture;

                    resolve(spriteFrame);
                }
            });
        });
    }


    public static async loadImageFromURLRealeaseAsset(remoteUrl: string, callback) {
        // Remote texture url with file extensions
        await assetManager.loadRemote<ImageAsset>(remoteUrl, { ext: ".png" }, function (err, imageAsset: ImageAsset) {

            if (err) {
                console.log(err);
            }
            else {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;

                callback(spriteFrame, texture);
            }
        });
    }


    public static loadImageAssetFromURL(remoteUrl: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // Remote texture url with file extensions
            assetManager.loadRemote<ImageAsset>(remoteUrl, function (err, imageAsset: ImageAsset) {
                if (!err) {
                    resolve(imageAsset);
                } else {
                    reject(err);
                }
            });
        });
    }

    public static loadMaterial(path: string, onProgress?: (finished: number, total: number) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, Material, onProgress, (err, material: Material) => {
                if (!err) {
                    resolve(material);
                } else {
                    reject(err);
                }
            });
        });
    }

    public static loadFileText(path: string, onProgress?: (finished: number, total: number) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, TextAsset, onProgress, (err, text: TextAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(text);
                }
            });
        });
    }
}