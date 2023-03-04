import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Reproduccion } from '../interfaces/reproduccion';

@Injectable({
  providedIn: 'root'
})
export class ReproduccionService {

  constructor(
    private firestore : Firestore
  ) { }

  addReproduccion(fincaId : any, animalId : any, reproduccion : Reproduccion) {
    const reproDocRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/reproduccion`);
    return addDoc(reproDocRef, reproduccion);
  }

  getReproducciones(fincaId : any, animalId : any): Observable<Reproduccion[]> {
    const reproRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/reproduccion`);
    return collectionData(reproRef, { idField: 'id'}) as Observable<Reproduccion[]>;
  }
}
