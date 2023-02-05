import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizarAnimalPageRoutingModule } from './actualizar-animal-routing.module';

import { ActualizarAnimalPage } from './actualizar-animal.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ActualizarAnimalPageRoutingModule
  ],
  declarations: [ActualizarAnimalPage]
})
export class ActualizarAnimalPageModule {}
