import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = environment.apiUrl;

  // Данные формы
  email = '';
  companyName = '';
  token = '';
  password = '';
  confirmPassword = '';

  // Управление состоянием (Signals)
  step = signal<number>(1); // 1: Ввод почты, 2: Ввод кода и пароля
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Шаг 1: Запрос кода на Email
  requestRegistration() {
    if (!this.email || !this.companyName) {
      this.error.set('Пожалуйста, заполните все поля.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>(`${this.API_URL}/register/request/`, {
      email: this.email,
      companyName: this.companyName
    }).subscribe({
      next: (res) => {
        this.step.set(2);
        this.success.set('Код активации отправлен на ваш Email!');
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Ошибка. Возможно, этот Email уже занят или сервер недоступен.');
        this.loading.set(false);
      }
    });
  }

  // Шаг 2: Подтверждение кодом и создание пароля
  confirmRegistration() {
    if (this.password !== this.confirmPassword) {
      this.error.set('Пароли не совпадают!');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>(`${this.API_URL}/register/confirm/`, {
      token: this.token,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.success.set('Компания успешно создана! Перенаправляем на вход...');
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err) => {
        this.error.set('Неверный код активации. Проверьте почту еще раз.');
        this.loading.set(false);
      }
    });
  }
}
