import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('../app/pages/login/login.component').then(m => m.LoginComponent) },

  { path: 'register', loadComponent: () => import('../app/pages/register/register.component').then(m => m.RegisterComponent) },

  { path: 'task', loadComponent: () => import('../app/pages/task/task.component').then(m => m.TaskComponent) },
];
