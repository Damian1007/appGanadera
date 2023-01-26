import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearFincaPage } from './crear-finca.page';

const routes: Routes = [
  {
    path: '',
    component: CrearFincaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearFincaPageRoutingModule {}
