import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('../app/pages/login/login.component').then(m => m.LoginComponent) },

  { path: 'register', loadComponent: () => import('../app/pages/register/register.component').then(m => m.RegisterComponent) },

  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('../app/layout/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: 'task', loadComponent: () => import('../app/pages/task/task.component').then(m => m.TaskComponent) },
      { path: '', redirectTo: 'task', pathMatch: 'full' }
    ]
  }
];
