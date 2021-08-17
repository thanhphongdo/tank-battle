import * as PIXI from 'pixi.js';

const baseAssetsImages = 'assets/images';

export interface GameResourseInterface {
    tankBody: PIXI.Sprite,
    tankBarrel: PIXI.Sprite,
    blullet: Array<PIXI.Texture<PIXI.Resource>>,
    mc: Array<PIXI.Texture<PIXI.Resource>>
}

export enum GameResource {
    TANK_BODY = 'TANK_BODY',
    TANK_BARREL = 'TANK_BARREL',
    BLULLET = 'BLULLET',
    MC = 'MC'
}

async function spriteLoader(gameApp: PIXI.Application, name: string, fileName: string): Promise<PIXI.Sprite> {
    return new Promise((resolve, reject) => {
        gameApp.loader.add(name, `${baseAssetsImages}/${fileName}`).load((loader, resources) => {
            const resource = new PIXI.Sprite(resources[name].texture);
            resolve(resource);
        });
    })
}

async function animatedSpriteloader(gameApp: PIXI.Application, name: string, jsonName: string, callback: Function): Promise<Array<PIXI.Texture<PIXI.Resource>>> {
    return new Promise((resolve, reject) => {
        gameApp.loader.add(name, `${baseAssetsImages}/${jsonName}`).load((loader, resources) => {
            const frames: Array<PIXI.Texture<PIXI.Resource>> = [];

            if (callback) {
                callback(frames);
            }
            resolve(frames);
        });
    })
}

async function loadResource(gameApp: PIXI.Application): Promise<GameResourseInterface> {
    return {
        tankBody: await spriteLoader(gameApp, GameResource.TANK_BODY, 'tank-body.png'),
        tankBarrel: await spriteLoader(gameApp, GameResource.TANK_BARREL, 'tank-barrel.png'),
        blullet: await animatedSpriteloader(gameApp, GameResource.BLULLET, 'blullet.json', (frames: Array<any>) => {
            for (let i = 0; i < 4; i++) {
                frames.push(PIXI.Texture.from(`${baseAssetsImages}/blullet-${i}.png`));
            }
        }),
        mc: await animatedSpriteloader(gameApp, GameResource.MC, 'mc.json', (frames: Array<any>) => {
            for (let i = 0; i < 26; i++) {
                const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
                frames.push(texture);
            }
        }),
    }
}

export {
    loadResource
}