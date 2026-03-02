import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./views/about/about.component').then(m => m.AboutComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'dashboard', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'stocks', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/stocks/stocks.component').then(m => m.StocksComponent) 
  },
  { 
    path: 'goods', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/goods/goods.component').then(m => m.GoodsComponent) 
  },
  { 
    path: 'goodincomes', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/incomes/incomes.component').then(m => m.IncomesComponent) 
  },
  { 
    path: 'goodmoves', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/moves/moves.component').then(m => m.MovesComponent) 
  },
  { 
    path: 'goodrests', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/rests/rests.component').then(m => m.RestsComponent) 
  },
  { 
    path: 'sales', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/sales/sales.component').then(m => m.SalesComponent) 
  },
  { 
    path: 'users', 
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent) 
  },
  { 
    path: 'auth/register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) 
  },
  { path: '**', redirectTo: '' }
];
