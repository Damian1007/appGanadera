import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FincaService } from '../services/finca.service';
import { Finca } from '../interfaces/finca';
import { Miembro } from '../interfaces/miembro';
import { AutentificarService } from '../services/autentificar.service';
import { Subscription } from 'rxjs';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { format } from 'date-fns';

@Component({
  selector: 'app-crear-finca',
  templateUrl: './crear-finca.page.html',
  styleUrls: ['./crear-finca.page.scss'],
})
export class CrearFincaPage implements OnInit {

  finca : Finca;
  alertas : Alertas;
  miembro : Miembro;
  usuarioId = localStorage.getItem('usuarioId');
  usuarioSub : Subscription;
  randomId : number;

  form = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    orientacion: ['', [Validators.required]],
    areaFinca: ['', [Validators.required]],
    areaGanaderia: ['', [Validators.required]],
    foto: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
    corregimiento: ['', [Validators.required]],
    coordenadas: ['', [Validators.required]],
  });
  
  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private fincaService : FincaService,
    private auth : AutentificarService,
    private alertasService : AlertasService,
  ) { 
      this.finca = {
        id: '',
        nombre: '',
        orientacion: '',
        areaFinca: '',
        areaGanaderia: '',
        foto: '',
        departamento: '',
        ciudad: '',
        corregimiento: '',
        coordenadas: '',
        propietario: this.usuarioId
      };

      this.miembro = {
        id : this.usuarioId,
        rol : 'Propietario',
        nombre : '',
        apellido : ''
      };

      this.alertas = {
        usuario: '',
        cambio: '',
        foto: '',
        fecha: ''
      };
    }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.randomId = Math.floor(Math.random() * 255);

    this.usuarioSub = this.auth.getUsuario(this.usuarioId).subscribe(usuario => {
      this.alertas.usuario = usuario.nombre
      this.miembro.nombre = usuario.nombre;
      this.miembro.apellido = usuario.apellido;
    });
  }

  ionViewDidLeave() {
    this.usuarioSub.unsubscribe();
  }

  crearFinca() {
    this.finca.nombre = this.form.getRawValue().nombre;
    this.finca.orientacion = this.form.getRawValue().orientacion;
    this.finca.areaFinca = this.form.getRawValue().areaFinca;
    this.finca.areaGanaderia = this.form.getRawValue().areaGanaderia;
    this.finca.foto = this.form.getRawValue().foto;
    this.finca.departamento = this.form.getRawValue().departamento;
    this.finca.ciudad = this.form.getRawValue().ciudad;
    this.finca.corregimiento = this.form.getRawValue().corregimiento;
    this.finca.coordenadas = this.form.getRawValue().coordenadas;
    this.finca.id = this.finca.nombre + this.finca.corregimiento + this.randomId;

    this.alertas.cambio = 'Creo la finca ' + this.finca.nombre;
    this.alertas.foto = this.finca.foto;
    this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');

    this.fincaService.addFinca(this.finca, this.miembro)
    .then(() => {
      this.alertasService.addAlerta(this.alertas, this.finca.id);

      this.router.navigate(['/seleccionar-finca'], { replaceUrl: true });
    })
    .catch(error => {
      console.log('Error al Crear finca', error);
    });
  }
}
