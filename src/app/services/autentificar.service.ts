import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AutentificarService {

  authState$ = authState(this.afAutentificador)

  constructor(private afAutentificador: Auth) { }

  registro(correo: string, contraseña: string) {
    return createUserWithEmailAndPassword(this.afAutentificador, correo, contraseña)
    .then(() => signInWithEmailAndPassword(this.afAutentificador, correo, contraseña));
  }

  iniciarSesion(correo: string, contraseña: string) {
    return signInWithEmailAndPassword(this.afAutentificador, correo, contraseña);
  }

  cerrarSesion() {
    return signOut(this.afAutentificador);
  }
}
