import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  form = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor(private formBuilder : FormBuilder) { }

  ngOnInit() {
  }

  registro(){
    if(this.form.valid) {
      const {email, password, confirmPassword} = this.form.getRawValue();
      console.log(email, password, confirmPassword);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
