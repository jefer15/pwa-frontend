import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  typePassword = "password";
  typePassword2 = "password";

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  register() {
    if (!this.registerForm.valid) {
      Swal.fire({
        title: "Registro",
        text: "Datos incorrectos.",
        icon: 'warning',
        confirmButtonText: 'Cerrar',
        showConfirmButton: true,
        showDenyButton: false
      })
      return
    }

    const data = {
      name:this.registerForm.get('name')?.value,
      email:this.registerForm.get('email')?.value,
      password:this.registerForm.get('password')?.value
    }

    this._userService.saveUser(data).subscribe({
      next:(res:any)=>{
        Swal.fire({
          title: "Registro Exitoso",
          text: "A continuación podrá loguearse.",
          icon: 'success',
          confirmButtonText: 'Ok',
          showConfirmButton: true,
          showDenyButton: false
        }).then((result) => {
          this.login()
        });
      }, error:()=>{
        Swal.fire({
          title: "Registro",
          text: "Ocurrió un error, intente nuevamente.",
          icon: 'info',
          confirmButtonText: 'Cerrar',
          showConfirmButton: true,
          showDenyButton: false
        })
      }
    })

  }

  login() {
    this.router.navigate(['/login'])
  }

  seePassword() {
    this.typePassword = (this.typePassword == "password") ? "text" : "password";
  }
  seePassword2() {
    this.typePassword2 = (this.typePassword2 == "password") ? "text" : "password";
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
}
