import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Animal } from '../interfaces/animal';
import { AnimalService } from '../services/animal.service';

@Component({
  selector: 'app-actualizar-animal',
  templateUrl: './actualizar-animal.page.html',
  styleUrls: ['./actualizar-animal.page.scss'],
})
export class ActualizarAnimalPage implements OnInit {

  animal : Animal;
  fincaId : any = localStorage.getItem('id');
  animalSub : Subscription;

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
  ) { 
      this.animal = {
        id: localStorage.getItem('animalId'),
        nombre: '',
        genero: '',
        foto: '',
        lote: '',
        raza: '',
        grupoEtario: '',
        fechaNacimiento: '',
        padre: '',
        madre: '',
        pesoActual: ''
      };
    }

  ngOnInit() {
    this.animalSub = this.animalService.getAnimal(this.fincaId, this.animal.id).subscribe(animal => {
      this.form.setValue(animal);
    })
  }

  ionViewDidLeave() {
    this.animalSub.unsubscribe();
  }

  actualizarAnimal() {
    this.animal.nombre = this.form.getRawValue().nombre;
    this.animal.genero = this.form.getRawValue().genero;
    this.animal.foto = this.form.getRawValue().foto;
    this.animal.lote = this.form.getRawValue().lote;
    this.animal.raza = this.form.getRawValue().raza;
    this.animal.grupoEtario = this.form.getRawValue().grupoEtario;
    this.animal.fechaNacimiento = this.form.getRawValue().fechaNacimiento;
    this.animal.padre = this.form.getRawValue().padre;
    this.animal.madre = this.form.getRawValue().madre;
    this.animal.pesoActual = this.form.getRawValue().pesoActual;

    this.animalService.updateAnimal(this.animal, this.fincaId, this.animal.id);
    this.router.navigate(['/tabs/animal'], { replaceUrl: true });
  }

}
