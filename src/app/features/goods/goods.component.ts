import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
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
  
  // Переменные для управления экземплярами модалок
  private goodsModal: any;
  private deleteModal: any;

  ngOnInit() { 
    this.refreshData(); 
  }

  refreshData() {
    this.http.get<any[]>(`${this.API_URL}/goods/`).subscribe({
      next: (res) => this.goods.set(res),
      error: (err) => console.error('API Error:', err)
    });
  }

  // Универсальный метод инициализации и показа модалки
  private showModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      if (modalId === 'goodsModal') this.goodsModal = modalInstance;
      if (modalId === 'deleteModal') this.deleteModal = modalInstance;
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

  // СОЗДАНИЕ (ACID: Ждем ответа сервера и пушим в Signal)
  createClick() {
    this.http.post<any>(`${this.API_URL}/goods/`, { nameGood: this.nameGood }).subscribe({
      next: (newGood) => {
        // Мгновенно добавляем в список без GET-запроса
        this.goods.update(items => [...items, newGood]);
        if (this.goodsModal) this.goodsModal.hide();
        this.nameGood = "";
      },
      error: (err) => alert("Ошибка при сохранении: " + err.message)
    });
  }

  // ОБНОВЛЕНИЕ (Меняем только один элемент в массиве в памяти)
  updateClick() {
    this.http.put<any>(`${this.API_URL}/goods/${this.id}/`, { nameGood: this.nameGood }).subscribe({
      next: (updatedGood) => {
        this.goods.update(items => 
          items.map(item => item.id === this.id ? updatedGood : item)
        );
        if (this.goodsModal) this.goodsModal.hide();
      }
    });
  }

  prepareDelete(id: number) { 
    this.idToDelete = id; 
    this.showModal('deleteModal');
  }

  // УДАЛЕНИЕ (Фильтруем список в памяти)
  confirmDelete() {
    this.http.delete(`${this.API_URL}/goods/${this.idToDelete}/`).subscribe({
      next: () => {
        this.goods.update(items => items.filter(item => item.id !== this.idToDelete));
        if (this.deleteModal) this.deleteModal.hide();
      }
    });
  }
}
