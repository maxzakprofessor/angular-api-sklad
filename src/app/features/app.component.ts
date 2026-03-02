import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
// ДОБАВЛЯЕМ ИМПОРТ НАВБАРА
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // ОБЯЗАТЕЛЬНО: Добавляем NavbarComponent в список импортов
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // Твоя родная логика синхронизации статуса
    this.auth.updateLoginStatus();
  }

  logout() {
    this.auth.logout();
    // SaaS: Направляем на страницу логина
    this.router.navigate(['/auth/login']);
  }
}
