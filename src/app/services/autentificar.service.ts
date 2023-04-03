import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { addDoc, collection, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { Observable } from 'rxjs';
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

  registroUsu(usuario : Usuario, id : any) {
      const usuarioDocRef = doc(this.firestore, `usuarios/${id}`);
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

  getUsuario(usuarioId : any): Observable<Usuario> {
    const usuarioDocRef = doc(this.firestore, `usuarios/${usuarioId}`);
    return docData(usuarioDocRef) as Observable<Usuario>;
  }

  updateUsuario(usuario : Usuario, usuarioId : any) {
    const usuarioDocRef = doc(this.firestore, `usuarios/${usuarioId}`);
    return updateDoc(usuarioDocRef, {
      correo: usuario.correo,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      contraseña: usuario.contrasena,
      pais: usuario.pais,
      telefono: usuario.telefono,
      departamento: usuario.departamento,
      ciudad: usuario.ciudad,
    });
  }
}

