import * as Phaser from 'phaser';
import { Tank } from './objects/tank';
import { loaderResource, GameResource } from './resource';

export class MainScene extends Phaser.Scene {
    eventEmiter: Phaser.Events.EventEmitter;
    event = {
        leftClick: 'LEFT_CICK',
        rightClick: 'RIGHT_CICK',
        timeUpdate: 'TIME_UPDATE',
        spaceDown: 'SPACE_DOWN',
        sDown: 'S_DOWN'
    }
    constructor() {
        super(MainScene.name);
    }

    preload() {
        loaderResource(this);
    }

    create() {
        this.eventEmiter = new Phaser.Events.EventEmitter();
        new Tank(this, 'MAIN').init().setPosition(100, 100);
        new Tank(this, 'ENEMY').init().setPosition(400, 400).autoAction();
        this.input.mouse.disableContextMenu();
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.eventEmiter.emit(this.event.rightClick, {
                    x: this.input.x,
                    y: this.input.y
                });
            } else {
                this.eventEmiter.emit(this.event.leftClick, {
                    x: this.input.x,
                    y: this.input.y
                });
            }
        });
        this.input.keyboard.addKey('SPACE').on('down', (event) => {
            this.eventEmiter.emit(this.event.spaceDown);
        });
        this.input.keyboard.addKey('S').on('down', (event) => {
            this.eventEmiter.emit(this.event.sDown);
        });
    }

    update(time: number, delta: number) {
        this.eventEmiter.emit(this.event.timeUpdate, { time, delta });
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    // backgroundColor: '#125555',
    width: window.innerWidth,
    height: window.innerHeight,
    fps: {
        target: 60
    },
    scene: MainScene
};

export const Game = new Phaser.Game(config);

// Game.canvas.addEventListener('click', ()=>{
//     Game.scene.emi
// });