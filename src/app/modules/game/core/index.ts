import * as PIXI from 'pixi.js';
import { GameResource, GameResourseInterface, loadResource } from './resource';

import { TankBody, TankBarrel } from './objects';

export class GameApplication {
    app!: PIXI.Application;
    gameResource: GameResourseInterface;
    tankBody: TankBody;
    tankBarrel: TankBarrel;
    constructor() {
        this.app = new PIXI.Application();
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });
        this.loadResource();
        this.app.view.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.tankBody.stop = true;
            this.tankBody.move(this.tankBody.position, {
                x: e.clientX,
                y: e.clientY
            }, 100);
            this.tankBarrel.stop = true;
            this.tankBarrel.move(this.tankBody.position, {
                x: e.clientX,
                y: e.clientY
            }, 100);
        });
        this.app.view.addEventListener('click', (e) => {
            this.tankBarrel.stop = true;
            this.tankBarrel.move(this.tankBody.position, {
                x: e.clientX,
                y: e.clientY
            }, 100);
        });
    }

    async loadResource() {
        this.gameResource = await loadResource(this.app);
        this.tankBody = new TankBody(this.app, this.gameResource.tankBody);
        this.tankBarrel = new TankBarrel(this.app, this.gameResource.tankBarrel);
    }
}