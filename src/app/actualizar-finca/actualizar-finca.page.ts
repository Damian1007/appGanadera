import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FincaService } from '../services/finca.service';
import { Finca } from '../interfaces/finca';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-actualizar-finca',
  templateUrl: './actualizar-finca.page.html',
  styleUrls: ['./actualizar-finca.page.scss'],
})
export class ActualizarFincaPage implements OnInit {

  finca : Finca;
  alertas : Alertas;
  fincaId : any = localStorage.getItem('id');
  usuarioId : any = localStorage.getItem('usuarioId');
  fincaSub : Subscription;
  usuarioSub : Subscription;
  
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
    private alertasService : AlertasService,
    private autentificarService : AutentificarService
  ) { 
      this.finca = {
        nombre: '',
        orientacion: '',
        areaFinca: '',
        areaGanaderia: '',
        foto: '',
        departamento: '',
        ciudad: '',
        corregimiento: '',
        coordenadas: '',
        propietario: ''
      };

      this.alertas = {
        usuario: '',
        cambio: '',
        foto: '',
        fecha: ''
      };
    }

  ngOnInit() {
    this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.form.setValue({
        nombre: finca.nombre,
        orientacion: finca.orientacion,
        areaFinca: finca.areaFinca,
        areaGanaderia: finca.areaGanaderia,
        foto: finca.foto,
        departamento: finca.departamento,
        ciudad: finca.ciudad,
        corregimiento: finca.corregimiento,
        coordenadas: finca.coordenadas
      });

      this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
        this.alertas.usuario = usuario.nombre;
      });

      this.alertas.cambio = 'Actualizo la finca ' + finca.nombre;
      this.alertas.foto = finca.foto;
      this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');
    })
  }

  ionViewDidLeave() {
    this.fincaSub.unsubscribe();
    this.usuarioSub.unsubscribe();
  }

  actualizarFinca() {
    this.finca.nombre = this.form.getRawValue().nombre;
    this.finca.orientacion = this.form.getRawValue().orientacion;
    this.finca.areaFinca = this.form.getRawValue().areaFinca;
    this.finca.areaGanaderia = this.form.getRawValue().areaGanaderia;
    this.finca.foto = this.form.getRawValue().foto;
    this.finca.departamento = this.form.getRawValue().departamento;
    this.finca.ciudad = this.form.getRawValue().ciudad;
    this.finca.corregimiento = this.form.getRawValue().corregimiento;
    this.finca.coordenadas = this.form.getRawValue().coordenadas;

    this.fincaService.updateFinca(this.finca, this.fincaId)
    .then(() => {
      this.alertasService.addAlerta(this.alertas, this.fincaId);

      this.router.navigate(['/tabs/finca'], { replaceUrl: true });
    })
    .catch(error => {
      console.log('Error al Actualizar finca', error);
    });
  }

}
