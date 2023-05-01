import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Alertas } from '../interfaces/alertas';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor( 
    private firestore : Firestore
  ) { }

  addAlerta(alertas : Alertas, fincaId : any) {
    const alertasRef = collection(this.firestore, `fincas/${fincaId}/alertas`);
    return addDoc(alertasRef, alertas);
  }

  getAlertas(fincaId : any): Observable<Alertas[]> {
    const alertasRef = collection(this.firestore, `fincas/${fincaId}/alertas`);
    return collectionData(alertasRef, { idField: 'id'}) as Observable<Alertas[]>;
  }
}
