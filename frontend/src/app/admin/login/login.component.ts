import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private adminServices: AdminServicesService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.createFormGroup();
    this.isLoggedIn();
  }

  isLoggedIn() {
    if(this.adminServices.isLoggedIn()) {
      this.router.navigate(['admin/dashboard']);
    }
  }

  login() {
    if(!this.loginForm.valid) {
      console.log("Please enter username and password");
    }
    else {
      this.adminServices.login(this.loginForm.value.username, this.loginForm.value.password).subscribe( tokenObject => {
      
        if(tokenObject.error) {
          console.log(tokenObject.message);
          
        }
        else {
  
          localStorage.setItem("token", tokenObject.token);
  
          this.router.navigate(['admin/dashboard']);
        }
        
      });
    }
    
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
}
