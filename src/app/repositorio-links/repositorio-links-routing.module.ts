import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepositorioLinksPage } from './repositorio-links.page';

const routes: Routes = [
  {
    path: '',
    component: RepositorioLinksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepositorioLinksPageRoutingModule {}
