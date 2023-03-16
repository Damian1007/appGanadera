import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosProduccionPage } from './datos-produccion.page';

const routes: Routes = [
  {
    path: '',
    component: DatosProduccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosProduccionPageRoutingModule {}
