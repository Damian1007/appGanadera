import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { addDoc, collection, doc, Firestore } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AutentificarService {

  authState$ = authState(this.afAutentificador)

  constructor(
    private afAutentificador: Auth,
    private firestore : Firestore
    ) { }

    getUid() {
      localStorage.setItem("usuarioId", this.afAutentificador.currentUser.uid);
    }
    
  registroAuth(correo: string, contraseña: string) {
    return createUserWithEmailAndPassword(this.afAutentificador, correo, contraseña)
    .then(() => signInWithEmailAndPassword(this.afAutentificador, correo, contraseña));
  }

  registroUsu(usuario : Usuario) {
      const usuarioDocRef = doc(this.firestore, `usuarios/${usuario.id}`);
      return setDoc(usuarioDocRef, usuario);
    }

   iniciarSesion(correo: string, contraseña: string) {
    return signInWithEmailAndPassword(this.afAutentificador, correo, contraseña)
    .then(() => {
      this.getUid();
    });
  }

  cerrarSesion() {
    return signOut(this.afAutentificador);
  }
}
