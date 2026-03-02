import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  public auth = inject(AuthService);
  
  // Управление аккордеоном документации
  activeSection = signal<string>('architecture');

  ngOnInit() {
    // Синхронизируем статус входа при загрузке страницы
    this.auth.updateLoginStatus();
  }

  toggleSection(section: string) {
    this.activeSection.update(current => current === section ? '' : section);
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }
}
