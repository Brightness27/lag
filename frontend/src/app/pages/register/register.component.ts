import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    fn: new FormControl('', Validators.required),
    mi: new FormControl('', Validators.maxLength(1)),
    ln: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    contact_number: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  register() {
    if(this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.registerForm.reset();
      
    }
  }

}
