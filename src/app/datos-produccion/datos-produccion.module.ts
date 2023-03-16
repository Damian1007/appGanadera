import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosProduccionPageRoutingModule } from './datos-produccion-routing.module';

import { DatosProduccionPage } from './datos-produccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosProduccionPageRoutingModule
  ],
  declarations: [DatosProduccionPage]
})
export class DatosProduccionPageModule {}
