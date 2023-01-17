import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public login!: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.login = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

}
