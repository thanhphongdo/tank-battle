import * as PIXI from 'pixi.js';
import { GameApplication } from '../..';
import { GameResource, GameResourseInterface } from '../../resource';
import { PositionInterface } from '../base';
import { TankBarrel } from './tank-barrel';
import { TankBlullet } from './tank-blullet';
import { TankBody } from './tank-body';
import * as Utils from '../../utils';

export class Tank {
    gameApp: GameApplication;
    tankBody: TankBody;
    tankBarrel: TankBarrel;
    tankBlullet: TankBlullet;
    shootSpeed: number = 500;
    blulletSpeed: number = 900;
    blulletRange: number = 500;
    acceptShoot = true;
    isMain: boolean;
    eventUUID: string;
    constructor(gameApp: GameApplication, gameResource: GameResourseInterface, isMain: boolean = false) {
        this.gameApp = gameApp;
        this.isMain = isMain;
        this.eventUUID = Utils.uuid(20);
        this.tankBody = new TankBody(gameApp.app, new PIXI.Sprite(PIXI.Texture.from(GameResource.TANK_BODY)));
        this.tankBarrel = new TankBarrel(gameApp.app, new PIXI.Sprite(PIXI.Texture.from(GameResource.TANK_BARREL)), this.tankBody);
    }

    init(position: PositionInterface) {
        this.tankBody.init(position);
        this.tankBarrel.init(position);
        if (this.isMain) {
            this.gameApp.eventHandler.click[this.eventUUID] = (e) => {
                this.onViewClick(e);
            }
            this.gameApp.eventHandler.rightClick[this.eventUUID] = (e) => {
                this.onViewRightClick(e);
            }
            this.gameApp.eventHandler.keydownSpace[this.eventUUID] = (e) => {
                this.shoot();
            }
            this.gameApp.eventHandler.keydownS[this.eventUUID] = (e) => {
                this.stop();
            }
        }
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
        const tankBlullet = new TankBlullet(this.gameApp.app, new PIXI.AnimatedSprite(this.gameApp.gameResource.blullet), this.tankBody, this.tankBarrel);
        tankBlullet.stopCallback = () => {
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

    destroy() {
        delete this.gameApp.eventHandler.click[this.eventUUID];
        delete this.gameApp.eventHandler.rightClick[this.eventUUID];
        delete this.gameApp.eventHandler.keydownSpace[this.eventUUID];
        delete this.gameApp.eventHandler.keydownS[this.eventUUID];
    }
}