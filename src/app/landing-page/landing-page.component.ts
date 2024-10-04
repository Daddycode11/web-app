import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../auth/register/register.component';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Users, UserType } from '../../models/users';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../auth/login/login.component';
import { TouristHeaderComponent } from '../tourist/tourist-header/tourist-header.component';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../services/cart.service';
import { Cart, CartWithProduct } from '../../models/cart';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    TouristHeaderComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  modalService = inject(NgbModal);

  users$: Users | null | undefined;
  cart$: CartWithProduct[] = [];
  toastr = inject(ToastrService);
  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.authService.listenToUsers().subscribe((data: Users | null) => {
      this.users$ = data;

      if (this.users$ !== null) {
        if (this.users$.type === UserType.ADMIN) {
          console.log(this.users$.type === UserType.ADMIN);
          this.router.navigate(['/administrator']);
        } else {
          cartService.getAllMyCart(this.users$.id).subscribe((data) => {
            this.cart$ = data;
            console.log(data);
          });
        }
      }
    });
  }

  openRegister() {
    const modal = this.modalService.open(RegisterComponent);
  }
  openLogin() {
    const modal = this.modalService.open(LoginComponent);
  }
  logout() {
    console.log('Logged out');
    this.authService
      .logout()
      .then(() => this.toastr.success('Successfully Logged out'))
      .catch((err) => {
        console.log(err);
      });
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
