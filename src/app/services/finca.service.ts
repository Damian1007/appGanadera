import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Finca } from '../interfaces/finca';


@Injectable({
  providedIn: 'root'
})
export class FincaService {

  constructor(private firestore : Firestore) { }

  addFinca(finca : Finca) {
    const fincaRef = collection(this.firestore, 'fincas');
    return addDoc(fincaRef, finca);
  }

  getFincas(): Observable<Finca[]> {
    const fincaRef = collection(this.firestore, 'fincas');
    return collectionData(fincaRef, { idField: 'id'}) as Observable<Finca[]>;
  }
}
