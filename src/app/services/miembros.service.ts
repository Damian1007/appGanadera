import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Miembro } from '../interfaces/miembro';

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {

  constructor(private firestore : Firestore) { }

  addMiembro(fincaId : any, miembro : Miembro) {
    const miembroRef = doc(this.firestore, `fincas/${fincaId}/miembros/${miembro.id}`);
    return setDoc(miembroRef, miembro);
  }

  getMiembros(fincaId : any): Observable<Miembro[]> {
    const miembroRef = collection(this.firestore, `fincas/${fincaId}/miembros`);
    return collectionData(miembroRef, { idField: 'id'}) as Observable<Miembro[]>;
  }

  getMiembro(fincaId : any, usuarioId : any): Observable<Miembro> {
    const miembroDocRef = doc(this.firestore, `fincas/${fincaId}/miembros/${usuarioId}`);
    return docData(miembroDocRef) as Observable<Miembro>; 
  }

  async deleteMiembro(fincaId : any, usuarioId : any) {
    const miembroDocRef = doc(this.firestore, `fincas/${fincaId}/miembros/${usuarioId}`);
    await deleteDoc(miembroDocRef);
  }
}
