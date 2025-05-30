import { Component, OnInit } from '@angular/core';
import { SyncService } from '../../services/sync/sync.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss'],
})
export class ConnectionStatusComponent implements OnInit {
  isOnline$: Observable<boolean>;

  constructor(private syncService: SyncService) {
    this.isOnline$ = this.syncService.isOnline$();
  }

  ngOnInit(): void {}
}
