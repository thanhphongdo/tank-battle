import * as PIXI from 'pixi.js';
import { GameResource, GameResourseInterface, loadResource } from './resource';

import { Tank } from './objects';

export class GameApplication {
    app!: PIXI.Application;
    gameResource: GameResourseInterface;
    tank: Tank;
    constructor() {
        this.app = new PIXI.Application();
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });
        this.loadResource();
        this.app.view.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.tank.onViewRightClick(e);
        });
        this.app.view.addEventListener('click', (e) => {
            this.tank.onViewClick(e);
        });
    }

    async loadResource() {
        this.gameResource = await loadResource(this.app);
        this.tank = new Tank(this.app, this.gameResource);
        this.tank.init({
            x: 100,
            y: 100
        });
    }
}