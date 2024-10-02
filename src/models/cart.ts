import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Products } from './products';

export interface CartWithProduct {
  cart: Cart;
  product: Products;
}
export interface Cart {
  id: string;
  userID: string;
  productID: string;
  quantity: number;
  createdAt: Date;
}

export const cartConverter = {
  toFirestore: (data: Cart) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const cart = snap.data() as Cart;
    cart.createdAt = (cart.createdAt as any).toDate();
    return cart;
  },
};
