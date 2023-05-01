import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pesaje } from '../interfaces/pesaje';
import { Ordeño } from '../interfaces/ordeño';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  constructor(private firestore : Firestore) { }

  async addPeso(fincaId : any, animalId : any, pesaje : Pesaje) {
    const prodRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/prodCarne`);
    await addDoc(prodRef, pesaje);
  }

  async addOrdeño(fincaId : any, animalId : any, ordeño : Ordeño) {
    const prodRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/prodLeche`);
    await addDoc(prodRef, ordeño);
  }

  getPesajes(fincaId : any, animalId : any): Observable<Pesaje[]> {
    const prodRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/prodCarne`);
    return collectionData(prodRef) as Observable<Pesaje[]>;
  }

  getOrdeños(fincaId : any, animalId : any): Observable<Ordeño[]> {
    const prodRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/prodLeche`);
    return collectionData(prodRef) as Observable<Ordeño[]>;
  }
}
