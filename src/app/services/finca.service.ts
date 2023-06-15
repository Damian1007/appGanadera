import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore, doc, deleteDoc, docData, updateDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Finca } from '../interfaces/finca';
import { MiembrosService } from './miembros.service';
import { Miembro } from '../interfaces/miembro';

@Injectable({
  providedIn: 'root'
})
export class FincaService {

  constructor(
    private firestore : Firestore,
    private miembroService : MiembrosService) { }

  async addFinca(finca : Finca, miembro : Miembro) {
    const fincaDocRef = doc(this.firestore, `fincas/${finca.id}`);
    await setDoc(fincaDocRef, finca);

    this.miembroService.addMiembro(finca.id, miembro);
  }

  async updateFinca(finca : Finca, id : any) {
    const fincaDocRef = doc(this.firestore, `fincas/${id}`);
    await updateDoc(fincaDocRef, {
      nombre: finca.nombre,
      orientacion: finca.orientacion,
      areaFinca: finca.areaFinca,
      areaGanaderia: finca.areaGanaderia,
      foto: finca.foto,
      departamento: finca.departamento,
      ciudad: finca.ciudad,
      corregimiento: finca.corregimiento,
      vereda_sector: finca.vereda_sector,
      coordenadas: finca.coordenadas
    });
  }

  getFincas(): Observable<Finca[]> {
    const fincaRef = collection(this.firestore, 'fincas');
    return collectionData(fincaRef, { idField: 'id'}) as Observable<Finca[]>;
  }

  getFinca(id : any): Observable<Finca> {
    const fincaDocRef = doc(this.firestore, `fincas/${id}`);
    return docData(fincaDocRef) as Observable<Finca>;
  }

  async deleteFinca(id : any) {
    const fincaDocRef = doc(this.firestore, `fincas/${id}`);
    await deleteDoc(fincaDocRef);
  }

}
