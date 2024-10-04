import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Items {
  id: string;
  image: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}
export const productsConverter = {
  toFirestore: (data: Items) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const items = snap.data() as Items;
    return items;
  },
};
