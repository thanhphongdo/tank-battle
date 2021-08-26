import * as Phaser from 'phaser';
import * as Utils from '../utils';
export class BaseSprite {
    uuid: number;
    object: Phaser.Physics.Matter.Sprite;

    constructor(object: Phaser.Physics.Matter.Sprite) {
        this.uuid = Utils.uuid(32);
        this.object = object;
        (this.object as any).uuid = this.uuid;
    }

    get id() {
        return (this.object.body as any).id;
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