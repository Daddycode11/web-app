import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Booking, bookingConverter } from '../../models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private firestore: Firestore) {}

  // Create a new booking
  async createBooking(booking: Booking): Promise<void> {
    const bookingRef = doc(
      collection(this.firestore, 'bookings')
    ).withConverter(bookingConverter);
    booking.id = bookingRef.id;
    await setDoc(bookingRef, booking);
  }

  // Get bookings by user ID
  getBookingsByUserID(userID: string): Observable<Booking[]> {
    const bookingsRef = collection(this.firestore, 'bookings').withConverter(
      bookingConverter
    );
    const q = query(bookingsRef, where('userID', '==', userID));
    return collectionData(q).pipe(map((data) => data as Booking[]));
  }

  // Get all bookings ordered by scheduled date
  getAllBookings(): Observable<Booking[]> {
    const bookingsRef = collection(this.firestore, 'bookings').withConverter(
      bookingConverter
    );
    const q = query(bookingsRef, orderBy('scheduledDate', 'asc'));
    return collectionData(q).pipe(map((data) => data as Booking[]));
  }

  // Delete a booking by ID
  async deleteBooking(bookingID: string): Promise<void> {
    const bookingRef = doc(
      this.firestore,
      `bookings/${bookingID}`
    ).withConverter(bookingConverter);
    await deleteDoc(bookingRef);
  }

  // Reschedule a booking
  async rescheduleBooking(bookingID: string, newDate: Date): Promise<void> {
    const bookingRef = doc(
      this.firestore,
      `bookings/${bookingID}`
    ).withConverter(bookingConverter);
    await updateDoc(bookingRef, {
      scheduledDate: newDate,
      updatedAt: new Date(),
    });
  }
}
