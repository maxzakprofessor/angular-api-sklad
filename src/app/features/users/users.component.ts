import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  public auth = inject(AuthService);
  private readonly API_URL = environment.apiUrl;

  userList = signal<any[]>([]);
  isDeleteModalOpen = signal(false);
  isSuccessModalOpen = signal(false);
  generatedInfo = signal<any>(null);
  idToDelete = signal<number | null>(null);
  
  form = { username: '', fullName: '' };

  ngOnInit() { this.fetchUsers(); }

  fetchUsers() {
    this.http.get<any[]>(`${this.API_URL}/auth/admin/all-users`).subscribe(res => {
      this.userList.set(res);
    });
  }

  registerUser() {
    if (!this.form.username || !this.form.fullName) return;
    this.http.post<any>(`${this.API_URL}/auth/admin/create-user`, { 
      username: this.form.username,
      fullName: this.form.fullName 
    }).subscribe({
      next: (res) => {
        this.generatedInfo.set(res);
        this.isSuccessModalOpen.set(true);
        this.fetchUsers();
        this.form.username = '';
        this.form.fullName = '';
      }
    });
  }

  // ВЫЗОВ МОДАЛКИ
  prepareDelete(id: number) {
    console.log('🗑️ Preparing to delete user ID:', id);
    this.idToDelete.set(id);
    this.isDeleteModalOpen.set(true);
  }

  // ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ
  confirmDelete() {
    const id = this.idToDelete();
    if (id) {
      this.http.delete(`${this.API_URL}/auth/admin/delete-user/${id}/`).subscribe(() => {
        this.fetchUsers();
        this.closeModals();
      });
    }
  }

  closeModals() {
    this.isDeleteModalOpen.set(false);
    this.isSuccessModalOpen.set(false);
    this.idToDelete.set(null);
  }
}
