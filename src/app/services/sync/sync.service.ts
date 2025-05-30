import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Task } from '../../models/task/task.model';

interface TaskDB extends DBSchema {
  tasks: {
    key: number;
    value: Task;
  };
  pendingOperations: {
    key: string;
    value: {
      type: 'create' | 'update' | 'delete';
      task: Task;
      timestamp: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private db: IDBPDatabase<TaskDB> | null = null;
  private isOnline = new BehaviorSubject<boolean>(navigator.onLine);
  private readonly DB_NAME = 'taskOfflineDB';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initDB();
    window.addEventListener('online', () => this.isOnline.next(true));
    window.addEventListener('offline', () => this.isOnline.next(false));
  }

  private async initDB() {
    this.db = await openDB<TaskDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('tasks', { keyPath: 'id' });
        db.createObjectStore('pendingOperations', { keyPath: 'id', autoIncrement: true });
      },
    });
  }

  async saveTask(task: Task): Promise<void> {
    if (!this.db) await this.initDB();
    await this.db!.put('tasks', task);
  }

  async getTask(id: number): Promise<Task | undefined> {
    if (!this.db) await this.initDB();
    return await this.db!.get('tasks', id);
  }

  async getAllTasks(): Promise<Task[]> {
    if (!this.db) await this.initDB();
    return await this.db!.getAll('tasks');
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.db) await this.initDB();
    await this.db!.delete('tasks', id);
  }

  async addPendingOperation(type: 'create' | 'update' | 'delete', task: Task): Promise<void> {
    if (!this.db) await this.initDB();
    await this.db!.add('pendingOperations', {
      type,
      task,
      timestamp: Date.now()
    });
  }

  async getPendingOperations(): Promise<Array<{
    type: 'create' | 'update' | 'delete';
    task: Task;
    timestamp: number;
  }>> {
    if (!this.db) await this.initDB();
    return await this.db!.getAll('pendingOperations');
  }

  async clearPendingOperations(): Promise<void> {
    if (!this.db) await this.initDB();
    await this.db!.clear('pendingOperations');
  }

  isOnline$(): Observable<boolean> {
    return this.isOnline.asObservable();
  }
} 