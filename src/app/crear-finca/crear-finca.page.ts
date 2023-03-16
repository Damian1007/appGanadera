import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FincaService } from '../services/finca.service';
import { Finca } from '../interfaces/finca';
import { Miembro } from '../interfaces/miembro';
import { AutentificarService } from '../services/autentificar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crear-finca',
  templateUrl: './crear-finca.page.html',
  styleUrls: ['./crear-finca.page.scss'],
})
export class CrearFincaPage implements OnInit {

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

  finca : Finca;
  miembro : Miembro;
  miembroId = localStorage.getItem('usuarioId');
  randomId : number;
  usuarioSub : Subscription;
  
  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private fincaService : FincaService,
    private auth : AutentificarService
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
        propietario: this.miembroId
      };

      this.miembro = {
        id : this.miembroId,
        rol : 'Propietario',
        nombre : '',
        apellido : ''
      };
    }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.randomId = Math.floor(Math.random() * 255);

    this.usuarioSub = this.auth.getUsuario(this.miembro.id).subscribe(usu => {
      this.miembro.nombre = usu.nombre;
      this.miembro.apellido = usu.apellido;
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

    this.fincaService.addFinca(this.finca, this.miembro);
    this.router.navigate(['/seleccionar-finca']);
  }
}
