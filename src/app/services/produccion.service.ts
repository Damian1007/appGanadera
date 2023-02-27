import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  constructor(private firestore : Firestore) { }

  addPeso(fincaId : any, animalId : any, peso : any, fecha : any) {
    const prodRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/prodCarne`);
    return addDoc(prodRef, {
      peso: peso,
      fecha: fecha
    });
  }
}
