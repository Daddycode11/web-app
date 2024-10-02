import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export const productsConverter = {
  toFirestore: (data: Products) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const product = snap.data() as Products;
    return product;
  },
};
