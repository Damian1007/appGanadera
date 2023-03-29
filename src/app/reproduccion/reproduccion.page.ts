import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReproduccionService } from '../services/reproduccion.service';
import { Reproduccion } from '../interfaces/reproduccion';
import { FormBuilder, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { OverlayEventDetail } from '@ionic/core/components';
import { AnimalService } from '../services/animal.service';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { FincaService } from '../services/finca.service';

@Component({
  selector: 'app-reproduccion',
  templateUrl: './reproduccion.page.html',
  styleUrls: ['./reproduccion.page.scss'],
})
export class ReproduccionPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  eventos : Reproduccion[];
  evento : Reproduccion;
  alertas : Alertas;
  fincaId : any;
  animalId : any;
  animalNombre : any;
  reproduccionId : any;
  usuarioId : any = localStorage.getItem('usuarioId');
  usuarioSub : Subscription;
  fincaSub : Subscription;
  reproduccionesSub : Subscription;
  reproduccionSub : Subscription;

  embarazo = false;
  isModalOpen = false;
  isModalOpen2 = false;
  isModalOpen3 = false;
  showPicker = false;
  dateValor = format(new Date(), 'yyyy-MM-dd');
  fechaValor = '';
  grupoEtario = '';

  form = this.formBuilder.group({
    tipo: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
  });

  form2 = this.formBuilder.group({
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
    private reproduccionService : ReproduccionService,
    private formBuilder : FormBuilder,
    private animalService : AnimalService,
    private alertasService : AlertasService,
    private autentificarService : AutentificarService,
    private fincaService : FincaService
  ) { 
    this.eventos = [{
      tipo: '',
      nombreToro: '',
      fechaMonta: '',
      nombreCria: '',
      fechaPartoProbable: '',
      fechaParto: ''
    }];

    this.evento = {
      id: '',
      tipo: '',
      nombreToro: '',
      fechaMonta: '',
      nombreCria: '',
      fechaPartoProbable: '',
      fechaParto: ''
    };

    this.alertas = {
      usuario: '',
      cambio: '',
      foto: '',
      fecha: ''
    };

    this.setTiempo();
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');
    this.animalNombre = localStorage.getItem('animalNombre');
    this.embarazo = false;

    this.reproduccionesSub = this.reproduccionService.getReproducciones(this.fincaId, this.animalId).subscribe(eventos => {
      this.eventos = eventos;

      eventos.forEach(evento => {
        if(evento.tipo == 'Monta') {
          this.embarazo = true;
        }
      });
    });

    this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
      this.alertas.usuario = usuario.nombre;
    });

    this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.alertas.foto = finca.foto;
    });

    this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');
  }

  ionViewDidLeave() {
    this.setOpen(false, 1);
    this.setOpen(false, 2);
    this.setOpen(false, 3);
    this.reproduccionesSub.unsubscribe();

    if (this.reproduccionSub) {
      this.reproduccionSub.unsubscribe();
    }
  }

  setOpen(isOpen : boolean, num : any) {
    if(num == 1) {
      this.isModalOpen = isOpen;
    }
    if(num == 2) {
      this.isModalOpen2 = isOpen;
    }
    if(num == 3) {
      this.isModalOpen3 = isOpen;
    }
  }

  getId(id : any) {
    this.reproduccionSub = this.reproduccionService.getReproduccion(this.fincaId, this.animalId, id).subscribe(evento => {
      this.evento = evento;
      //console.log(evento);
      this.evento.id = id;

      this.setOpen(true, 2);
    });
  }

  // <!----------------------------------- Configuración de Fecha ------------------------------------------->
  setTiempo() {
    this.fechaValor = format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'yyyy/MM/dd');
  }

  tiempoChange(value: any) {
    this.dateValor = value;
    this.fechaValor = format(parseISO(value), 'yyyy/MM/dd');
    this.showPicker = false;
  }
  // <!------------------------------------------------------------------------------------------------------>

  agregarMonta() {
    if (this.embarazo) {
      console.log("Ya preñada");
    }else {
      this.evento.tipo = 'Monta';
      this.evento.nombreToro = this.form.getRawValue().nombre;
      this.evento.fechaMonta = this.fechaValor;

      this.alertas.cambio = 'Agrego una monta a ' + this.animalNombre;

      this.modal.dismiss(null, 'monta');
      this.setOpen(false, 1);

      this.reproduccionService.addReproduccion(this.fincaId, this.animalId, this.evento)
      .then(() => {
        this.alertasService.addAlerta(this.alertas, this.fincaId);
      })
      .catch(error => {
        console.log('Error al Agregar monta', error);
      });
    }
  }

  registrarParto() {
    this.form2.get('padre').setValue(this.evento.nombreToro, { onlySelf: true});
    this.form2.get('madre').setValue(this.animalNombre, { onlySelf: true});

    this.modal.dismiss(null, 'monta_parto');
    this.setOpen(false, 2);
    this.setOpen(true, 3);
  }

  agregarParto() {
    this.evento.tipo = 'Parto';
    this.evento.fechaParto = this.fechaValor;
    this.evento.nombreCria = this.form2.getRawValue().nombre;

    if (this.form2.getRawValue().genero == 'Macho') {
      this.grupoEtario = 'Ternero ordeño';
    } else {
      this.grupoEtario = 'Ternera ordeño';
    }
    this.form2.get('grupoEtario').setValue(this.grupoEtario, { onlySelf: true});
    this.form2.get('fechaNacimiento').setValue(this.fechaValor, { onlySelf: true});

    this.alertas.cambio = 'Agrego el nacimiento de ' + this.evento.nombreCria;

    this.reproduccionService.updateReproduccion(this.evento, this.fincaId, this.animalId);
    this.animalService.addAnimal(this.form2.getRawValue(), this.fincaId)
    .then(() => {
      this.alertasService.addAlerta(this.alertas, this.fincaId);
    })
    .catch(error => {
      console.log('Error al Agregar parto', error);
    });

    this.modal.dismiss(null, 'parto');
    this.setOpen(false, 3);
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'monta') {
      console.log(this.evento);
      this.form.reset();
    }

    console.log(ev.detail.role);
    if (ev.detail.role === 'monta_parto') {
      console.log(this.evento);
      this.form.reset();
    }

    if (ev.detail.role === 'parto') {
      console.log(this.evento);
      this.form.reset();
      this.form2.reset();
    }

    if (ev.detail.role === 'backdrop') {
      //console.log(this.evento);
      this.setOpen(false, 1);
      this.setOpen(false, 2);
      this.setOpen(false, 3);
      this.form.reset();
      this.form2.reset();
    }
  }
}
