import * as PIXI from 'pixi.js';
import { GameApplication } from '..';
import * as Utils from '../utils';
import { Bump } from './bump';
const bumb = new Bump(PIXI);

export interface PositionInterface {
    x: number;
    y: number;
}

export class BaseObject {
    gameApp: GameApplication
    sprite: PIXI.Sprite | PIXI.AnimatedSprite;
    ticker: PIXI.Ticker;
    isStop: boolean = true;
    from: PositionInterface
    to: PositionInterface
    speed: number;
    autoChangeDirection: boolean = true;
    currentAngle: number = 0;
    stopCallback: Function;
    uuid: string;
    distanceDelta: number;
    constructor(gameApp: GameApplication, sprite: PIXI.Sprite) {
        this.uuid = `obj_${Utils.uuid(32)}`;
        this.gameApp = gameApp;
        this.sprite = sprite;
        // this.ticker = new PIXI.Ticker();
        this.from = this.position;
        this.to = this.position;
        this.speed = 100;
        // this.ticker.start();
        // this.ticker.add(() => {
        //     this.changePosition();
        //     if (this.distance(this.position, this.to) <= this.distanceDelta + 1) {
        //         this.sprite.x = this.to.x;
        //         this.sprite.y = this.to.y;
        //         this.stop();
        //     }
        // });
        this.addToMovementSharedTicker();
    }

    get position() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        }
    }

    addToMovementSharedTicker() {
        this.gameApp.eventHandler.sharedTicker[`move_${this.uuid}`] = () => {
            this.changePosition();
            if (this.distance(this.position, this.to) <= this.distanceDelta + 1) {
                this.sprite.x = this.to.x;
                this.sprite.y = this.to.y;
                this.stop();
            }
        }
    }

    distance(from: PositionInterface, to: PositionInterface) {
        return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
    }

    vector(from: PositionInterface, to: PositionInterface) {
        return {
            x: to.x - from.x,
            y: to.y - from.y
        }
    }

    vectorAngle(from: PositionInterface, to: PositionInterface) {
        const vector = this.vector(from, to);
        let addPI = false;
        const rootVector: PositionInterface = {
            x: 1,
            y: 0
        }
        if (vector.x < 0 && vector.y < 0) {
            vector.x = -vector.x;
            vector.y = -vector.y;
            addPI = true;
        }
        if (vector.x > 0 && vector.y < 0) {
            vector.x = -vector.x;
            vector.y = -vector.y;
            addPI = true;
        }
        const cosin =
            ((vector.x * rootVector.x) + (vector.y * rootVector.y)) /
            (Math.sqrt(((Math.pow(vector.x, 2) + Math.pow(vector.y, 2))) * Math.sqrt(Math.pow(rootVector.x, 2) + Math.pow(rootVector.y, 2))));
        let angle = Math.acos(cosin);
        if (addPI) {
            angle += Math.PI;
        }
        return angle;
    }

    rotate(from: PositionInterface, to: PositionInterface) {
        this.currentAngle = this.vectorAngle(from, to);
        this.sprite.rotation = this.currentAngle + Math.PI / 2;
    }

    scale(value: number) {
        this.sprite.scale.x = value;
        this.sprite.scale.y = value;
    }

    move(from: PositionInterface, to: PositionInterface, speed: number) {
        // this.ticker.start();
        this.isStop = false;
        this.from = from;
        this.to = to;
        this.speed = speed;
        this.addToMovementSharedTicker();
    }

    stop() {
        this.isStop = true;
        // this.ticker.stop();
        delete this.gameApp.eventHandler.sharedTicker[`move_${this.uuid}`];
        if (this.stopCallback) {
            this.stopCallback();
        }
    }

    changePosition() {
        if (this.isStop) {
            return;
        }
        if (this.from.x == this.to.x && this.from.y == this.from.y) {
            return;
        }

        const vector = {
            x: this.to.x - this.from.x,
            y: this.to.y - this.from.y
        }

        const angle = this.vectorAngle(this.from, this.to);
        const distance = this.distance(this.from, this.to);
        const dx = Math.cos(angle) * this.speed / 60.0;
        const dy = Math.sin(angle) * this.speed / 60.0;
        this.distanceDelta = Math.sqrt(dx * dx + dy * dy);
        if (!this.isStop) {
            if (this.autoChangeDirection) {
                this.sprite.rotation = angle + Math.PI / 2;
            }
            this.sprite.x += dx;
            this.sprite.y += dy;
        }

        return {
            angle,
            distance
        }
    }

    collision(obj: Array<BaseObject>) {
        return obj.filter(item => {
            return bumb.hit(this.sprite, item.sprite, true, false, true);
        });

    }

    destroy() {
        this.sprite.visible = false;
        if (this.gameApp.eventHandler.sharedTicker[`move_${this.uuid}`]) {
            delete this.gameApp.eventHandler.sharedTicker[`move_${this.uuid}`];
        }
        try {
            this.sprite.destroy();
        } catch (e) { }
    }
}