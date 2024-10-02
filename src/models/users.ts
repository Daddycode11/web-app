import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Users {
  id: string;
  name: string;
  phone: string;
  profile: string;
  email: string;
  type: UserType;
}

export enum UserType {
  ADMIN = 'ADMIN',
  USERS = 'USERS',
}

export const usersConverter = {
  toFirestore: (data: Users) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const users = snap.data() as Users;
    return users;
  },
};
