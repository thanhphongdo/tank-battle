import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import 'phaser';
// import { GameApplication } from './core';
import { Game } from './core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {

  @ViewChild('game') game: ElementRef;
  gameApp: Phaser.Game;

  // get tank() {
  //   return this.gameApp?.tank;
  // }

  constructor() {
    // this.gameApp = new GameApplication();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.game.nativeElement.appendChild(Game.canvas);
  }

}
