import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearFincaPageRoutingModule } from './crear-finca-routing.module';

import { CrearFincaPage } from './crear-finca.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CrearFincaPageRoutingModule
  ],
  declarations: [CrearFincaPage]
})
export class CrearFincaPageModule {}
