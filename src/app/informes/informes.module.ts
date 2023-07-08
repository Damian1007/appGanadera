import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformesPageRoutingModule } from './informes-routing.module';

import { InformesPage } from './informes.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    InformesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InformesPage]
})
export class InformesPageModule {}
