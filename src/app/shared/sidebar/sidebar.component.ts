import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { map, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public name: string;
  public userSubs: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>
    ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('auth')
      .pipe(
        filter(({user}) => user !== null)
      )
      .subscribe(({user}) => this.name = user.nombre);
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }

  logout() {
    Swal.fire({
      title: 'Loading',
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
    this.auth.logout().then(() => {
      Swal.close();
      this.router.navigate(['/login']);
    } );
  }
}
