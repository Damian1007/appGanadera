import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepositorioLinksPageRoutingModule } from './repositorio-links-routing.module';

import { RepositorioLinksPage } from './repositorio-links.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepositorioLinksPageRoutingModule
  ],
  declarations: [RepositorioLinksPage]
})
export class RepositorioLinksPageModule {}
