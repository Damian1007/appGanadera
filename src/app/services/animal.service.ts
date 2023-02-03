import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, doc, deleteDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Animal } from '../interfaces/animal';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  constructor(
    private firestore : Firestore
  ) { }

  addAnimal(animal : Animal, fincaId : any) {
    const fincaRef = collection(this.firestore, `fincas/${fincaId}/animales`);
    return addDoc(fincaRef, animal);
  }

  getAnimales(fincaId : any): Observable<Animal[]> {
    const fincaRef = collection(this.firestore, `fincas/${fincaId}/animales`);
    return collectionData(fincaRef, { idField: 'id'}) as Observable<Animal[]>;
  }
}
