import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizarUsuarioPageRoutingModule } from './actualizar-usuario-routing.module';

import { ActualizarUsuarioPage } from './actualizar-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ActualizarUsuarioPageRoutingModule
  ],
  declarations: [ActualizarUsuarioPage]
})
export class ActualizarUsuarioPageModule {}
