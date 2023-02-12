import { Injectable } from '@angular/core';
import { addDoc, collection, doc, docData, Firestore } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { map } from 'rxjs';
import { Finca } from '../interfaces/finca';

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {

  constructor(private firestore : Firestore) { }

  addMiembro(fincaId : any, usuarioId : any, rol : any) {
    const miembroDocRef = doc(this.firestore, `fincas/${fincaId}/miembros/${usuarioId}`);
    return setDoc(miembroDocRef, {
      id: usuarioId,
      rol: rol
    });
  }

  getMiembro(fincaId : any, usuarioId : any) {
    const miembroDocRef = doc(this.firestore, `fincas/${fincaId}/miembros/${usuarioId}`);
    return docData(miembroDocRef); 
  }
}
