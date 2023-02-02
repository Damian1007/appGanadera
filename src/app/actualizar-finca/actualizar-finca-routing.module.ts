import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarFincaPage } from './actualizar-finca.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarFincaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarFincaPageRoutingModule {}
