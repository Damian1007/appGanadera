import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutentificarService } from '../services/autentificar.service';
import { MiembrosService } from '../services/miembros.service';
import { Miembro } from '../interfaces/miembro';
import { FincaService } from '../services/finca.service';
import { Finca } from '../interfaces/finca';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-miembros',
  templateUrl: './miembros.page.html',
  styleUrls: ['./miembros.page.scss'],
})
export class MiembrosPage implements OnInit {

  miembros : Miembro[];
  miembro : Miembro;
  finca : Finca;
  fincaId = localStorage.getItem('id');
  usuarioId = localStorage.getItem("usuarioId");
  miembrosSub : Subscription;
  usuariosSub : Subscription;
  fincaSub : Subscription;

  loading : any;
  nuevoMiembro = false;
  isSubmitted = false;

  form = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    rol: ['', [Validators.required]],
  });

  constructor(
    private miembrosService : MiembrosService,
    private formBuilder : FormBuilder,
    private autentificarService : AutentificarService,
    private fincaService : FincaService,
    private router : Router,
    public toastController : ToastController,
    public loadingController : LoadingController
  ) { 
    this.miembros = [{
      id : '',
      rol : '',
      nombre : '',
      apellido : ''
    }];

    this.miembro = {
      id : '',
      rol : '',
      nombre : '',
      apellido : ''
    };

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
      vereda_sector: '',
      coordenadas: '',
      propietario: ''
    };
   }

  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.miembrosSub = this.miembrosService.getMiembros(this.fincaId).subscribe(miembros => {
      this.miembros = miembros;
    });

    this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.finca = finca;
    });
  }

  ionViewDidLeave() {
    this.miembrosSub.unsubscribe();
    this.fincaSub.unsubscribe();

     if(this.usuariosSub) {
      this.usuariosSub.unsubscribe();
     }
  }

  agregarMiembro() {
    // this.isSubmitted = true;

    // if(this.form.valid) {
    //   this.presentLoading();
    //   this.usuariosSub = this.autentificarService.getUsuarios().subscribe(usuarios => {
        
    //     usuarios.map((usuario : any) => {
    //       if(this.form.getRawValue().correo == usuario.correo && usuario.id != this.usuarioId) {
    //         this.miembro.id = usuario.id;
    //         this.miembro.rol = this.form.getRawValue().rol;
    //         const miembroRol = this.miembros.filter( m => m.rol == this.form.getRawValue().rol);
    //         this.miembro.nombre = usuario.nombre;
    //         this.miembro.apellido = usuario.apellido;

    //         switch (this.form.getRawValue().rol) {
    //           case 'Mayordomo':
    //             this.finca.mayordomo = usuario.id;
    //             break;
            
    //           case 'Trabajador':
    //             this.finca.trabajador = usuario.id;
    //             break;

    //           case 'Visitante':
    //             this.finca.visitante = usuario.id;
    //             break;
    //         }

    //         this.miembrosService.addMiembro(this.fincaId, this.miembro)
    //         .then(() => {
          
    //           this.miembrosService.deleteMiembro(this.fincaId, (miembroRol.pop()).id)
    //           this.fincaService.updateFinca(this.finca)
    //           .then(() => {
                
    //             this.loading.dismiss();
    //             this.presentToast();
    //           })
    //           .catch(error => {
    //             console.log('Error al agregar nuevo miembro', error);
    //             this.loading.dismiss();
    //             this.presentToastError();
    //           });

    //         })
    //         .catch(error => {
    //           console.log('Error al agregar nuevo miembro', error);
    //           this.loading.dismiss();
    //           this.presentToastError();
    //         });
    //       } else {
    //         this.loading.dismiss();
    //         this.presentToastError2();
    //       }
    //     });
    //   });
    // }
  }

  getId(id : any) {
    //console.log(id);
    // localStorage.setItem('id', id);
    // this.router.navigate(['/tabs/finca'], { replaceUrl: true });
  }

  get errorControl() {
    return this.form.controls;
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Agregando nuevo Miembro...',
      cssClass: "normal"
    });
    await this.loading.present();
  }
  
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Nuevo miembro agregado con exito',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'Error al intentar agregar un nuevo miembro, intentelo nuevamente',
      duration: 5000,
      position: "bottom",
      cssClass: "custom-toast"
    });
    toast.present()
  }

  async presentToastError2() {
    const toast = await this.toastController.create({
      message: 'El correo no se encuentra registrado en la App',
      duration: 5000,
      position: "bottom",
      cssClass: "custom-toast"
    });
    toast.present()
  }

}
