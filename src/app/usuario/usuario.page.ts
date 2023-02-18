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
      id: this.usuarioId,
      correo: '',
      nombre: '',
      apellido: '',
      contraseña: '',
      pais: '',
      telefono: '',
      departamento: '',
      ciudad: '',
    }
  }

  ngOnInit() {
    this.usuarioSub = this.autentificarService.getUsuario(this.usuario.id).subscribe(usu => {
      this.usuario = usu;
    });
  }

}
