import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-linked-account',
  templateUrl: './linked-account.component.html',
  styleUrls: ['./linked-account.component.css']
})
export class LinkedAccountComponent implements OnInit {
  public form: FormGroup;
  isSubmit = false;

  constructor(private formBuilder: FormBuilder, public translate: TranslateService
    ) { }

  ngOnInit(): void {
    this.create();
  }

  create(){
    this.form = this.formBuilder.group({
      email  : ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    })
  }

  get f(){
    return this.form.controls;
  }

  onSubmit(){
    this.isSubmit = true;
    if (this.form.invalid) { 
      return; 
    }
  }

}
