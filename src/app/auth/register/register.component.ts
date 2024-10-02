import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Users, UserType } from '../../../models/users';
import { AuthService } from '../../services/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  userForm$: FormGroup;
  activeModal = inject(NgbActiveModal);
  //  users$: Observable<Users | null>;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.userForm$ = this.fb.group({
      name: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.userForm$.valid) {
      const formValues = this.userForm$.value;
      const user: Users = {
        id: '',
        name: formValues.name,
        phone: formValues.phone,
        profile: '',
        email: formValues.email,
        type: UserType.USERS,
      };

      console.log(user);

      const success = await this.authService.register(
        user,
        formValues.password
      );
      if (success) {
        alert('Successfully registered!');
      } else {
        alert('Error during registration!');
      }
    } else {
      alert('Form is invalid!');
    }
  }
}
