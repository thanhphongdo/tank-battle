import * as PIXI from 'pixi.js';

export interface PositionInterface {
    x: number;
    y: number;
}

export class BaseObject {
    gameApp: PIXI.Application
    sprite: PIXI.Sprite | PIXI.AnimatedSprite;
    ticker: PIXI.Ticker;
    stop: boolean = true;
    from: PositionInterface
    to: PositionInterface
    speed: number;
    autoChangeDirection: boolean = true;
    currentAngle: number = 0;
    stopCallback: Function;
    constructor(gameApp: PIXI.Application, sprite: PIXI.Sprite) {
        this.gameApp = gameApp;
        this.sprite = sprite;
        // this.ticker = PIXI.Ticker.shared;
        this.ticker = new PIXI.Ticker();
        this.from = this.position;
        this.to = this.position;
        this.speed = 100;
        this.ticker.start();
        this.ticker.add(() => {
            this.changePosition();
            if (this.distance(this.position, this.to) <= 2) {
                this.sprite.x = this.to.x;
                this.sprite.y = this.to.y;
                this.stop = true;
                this.ticker.stop();
                if (this.stopCallback) {
                    this.stopCallback();
                }
            }
        });
    }

    get position() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
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
        this.ticker.start();
        this.stop = false;
        this.from = from;
        this.to = to;
        this.speed = speed;
    }

    changePosition() {
        if (this.stop) {
            return;
        }
        if (this.from.x == this.to.x && this.from.y == this.from.y) {
            return;
        }

        const vector = {
            x: this.to.x - this.from.x,
            y: this.to.y - this.from.y
        }

        this.currentAngle = this.vectorAngle(this.from, this.to);
        const distance = this.distance(this.from, this.to);
        const vx = Math.cos(this.currentAngle) * this.speed / 60.0;
        const vy = Math.sin(this.currentAngle) * this.speed / 60.0;
        // this.rotate(angle + Math.PI / 2);
        if (!this.stop) {
            if (this.autoChangeDirection) {
                this.sprite.rotation = this.currentAngle + Math.PI / 2;
            }
            this.sprite.x += vx;
            this.sprite.y += vy;
        }

        return {
            angle: this.currentAngle,
            distance
        }
    }

    destroy() {
        this.sprite.destroy();
        this.ticker.destroy();
    }
}