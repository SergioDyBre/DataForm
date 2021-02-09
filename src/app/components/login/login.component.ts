import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  error: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthService) {
    //Redirects to home if already logged in
    if (this.auth.isAuthenticated) {
      this.router.navigate(['/home'])
    }
  }

  get formControls() { return this.loginForm.controls; }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.auth.login(this.formControls.username.value, this.formControls.password.value).subscribe(
      data => {
        this.router.navigate(["home"]);
      },
      error => {
        this.loading = false;
        this.submitted = false;
        this.error = true;
      }
    )
  }

}
