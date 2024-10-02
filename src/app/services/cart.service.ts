import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { Cart, cartConverter, CartWithProduct } from '../../models/cart';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Products } from '../../models/products';
export const CART_COLLECTION = 'carts';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private firestore: Firestore) {}

  getAllMyCart(userID: string): Observable<CartWithProduct[]> {
    const cartRef = collection(this.firestore, CART_COLLECTION);
    const productsRef = collection(this.firestore, 'products');

    const q = query(cartRef, where('userID', '==', userID));

    return from(getDocs(q)).pipe(
      switchMap((cartSnapshot) => {
        const cartItems = cartSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Cart[];
        const productQueries = cartItems.map((cartItem) =>
          getDocs(query(productsRef, where('id', '==', cartItem.productID)))
        );

        return from(Promise.all(productQueries)).pipe(
          switchMap((productSnapshots) => {
            const cartWithProducts: CartWithProduct[] = [];
            cartItems.forEach((cartItem, index) => {
              const product = productSnapshots[index].docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Products[];
              if (product.length > 0) {
                cartWithProducts.push({ cart: cartItem, product: product[0] });
              }
            });
            return [cartWithProducts];
          })
        );
      })
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

  async increaseCartQuantity(cartID: string): Promise<void> {
    const cartDocRef = doc(this.firestore, `carts/${cartID}`).withConverter(
      cartConverter
    );
    const cartDoc = await getDoc(cartDocRef);
    const currentQuantity = cartDoc.data()?.quantity || 0;
    await updateDoc(cartDocRef, { quantity: currentQuantity + 1 });
  }
}
