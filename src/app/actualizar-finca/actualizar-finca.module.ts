import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizarFincaPageRoutingModule } from './actualizar-finca-routing.module';

import { ActualizarFincaPage } from './actualizar-finca.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ActualizarFincaPageRoutingModule
  ],
  declarations: [ActualizarFincaPage]
})
export class ActualizarFincaPageModule {}
