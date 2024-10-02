import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateProductComponent } from '../create-product/create-product.component';
import { Observable } from 'rxjs';
import { Products } from '../../../models/products';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css',
})
export class AdminMainComponent {
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  products$: Observable<Products[]>;
  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService
  ) {
    this.products$ = productService.getAllProducts();
  }
  logout() {
    this.authService
      .logout()
      .then(() => {
        this.toastr.success('Successfully Logged out!');
        this.router.navigate(['/']);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  createProducts() {
    const modal = this.modalService.open(CreateProductComponent);
  }

  editProduct(product: Products) {
    // Logic to open a modal for editing a product
  }

  async deleteProduct(product: Products) {
    try {
      await this.productService.deleteProduct(product);
      this.toastr.success('Product successfully deleted!');
    } catch (error) {
      this.toastr.error('Error deleting product!');
    }
  }
}
