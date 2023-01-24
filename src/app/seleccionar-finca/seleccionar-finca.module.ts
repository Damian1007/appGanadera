import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeleccionarFincaPageRoutingModule } from './seleccionar-finca-routing.module';

import { SeleccionarFincaPage } from './seleccionar-finca.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeleccionarFincaPageRoutingModule
  ],
  declarations: [SeleccionarFincaPage]
})
export class SeleccionarFincaPageModule {}
