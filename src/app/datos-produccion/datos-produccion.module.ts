import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DatosProduccionPageRoutingModule } from './datos-produccion-routing.module';
import { DatosProduccionPage } from './datos-produccion.page';

import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosProduccionPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DatosProduccionPage]
})
export class DatosProduccionPageModule {}
