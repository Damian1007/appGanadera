import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProduccionCarnePageRoutingModule } from './produccion-carne-routing.module';
import { ProduccionCarnePage } from './produccion-carne.page';

import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ProduccionCarnePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProduccionCarnePage]
})
export class ProduccionCarnePageModule {}
