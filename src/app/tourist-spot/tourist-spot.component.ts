import { Component, inject } from '@angular/core';
import { TouristSpot } from '../../models/tourist.spot';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBookingComponent } from '../tourist/create-booking/create-booking.component';
import { CommonModule } from '@angular/common';
import { Users } from '../../models/users';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tourist-spot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tourist-spot.component.html',
  styleUrl: './tourist-spot.component.css',
})
export class TouristSpotComponent {
  modalService = inject(NgbModal);
  touristSpots: TouristSpot[] = [
    {
      name: 'Dumahon Mountain',
      imageUrl: '../../assets/Dumahon mountain.jpg',
      description:
        "Dumahon Mountain is a breathtaking tourist destination located in Barangay Malpalon, Calintaan, Occidental Mindoro. Known for its lush greenery, Dumahon Mountain offers adventurers a serene escape into nature. The mountain's trails are popular among hikers and nature lovers, providing panoramic views of the surrounding landscape, including nearby valleys and forests.",
      location: 'Barangay Malpalon, Calintaan, Occidental Mindoro',
      price: 100,
    },
    {
      name: 'Sandulayan Mountain',
      imageUrl: '../../assets/sandulayan mountain.jpg',
      description:
        'Sandulayan Mountain is a scenic tourist spot nestled in Barangay Malpalon, Calintaan, Occidental Mindoro. This mountain is famed for its rugged beauty and offers an adventurous escape for trekkers and outdoor enthusiasts.',
      location: 'Barangay Malpalon, Calintaan, Occidental Mindoro',
      price: 100,
    },
    {
      name: 'Makatiklas',
      imageUrl: '../../assets/Makatiklas.png',
      description:
        'Makatiklas is a hidden gem in Barangay Malpalon, Calintaan, Occidental Mindoro, renowned for its natural beauty and serene environment. This tourist spot features a tranquil river surrounded by dense forests, offering visitors a peaceful retreat in nature.',
      location: 'Barangay Malpalon, Calintaan, Occidental Mindoro',
      price: 100,
    },
    {
      name: 'Salugsog Falls',
      imageUrl: '../../assets/slugsog falls.jpg',
      description:
        'Salugsog Falls is a captivating waterfall located in Barangay Malpalon, Calintaan, Occidental Mindoro. This hidden treasure is known for its pristine, cascading waters that flow into a refreshing natural pool, surrounded by lush vegetation.',
      location: 'Barangay Malpalon, Calintaan, Occidental Mindoro',
      price: 100,
    },
    {
      name: 'Laylayan Falls',
      imageUrl: '../../assets/laylayan Falls.png',
      description:
        'Laylayan Falls is a stunning natural attraction in Barangay Malpalon, Calintaan, Occidental Mindoro. Known for its multi-tiered cascades, the falls offer a picturesque and serene setting for adventurers and nature lovers.',
      location: 'Barangay Malpalon, Calintaan, Occidental Mindoro',
      price: 100,
    },
  ];
  user$: Users | null = null;
  constructor(private authService: AuthService, private toastr: ToastrService) {
    authService.listenToUsers().subscribe((data: Users | null) => {
      this.user$ = data;
    });
  }
  //navigate to view tourist spot component
  navigateToViewTouristSpot(spot: TouristSpot) {}

  createBooking(spot: TouristSpot) {
    if (this.user$ == null) {
      this.toastr.error('No user found');
      return;
    }
    const modal = this.modalService.open(CreateBookingComponent);
    modal.componentInstance.spot = spot;
  }
}
