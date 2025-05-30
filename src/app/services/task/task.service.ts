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
  private isSyncing = false;

  constructor(
    private _http: HttpClient,
    private syncService: SyncService
  ) {
    this.initializeService();
    window.addEventListener('online', this.handleOnline.bind(this));
  }

  private async handleOnline() {
    if (this.isSyncing) return;
    
    try {
      this.isSyncing = true;
      console.log('Iniciando sincronización');
      
      // 1. Obtener todas las operaciones pendientes
      const pendingOps = await this.syncService.getPendingOperations();
      console.log('Operaciones pendientes:', pendingOps);

      if (pendingOps.length > 0) {
        // 2. Procesar cada operación
        for (const op of pendingOps) {
          try {
            if (op.type === 'create') {
              await firstValueFrom(this._http.post<Task>(this.apiUrl, op.task));
            } else if (op.type === 'update') {
              await firstValueFrom(this._http.put<void>(`${this.apiUrl}/${op.task.id}`, op.task));
            } else if (op.type === 'delete') {
              await firstValueFrom(this._http.delete<void>(`${this.apiUrl}/${op.task.id}`));
            }
          } catch (error) {
            console.error('Error procesando operación:', op, error);
          }
        }

        // 3. Limpiar todas las operaciones pendientes
        await this.syncService.clearPendingOperations();
      }

      // 4. Obtener el estado actual del servidor
      const serverTasks = await firstValueFrom(this._http.get<Task[]>(this.apiUrl));
      
      // 5. Actualizar el estado local
      await this.syncService.clearAllTasks();
      for (const task of serverTasks) {
        await this.syncService.saveTask(task);
      }
      this.tasksSubject.next(serverTasks);

      console.log('Sincronización completada');
    } catch (error) {
      console.error('Error en sincronización:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async initializeService() {
    if (navigator.onLine) {
      try {
        const tasks = await firstValueFrom(this._http.get<Task[]>(this.apiUrl));
        await this.syncService.clearAllTasks();
        for (const task of tasks) {
          await this.syncService.saveTask(task);
        }
        this.tasksSubject.next(tasks);
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
        const localTasks = await this.syncService.getAllTasks();
        this.tasksSubject.next(localTasks);
      }
    } else {
      const localTasks = await this.syncService.getAllTasks();
      this.tasksSubject.next(localTasks);
    }
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
          return from((async () => {
            await this.syncService.saveTask(offlineTask);
            await this.syncService.addPendingOperation('create', offlineTask);
            const currentTasks = this.tasksSubject.value;
            this.tasksSubject.next([...currentTasks, offlineTask]);
            return offlineTask;
          })());
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
          return from((async () => {
            await this.syncService.saveTask(task);
            await this.syncService.addPendingOperation('update', task);
            const currentTasks = this.tasksSubject.value;
            const updatedTasks = currentTasks.map(t => t.id === id ? task : t);
            this.tasksSubject.next(updatedTasks);
          })());
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
            return from((async () => {
              await this.syncService.deleteTask(id);
              await this.syncService.addPendingOperation('delete', taskToDelete);
              const currentTasks = this.tasksSubject.value;
              this.tasksSubject.next(currentTasks.filter(t => t.id !== id));
            })());
          }
          return of(void 0);
        }
      })
    );
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }
}

