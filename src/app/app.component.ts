import { Component } from '@angular/core';
import { AutentificarService } from './services/autentificar.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '', icon: 'mail' },
    { title: 'Outbox', url: '', icon: 'paper-plane' },
    { title: 'Favorites', url: '', icon: 'heart' },
    { title: 'Archived', url: '', icon: 'archive' },
    { title: 'Trash', url: '', icon: 'trash' },
    { title: 'Spam', url: '', icon: 'warning' },
  ];
  
  usuario$ = this.autentificarService.authState$.pipe(
    filter(state => state ? true : false)
  );

  constructor(
    private autentificarService : AutentificarService,
    private router : Router
  ) {}

  async cerrarSesion() {
    await this.autentificarService.cerrarSesion();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
