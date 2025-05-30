import { Component, OnInit } from '@angular/core';
import { SyncService } from '../../services/sync/sync.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="connection-status" [class.offline]="!(isOnline$ | async)">
      <div class="status-indicator"></div>
      <div class="status-message">
        {{ (isOnline$ | async) ? 'Conectado' : 'Sin conexión - Modo offline' }}
      </div>
    </div>
  `,
  styles: [`
    .connection-status {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 20px;
      border-radius: 20px;
      background-color: #4CAF50;
      color: white;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    }

    .connection-status.offline {
      background-color: #f44336;
    }

    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: white;
    }

    .status-message {
      font-size: 14px;
    }
  `]
})
export class ConnectionStatusComponent implements OnInit {
  isOnline$: Observable<boolean>;

  constructor(private syncService: SyncService) {
    this.isOnline$ = this.syncService.isOnline$();
  }

  ngOnInit(): void {}
} 