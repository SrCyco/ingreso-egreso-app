import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresosEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresoSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('auth')
      .pipe(
        filter(auth => auth.user !== null)
      ).subscribe( ({user}) => {
        console.log(user);
        this.ingresoSubs = this.ingresoEgresoService.ingresosEgresosListener(user.uid)
          .subscribe((ingresosEgresos: any) => {
            this.store.dispatch(ingresosEgresosActions.setItems({items: ingresosEgresos}))
          });
      });
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
    this.ingresoSubs.unsubscribe();
  }

}
