import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {

  constructor(private firestore : Firestore) { }

  addMiembro(fincaId : any, usuarioId : any, rol : any) {
    const fincaRef = collection(this.firestore, `fincas/${fincaId}/miembros`);
    return addDoc(fincaRef, {
      id: usuarioId,
      rol: rol
    });
  }
}
