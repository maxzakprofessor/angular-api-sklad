import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html'
})
export class SalesComponent implements OnInit {
  private http = inject(HttpClient);
  public auth = inject(AuthService);
  private readonly API_URL = environment.apiUrl;

  sales = signal<any[]>([]);
  stocks = signal<any[]>([]);
  goods = signal<any[]>([]);

  // Состояния модалок
  isConfirmModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  idToDelete = signal<number | null>(null);

  form = { stock: '', good: '', qty: 1, price: 0 };

  ngOnInit() {
    this.loadSales();
    this.loadStocks();
    this.loadGoods();
  }

  loadSales() { this.http.get<any[]>(`${this.API_URL}/goodsales/`).subscribe(data => this.sales.set(data)); }
  loadStocks() { this.http.get<any[]>(`${this.API_URL}/stocks/`).subscribe(data => this.stocks.set(data)); }
  loadGoods() { this.http.get<any[]>(`${this.API_URL}/goods/`).subscribe(data => this.goods.set(data)); }

  // Открытие модалки подтверждения
  openConfirm() {
    if (!this.form.stock || !this.form.good || this.form.qty <= 0) return;
    this.isConfirmModalOpen.set(true);
  }

  // Финальная отправка на сервер
  confirmSale() {
    this.http.post(`${this.API_URL}/goodsales/`, this.form).subscribe({
      next: () => {
        this.loadSales();
        this.closeModals();
        this.form = { stock: '', good: '', qty: 1, price: 0 };
      },
      error: () => alert('Error: Stock balance insufficient or connection lost.')
    });
  }

  prepareDelete(id: number) {
    this.idToDelete.set(id);
    this.isDeleteModalOpen.set(true);
  }

  confirmDelete() {
    if (this.idToDelete()) {
      this.http.delete(`${this.API_URL}/goodsales/${this.idToDelete()}/`).subscribe(() => {
        this.loadSales();
        this.closeModals();
      });
    }
  }

  closeModals() {
    this.isConfirmModalOpen.set(false);
    this.isDeleteModalOpen.set(false);
    this.idToDelete.set(null);
  }

  // Вспомогательные методы для отображения имен в модалке
  getSelectedStockName() { return this.stocks().find(s => s.id == this.form.stock)?.nameStock; }
  getSelectedGoodName() { return this.goods().find(g => g.id == this.form.good)?.nameGood; }
}
