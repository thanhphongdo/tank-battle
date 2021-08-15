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
        this.tank = new Tank(this, this.gameResource);
        this.tank.init({
            x: 100,
            y: 100
        });

        // var blullet = new PIXI.AnimatedSprite(this.gameResource.blullet);
        // blullet.x = this.app.screen.width / 2;
        // blullet.y = this.app.screen.height / 2;
        // blullet.tint = 0xFEFE00;
        // blullet.anchor.set(0.5);
        // blullet.animationSpeed = 0.5;
        // blullet.scale.x = 1 / 4;
        // blullet.scale.y = 1 / 4;
        // // for (var i = 0; i < 4; i++) {
        // //     (blullet.textures[i] as PIXI.Texture<PIXI.Resource>).baseTexture.resolution = 4;
        // // }

        // blullet.play();
        // this.app.stage.addChild(blullet)
        // // this.gameResource.blullet
        // // PIXI.AnimatedSprite.from('')
        // var blullet2 = new PIXI.AnimatedSprite(this.gameResource.blullet);
        // blullet2.x = this.app.screen.width / 2 + 100;
        // blullet2.y = this.app.screen.height / 2 + 100;
        // blullet2.tint = 0xFEFE00;
        // blullet2.anchor.set(0.5);
        // blullet2.animationSpeed = 0.5;
        // for (var i = 0; i < 4; i++) {
        //     (blullet2.textures[i] as PIXI.Texture<PIXI.Resource>).baseTexture.resolution = 1;
        // }

        // blullet2.play();
        // this.app.stage.addChild(blullet2)

    }
}