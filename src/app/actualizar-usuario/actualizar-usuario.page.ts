import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { AutentificarService } from '../services/autentificar.service';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.page.html',
  styleUrls: ['./actualizar-usuario.page.scss'],
})
export class ActualizarUsuarioPage implements OnInit {

  form = this.formBuilder.group({
    id: ['', [Validators.required]],
    correo: ['', [Validators.email, Validators.required]],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    contraseña: ['', [Validators.required]],
    confirmarContraseña: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
  });

  usuario : Usuario;
  usuarioId : any = localStorage.getItem("usuarioId");
  usuarioSub : Subscription;

  constructor(
    private formBuilder : FormBuilder,
    private autentificarService : AutentificarService,
    private router : Router,
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
      this.form.setValue({
        id: this.usuarioId,
        correo: usu.correo,
        nombre: usu.nombre,
        apellido: usu.apellido,
        contraseña: '',
        confirmarContraseña: '',
        pais: usu.pais,
        telefono: usu.telefono,
        departamento: usu.departamento,
        ciudad: usu.ciudad,
      });
    });
  }

  actualizarUsuario() {
    this.usuario.id = this.form.getRawValue().id;
    this.usuario.correo = this.form.getRawValue().correo;
    this.usuario.nombre = this.form.getRawValue().nombre;
    this.usuario.apellido = this.form.getRawValue().apellido;
    this.usuario.contraseña = this.form.getRawValue().contraseña;
    this.usuario.pais = this.form.getRawValue().pais;
    this.usuario.telefono = this.form.getRawValue().telefono;
    this.usuario.departamento = this.form.getRawValue().departamento;
    this.usuario.ciudad = this.form.getRawValue().ciudad;

    this.autentificarService.updateUsuario(this.usuario, this.usuario.id);
    this.router.navigate(['/usuario']);
  }
}
