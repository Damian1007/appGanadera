import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AnimalService } from '../services/animal.service';

@Component({
  selector: 'app-crear-animal',
  templateUrl: './crear-animal.page.html',
  styleUrls: ['./crear-animal.page.scss'],
})
export class CrearAnimalPage implements OnInit {

  fincaId : any = localStorage.getItem('id');

  form = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    genero: ['', [Validators.required]],
    foto: ['', [Validators.required]],
    lote: ['', [Validators.required]],
    raza: ['', [Validators.required]],
    grupoEtario: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    padre: ['', [Validators.required]],
    madre: ['', [Validators.required]],
    pesoActual: ['', [Validators.required]],
  });

  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private animalService : AnimalService
  ) { }

  ngOnInit() {
  }

  crearAnimal() {
    this.animalService.addAnimal(this.form.getRawValue(), this.fincaId);
    this.router.navigate(['/tabs/animales']);
  }
}
