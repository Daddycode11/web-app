import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
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

  getAllTransactions(userID: string): Observable<Transactions[]> {
    const transactionsRef = collection(
      this.firestore,
      'transactions'
    ).withConverter(transactionsConverter);
    const q = query(transactionsRef, where('userID', '==', userID));

    return collectionData(q).pipe(
      map((transactions) => transactions as Transactions[])
    );
  }

  getTransactionById(transactionID: string): Observable<Transactions> {
    const transactionDocRef = doc(
      this.firestore,
      `transactions/${transactionID}`
    ).withConverter(transactionsConverter);
    return docData(transactionDocRef);
  }

  addTransaction(transaction: Transactions): Promise<void> {
    const transactionDocRef = doc(
      collection(this.firestore, 'transactions'),
      transaction.id
    ).withConverter(transactionsConverter);

    return setDoc(transactionDocRef, transaction);
  }

  updateTransaction(transaction: Transactions): Promise<void> {
    const transactionDocRef = doc(
      this.firestore,
      `transactions/${transaction.id}`
    ).withConverter(transactionsConverter);
    return updateDoc(transactionDocRef, { ...transaction });
  }

  deleteTransaction(transactionID: string): Promise<void> {
    const transactionDocRef = doc(
      this.firestore,
      `transactions/${transactionID}`
    ).withConverter(transactionsConverter);
    return deleteDoc(transactionDocRef);
  }
}
