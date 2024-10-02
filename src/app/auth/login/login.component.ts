import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { activate } from '@angular/fire/remote-config';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm$: FormGroup;
  activeModal = inject(NgbActiveModal);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loginForm$ = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }
  async onSubmit() {
    if (this.loginForm$.valid) {
      const formValues = this.loginForm$.value;
      const success = await this.authService.login(
        formValues.email,
        formValues.password
      );
      if (success) {
        this.toastr.success('Successfully logged in!');
      } else {
        this.toastr.error('Error during login!');
      }
    } else {
      this.toastr.error('Form is invalid!');
    }
    this.activeModal.close();
  }
}
