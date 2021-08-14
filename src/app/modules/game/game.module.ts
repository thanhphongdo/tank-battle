import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';

const routes: Routes = [
  {
    path: '',
    component: GameComponent
  }
];

@NgModule({
  declarations: [
    GameComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class GameModule { }
