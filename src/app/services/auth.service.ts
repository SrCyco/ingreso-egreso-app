import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      // console.log(fuser?.uid);
      if (fuser) {
        // existe
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe( (fireUser: any) => {
            console.log(fireUser);
            const user = Usuario.fromFirebase(fireUser);
            this.store.dispatch(authActions.setUser({user}));
          });
      } else {
        // no Existe
        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unsetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    // console.log({nombre, email, password});
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( ({user}) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this.firestore.doc(`${user.uid}/usuario`)
          .set({...newUser});
      });
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState
    .pipe(
       map( fuser => fuser !== null)
    );
  }
}
