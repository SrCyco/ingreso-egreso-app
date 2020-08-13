import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private store: Store<AppState>,
    private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
      .subscribe(ui => {
        this.cargando = ui.isLoading;
        console.log('cargando subs');
      });
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Loading',
    //   timerProgressBar: true,
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    const {email, password} = this.loginForm.value;
    this.auth.login(email, password)
      .then((resp) => {
        console.log(resp);
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.store.dispatch(ui.isLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      });
  }

}
