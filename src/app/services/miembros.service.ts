import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {

  constructor(private firestore : Firestore) { }

  addMiembro(fincaId : any, usuarioId : any, rol : any) {
    const fincaDocRef = doc(this.firestore, `fincas/${fincaId}/miembros/${usuarioId}`);
    return setDoc(fincaDocRef, {
      id: usuarioId,
      rol: rol
    });
  }
}
