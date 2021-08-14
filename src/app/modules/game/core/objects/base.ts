import * as PIXI from 'pixi.js';

export interface PositionInterface {
    x: number;
    y: number;
}

export class BaseObject {
    gameApp: PIXI.Application
    sprite: PIXI.Sprite;
    ticker: PIXI.Ticker;
    stop: boolean = true;
    from: PositionInterface
    to: PositionInterface
    speed: number;
    constructor(gameApp: PIXI.Application, sprite: PIXI.Sprite) {
        this.gameApp = gameApp;
        this.sprite = sprite;
        this.ticker = PIXI.Ticker.shared;

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

    vectorAngle(vector: PositionInterface) {
        const rootVector: PositionInterface = {
            x: 1,
            y: 0
        }
        const cosin =
            ((vector.x * rootVector.x) + (vector.y * rootVector.y)) /
            (Math.sqrt(((Math.pow(vector.x, 2) + Math.pow(vector.y, 2))) * Math.sqrt(Math.pow(rootVector.x, 2) + Math.pow(rootVector.y, 2))));
        return Math.acos(cosin);
    }

    getAngleByVector(from: PositionInterface, to: PositionInterface){
        let addPI = false;
        const vector = {
            x: this.to.x - this.from.x,
            y: this.to.y - this.from.y
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

        const distance = this.distance(this.from, this.to);
        let angle = this.vectorAngle(vector);
        if (addPI) {
            angle += Math.PI;
        }
    }

    rotate(angle: number) {
        this.sprite.rotation = angle;
    }

    move(from: PositionInterface, to: PositionInterface, speed: number) {
        this.stop = false;
        this.from = from;
        this.to = to;
        this.speed = speed;
        const vector = {
            x: this.to.x - this.from.x,
            y: this.to.y - this.from.y
        }
    }

    changePosition() {
        if (this.from.x == this.to.x && this.from.y == this.from.y) {
            return;
        }
        let addPI = false;
        const vector = {
            x: this.to.x - this.from.x,
            y: this.to.y - this.from.y
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

        const distance = this.distance(this.from, this.to);
        let angle = this.vectorAngle(vector);
        if (addPI) {
            angle += Math.PI;
        }
        const vx = Math.cos(angle) * this.speed / 60.0;
        const vy = Math.sin(angle) * this.speed / 60.0;
        // this.sprite.rotation = angle + Math.PI / 2;
        this.rotate(angle + Math.PI / 2);
        if (!this.stop) {
            this.sprite.x += vx;
            this.sprite.y += vy;
        }

        return {
            angle,
            distance
        }
    }
}