import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Products, productsConverter } from '../../models/products';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { generateRandomString } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private firestore: Firestore, private storage: Storage) {}
  async addProduct(product: Products, file: File): Promise<void> {
    const id = doc(collection(this.firestore, 'products')).id;
    product.id = id;
    const fileName = `${generateRandomString(10)}-${file.name}`;
    const fileRef = ref(this.storage, `products/${fileName}`);

    await uploadBytes(fileRef, file);

    const downloadURL = await getDownloadURL(fileRef);
    product.imageUrl = downloadURL;

    await setDoc(
      doc(this.firestore, 'products', product.id).withConverter(
        productsConverter
      ),
      product
    );
  }

  getProductById(id: string): Observable<Products | undefined> {
    const productDoc = doc(this.firestore, `products/${id}`).withConverter(
      productsConverter
    );
    return docData(productDoc);
  }

  getAllProducts(): Observable<Products[]> {
    const productsCollection = collection(
      this.firestore,
      'products'
    ).withConverter(productsConverter);
    return collectionData(productsCollection, { idField: 'id' }) as Observable<
      Products[]
    >;
  }

  // Update an existing product
  async updateProduct(product: Products): Promise<void> {
    const productDoc = doc(
      this.firestore,
      `products/${product.id}`
    ).withConverter(productsConverter);
    await updateDoc(productDoc, { ...product });
  }

  // Delete a product
  async deleteProduct(product: Products): Promise<void> {
    const productDoc = doc(
      this.firestore,
      `products/${product.id}`
    ).withConverter(productsConverter);

    return deleteDoc(productDoc).then(() =>
      deleteObject(ref(this.storage, product.imageUrl))
    );
  }
}
