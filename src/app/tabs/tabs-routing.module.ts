import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'finca',
        loadChildren: () => import('../finca/finca.module').then( m => m.FincaPageModule)
      },
      {
        path: 'animales',
        loadChildren: () => import('../animales/animales.module').then( m => m.AnimalesPageModule)
      },
      {
        path: 'animal',
        loadChildren: () => import('../animal/animal.module').then( m => m.AnimalPageModule)
      },
      {
        path: 'salud',
        loadChildren: () => import('../salud/salud.module').then( m => m.SaludPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
