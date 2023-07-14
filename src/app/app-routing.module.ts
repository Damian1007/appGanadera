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
//----------------------------------------- TABS --------------------------------------------
  {
    path: 'finca',
    loadChildren: () => import('./finca/finca.module').then( m => m.FincaPageModule)
  },
  {
    path: 'animales',
    loadChildren: () => import('./animales/animales.module').then( m => m.AnimalesPageModule)
  },
  {
    path: 'animal',
    loadChildren: () => import('./animal/animal.module').then( m => m.AnimalPageModule)
  },
  {
    path: 'salud',
    loadChildren: () => import('./salud/salud.module').then( m => m.SaludPageModule)
  },
  {
    path: 'produccion-carne',
    loadChildren: () => import('./produccion-carne/produccion-carne.module').then( m => m.ProduccionCarnePageModule)
  },
  {
    path: 'produccion-leche',
    loadChildren: () => import('./produccion-leche/produccion-leche.module').then( m => m.ProduccionLechePageModule)
  },
  {
    path: 'reproduccion',
    loadChildren: () => import('./reproduccion/reproduccion.module').then( m => m.ReproduccionPageModule)
  },
  {
    path: 'datos-produccion',
    loadChildren: () => import('./datos-produccion/datos-produccion.module').then( m => m.DatosProduccionPageModule)
  },
  {
    path: 'alertas',
    loadChildren: () => import('./alertas/alertas.module').then( m => m.AlertasPageModule)
  },
  {
    path: 'informes',
    loadChildren: () => import('./informes/informes.module').then( m => m.InformesPageModule)
  },
//-------------------------------------------------------------------------------------------------
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
  {
    path: 'miembros',
    loadChildren: () => import('./miembros/miembros.module').then( m => m.MiembrosPageModule)
  },
  {
    path: 'historia',
    loadChildren: () => import('./historia/historia.module').then( m => m.HistoriaPageModule)
  },
  {
    path: 'repositorio-links',
    loadChildren: () => import('./repositorio-links/repositorio-links.module').then( m => m.RepositorioLinksPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
