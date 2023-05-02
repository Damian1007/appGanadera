import { Component } from '@angular/core';
import { AutentificarService } from './services/autentificar.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from './interfaces/usuario';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  usuarioSub : Subscription;
  usuario : Usuario;
  
  public appPages = [
    { title: 'Seleccionar Finca', url: 'seleccionar-finca', icon: 'home' },
    { title: 'Perfil de Usuario', url: 'usuario', icon: 'person-circle' },
    { title: 'Miembros', url: 'miembros', icon: 'people' },
  ];

  constructor(
    private autentificarService : AutentificarService,
    private router : Router
  ) {
    
    if(localStorage.getItem("usuarioId")){
      this.usuarioSub = this.autentificarService.getUsuario(localStorage.getItem("usuarioId")).subscribe(usuario => {
        this.usuario = usuario;
        //console.log(usuario);
      });
    }
  }

  async cerrarSesion() {
    await this.autentificarService.cerrarSesion();
    
    if(this.usuarioSub){
      this.usuarioSub.unsubscribe();
    }
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
