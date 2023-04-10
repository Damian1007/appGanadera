import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FincaService } from '../services/finca.service';
import { Finca } from '../interfaces/finca';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { format } from 'date-fns';
import { Subscription, map } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-actualizar-finca',
  templateUrl: './actualizar-finca.page.html',
  styleUrls: ['./actualizar-finca.page.scss'],
})
export class ActualizarFincaPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  form : FormGroup;
  finca : Finca;
  alertas : Alertas;
  fincaId : any = localStorage.getItem('id');
  usuarioId : any = localStorage.getItem('usuarioId');
  fincaSub : Subscription;
  usuarioSub : Subscription;
  dptoSub : Subscription;
  citySub : Subscription;
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
    private alertasService : AlertasService,
    private autentificarService : AutentificarService,
    private http : HttpClient
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
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      orientacion: ['', [Validators.required]],
      areaFinca: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      areaGanaderia: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      //foto: ['', [Validators.required]], AGREGAR FUNCIONALIDAD DE GALERIA Y CAMARA
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      corregimiento: ['', [Validators.required]],
      coordenadas: [''],
    });

    this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.form.setValue({
        nombre: finca.nombre,
        orientacion: finca.orientacion,
        areaFinca: finca.areaFinca,
        areaGanaderia: finca.areaGanaderia,
        //foto: finca.foto,
        departamento: finca.departamento,
        ciudad: finca.ciudad,
        corregimiento: finca.corregimiento,
        coordenadas: finca.coordenadas
      });

      if (finca.foto == '') {
        this.finca.foto = "assets/icon/imagen_camara.png";
      } else{
        this.finca.foto = finca.foto;
      }

      this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
        this.alertas.usuario = usuario.nombre;
      });

      this.alertas.cambio = 'Actualizo la finca ' + finca.nombre;
      this.alertas.foto = finca.foto;
      this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');
    })

    this.dptoSub = this.getDpto().subscribe(dptos => {
      this.departamentos = dptos;
      this.departamentosAux = dptos;
    });

    this.citySub = this.getCity().subscribe(ciudades => {
      this.ciudades = ciudades;
      this.ciudadesAux = ciudades;
    });
  }

  ionViewDidLeave() {
    this.fincaSub.unsubscribe();
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

  actualizarFinca() {
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
      this.finca.coordenadas = this.form.getRawValue().coordenadas;

      this.fincaService.updateFinca(this.finca, this.fincaId)
      .then(() => {
        this.alertasService.addAlerta(this.alertas, this.fincaId);

        this.router.navigate(['/tabs/finca'], { replaceUrl: true });
      })
      .catch(error => {
        console.log('Error al Actualizar finca', error);
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
