import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  user,
  User,
} from '@angular/fire/auth';
import {
  Firestore,
  query,
  collection,
  where,
  limit,
  getDocs,
  collectionData,
  setDoc,
  doc,
  docData,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { Users, usersConverter } from '../../models/users';

export const USERS_COLLECTION = 'users';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  listenToUsers() {
    const users$ = user(this.auth);

    return users$.pipe(
      switchMap((user: User | null) => {
        if (user) {
          return docData(
            doc(this.firestore, USERS_COLLECTION, user.uid).withConverter(
              usersConverter
            )
          );
        } else {
          return of(null);
        }
      })
    );
  }

  async register(users: Users, password: string): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        users.email,
        password
      );
      const user = userCredential.user;

      users.id = user.uid;

      await setDoc(
        doc(this.firestore, USERS_COLLECTION, users.id).withConverter(
          usersConverter
        ),
        users
      );

      return true;
    } catch (error) {
      console.error('Error during sign up:', error);
      return false;
    }
  }

  logout() {
    return signOut(this.auth);
  }

  forgotPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      const user = this.auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(
          user.email || '',
          oldPassword
        );

        let result = await reauthenticateWithCredential(user, credential);

        return updatePassword(result.user, newPassword);
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      throw new Error('Error changing password:');
    }
  }
}
