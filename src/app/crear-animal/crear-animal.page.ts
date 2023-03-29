import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AnimalService } from '../services/animal.service';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { FincaService } from '../services/finca.service';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crear-animal',
  templateUrl: './crear-animal.page.html',
  styleUrls: ['./crear-animal.page.scss'],
})
export class CrearAnimalPage implements OnInit {

  alertas : Alertas;
  fincaId : any = localStorage.getItem('id');
  usuarioId : any = localStorage.getItem('usuarioId');
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
      this.alertas = {
        usuario: '',
        cambio: '',
        foto: '',
        fecha: ''
      };
    }

  ngOnInit() {
  }

  crearAnimal() {
    this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
      this.alertas.usuario = usuario.nombre;
    });

    this.alertas.cambio = 'Creo el animal ' + this.form.getRawValue().nombre;

    this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.alertas.foto = finca.foto;
    });

    this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');

    this.form.get('pesoActual').setValue('0', { onlySelf: true});
    this.animalService.addAnimal(this.form.getRawValue(), this.fincaId)
    .then(() => {
      this.alertasService.addAlerta(this.alertas, this.fincaId);

      this.router.navigate(['/tabs/animales'], { replaceUrl: true });
    })
    .catch(error => {
      console.log('Error al Crear animal', error);
    });
  }
}
