import { Item } from '@angular/fire/analytics';
import { Items } from './items';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Transactions {
  id: string;
  userID: string;
  items: Items[];
  status: TransactionStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export const transactionsConverter = {
  toFirestore: (data: Transactions) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const transaction = snap.data() as Transactions;
    transaction.createdAt = (transaction.createdAt as any).toDate();
    transaction.updatedAt = (transaction.createdAt as any).toDate();
    return transaction;
  },
};

export enum TransactionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
