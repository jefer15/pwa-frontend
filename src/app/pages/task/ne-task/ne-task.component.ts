import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task/task.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ne-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './ne-task.component.html',
  styleUrls: ['./ne-task.component.scss']
})
export class NeTaskComponent implements OnInit {

  taskForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _taskService: TaskService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data?: any,
  ) { }

  ngOnInit(): void {
    this.constructorForm();
  }

  constructorForm() {
    this.taskForm = this.fb.group({
      name: [this.data ? this.data.name : '', [Validators.required, Validators.minLength(5)]],
      description: [this.data ? this.data.description : '']
    })
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.taskForm.valid) {
      let dataTask = {
        name: this.taskForm.get('name')?.value,
        description: this.taskForm.get('description')?.value,
      }
      if (this.data?.id) {
        this._taskService.updateTask(this.data?.id, dataTask).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Tarea",
              text: "Se ha actualizado exitosamente la tarea",
              icon: 'success',
              confirmButtonText: 'Ok',
              showConfirmButton: true,
              showDenyButton: false
            }).then((result) => {
              this.close();
            });
          },
          error: (err: any) => {
            if (err.error.code === 3) {
              Swal.fire({
                title: "Tarea",
                text: "No se puedo actualizar la tarea porque el nombre ya existe",
                icon: 'info',
                confirmButtonText: 'Ok',
                showConfirmButton: true,
                showDenyButton: false
              }).then((result) => {
                this.close();
              });
            }
          }
        })
      } else {
        this._taskService.addTask(dataTask).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Tarea",
              text: "Se ha creado exitosamente la tarea",
              icon: 'success',
              confirmButtonText: 'Ok',
              showConfirmButton: true,
              showDenyButton: false
            }).then((result) => {
              this.close();
            });
          },
          error: (err: any) => {
            if (err.error.code === 3) {
              Swal.fire({
                title: "Tarea",
                text: "No se puedo crear la tarea porque el nombre ya existe",
                icon: 'info',
                confirmButtonText: 'Ok',
                showConfirmButton: true,
                showDenyButton: false
              }).then((result) => {
                this.close();
              });
            }
          }
        })
      }
    }

  }
}
