import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';

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

  getMiembros(fincaId : any) {
    const miembroRef = collection(this.firestore, `fincas/${fincaId}/miembros`);
    return collectionData(miembroRef, { idField: 'id'});
  }

  getMiembro(fincaId : any, usuarioId : any) {
    const miembroDocRef = doc(this.firestore, `fincas/${fincaId}/miembros/${usuarioId}`);
    return docData(miembroDocRef); 
  }

  async deleteMiembro(fincaId : any, usuarioId : any) {
    const miembroDocRef = doc(this.firestore, `fincas/${fincaId}/miembros/${usuarioId}`);
    await deleteDoc(miembroDocRef);
  }
}
