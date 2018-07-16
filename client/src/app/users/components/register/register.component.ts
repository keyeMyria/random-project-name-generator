import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: '',
      lastName: ''
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.usersService.register(this.registerForm.getRawValue())
        .subscribe((response) => {
          alert('Successfully registered');
        });
    }
  }
}
