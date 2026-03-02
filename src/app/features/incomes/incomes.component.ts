import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-incomes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.scss'
})
export class IncomesComponent implements OnInit {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  // Data Signals
  goodincomes = signal<any[]>([]);
  stocks = signal<any[]>([]);
  goods = signal<any[]>([]);

  // Form State
  modalTitle = "";
  nameStock = "";
  nameGood = "";
  qty = 1;
  dateInp = "";
  timeInp = "";
  id = 0;
  idToDelete = 0;

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    forkJoin({
      incomes: this.http.get<any[]>(`${this.API_URL}/goodincomes/`),
      stocks: this.http.get<any[]>(`${this.API_URL}/stocks/`),
      goods: this.http.get<any[]>(`${this.API_URL}/goods/`)
    }).subscribe({
      next: (res) => {
        this.goodincomes.set(res.incomes);
        this.stocks.set(res.stocks);
        this.goods.set(res.goods);
      },
      error: (err) => console.error('Error loading data:', err)
    });
  }

  private showModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  addClick() {
    this.modalTitle = "Add Product Income";
    this.id = 0;
    this.nameStock = "";
    this.nameGood = "";
    this.qty = 1;
    const now = new Date();
    this.dateInp = now.toISOString().split('T')[0];
    this.timeInp = now.toTimeString().slice(0, 5);
    this.showModal('editModal');
  }

  editClick(acc: any) {
    this.modalTitle = "Edit Income Record";
    this.id = acc.id;
    this.nameStock = acc.nameStock;
    this.nameGood = acc.nameGood;
    this.qty = acc.qty;
    
    if (acc.datetime && acc.datetime.includes('T')) {
      this.dateInp = acc.datetime.substring(0, 10);
      this.timeInp = acc.datetime.substring(11, 16);
    }
    this.showModal('editModal');
  }

  private getRequestPayload() {
    const stockObj = this.stocks().find(s => s.nameStock === this.nameStock);
    const goodObj = this.goods().find(g => g.nameGood === this.nameGood);
    return {
      stock: stockObj ? stockObj.id : null,
      good: goodObj ? goodObj.id : null,
      qty: this.qty,
      datetime: `${this.dateInp}T${this.timeInp}:00Z`
    };
  }

  createClick() {
    this.http.post(`${this.API_URL}/goodincomes/`, this.getRequestPayload()).subscribe({
      next: () => this.refreshData(),
      error: (err) => alert('Save error')
    });
  }

  updateClick() {
    this.http.put(`${this.API_URL}/goodincomes/${this.id}/`, this.getRequestPayload()).subscribe({
      next: () => this.refreshData(),
      error: (err) => alert('Update error')
    });
  }

  prepareDelete(id: number) {
    this.idToDelete = id;
    this.showModal('deleteConfirmModal');
  }

  confirmDelete() {
    this.http.delete(`${this.API_URL}/goodincomes/${this.idToDelete}/`).subscribe({
      next: () => this.refreshData()
    });
  }
}
