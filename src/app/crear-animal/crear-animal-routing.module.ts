import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearAnimalPage } from './crear-animal.page';

const routes: Routes = [
  {
    path: '',
    component: CrearAnimalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearAnimalPageRoutingModule {}
