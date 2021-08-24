import * as Phaser from 'phaser';
import * as Utils from '../utils';
export class BaseSprite {
    uuid: string;
    object: Phaser.GameObjects.Sprite;

    constructor(object: Phaser.GameObjects.Sprite) {
        this.uuid = Utils.uuid(32);
        this.object = object;
    }

    get position() {
        return {
            x: this.object.x,
            y: this.object.y
        }
    }

    setPosition(x: number, y: number) {
        this.object.setPosition(x, y);
    }

    setRotation(radians: number) {
        this.object.setRotation(radians);
    }

    destroy() {
        this.object.destroy();
    }
}