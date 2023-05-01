import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, docData, Firestore } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Miembro } from '../interfaces/miembro';

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {

  constructor(private firestore : Firestore) { }

  async addMiembro(fincaId : any, miembro : Miembro) {
    const miembroRef = doc(this.firestore, `fincas/${fincaId}/miembros/${miembro.id}`);
    await setDoc(miembroRef, miembro);
  }

  getMiembros(fincaId : any): Observable<Miembro[]> {
    const miembroRef = collection(this.firestore, `fincas/${fincaId}/miembros`);
    return collectionData(miembroRef, { idField: 'id'}) as Observable<Miembro[]>;
  }

  getMiembro(fincaId : any, usuarioId : any): Observable<Miembro> {
    const miembroDocRef = doc(this.firestore, `fincas/${fincaId}/miembros/${usuarioId}`);
    return docData(miembroDocRef, { idField: 'id'}) as Observable<Miembro>; 
  }

  async deleteMiembro(fincaId : any, usuarioId : any) {
    const miembroDocRef = doc(this.firestore, `fincas/${fincaId}/miembros/${usuarioId}`);
    await deleteDoc(miembroDocRef);
  }
}
