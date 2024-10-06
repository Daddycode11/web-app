import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Transactions, transactionsConverter } from '../../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private firestore: Firestore) {}

  //for admin to get all orders

  getAllTransactions(): Observable<Transactions[]> {
    const transactionsRef = collection(
      this.firestore,
      'transactions'
    ).withConverter(transactionsConverter);
    const q = query(transactionsRef, orderBy('createdAt', 'desc'));

    return collectionData(q).pipe(
      map((transactions) => transactions as Transactions[])
    );
  }

  //for users to see his orders
  getAllTransactionsByUsers(userID: string): Observable<Transactions[]> {
    const transactionsRef = collection(
      this.firestore,
      'transactions'
    ).withConverter(transactionsConverter);
    const q = query(transactionsRef, where('userID', '==', userID));

    return collectionData(q).pipe(
      map((transactions) => transactions as Transactions[])
    );
  }

  //to view transaction info
  getTransactionById(transactionID: string): Observable<Transactions> {
    const transactionDocRef = doc(
      this.firestore,
      `transactions/${transactionID}`
    ).withConverter(transactionsConverter);
    return docData(transactionDocRef);
  }

  //create transaction / order
  addTransaction(transaction: Transactions): Promise<void> {
    const transactionDocRef = doc(
      collection(this.firestore, 'transactions'),
      transaction.id
    ).withConverter(transactionsConverter);

    return setDoc(transactionDocRef, transaction);
  }

  //update transation info / update order
  updateTransaction(transaction: Transactions): Promise<void> {
    const transactionDocRef = doc(
      this.firestore,
      `transactions/${transaction.id}`
    ).withConverter(transactionsConverter);
    return updateDoc(transactionDocRef, { ...transaction });
  }

  //delete order / for admin
  deleteTransaction(transactionID: string): Promise<void> {
    const transactionDocRef = doc(
      this.firestore,
      `transactions/${transactionID}`
    ).withConverter(transactionsConverter);
    return deleteDoc(transactionDocRef);
  }
}
