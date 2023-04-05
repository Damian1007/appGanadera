import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FincaService } from '../services/finca.service';
import { Finca } from '../interfaces/finca';
import { Miembro } from '../interfaces/miembro';
import { AutentificarService } from '../services/autentificar.service';
import { Subscription, map } from 'rxjs';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { format } from 'date-fns';
import { OverlayEventDetail } from '@ionic/core/components';
import { IonModal } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-finca',
  templateUrl: './crear-finca.page.html',
  styleUrls: ['./crear-finca.page.scss'],
})
export class CrearFincaPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  form : FormGroup;
  finca : Finca;
  alertas : Alertas;
  miembro : Miembro;
  usuarioId = localStorage.getItem('usuarioId');
  usuarioSub : Subscription;
  dptoSub : Subscription;
  citySub : Subscription;
  randomId : number;
  isSubmitted = false;

  isModalOpen = false;
  isModalOpen2 = false;
  departamentos : any[];
  departamentosAux : any[];
  dpto : any;
  dptoCodigo : any;
  ciudades : any[];
  ciudadesAux : any[];
  ciud : any;
  
  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private fincaService : FincaService,
    private auth : AutentificarService,
    private alertasService : AlertasService,
    private http : HttpClient
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
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      orientacion: ['', [Validators.required]],
      areaFinca: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      areaGanaderia: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      //foto: ['', [Validators.required]], AGREGAR FUNCIONALIDAD DE GALERIA Y CAMARA
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      corregimiento: ['', [Validators.required]],
    });

    this.dptoSub = this.getDpto().subscribe(dptos => {
      this.departamentos = dptos;
      this.departamentosAux = dptos;
    });

    this.citySub = this.getCity().subscribe(ciudades => {
      this.ciudades = ciudades;
      this.ciudadesAux = ciudades;
    });
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
    this.citySub.unsubscribe();
    this.dptoSub.unsubscribe();
  }

  // --------------------------------------------- SearchBars ------------------------------------------------
  buscarDpto(ev : any) {
    const text = ev.target.value;
    
    if(text && text.trim() != '') {
      this.departamentosAux = this.departamentosAux.filter((depto : any) => {
        return (depto.depto.toLowerCase().indexOf(text.toLowerCase()) > -1);
      })
    }else{
      this.departamentosAux = this.departamentos;
    }
  }

  buscarCiudad(ev : any) {
    const text = ev.target.value;
    
    if(text && text.trim() != '') {
      this.ciudadesAux = this.ciudadesAux.filter((ciudad : any) => {
        return (ciudad.Ciudad.toLowerCase().indexOf(text.toLowerCase()) > -1);
      })
    }else{
      this.ciudadesAux = this.ciudades;
    }
  }

  // ---------------------------------- Cambios y Consultas Departamento y Ciudad -------------------------------------------------
  getDpto() {
    return this.http.get("assets/archivos/departamentos.json").pipe( map((res:any) => {
      return res.data;
    }));
  }

  getCity() {
    return this.http.get("assets/archivos/ciudades.json").pipe( map((res:any) => {
      return res.data;
    }));
  }

  dptoChange(e : any) {
    this.dpto = e.depto;
    this.dptoCodigo = e.codigo;
    this.ciudadesAux = this.ciudades;

    this.ciudadesAux = this.ciudadesAux.filter((ciudades : any) => {
      return (ciudades.Depto == this.dptoCodigo);
    })
    this.ciud = '';

    this.setOpen(false, 1);
  }

  ciudadChange(e : any) {
    this.ciud = e.Ciudad;
    //console.log(this.ciud['Depto']);
    this.setOpen(false, 2);
  }
// -----------------------------------------------------------------------------------------------------------------

setOpen(isOpen : boolean, num : any) {
  if(num == 1) {
    this.isModalOpen = isOpen;
  }
  if(num == 2) {
    this.isModalOpen2 = isOpen;
  }
}

  crearFinca() {
    this.isSubmitted = true;
    
    if(this.form.valid) {
      this.finca.nombre = this.form.getRawValue().nombre;
      this.finca.orientacion = this.form.getRawValue().orientacion;
      this.finca.areaFinca = this.form.getRawValue().areaFinca;
      this.finca.areaGanaderia = this.form.getRawValue().areaGanaderia;
      //this.finca.foto = this.form.getRawValue().foto;
      this.finca.departamento = this.form.getRawValue().departamento;
      this.finca.ciudad = this.form.getRawValue().ciudad;
      this.finca.corregimiento = this.form.getRawValue().corregimiento;
      this.finca.id = this.finca.nombre + this.finca.areaFinca + this.finca.areaGanaderia + '_' + this.finca.corregimiento + this.randomId;

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
    } else {
      this.form.markAllAsTouched();
    }
  }

  get errorControl() {
    return this.form.controls;
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'backdrop') {
      //console.log(this.evento);
      this.setOpen(false, 1);
      this.setOpen(false, 2);
    }
  }
}
