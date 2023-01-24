import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeleccionarFincaPage } from './seleccionar-finca.page';

const routes: Routes = [
  {
    path: '',
    component: SeleccionarFincaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeleccionarFincaPageRoutingModule {}
