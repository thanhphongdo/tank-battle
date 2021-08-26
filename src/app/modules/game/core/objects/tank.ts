import * as Phaser from 'phaser';
import { MainScene } from '..';
import { PositionInterface } from '../inerfaces';
import { GameResource } from '../resource';
import { BaseSprite } from './base';
import * as Utils from '../utils';

export class Tank {

    uuid: string;
    mainScene: MainScene;
    tankBody: BaseSprite;
    tankBarrel: BaseSprite;
    isStop: boolean = true;
    from: PositionInterface;
    to: PositionInterface;
    speed: number = 100;
    distanceDelta: number;
    shootSpeed = 80;
    canShoot = true;
    type: 'MAIN' | 'ALLY' | 'ENEMY';
    blullets: {
        [key: string]: Blullet;
    } = {};

    static tanks: {
        [key: string]: Tank
    } = {};

    constructor(mainScene: MainScene, type: 'MAIN' | 'ALLY' | 'ENEMY') {
        this.uuid = Utils.uuid(32);
        this.mainScene = mainScene;
        this.type = type;
        Tank.tanks[this.uuid] = this;
    }

    init() {
        this.tankBody = new BaseSprite(this.mainScene.add.sprite(0, 0, GameResource.TANK_BODY));
        this.tankBody.object.setScale(0.125);

        this.tankBarrel = new BaseSprite(this.mainScene.add.sprite(0, 0, GameResource.TANK_BARREL));
        this.tankBarrel.object.setScale(0.125);
        this.tankBarrel.object.setOrigin(0.5, 0.8);

        this.mainScene.eventEmiter.on(this.mainScene.event.timeUpdate, ({ time, delta }) => {
            if (this.isStop) {
                return;
            }
            this.move();
        });

        if (this.type == 'MAIN') {
            this.mainScene.eventEmiter.on(this.mainScene.event.leftClick, (pos: PositionInterface) => {
                this.setTankBarrelRotation(pos);
            });

            this.mainScene.eventEmiter.on(this.mainScene.event.rightClick, (pos: PositionInterface) => {
                this.setTankBodyRotation(pos);
                this.from = this.tankBody.position;
                this.to = pos;
                this.isStop = false;
            });

            this.mainScene.eventEmiter.on(this.mainScene.event.sDown, () => {
                this.isStop = true;
            });

            this.mainScene.eventEmiter.on(this.mainScene.event.spaceDown, () => {
                if (!this.canShoot) {
                    return;
                }
                this.canShoot = false;
                setTimeout(() => {
                    this.canShoot = true;
                }, 60000 / this.shootSpeed);
                this.shoot();
            });
        }
        return this;
    }

    setPosition(x: number, y: number) {
        this.tankBody.setPosition(x, y);
        this.tankBarrel.setPosition(x, y);
        return this;
    }

    setTankBodyRotation(toPos: PositionInterface) {
        this.tankBody.setRotation(Utils.vectorAngle(this.tankBody.position, toPos) + Math.PI / 2);
        return this;
    }

    setTankBarrelRotation(toPos: PositionInterface) {
        this.tankBarrel.setRotation(Utils.vectorAngle(this.tankBody.position, toPos) + Math.PI / 2);
        return this;
    }

    autoAction() {
        setInterval(() => {
            this.from = this.tankBody.position;
            this.to = {
                x: Math.floor(Math.random() * window.innerWidth),
                y: Math.floor(Math.random() * window.innerHeight)
            }
            this.setTankBodyRotation(this.to);
            this.isStop = false;
        }, 3000);
        setInterval(() => {
            this.setTankBarrelRotation({
                x: Math.floor(Math.random() * window.innerWidth),
                y: Math.floor(Math.random() * window.innerHeight)
            });
            this.shoot();
        }, 60000 / this.shootSpeed);
    }

    move() {
        Utils.move(this.tankBody.object, this.from, this.to, this.speed, this.isStop);
        Utils.move(this.tankBarrel.object, this.from, this.to, this.speed, this.isStop);
    }

    shoot() {
        const blullet = new Blullet(this.mainScene, this.tankBody, this.tankBarrel);
        this.blullets[blullet.uuid] = blullet;
        blullet.stopCallback = () => {
            blullet.sprite.destroy();
            delete this.blullets[blullet.uuid];
        }
    }

}

export class Blullet {
    mainScene: MainScene;
    tankBody: BaseSprite;
    tankBarrel: BaseSprite;
    sprite: BaseSprite;
    from: PositionInterface;
    to: PositionInterface;
    speed: number = 500;
    distance: number = 700;
    isStop: boolean = false;
    stopCallback: Function;

    get uuid() {
        return this.sprite.uuid;
    }

    constructor(mainScene: MainScene, tankBody: BaseSprite, tankBarrel: BaseSprite) {
        this.mainScene = mainScene;
        this.tankBody = tankBody;
        this.tankBarrel = tankBarrel;
        this.init();
    }

    init() {
        this.mainScene.anims.create({
            key: GameResource.BLULLET,
            frames: GameResource.BLULLET,
            frameRate: 12,
            repeat: -1
        });
        const w = this.tankBarrel.object.height * this.tankBarrel.object.scaleY * 0.8;
        const dx = w * Math.cos(this.tankBarrel.object.rotation - Math.PI / 2);
        const dy = w * Math.sin(this.tankBarrel.object.rotation - Math.PI / 2);
        this.sprite = new BaseSprite(this.mainScene.add.sprite(this.tankBarrel.object.x + dx, this.tankBarrel.object.y + dy, GameResource.BLULLET).play(GameResource.BLULLET));
        this.sprite.object.setScale(0.25);
        this.sprite.object.setRotation(this.tankBarrel.object.rotation - Math.PI / 2);
        this.from = this.sprite.position;
        this.to = {
            x: this.distance * Math.cos(this.tankBarrel.object.rotation - Math.PI / 2) + this.tankBarrel.object.x + dx,
            y: this.distance * Math.sin(this.tankBarrel.object.rotation - Math.PI / 2) + this.tankBarrel.object.y + dy
        }
        this.mainScene.eventEmiter.on(this.mainScene.event.timeUpdate, ({ time, delta }) => {
            if (this.isStop) {
                return;
            }
            this.move();
        });
        return this;
    }

    move() {
        Utils.move(this.sprite.object, this.from, this.to, this.speed, this.isStop, this.stopCallback);
    }
}