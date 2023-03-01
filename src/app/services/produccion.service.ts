import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pesaje } from '../interfaces/pesaje';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  constructor(private firestore : Firestore) { }

  addPeso(fincaId : any, animalId : any, pesaje : Pesaje) {
    const prodRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/prodCarne`);
    return addDoc(prodRef, pesaje);
  }

  getPesajes(fincaId : any, animalId : any): Observable<Pesaje[]> {
    const prodRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/prodCarne`);
    return collectionData(prodRef) as Observable<Pesaje[]>;
  }
}
