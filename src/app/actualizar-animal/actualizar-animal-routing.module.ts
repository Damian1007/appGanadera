import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarAnimalPage } from './actualizar-animal.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarAnimalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarAnimalPageRoutingModule {}
