import * as PIXI from 'pixi.js';
import { GameApplication } from '../..';
import { GameResource, GameResourseInterface } from '../../resource';
import { BaseObject, PositionInterface } from '../base';
import { TankBarrel } from './tank-barrel';
import { TankBlullet } from './tank-blullet';
import { TankMC } from './tank-mc';
import { TankBody } from './tank-body';
import * as Utils from '../../utils';

export class Tank {
    gameApp: GameApplication;
    type: 'ALLY' | 'ENEMY';
    tankBody: TankBody;
    tankBarrel: TankBarrel;
    shootSpeed: number = 500;
    blulletSpeed: number = 700;
    blulletRange: number = 500;
    acceptShoot = true;
    isMain: boolean;
    uuid: string;
    tankBlullets: {
        [key: string]: TankBlullet
    } = {};
    constructor(gameApp: GameApplication, gameResource: GameResourseInterface, isMain: boolean = false) {
        this.gameApp = gameApp;
        this.isMain = isMain;
        this.uuid = `obj_${Utils.uuid(32)}`;
        this.tankBody = new TankBody(gameApp, new PIXI.Sprite(PIXI.Texture.from(GameResource.TANK_BODY)));
        this.tankBarrel = new TankBarrel(gameApp, new PIXI.Sprite(PIXI.Texture.from(GameResource.TANK_BARREL)), this.tankBody);
    }

    init(position: PositionInterface) {
        this.tankBody.init(position);
        this.tankBarrel.init(position);
        if (this.isMain) {
            this.gameApp.eventHandler.click[this.uuid] = (e) => {
                this.onViewClick(e);
            }
            this.gameApp.eventHandler.rightClick[this.uuid] = (e) => {
                this.onViewRightClick(e);
            }
            this.gameApp.eventHandler.keydownSpace[this.uuid] = (e) => {
                this.shoot();
            }
            this.gameApp.eventHandler.keydownS[this.uuid] = (e) => {
                this.stop();
            }
        }
        // const mc = new PIXI.AnimatedSprite(this.gameApp.gameResource.mc);
        // mc.x = 400;
        // mc.y = 400;
        // mc.anchor.set(0.5);
        // mc.scale.set(0.2);
        // mc.gotoAndPlay(10);
        // this.gameApp.app.stage.addChild(mc);
    }

    tint(color: number) {
        this.tankBody.sprite.tint = color;
        this.tankBarrel.sprite.tint = color;
        // this.tankBlullet.sprite.tint = color;
    }

    rotate(from: PositionInterface, to: PositionInterface) {
        this.tankBody.rotate(from, to);
        this.tankBarrel.rotate(from, to);
    }

    shoot() {
        if (!this.acceptShoot) {
            return;
        }
        this.acceptShoot = false;
        setTimeout(() => {
            this.acceptShoot = true;
        }, this.shootSpeed);
        const tankBlullet = new TankBlullet(this.gameApp, new PIXI.AnimatedSprite(this.gameApp.gameResource.blullet), this.tankBody, this.tankBarrel);
        this.tankBlullets[tankBlullet.uuid] = tankBlullet;
        tankBlullet.stopCallback = () => {
            delete this.gameApp.eventHandler.sharedTicker[this.uuid + tankBlullet.uuid];
            tankBlullet.destroy();
        }
        const w = this.tankBarrel.sprite.height;
        const dx = w * Math.cos(this.tankBarrel.currentAngle);
        const dy = w * Math.sin(this.tankBarrel.currentAngle);
        tankBlullet.init({ x: dx + this.tankBarrel.sprite.x, y: dy + this.tankBarrel.sprite.y });
        tankBlullet.sprite.rotation = this.tankBarrel.currentAngle;
        tankBlullet.autoChangeDirection = false;
        tankBlullet.move(tankBlullet.position, {
            x: tankBlullet.sprite.x + Math.cos(this.tankBarrel.currentAngle) * this.blulletRange,
            y: tankBlullet.sprite.y + Math.sin(this.tankBarrel.currentAngle) * this.blulletRange
        }, this.blulletSpeed);

        this.gameApp.eventHandler.sharedTicker[this.uuid + tankBlullet.uuid] = () => {
            const collision = this.collision(tankBlullet, this.gameApp.tanks.filter(tank => tank.type == (this.type == 'ALLY' ? 'ENEMY' : 'ALLY')));
            if (collision.length) {
                console.log('hitted');
                const tankMc = new TankMC(this.gameApp, new PIXI.AnimatedSprite(this.gameApp.gameResource.mc), tankBlullet);
                tankMc.init();
                delete this.gameApp.eventHandler.sharedTicker[this.uuid + tankBlullet.uuid];
                tankBlullet.stop();
                tankBlullet.destroy();
            }
        }
    }

    move(to: PositionInterface) {
        this.tankBody.isStop = true;
        this.tankBarrel.isStop = true;
        this.tankBody.move(this.tankBody.position, to, 100);
        this.tankBarrel.autoChangeDirection = false;
        this.tankBarrel.move(this.tankBody.position, to, 100);
    }

    stop() {
        this.tankBody.stop();
        this.tankBarrel.stop();
    }

    onViewClick(e: MouseEvent) {
        this.tankBarrel.autoChangeDirection = false;
        this.tankBarrel.rotate(this.tankBody.position, {
            x: e.clientX,
            y: e.clientY
        });
    }

    onViewRightClick(e: MouseEvent) {
        this.move({
            x: e.clientX,
            y: e.clientY
        })
    }

    collision(tankBlullet: TankBlullet, tanks: Array<Tank>) {
        const tankBodys = tanks.map(tank => {
            return tank.tankBody;
        })
        return tankBlullet.collision(tankBodys);
    }

    destroy() {
        delete this.gameApp.eventHandler.click[this.uuid];
        delete this.gameApp.eventHandler.rightClick[this.uuid];
        delete this.gameApp.eventHandler.keydownSpace[this.uuid];
        delete this.gameApp.eventHandler.keydownS[this.uuid];
    }
}