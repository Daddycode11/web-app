import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Products } from '../../../models/products';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent {
  productForm$: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal
  ) {
    this.productForm$ = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, Validators.required],
      imageUrl: [null],
      category: [null, Validators.required],
      stock: [null, Validators.required],
      file: [null, Validators.required],
    });
  }

  async onSubmit() {
    if (this.productForm$.valid) {
      const formValues = this.productForm$.value;
      const product: Products = {
        id: '',
        name: formValues.name,
        description: formValues.description,
        price: formValues.price,
        imageUrl: '',
        category: formValues.category,
        stock: formValues.stock,
      };

      const file = formValues.file;
      this.productService
        .addProduct(product, file)
        .then(() => {
          this.toastr.success('Product successfully created!');
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.activeModal.close();
        });
    } else {
      this.toastr.error('Form is invalid!');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.productForm$.patchValue({ file: file });
  }
}
