import * as Phaser from 'phaser';

const baseAssetsImages = 'assets/images';

export interface GameResourseInterface {
    tankBody: any,
    tankBarrel: any,
    blullet: any,
    mc: any
}

export enum GameResource {
    TANK_BODY = 'TANK_BODY',
    TANK_BARREL = 'TANK_BARREL',
    BLULLET = 'BLULLET',
    EXPLOSION = 'MC'
}

function loaderResource(scene: Phaser.Scene) {
    scene.load.image(GameResource.TANK_BODY, `${baseAssetsImages}/tank-body.png`);
    scene.load.image(GameResource.TANK_BARREL, `${baseAssetsImages}/tank-barrel.png`);
    scene.load.atlas(GameResource.BLULLET, `${baseAssetsImages}/blullet.png`, `${baseAssetsImages}/blullet.json`);
    scene.load.spritesheet(GameResource.EXPLOSION, `${baseAssetsImages}/explosion.png`, { frameWidth: 64, frameHeight: 64, endFrame: 23 });
}

export {
    loaderResource
}