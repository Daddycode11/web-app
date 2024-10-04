import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Users } from '../../../models/users';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { Cart, CartWithProduct } from '../../../models/cart';
import { CommonModule } from '@angular/common';
import { isAsyncIterable } from 'rxjs/internal/util/isAsyncIterable';
import { increment } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Transactions, TransactionStatus } from '../../../models/transaction';
import { generateRandomString } from '../../utils/constants';

@Component({
  selector: 'app-tourist-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tourist-header.component.html',
  styleUrl: './tourist-header.component.css',
})
export class TouristHeaderComponent implements OnInit {
  @Input() users!: Users;
  @Input() cart: CartWithProduct[] = [];
  @Output() onLoggedOut = new EventEmitter<Users>();
  items$: CartWithProduct[] = [];
  onUserClick() {
    this.onLoggedOut.emit(this.users);
  }
  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private transactionService: TransactionService
  ) {}
  ngOnInit(): void {}
  incrementQuantity(cart: CartWithProduct) {
    if (cart.cart.quantity >= cart.product.stock) {
      this.toastr.success('Not enough stocks');
      return;
    }
    this.cartService
      .increaseCartQuantity(cart.cart.id, 1)
      .then(() => this.toastr.success('Cart updated'));
  }

  decrementQuantity(cart: CartWithProduct) {
    if (cart.cart.quantity > 1) {
      this.cartService
        .increaseCartQuantity(cart.cart.id, -1)
        .then(() => this.toastr.success('Cart updated'));
    }
  }

  get itemTotal(): number {
    let total = 0;
    this.items$.forEach((e) => {
      total += e.cart.quantity * e.product.price;
    });
    return total;
  }
  toggleItem(event: Event, cartWithProduct: CartWithProduct) {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;

    if (isChecked) {
      this.addToItems(cartWithProduct);
    } else {
      this.removeFromItems(cartWithProduct);
    }
  }

  addToItems(cartWithProduct: CartWithProduct) {
    if (!this.items$.includes(cartWithProduct)) {
      this.items$.push(cartWithProduct);
    }
  }

  removeFromItems(cartWithProduct: CartWithProduct) {
    this.items$ = this.items$.filter(
      (item) => item.cart.id !== cartWithProduct.cart.id
    );
  }

  async checkout() {
    if (this.items$.length === 0) {
      this.toastr.error('No product to checkout');
      return;
    }

    try {
      const transaction: Transactions = {
        id: generateRandomString(),
        userID: this.users.id,
        items: this.items$.map((e) => ({
          id: e.product.id,
          image: e.product.imageUrl,
          name: e.product.name,
          quantity: e.cart.quantity,
          price: e.product.price,
          total: e.cart.quantity * e.product.price,
        })),
        status: TransactionStatus.PENDING,
        total: this.itemTotal,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.transactionService.addTransaction(transaction);
      const carts = this.items$.map((e) => e.cart.id);
      await this.cartService.deleteCartInBatch(carts);
      this.toastr.success('Checkout successful!');
      this.items$ = [];
    } catch (error) {
      this.toastr.error('Checkout failed');
    }
  }
}
