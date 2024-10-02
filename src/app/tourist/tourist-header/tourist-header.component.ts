import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Users } from '../../../models/users';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { Cart, CartWithProduct } from '../../../models/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tourist-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tourist-header.component.html',
  styleUrl: './tourist-header.component.css',
})
export class TouristHeaderComponent implements OnInit {
  @Input() users!: Users;

  @Output() onLoggedOut = new EventEmitter<Users>();
  carts$: Observable<CartWithProduct[]> | undefined;
  onUserClick() {
    this.onLoggedOut.emit(this.users);
  }
  constructor(private cartService: CartService) {}
  ngOnInit(): void {
    this.carts$ = this.cartService.getAllMyCart(this.users.id);
  }
}
