import { Injectable } from '@angular/core';
import { from, map, mergeMap, Observable, switchMap, toArray } from 'rxjs';
import { Cart, cartConverter, CartWithProduct } from '../../models/cart';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { Products, productsConverter } from '../../models/products';
export const CART_COLLECTION = 'carts';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private firestore: Firestore) {}
  getAllMyCart(userID: string): Observable<CartWithProduct[]> {
    const cartRef = collection(this.firestore, CART_COLLECTION).withConverter(
      cartConverter
    );
    const productsRef = collection(this.firestore, 'products').withConverter(
      productsConverter
    );

    const q = query(cartRef, where('userID', '==', userID));

    return collectionData(q).pipe(
      mergeMap((carts: Cart[]) =>
        from(carts).pipe(
          mergeMap((cart: Cart) =>
            from(getDoc(doc(productsRef, cart.productID))).pipe(
              map((productDoc) => {
                const product = productDoc.data() as Products;
                return { cart, product };
              })
            )
          ),
          toArray()
        )
      )
    );
  }
  async addToCart(cart: Cart): Promise<void> {
    const cartRef = collection(this.firestore, 'carts').withConverter(
      cartConverter
    );
    const q = query(
      cartRef,
      where('userID', '==', cart.userID),
      where('productID', '==', cart.productID)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      // Cart doesn't exist, add new
      const newCartRef = doc(cartRef);
      await setDoc(newCartRef, { ...cart, id: newCartRef.id });
    } else {
      // Cart exists, increment quantity
      const cartDoc = querySnapshot.docs[0];
      const currentQuantity = cartDoc.data().quantity;
      await updateDoc(cartDoc.ref, { quantity: currentQuantity + 1 });
    }
  }

  async deleteToCart(cartID: string): Promise<void> {
    const cartDocRef = doc(this.firestore, `carts/${cartID}`);
    await deleteDoc(cartDocRef);
  }

  deleteCartInBatch(carts: string[]) {
    const batch = writeBatch(this.firestore);
    carts.forEach((e) => {
      batch.delete(doc(this.firestore, `carts/${e}`));
    });
    return batch.commit();
  }
  async increaseCartQuantity(cartID: string, quantity: number): Promise<void> {
    const cartDocRef = doc(this.firestore, `carts/${cartID}`).withConverter(
      cartConverter
    );

    await updateDoc(cartDocRef, { quantity: increment(quantity) });
  }
}
