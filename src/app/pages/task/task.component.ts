import { Component } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'description', 'isCompleted', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selectedFilter: 'all' | 'completed' | 'pending' = 'all';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _tasksService: TasksService,
    private _dialog: MatDialog,
  ) { }
  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this._tasksService.getTasks(this.selectedFilter).subscribe({
      next: (tasks: Task[]) => {
        this.dataSource.data = tasks;
        console.log(this.dataSource.data);
      },
    })
  }

  onFilterChange(filter: 'all' | 'completed' | 'pending') {
    this.selectedFilter = filter;
    this.getData();
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
    this._tasksService.deleteTask(task.id!).subscribe({
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

  updateStateTask(task: Task) {
    this._tasksService.updateTaskStatus(task.id!, true).subscribe({
      next: () => {
        Swal.fire({
          title: "Tarea",
          text: "Se ha completado exitosamente la tarea",
          icon: 'success',
          confirmButtonText: 'Ok',
          showConfirmButton: true,
          showDenyButton: false
        }).then((result) => {
          this.getData();
        });
      }
    })
  }



}
