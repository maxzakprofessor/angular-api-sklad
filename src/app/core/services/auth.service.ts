import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));
  userName = signal<string>(localStorage.getItem('username') || '');
  tenantName = signal<string>(localStorage.getItem('tenantName') || '');

  updateLoginStatus() {
    this.isLoggedIn.set(!!localStorage.getItem('token'));
    this.userName.set(localStorage.getItem('username') || '');
    this.tenantName.set(localStorage.getItem('tenantName') || '');
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn.set(false);
    this.userName.set('');
    this.tenantName.set('');
  }
}
