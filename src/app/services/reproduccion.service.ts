import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Reproduccion } from '../interfaces/reproduccion';

@Injectable({
  providedIn: 'root'
})
export class ReproduccionService {

  constructor(
    private firestore : Firestore
  ) { }

  async addReproduccion(fincaId : any, animalId : any, reproduccion : Reproduccion) {
    const reproDocRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/reproduccion`);
    await addDoc(reproDocRef, reproduccion);
  }

  getReproducciones(fincaId : any, animalId : any): Observable<Reproduccion[]> {
    const reproRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/reproduccion`);
    return collectionData(reproRef, { idField: 'id'}) as Observable<Reproduccion[]>;
  }

  getReproduccion(fincaId : any, animalId : any, id : any): Observable<Reproduccion> {
    const reproDocRef = doc(this.firestore, `fincas/${fincaId}/animales/${animalId}/reproduccion/${id}`);
    return docData(reproDocRef, { idField: 'id'}) as Observable<Reproduccion>;
  }

  async updateReproduccion(reproduccion : Reproduccion, fincaId : any, animalId : any) {
    const reproDocRef = doc(this.firestore, `fincas/${fincaId}/animales/${animalId}/reproduccion/${reproduccion.id}`);
    await updateDoc(reproDocRef, {
      tipo: reproduccion.tipo,
      fechaMonta: reproduccion.fechaMonta,
      nombreToro: reproduccion.nombreToro,
      fechaPartoProbable: reproduccion.fechaPartoProbable,
      fechaParto: reproduccion.fechaParto,
      nombreCria: reproduccion.nombreCria,
    });
  }
}
