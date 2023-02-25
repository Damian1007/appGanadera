import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProduccionLechePageRoutingModule } from './produccion-leche-routing.module';

import { ProduccionLechePage } from './produccion-leche.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProduccionLechePageRoutingModule
  ],
  declarations: [ProduccionLechePage]
})
export class ProduccionLechePageModule {}
