import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  constructor(
    private router : Router
  ) { }

  ngOnInit() { }

  finca() {
    this.router.navigate(['/finca'], { replaceUrl: true });
  }

  animales() {
    this.router.navigate(['/animales'], { replaceUrl: true });
  }
  produccion() {
    this.router.navigate(['/datos-produccion'], { replaceUrl: true });
  }

  alertas() {
    this.router.navigate(['/alertas'], { replaceUrl: true });
  }

  informes() {
    this.router.navigate(['/informes'], { replaceUrl: true });
  }
}
