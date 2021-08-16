import * as PIXI from 'pixi.js';
import { GameResource, GameResourseInterface, loadResource } from './resource';

import { Tank } from './objects';

export class GameApplication {
    app!: PIXI.Application;
    gameResource: GameResourseInterface;
    eventHandler: {
        click: {
            [key: string]: (e: MouseEvent) => any;
        },
        rightClick: {
            [key: string]: (e: MouseEvent) => any;
        },
        keydownSpace: {
            [key: string]: (e: KeyboardEvent) => any;
        },
        keydownS: {
            [key: string]: (e: KeyboardEvent) => any;
        }
    } = {
            click: {},
            rightClick: {},
            keydownSpace: {},
            keydownS: {}
        }
    constructor() {
        this.app = new PIXI.Application();
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });
        this.loadResource();
        this.app.view.addEventListener('click', (e) => {
            Object.keys(this.eventHandler.click).forEach(key => {
                if (typeof this.eventHandler.click[key] == 'function') {
                    this.eventHandler.click[key](e);
                }
            });
        });
        this.app.view.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            Object.keys(this.eventHandler.rightClick).forEach(key => {
                if (typeof this.eventHandler.rightClick[key] == 'function') {
                    this.eventHandler.rightClick[key](e);
                }
            });
        });
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'Space':
                    Object.keys(this.eventHandler.keydownSpace).forEach(key => {
                        if (typeof this.eventHandler.keydownSpace[key] == 'function') {
                            this.eventHandler.keydownSpace[key](e);
                        }
                    });
                    break;
                case 'KeyS':
                    Object.keys(this.eventHandler.keydownS).forEach(key => {
                        if (typeof this.eventHandler.keydownS[key] == 'function') {
                            this.eventHandler.keydownS[key](e);
                        }
                    });
                    break;
            }
        });
    }

    async loadResource() {
        this.gameResource = await loadResource(this.app);
        const mainTank = new Tank(this, this.gameResource, true);
        mainTank.init({
            x: mainTank.tankBody.sprite.width / 8,
            y: mainTank.tankBody.sprite.height / 8
        });
        mainTank.rotate({ x: 0, y: 0 }, { x: 1, y: 1 });

        const subTank = new Tank(this, this.gameResource, false);
        subTank.init({
            x: this.app.view.width - mainTank.tankBody.sprite.width / 8 - 100,
            y: this.app.view.height - mainTank.tankBody.sprite.height / 8 - 100
        });
        subTank.rotate({ x: 0, y: 0 }, { x: -1, y: -1 });
        subTank.tint(0x097F8C);
        // setInterval(() => {
        //     subTank.stop();
        //     const x = Math.random() * this.app.view.width - 30;
        //     const y = Math.random() * this.app.view.height - 30;
        //     subTank.move({ x, y });
        // }, 3000);

        // setInterval(() => {
        //     subTank.shoot();
        //     // const x = Math.random() * this.app.view.width - 30;
        //     // const y = Math.random() * this.app.view.height - 30;
        //     subTank.tankBarrel.rotate(subTank.tankBody.position, mainTank.tankBody.position);
        // }, 700)
    }
}