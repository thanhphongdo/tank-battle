import * as PIXI from 'pixi.js';
import { GameResourseInterface } from '../../resource';
import { PositionInterface } from '../base';
import { TankBarrel } from './tank-barrel';
import { TankBody } from './tank-body';

export class Tank {
    tankBody: TankBody;
    tankBarrel: TankBarrel;
    constructor(gameApp: PIXI.Application, gameResource: GameResourseInterface) {
        this.tankBody = new TankBody(gameApp, gameResource.tankBody);
        this.tankBarrel = new TankBarrel(gameApp, gameResource.tankBarrel, this.tankBody);
    }

    init(position: PositionInterface) {
        this.tankBody.init(position);
        this.tankBarrel.init(position);
    }

    onViewClick(e: MouseEvent) {
        this.tankBarrel.autoChangeDirection = false;
        this.tankBarrel.rotate(this.tankBody.position, {
            x: e.clientX,
            y: e.clientY
        });
    }

    onViewRightClick(e: MouseEvent) {
        this.tankBody.stop = true;
        this.tankBarrel.stop = true;
        this.tankBarrel.autoChangeDirection = false;
        this.tankBody.move(this.tankBody.position, {
            x: e.clientX,
            y: e.clientY
        }, 100);
        this.tankBarrel.move(this.tankBody.position, {
            x: e.clientX,
            y: e.clientY
        }, 100);
    }
}