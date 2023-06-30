import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiembrosPageRoutingModule } from './miembros-routing.module';

import { MiembrosPage } from './miembros.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MiembrosPageRoutingModule
  ],
  declarations: [MiembrosPage]
})
export class MiembrosPageModule {}
