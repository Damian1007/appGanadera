import { Component } from '@angular/core';
import { AutentificarService } from './services/autentificar.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  public appPages = [
    { title: 'Seleccionar Finca', url: 'seleccionar-finca', icon: 'home' },
    { title: 'Miembros', url: 'seleccionar-finca', icon: 'paper-plane' },
    { title: 'Usuario', url: 'seleccionar-finca', icon: 'heart' },
  ];
  
  usuario$ = this.autentificarService.authState$.pipe(
    filter(state => state ? true : false)
  );

  constructor(
    private autentificarService : AutentificarService,
    private router : Router
  ) {}

  async cerrarSesion() {
    await this.autentificarService.cerrarSesion();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
