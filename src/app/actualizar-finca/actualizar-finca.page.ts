import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FincaService } from '../services/finca.service';
import { Finca } from '../interfaces/finca';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-actualizar-finca',
  templateUrl: './actualizar-finca.page.html',
  styleUrls: ['./actualizar-finca.page.scss'],
})
export class ActualizarFincaPage implements OnInit {

  form = this.formBuilder.group({
    id: ['', [Validators.required]], 
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
  fincaId = localStorage.getItem("id");

  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private fincaService : FincaService
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
        propietario: ''
      };
    }

  ngOnInit() {
    this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.form.setValue({
        id : finca.id,
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
    })
  }

  actualizarFinca() {
    this.finca.id = this.form.getRawValue().id;
    this.finca.nombre = this.form.getRawValue().nombre;
    this.finca.orientacion = this.form.getRawValue().orientacion;
    this.finca.areaFinca = this.form.getRawValue().areaFinca;
    this.finca.areaGanaderia = this.form.getRawValue().areaGanaderia;
    this.finca.foto = this.form.getRawValue().foto;
    this.finca.departamento = this.form.getRawValue().departamento;
    this.finca.ciudad = this.form.getRawValue().ciudad;
    this.finca.corregimiento = this.form.getRawValue().corregimiento;
    this.finca.coordenadas = this.form.getRawValue().coordenadas;

    this.fincaService.updateFinca(this.finca, this.finca.id);
    this.router.navigate(['/tabs/finca']);
  }

}
