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

  updateAnimal(animal : Animal, fincaId : any, animalId : any) {
    const fincaDocRef = doc(this.firestore, `fincas/${fincaId}/animales/${animalId}`);
    return updateDoc(fincaDocRef, {
      nombre: animal.nombre,
      genero: animal.genero,
      foto: animal.foto,
      lote: animal.lote,
      raza: animal.raza,
      grupoEtario: animal.grupoEtario,
      fechaNacimiento: animal.fechaNacimiento,
      padre: animal.padre,
      madre: animal.madre,
      pesoActual: animal.pesoActual
    });
  }

  getAnimales(fincaId : any): Observable<Animal[]> {
    const fincaRef = collection(this.firestore, `fincas/${fincaId}/animales`);
    return collectionData(fincaRef, { idField: 'id'}) as Observable<Animal[]>;
  }

  getAnimal(fincaId : any, animalId : any): Observable<Animal> {
    const fincaDocRef = doc(this.firestore, `fincas/${fincaId}/animales/${animalId}`);
    return docData(fincaDocRef) as Observable<Animal>;
  }

  deleteAnimal(fincaId : any, animalId : any) {
    const fincaDocRef = doc(this.firestore, `fincas/${fincaId}/animales/${animalId}`);
    return deleteDoc(fincaDocRef);
  }
}
