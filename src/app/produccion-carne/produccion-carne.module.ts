import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProduccionCarnePageRoutingModule } from './produccion-carne-routing.module';

import { ProduccionCarnePage } from './produccion-carne.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ProduccionCarnePageRoutingModule
  ],
  declarations: [ProduccionCarnePage]
})
export class ProduccionCarnePageModule {}
