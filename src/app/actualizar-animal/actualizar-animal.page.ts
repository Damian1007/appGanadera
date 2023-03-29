import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Animal } from '../interfaces/animal';
import { AnimalService } from '../services/animal.service';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { FincaService } from '../services/finca.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-actualizar-animal',
  templateUrl: './actualizar-animal.page.html',
  styleUrls: ['./actualizar-animal.page.scss'],
})
export class ActualizarAnimalPage implements OnInit {

  animal : Animal;
  alertas : Alertas;
  fincaId : any = localStorage.getItem('id');
  animalId : any = localStorage.getItem('animalId');
  usuarioId : any = localStorage.getItem('usuarioId');
  animalSub : Subscription;
  usuarioSub : Subscription;
  fincaSub : Subscription;

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
    private animalService : AnimalService,
    private alertasService : AlertasService,
    private autentificarService : AutentificarService,
    private fincaService : FincaService
  ) { 
      this.animal = {
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

      this.alertas = {
        usuario: '',
        cambio: '',
        foto: '',
        fecha: ''
      };
    }

  ngOnInit() {
    this.animalSub = this.animalService.getAnimal(this.fincaId, this.animalId).subscribe(animal => {
      this.form.setValue(animal);

      this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
        this.alertas.usuario = usuario.nombre;
      });

      this.alertas.cambio = 'Actualizo el animal ' + animal.nombre;

      this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
        this.alertas.foto = finca.foto;
      });

      this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');
    })
  }

  ionViewDidLeave() {
    this.fincaSub.unsubscribe();
    this.usuarioSub.unsubscribe();
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

    this.animalService.updateAnimal(this.animal, this.fincaId, this.animalId)
    .then(() => {
      this.alertasService.addAlerta(this.alertas, this.fincaId);

      this.router.navigate(['/tabs/animal'], { replaceUrl: true });
    })
    .catch(error => {
      console.log('Error al Actualizar animal', error);
    });
    
  }

}
