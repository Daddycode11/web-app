import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../../services/booking.service';
import { TouristSpot } from '../../../models/tourist.spot';
import { ToastrService } from 'ngx-toastr';
import { Booking, BookingStatus } from '../../../models/booking';
import { Users } from '../../../models/users';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css',
})
export class CreateBookingComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  private users$: Users | null = null;
  @Input() spot!: TouristSpot;
  bookingForm: FormGroup;
  totalAmount: number = 0;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private bookingService: BookingService,
    private toastr: ToastrService
  ) {
    this.bookingForm = this.fb.group({
      destination: ['', Validators.required],
      price: ['', [Validators.required]],
      persons: ['', [Validators.required, Validators.min(1)]],
      scheduledDate: ['', Validators.required],
    });
    this.bookingForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  ngOnInit(): void {
    this.bookingForm.patchValue({
      destination: this.spot.name,
      price: this.spot.price,
    });

    this.authService.listenToUsers().subscribe((data: Users | null) => {
      this.users$ = data;
    });
  }

  calculateTotal(): void {
    const price = this.bookingForm.get('price')!.value || 0;
    const persons = this.bookingForm.get('persons')!.value || 1;
    this.totalAmount = price * persons;
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const booking: Booking = {
        id: '',
        userID: this.users$?.id ?? '',
        destination: this.spot.name,
        price: this.spot.price,
        persons: this.bookingForm.controls['persons'].value ?? 1,
        status: BookingStatus.PENDING,
        scheduledDate: this.bookingForm.controls['scheduledDate'].value ?? 1,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      this.bookingService
        .createBooking(booking)
        .then(() => {
          this.toastr.success('Booking successful!');
        })
        .catch((error) => {
          this.toastr.error('Booking failed: ' + error.message);
        })
        .finally(() => {
          this.activeModal.close();
        });
    }
  }
}
