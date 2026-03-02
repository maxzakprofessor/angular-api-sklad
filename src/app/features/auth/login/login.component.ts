import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);
  private readonly API_URL = environment.apiUrl;

  username = '';
  password = '';
  newPassword = '';
  confirmPassword = '';
  
  loading = signal(false);
  isChangeMode = signal(false); // Флаг режима смены пароля
  error = signal<string | null>(null);

  login() {
    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>(`${this.API_URL}/auth/signin`, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        // Сохраняем токены временно
        localStorage.setItem('token', res.access);
        localStorage.setItem('username', res.username);
        localStorage.setItem('tenantName', res.tenantName || 'Sklad PRO');

        if (res.needsPasswordChange) {
          // Если это первый вход сотрудника — включаем смену пароля
          this.isChangeMode.set(true);
          this.loading.set(false);
        } else {
          // Если это Директор или старый юзер — сразу в Dashboard
          this.auth.updateLoginStatus();
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.error.set('Invalid credentials. Please try again.');
        this.loading.set(false);
      }
    });
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.error.set('Passwords do not match!');
      return;
    }

    this.loading.set(true);
    this.http.post(`${this.API_URL}/auth/update-password`, { 
      newPassword: this.newPassword 
    }).subscribe({
      next: () => {
        this.auth.updateLoginStatus();
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error.set('Error updating password.');
        this.loading.set(false);
      }
    });
  }
}
