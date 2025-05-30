import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, from, switchMap, tap, firstValueFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Task } from "../../models/task/task.model";
import { SyncService } from "../sync/sync.service";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.uri}/task`;
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor(
    private _http: HttpClient,
    private syncService: SyncService
  ) {
    this.initializeService();
  }

  private async initializeService() {
    // Primero intentamos cargar los datos del servidor si estamos online
    if (navigator.onLine) {
      try {
        const tasks = await firstValueFrom(this._http.get<Task[]>(this.apiUrl));
        for (const task of tasks) {
          await this.syncService.saveTask(task);
        }
        this.tasksSubject.next(tasks);
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Si falla, cargamos los datos locales
        await this.loadLocalData();
      }
    } else {
      // Si estamos offline, cargamos los datos locales
      await this.loadLocalData();
    }
    
    this.setupOnlineSync();
  }

  private async loadLocalData() {
    const tasks = await this.syncService.getAllTasks();
    this.tasksSubject.next(tasks);
  }

  private setupOnlineSync() {
    this.syncService.isOnline$().subscribe(async (isOnline) => {
      if (isOnline) {
        await this.syncPendingOperations();
        // Recargamos los datos del servidor cuando volvemos a estar online
        try {
          const tasks = await firstValueFrom(this._http.get<Task[]>(this.apiUrl));
          for (const task of tasks) {
            await this.syncService.saveTask(task);
          }
          this.tasksSubject.next(tasks);
        } catch (error) {
          console.error('Error syncing with server:', error);
        }
      }
    });
  }

  private async syncPendingOperations() {
    const pendingOps = await this.syncService.getPendingOperations();
    
    for (const op of pendingOps) {
      try {
        switch (op.type) {
          case 'create':
            await firstValueFrom(this._http.post<Task>(this.apiUrl, op.task));
            break;
          case 'update':
            await firstValueFrom(this._http.put<void>(`${this.apiUrl}/${op.task.id}`, op.task));
            break;
          case 'delete':
            await firstValueFrom(this._http.delete<void>(`${this.apiUrl}/${op.task.id}`));
            break;
        }
      } catch (error) {
        console.error('Error syncing operation:', error);
        continue;
      }
    }

    await this.syncService.clearPendingOperations();
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Task): Observable<Task> {
    return this.syncService.isOnline$().pipe(
      switchMap(isOnline => {
        if (isOnline) {
          return this._http.post<Task>(this.apiUrl, task).pipe(
            tap(async savedTask => {
              await this.syncService.saveTask(savedTask);
              const currentTasks = this.tasksSubject.value;
              this.tasksSubject.next([...currentTasks, savedTask]);
            })
          );
        } else {
          const tempId = Date.now();
          const offlineTask = { ...task, id: tempId };
          return from(this.syncService.saveTask(offlineTask).then(() => {
            this.syncService.addPendingOperation('create', offlineTask);
            const currentTasks = this.tasksSubject.value;
            this.tasksSubject.next([...currentTasks, offlineTask]);
            return offlineTask;
          }));
        }
      })
    );
  }

  updateTask(id: number, task: Task): Observable<void> {
    return this.syncService.isOnline$().pipe(
      switchMap(isOnline => {
        if (isOnline) {
          return this._http.put<void>(`${this.apiUrl}/${id}`, task).pipe(
            tap(async () => {
              await this.syncService.saveTask(task);
              const currentTasks = this.tasksSubject.value;
              const updatedTasks = currentTasks.map(t => t.id === id ? task : t);
              this.tasksSubject.next(updatedTasks);
            })
          );
        } else {
          return from(this.syncService.saveTask(task).then(() => {
            this.syncService.addPendingOperation('update', task);
            const currentTasks = this.tasksSubject.value;
            const updatedTasks = currentTasks.map(t => t.id === id ? task : t);
            this.tasksSubject.next(updatedTasks);
          }));
        }
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.syncService.isOnline$().pipe(
      switchMap(isOnline => {
        if (isOnline) {
          return this._http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(async () => {
              await this.syncService.deleteTask(id);
              const currentTasks = this.tasksSubject.value;
              this.tasksSubject.next(currentTasks.filter(t => t.id !== id));
            })
          );
        } else {
          const taskToDelete = this.tasksSubject.value.find(t => t.id === id);
          if (taskToDelete) {
            return from(this.syncService.deleteTask(id).then(() => {
              this.syncService.addPendingOperation('delete', taskToDelete);
              const currentTasks = this.tasksSubject.value;
              this.tasksSubject.next(currentTasks.filter(t => t.id !== id));
            }));
          }
          return of(void 0);
        }
      })
    );
  }
}
