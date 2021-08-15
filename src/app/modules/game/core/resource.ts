import * as PIXI from 'pixi.js';

const baseAssetsImages = 'assets/images';

export interface GameResourseInterface {
    tankBody: PIXI.Sprite,
    tankBarrel: PIXI.Sprite,
    blullet: Array<PIXI.Texture<PIXI.Resource>>
}

export enum GameResource {
    TANK_BODY = 'TANK_BODY',
    TANK_BARREL = 'TANK_BARREL',
    BLULLET = 'BLULLET'
}

async function spriteLoader(gameApp: PIXI.Application, name: string, fileName: string): Promise<PIXI.Sprite> {
    return new Promise((resolve, reject) => {
        gameApp.loader.add(name, `${baseAssetsImages}/${fileName}`).load((loader, resources) => {
            const resource = new PIXI.Sprite(resources[name].texture);
            resolve(resource);
        });
    })
}

async function animatedSpriteloader(gameApp: PIXI.Application, name: string, jsonName: string, imagePreName: string, numOfFrame: number): Promise<Array<PIXI.Texture<PIXI.Resource>>> {
    return new Promise((resolve, reject) => {
        gameApp.loader.add(name, `${baseAssetsImages}/${jsonName}`).load((loader, resources) => {
            const frames: Array<PIXI.Texture<PIXI.Resource>> = [];

            for (let i = 0; i < numOfFrame; i++) {
                frames.push(PIXI.Texture.from(`${baseAssetsImages}/${imagePreName}-${i}.png`));
                // frames[i].baseTexture.resolution = 4;
            }

            // const animatedSprite = new PIXI.AnimatedSprite(frames);
            resolve(frames);
        });
    })
}

async function loadResource(gameApp: PIXI.Application): Promise<GameResourseInterface> {
    return {
        tankBody: await spriteLoader(gameApp, GameResource.TANK_BODY, 'tank-body.png'),
        tankBarrel: await spriteLoader(gameApp, GameResource.TANK_BARREL, 'tank-barrel.png'),
        blullet: await animatedSpriteloader(gameApp, GameResource.BLULLET, 'blullet.json', 'blullet', 4)
    }
}

export {
    loadResource
}