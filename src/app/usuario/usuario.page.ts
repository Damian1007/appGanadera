import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { AutentificarService } from '../services/autentificar.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  usuario : Usuario;
  usuarioId : any = localStorage.getItem("usuarioId");
  usuarioSub : Subscription;

  constructor(
    private autentificarService : AutentificarService
  ) {
    this.usuario = {
      correo: '',
      nombre: '',
      apellido: '',
      contrasena: '',
      pais: '',
      telefono: '',
      departamento: '',
      ciudad: '',
    }
  }

  ngOnInit() {
    this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  ionViewDidLeave() {
    this.usuarioSub.unsubscribe();
  }

}
