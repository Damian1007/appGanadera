import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, doc, deleteDoc, docData, updateDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Animal } from '../interfaces/animal';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  constructor(
    private firestore : Firestore
  ) { }

  async addAnimal(animal : Animal, fincaId : any) {
    const animalDocRef = doc(this.firestore, `fincas/${fincaId}/animales/${animal.id}`);
    await setDoc(animalDocRef, animal);
  }

  async updateAnimal(animal : Animal, fincaId : any, animalId : any) {
    const animalDocRef = doc(this.firestore, `fincas/${fincaId}/animales/${animalId}`);
    await updateDoc(animalDocRef, {
      nombre: animal.nombre,
      genero: animal.genero,
      foto: animal.foto,
      ubicacion: animal.ubicacion,
      raza: animal.raza,
      grupoEtario: animal.grupoEtario,
      fechaNacimiento: animal.fechaNacimiento,
      padre: animal.padre,
      madre: animal.madre,
      pesoActual: animal.pesoActual
    });
  }

  getAnimales(fincaId : any): Observable<Animal[]> {
    const animalRef = collection(this.firestore, `fincas/${fincaId}/animales`);
    return collectionData(animalRef, { idField: 'id'}) as Observable<Animal[]>;
  }

  getAnimal(fincaId : any, animalId : any): Observable<Animal> {
    const animalDocRef = doc(this.firestore, `fincas/${fincaId}/animales/${animalId}`);
    return docData(animalDocRef) as Observable<Animal>;
  }

  async deleteAnimal(fincaId : any, animalId : any) {
    const animalDocRef = doc(this.firestore, `fincas/${fincaId}/animales/${animalId}`);
    await deleteDoc(animalDocRef);
  }
}
