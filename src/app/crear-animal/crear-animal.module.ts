import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearAnimalPageRoutingModule } from './crear-animal-routing.module';

import { CrearAnimalPage } from './crear-animal.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CrearAnimalPageRoutingModule
  ],
  declarations: [CrearAnimalPage]
})
export class CrearAnimalPageModule {}
