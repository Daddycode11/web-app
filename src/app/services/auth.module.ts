import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { LoginComponent } from '../../Auth/login-page/login-page.component'; // Ensure the LoginComponent is imported

@NgModule({
  declarations: [
    LoginComponent, // Declare your LoginComponent here
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Add ReactiveFormsModule here
  ],
})
export class AuthModule {}
