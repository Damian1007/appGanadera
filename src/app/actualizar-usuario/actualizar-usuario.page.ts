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

  usuario : Usuario;
  usuarioId : any = localStorage.getItem("usuarioId");
  usuarioSub : Subscription;

  form = this.formBuilder.group({
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

  constructor(
    private formBuilder : FormBuilder,
    private autentificarService : AutentificarService,
    private router : Router,
  ) { 
    this.usuario = {
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
    this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usu => {
      this.form.setValue({
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

  ionViewDidLeave() {
    this.usuarioSub.unsubscribe();
  }

  actualizarUsuario() {
    this.usuario.correo = this.form.getRawValue().correo;
    this.usuario.nombre = this.form.getRawValue().nombre;
    this.usuario.apellido = this.form.getRawValue().apellido;
    this.usuario.contraseña = this.form.getRawValue().contraseña;
    this.usuario.pais = this.form.getRawValue().pais;
    this.usuario.telefono = this.form.getRawValue().telefono;
    this.usuario.departamento = this.form.getRawValue().departamento;
    this.usuario.ciudad = this.form.getRawValue().ciudad;

    this.autentificarService.updateUsuario(this.usuario, this.usuarioId)
    .then(() => {
      this.router.navigate(['/usuario'], { replaceUrl: true });
    })
    .catch(error => {
      console.log('Error al Actualizar usuario', error);
    });
  }
}
