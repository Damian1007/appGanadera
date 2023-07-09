import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';
import { AutentificarService } from 'src/app/services/autentificar.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  usuarioSub : Subscription;
  usuario : Usuario;

  constructor(
    private autentificarService : AutentificarService,
    private router : Router
  ) { }

  ngOnInit() {
    if(localStorage.getItem("usuarioId")){
      this.usuarioSub = this.autentificarService.getUsuario(localStorage.getItem("usuarioId")).subscribe(usuario => {
        this.usuario = usuario;
        //console.log(usuario);
      });
    }
  }

  seleccionar() {
    this.router.navigate(['/seleccionar-finca'], { replaceUrl: true });
  }

  perfil() {
    this.router.navigate(['/usuario'], { replaceUrl: true });
  }

  miembros() {
    this.router.navigate(['/miembros'], { replaceUrl: true });
  }

  web() {
    this.router.navigate(['/repositorio-links'], { replaceUrl: true });
  }

  async cerrarSesion() {
    await this.autentificarService.cerrarSesion();
    
    if(this.usuarioSub){
      this.usuarioSub.unsubscribe();
    }
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
