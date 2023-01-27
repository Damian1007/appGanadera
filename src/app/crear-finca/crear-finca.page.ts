import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FincaService } from '../services/finca.service';

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

  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private fincaService : FincaService
  ) { }

  ngOnInit() {
  }

  crearFinca() {
    this.fincaService.addFinca(this.form.getRawValue());
  }
}
