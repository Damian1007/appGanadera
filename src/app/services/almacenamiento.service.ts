import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class AlmacenamientoService {

  constructor(
    private storage : Storage
  ) { }

  subirImagen(file : any, path : string, nombre : string): Promise<string> {
    return new Promise( resolve => {
      const filePath = path + '/' + nombre;
      const storageRef = ref(this.storage, filePath);
      const task = uploadBytesResumable(storageRef, file)
      .then(() => {
        const downloadURL = getDownloadURL(storageRef);
        resolve(downloadURL);
        return;
      });
    })
  }
}
