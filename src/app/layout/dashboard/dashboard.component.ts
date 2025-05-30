import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../services/layout/layout.service';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ConnectionStatusComponent } from '../../components/connection-status/connection-status.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    RouterModule,
    AsyncPipe,
    CommonModule,
    ConnectionStatusComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  isHandset$: Observable<boolean>;

  constructor(
    private layoutService: LayoutService,
    private _authService: AuthService
  ) {
    this.isHandset$ = this.layoutService.isHandset$;
  }

  ngOnInit(): void {}

  logout() {
    this._authService.logout();
  }
}
