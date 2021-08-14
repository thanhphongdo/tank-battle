import * as PIXI from 'pixi.js';

export interface GameResourseInterface {
    tankBody: PIXI.Sprite,
    tankBarrel: PIXI.Sprite,
}

export enum GameResource {
    TANK_BODY = 'TANK_BODY',
    TANK_BARREL = 'TANK_BARREL',
    BLULLET_0 = 'BLULLET_0',
    BLULLET_1 = 'BLULLET_1',
    BLULLET_2 = 'BLULLET_2',
    BLULLET_3 = 'BLULLET_3',
}

async function loader(gameApp: PIXI.Application, name: string, path: string): Promise<PIXI.Sprite> {
    return new Promise((resolve, reject) => {
        gameApp.loader.add(name, path).load((loader, resources) => {
            const resource = new PIXI.Sprite(resources[name].texture);
            resolve(resource);
        });
    })
}

async function loadResource(gameApp: PIXI.Application): Promise<GameResourseInterface> {
    return {
        tankBody: await loader(gameApp, GameResource.TANK_BODY, 'assets/images/tank-body.png'),
        tankBarrel: await loader(gameApp, GameResource.TANK_BARREL, 'assets/images/tank-barrel.png')
    }
}

export {
    loadResource
}