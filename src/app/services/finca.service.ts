import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, doc, deleteDoc, docData, updateDoc, setDoc } from '@angular/fire/firestore';
import { filter, map, Observable } from 'rxjs';
import { Finca } from '../interfaces/finca';
import { MiembrosService } from './miembros.service';
import { AutentificarService } from '../services/autentificar.service';

@Injectable({
  providedIn: 'root'
})
export class FincaService {

  constructor(
    private firestore : Firestore,
    private miembroService : MiembrosService,
    private autentificarService : AutentificarService) { }

  async addFinca(finca : Finca) {
    const fincaRef = doc(this.firestore, `fincas/${finca.id}`);
    await setDoc(fincaRef, finca)

    this.miembroService.addMiembro(finca.id, localStorage.getItem("usuarioId"), "Propietario");
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
