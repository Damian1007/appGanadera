import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProduccionLechePage } from './produccion-leche.page';

const routes: Routes = [
  {
    path: '',
    component: ProduccionLechePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProduccionLechePageRoutingModule {}
