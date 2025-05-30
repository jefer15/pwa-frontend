import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  typePassword = "password";

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  register() {
    this.router.navigate(['/register'])
  }

  seePassword() {
    this.typePassword = (this.typePassword == "password") ? "text" : "password";
  }

  login() {
    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }

    this._authService.login(data).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: "Login Exitoso",
          text: "A continuación entrará a la plataforma",
          icon: 'success',
          confirmButtonText: 'Ok',
          showConfirmButton: true,
          showDenyButton: false
        }).then((result) => {
          this.router.navigate(['/task'])
        });
      },
      error: () => {
        Swal.fire({
          title: "Error en la autenticación",
          text: "Datos incorrectos o Usuario no existente",
          icon: 'warning',
          confirmButtonText: 'Cerrar',
          showConfirmButton: true,
          showDenyButton: false
        })
      }
    })
  }
}
