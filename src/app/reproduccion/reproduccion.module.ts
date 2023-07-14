import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ReproduccionPageRoutingModule } from './reproduccion-routing.module';
import { ReproduccionPage } from './reproduccion.page';

import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ReproduccionPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ReproduccionPage]
})
export class ReproduccionPageModule {}
