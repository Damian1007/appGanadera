import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class InformesService {

  constructor(
    private file : File
  ) { }

  async crearToExcelAll(data1 : any, data2 : any, data3 : any, data4 : any, data5 : any, filename : any) {
    {
      const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data1);
      const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data2);
      const ws3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data3);
      const ws4: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data4);
      const ws5: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data5);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws1, 'Animales');
      XLSX.utils.book_append_sheet(wb, ws2, 'Pesajes');
      XLSX.utils.book_append_sheet(wb, ws3, 'Ordeños');
      XLSX.utils.book_append_sheet(wb, ws4, 'Salud');
      XLSX.utils.book_append_sheet(wb, ws5, 'Reproducción');
      var buffer = XLSX.write(wb, {bookType : 'xlsx', type : 'array'});
      this.exportToPhone(buffer, filename);
    }
  }

  async crearToExcel(data : any, filename : any, finca : any) {
    {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data); 
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, filename);
      var buffer = XLSX.write(wb, {bookType : 'xlsx', type : 'array'});
      this.exportToPhone(buffer, filename);
    }
  }

  exportToPhone(buffer : any, filename : any) {
    var fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    var fileExtension = '.xlsx';
    
    var data: Blob = new Blob([buffer], {type : fileType});
    console.log(data, filename);
    this.file.writeFile(this.file.externalRootDirectory, filename + fileExtension, data, {replace : true});
  }
}
