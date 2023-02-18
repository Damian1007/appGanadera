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
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'crear-finca',
    loadChildren: () => import('./crear-finca/crear-finca.module').then( m => m.CrearFincaPageModule)
  },
  {
    path: 'actualizar-finca',
    loadChildren: () => import('./actualizar-finca/actualizar-finca.module').then( m => m.ActualizarFincaPageModule)
  },
  {
    path: 'crear-animal',
    loadChildren: () => import('./crear-animal/crear-animal.module').then( m => m.CrearAnimalPageModule)
  },
  {
    path: 'actualizar-animal',
    loadChildren: () => import('./actualizar-animal/actualizar-animal.module').then( m => m.ActualizarAnimalPageModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
  {
    path: 'actualizar-usuario',
    loadChildren: () => import('./actualizar-usuario/actualizar-usuario.module').then( m => m.ActualizarUsuarioPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
