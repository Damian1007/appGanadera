import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { async } from '@firebase/util';
import { Subscription } from 'rxjs';
import { AutentificarService } from '../services/autentificar.service';
import { MiembrosService } from '../services/miembros.service';

@Component({
  selector: 'app-miembros',
  templateUrl: './miembros.page.html',
  styleUrls: ['./miembros.page.scss'],
})
export class MiembrosPage implements OnInit {

  miembros : any[];
  fincaId = localStorage.getItem('id');
  miembrosSub : Subscription;
  usuarioSub : Subscription;

  constructor(
    private miembrosService : MiembrosService,
    private autentificarService : AutentificarService,
    private router : Router
  ) { 
    this.miembros = [{
      id : '',
      rol : '',
      nombre : '',
      apellido : ''
    }];
   }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.miembrosSub = this.miembrosService.getMiembros(this.fincaId).subscribe(miembros => {

      for (let i = 0; i < miembros.length; i++) {
        this.miembros[i] = miembros[i];

        this.usuarioSub = this.autentificarService.getUsuario(miembros[i]['id']).subscribe(usu => {
          this.miembros[i].nombre = usu.nombre;
          this.miembros[i].apellido = usu.apellido;
        });
      }
    });
  }

  ionViewDidLeave() {
    this.miembrosSub.unsubscribe();
    this.usuarioSub.unsubscribe();
  }

  getId(id : any) {
    console.log(id);
    // localStorage.setItem('id', id);
    // this.router.navigate(['/tabs/finca'], { replaceUrl: true });
  }

}
