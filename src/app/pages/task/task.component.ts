import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Task } from '../../models/task/task.model';
import { TaskService } from '../../services/task/task.service';
import { NeTaskComponent } from './ne-task/ne-task.component';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _taskService: TaskService,
    private _dialog: MatDialog,
  ) { }
  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this._taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.dataSource.data = tasks;
        console.log(this.dataSource.data);
      },
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addTask() {
    const dialogRef = this._dialog.open(NeTaskComponent, {
      width: "90%",
      maxWidth: "90%",
      height: "auto",
      panelClass: 'centered-dialog'
    });
    dialogRef.afterClosed().subscribe((data) => {
      this.getData();
    });
  }
  editTask(task: Task) {
    const dialogRef = this._dialog.open(NeTaskComponent, {
      width: "90%",
      maxWidth: "90%",
      height: "auto",
      panelClass: 'centered-dialog',
      data: task
    });
    dialogRef.afterClosed().subscribe((data) => {
      this.getData();
    });
  }

  deleteTask(task: Task) {
    this._taskService.deleteTask(task.id!).subscribe({
      next: () => {
        Swal.fire({
          title: "Tarea",
          text: "Se ha eliminado exitosamente la tarea",
          icon: 'success',
          confirmButtonText: 'Ok',
          showConfirmButton: true,
          showDenyButton: false
        }).then((result) => {
          this.getData();
        });
      },
      error: () => {
        Swal.fire({
          title: "Tarea",
          text: "No se eliminó la tarea porque está en estado Pendiente",
          icon: 'error',
          confirmButtonText: 'Ok',
          showConfirmButton: true,
          showDenyButton: false
        }).then((result) => {
          this.getData();
        });
      },
    });
  }



}
