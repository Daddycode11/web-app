import { QueryDocumentSnapshot } from '@angular/fire/firestore';

//create booking service for this model
// create booking
//getBookingsByUserID
//getAllBookings orderBy Schedule date
//delete booking
//rescheduleBooking userId , schedule date
//and more that I can implement
export interface Booking {
  id: string;
  userID: string;
  destination: string;
  price: number;
  persons: number;
  status: BookingStatus;
  scheduledDate: Date;
  updatedAt: Date;
  createdAt: Date;
}

export const bookingConverter = {
  toFirestore: (data: Booking) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const booking = snap.data() as Booking;
    booking.createdAt = (booking.createdAt as any).toDate();
    booking.scheduledDate = (booking.scheduledDate as any).toDate();
    booking.updatedAt = (booking.updatedAt as any).toDate();
    return booking;
  },
};

export enum BookingStatus {
  PENDING = 'PENDING',
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
}
