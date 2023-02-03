import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToSeleccionarFinca = () => redirectLoggedInTo(['seleccionar-finca']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [ AuthGuard ],
    data: { authGuardPipe : redirectLoggedInToSeleccionarFinca },
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    canActivate: [ AuthGuard ],
    data: { authGuardPipe : redirectLoggedInToSeleccionarFinca },
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'seleccionar-finca',
    canActivate: [ AuthGuard ],
    data: { authGuardPipe : redirectUnauthorizedToLogin },
    loadChildren: () => import('./seleccionar-finca/seleccionar-finca.module').then( m => m.SeleccionarFincaPageModule)
  },
  {
    path: 'crear-finca',
    loadChildren: () => import('./crear-finca/crear-finca.module').then( m => m.CrearFincaPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'actualizar-finca',
    loadChildren: () => import('./actualizar-finca/actualizar-finca.module').then( m => m.ActualizarFincaPageModule)
  },
  {
    path: 'crear-animal',
    loadChildren: () => import('./crear-animal/crear-animal.module').then( m => m.CrearAnimalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
