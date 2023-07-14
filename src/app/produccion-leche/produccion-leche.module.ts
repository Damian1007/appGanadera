import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProduccionLechePageRoutingModule } from './produccion-leche-routing.module';
import { ProduccionLechePage } from './produccion-leche.page';

import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ProduccionLechePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProduccionLechePage]
})
export class ProduccionLechePageModule {}
