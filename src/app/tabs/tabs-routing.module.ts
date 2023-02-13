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
        path: 'produccion',
        loadChildren: () => import('../finca/finca.module').then( m => m.FincaPageModule)
      },
      {
        path: 'alertas',
        loadChildren: () => import('../animales/animales.module').then( m => m.AnimalesPageModule)
      },
      {
        path: 'informes',
        loadChildren: () => import('../animales/animales.module').then( m => m.AnimalesPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
