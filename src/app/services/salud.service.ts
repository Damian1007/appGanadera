import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Salud } from '../interfaces/salud';

@Injectable({
  providedIn: 'root'
})
export class SaludService {

  constructor(
    private firestore : Firestore
  ) { }

  async addHistoria(fincaId : any, animalId : any, salud : Salud) {
    const saludDocRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/salud`);
    await addDoc(saludDocRef, salud);
  }

  getHistorias(fincaId : any, animalId : any): Observable<Salud[]> {
    const saludRef = collection(this.firestore, `fincas/${fincaId}/animales/${animalId}/salud`);
    return collectionData(saludRef, { idField: 'id'}) as Observable<Salud[]>;
  }

  getHistoria(fincaId : any, animalId : any, id : any): Observable<Salud> {
    const saludDocRef = doc(this.firestore, `fincas/${fincaId}/animales/${animalId}/salud/${id}`);
    return docData(saludDocRef) as Observable<Salud>;
  }
}
