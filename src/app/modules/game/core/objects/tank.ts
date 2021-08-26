import * as Phaser from 'phaser';
import { MainScene } from '..';
import { PositionInterface } from '../inerfaces';
import { GameResource } from '../resource';
import { BaseSprite } from './base';
import * as Utils from '../utils';

export class Tank {

    uuid: number;
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
    canSpeedUp = true;
    speedUpTimeout = 15000;
    type: 'MAIN' | 'ALLY' | 'ENEMY';
    blood: number = 1000;
    dmg: number = 80;
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
        this.tankBody = new BaseSprite(this.mainScene.matter.add.sprite(0, 0, GameResource.TANK_BODY, null, { isSensor: true }));
        this.tankBody.object.setScale(0.125);
        this.tankBody.object.setCollisionGroup(this.uuid);

        this.tankBarrel = new BaseSprite(this.mainScene.matter.add.sprite(0, 0, GameResource.TANK_BARREL, null, { isSensor: true }));
        this.tankBarrel.object.setScale(0.125);
        this.tankBarrel.object.setOrigin(0.5, 0.8);
        this.tankBarrel.object.setCollisionGroup(this.uuid);

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

            this.mainScene.eventEmiter.on(this.mainScene.event.qDown, () => {
                if (this.isStop) {
                    return;
                }
                if (!this.canSpeedUp) {
                    return;
                }
                this.canSpeedUp = false;
                setTimeout(() => {
                    this.canSpeedUp = true;
                }, this.speedUpTimeout);
                this.speedUp(this.speed + 50, 1000);
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
            this.mainScene.eventEmiter.on(this.mainScene.event.rDown, () => {
                // if (!this.canShoot) {
                //     return;
                // }
                // this.canShoot = false;
                // setTimeout(() => {
                //     this.canShoot = true;
                // }, 60000 / this.shootSpeed);
                this.skillR();
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
        Utils.move(this.tankBody.object as any, this.from, this.to, this.speed, this.isStop);
        Utils.move(this.tankBarrel.object as any, this.from, this.to, this.speed, this.isStop);
    }

    shoot() {
        const blullet = new Blullet(this.mainScene, this);
        blullet.dmg = this.dmg;
        blullet.stopCallback = () => {
            blullet.destroy();
            delete this.blullets[blullet.uuid];
        }
        blullet.init();
        this.blullets[blullet.uuid] = blullet;
    }

    speedUp(speed, time) {
        const currentSpeed = this.speed;
        this.speed += speed;
        setTimeout(() => {
            this.speed = currentSpeed;
        }, time);
    }

    skillR() {
        this.shoot();
        setTimeout(() => {
            this.shoot();
        }, 100);
        setTimeout(() => {
            this.shoot();
        }, 200);
    }

    isHitted(dmg: number) {
        this.blood -= dmg;
        if (this.blood <= 0) {
            this.destroy();
            console.log('destroy');
        }
    }

    destroy() {
        this.tankBody.destroy();
        this.tankBarrel.destroy();
    }

}

export class Blullet {
    // uuid: number;
    mainScene: MainScene;
    tank: Tank;
    tankBody: BaseSprite;
    tankBarrel: BaseSprite;
    sprite: BaseSprite;
    from: PositionInterface;
    to: PositionInterface;
    speed: number = 500;
    distance: number = 700;
    isStop: boolean = false;
    stopCallback: Function;
    dmg: number;
    isDestroyed: boolean = false;

    get uuid() {
        return this.tank.uuid + this.sprite.uuid;
    }

    constructor(mainScene: MainScene, tank: Tank) {
        this.mainScene = mainScene;
        this.tank = tank;
        this.tankBody = tank.tankBody;
        this.tankBarrel = tank.tankBarrel;
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
        this.sprite = new BaseSprite(
            this.mainScene.matter.add.sprite(
                this.tankBarrel.object.x + dx,
                this.tankBarrel.object.y + dy,
                GameResource.BLULLET,
                null,
                { isSensor: true }).play(GameResource.BLULLET));
        this.sprite.object.setCollisionGroup(this.uuid);
        this.sprite.object.setScale(0.25);
        this.setRotation(this.tankBarrel.object.rotation - Math.PI / 2);
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
        const enemyTanks = Object.keys(Tank.tanks).map(key => {
            if (Tank.tanks[key] && Tank.tanks[key].type == 'ENEMY') {
                return Tank.tanks[key];
            }
            return null;
        }).filter(tank => tank);

        this.mainScene.eventEmiter.on(this.mainScene.event.collisionStart, ({ event, bodyA, bodyB }) => {
            if (bodyA.collisionFilter.group == this.uuid || bodyB.collisionFilter.group == this.uuid) {
                if (this.isDestroyed) {
                    return;
                }
                const tankTarget = enemyTanks.find(tank => {
                    return bodyA.collisionFilter.group == tank.uuid || bodyB.collisionFilter.group == tank.uuid;
                });
                if (tankTarget) {
                    this.isStop = true;
                    this.sprite.destroy();
                    console.log('hit');
                    tankTarget.isHitted(this.dmg);
                }
            }
        });
        return this;
    }

    setRotation(angle: number) {
        this.sprite.object.setRotation(angle);
        return this;
    }

    move() {
        Utils.move(this.sprite.object as any, this.from, this.to, this.speed, this.isStop, this.stopCallback);
    }

    destroy() {
        this.sprite.destroy();
        this.isDestroyed = true;
    }
}