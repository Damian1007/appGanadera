import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProduccionCarnePage } from './produccion-carne.page';

const routes: Routes = [
  {
    path: '',
    component: ProduccionCarnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProduccionCarnePageRoutingModule {}
