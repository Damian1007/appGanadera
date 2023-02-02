import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, doc, deleteDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Finca } from '../interfaces/finca';

@Injectable({
  providedIn: 'root'
})
export class FincaService {

  constructor(
    private firestore : Firestore) { }

  addFinca(finca : Finca) {
    const fincaRef = collection(this.firestore, 'fincas');
    return addDoc(fincaRef, finca);
  }

  updateFinca(finca : Finca, id : any) {
    const fincaDocRef = doc(this.firestore, `fincas/${id}`);
    return updateDoc(fincaDocRef, {
      nombre: finca.nombre,
      orientacion: finca.orientacion,
      areaFinca: finca.areaFinca,
      areaGanaderia: finca.areaGanaderia,
      foto: finca.foto,
      departamento: finca.departamento,
      ciudad: finca.ciudad,
      corregimiento: finca.corregimiento,
      coordenadas: finca.coordenadas
    } );
  }

  getFincas(): Observable<Finca[]> {
    const fincaRef = collection(this.firestore, 'fincas');
    return collectionData(fincaRef, { idField: 'id'}) as Observable<Finca[]>;
  }

  getFinca(id : any): Observable<Finca> {
    const fincaDocRef = doc(this.firestore, `fincas/${id}`);
    return docData(fincaDocRef) as Observable<Finca>;
  }

   deleteFinca(finca : Finca) {
    const fincaDocRef = doc(this.firestore, `finca/${finca.id}`);
    return deleteDoc(fincaDocRef).then(() => {
      console.log("hhhhhhhhh");
    })
  }

}
