import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Task } from "../../models/task/task.model";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
private apiUrl = `${environment.uri}/tasks`;

  constructor(private _http: HttpClient) { }
  getTasks(status: 'all' | 'completed' | 'pending' = 'all'): Observable<Task[]> {
    return this._http.get<Task[]>(`${this.apiUrl}?status=${status}`);
  }


  addTask(task: Task): Observable<Task> {
    return this._http.post<Task>(this.apiUrl, task);
  }

  updateTask(id:number, task: Task): Observable<void> {
    return this._http.put<void>(`${this.apiUrl}/${id}`, task);
  }

  updateTaskStatus(id: number, isCompleted: boolean): Observable<void> {
    return this._http.put<void>(`${this.apiUrl}/status/${id}`, { isCompleted });
  }

  deleteTask(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
