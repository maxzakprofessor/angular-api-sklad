import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
// ПРЯМОЙ ИМПОРТ: Теперь TypeScript и Angular точно знают, что такое bootstrap
import * as bootstrap from 'bootstrap'; 

@Component({
  selector: 'app-goods',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goods.component.html',
  styleUrl: './goods.component.scss'
})
export class GoodsComponent implements OnInit {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  goods = signal<any[]>([]);
  modalTitle = "";
  nameGood = "";
  id = 0;
  idToDelete = 0;

  ngOnInit() { this.refreshData(); }

  refreshData() {
    this.http.get<any[]>(`${this.API_URL}/goods/`).subscribe({
      next: (res) => this.goods.set(res),
      error: (err) => console.error('API Error:', err)
    });
  }

  // Метод открытия окна через импортированный объект bootstrap
  private showModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  addClick() {
    this.modalTitle = "Add New Product";
    this.id = 0;
    this.nameGood = "";
    this.showModal('goodsModal');
  }

  editClick(item: any) {
    this.modalTitle = "Edit Product";
    this.id = item.id;
    this.nameGood = item.nameGood;
    this.showModal('goodsModal');
  }

  createClick() {
    this.http.post(`${this.API_URL}/goods/`, { nameGood: this.nameGood }).subscribe(() => {
      this.refreshData();
    });
  }

  updateClick() {
    this.http.put(`${this.API_URL}/goods/${this.id}/`, { nameGood: this.nameGood }).subscribe(() => {
      this.refreshData();
    });
  }

  prepareDelete(id: number) { 
    this.idToDelete = id; 
    this.showModal('deleteModal');
  }

  confirmDelete() {
    this.http.delete(`${this.API_URL}/goods/${this.idToDelete}/`).subscribe(() => {
      this.refreshData();
    });
  }
}
