import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-moves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './moves.component.html',
  styleUrl: './moves.component.scss'
})
export class MovesComponent implements OnInit {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  // Data Signals
  goodmoves = signal<any[]>([]);
  stocks = signal<any[]>([]);
  goods = signal<any[]>([]);

  // Form State
  modalTitle = "";
  nameStockFrom = "";
  nameStockTowhere = "";
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
      moves: this.http.get<any[]>(`${this.API_URL}/goodmoves/`),
      stocks: this.http.get<any[]>(`${this.API_URL}/stocks/`),
      goods: this.http.get<any[]>(`${this.API_URL}/goods/`)
    }).subscribe({
      next: (res) => {
        this.goodmoves.set(res.moves);
        this.stocks.set(res.stocks);
        this.goods.set(res.goods);
      },
      error: (err) => console.error('Error loading moves:', err)
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
    this.modalTitle = "New Stock Transfer";
    this.id = 0;
    this.nameStockFrom = "";
    this.nameStockTowhere = "";
    this.nameGood = "";
    this.qty = 1;
    const now = new Date();
    this.dateInp = now.toISOString().split('T')[0];
    this.timeInp = now.toTimeString().slice(0, 5);
    this.showModal('movesModal');
  }

  editClick(acc: any) {
    this.modalTitle = "Edit Transfer Record";
    this.id = acc.id;
    this.nameStockFrom = acc.nameStockFrom;
    this.nameStockTowhere = acc.nameStockTowhere;
    this.nameGood = acc.nameGood;
    this.qty = acc.qty;
    
    if (acc.datetime && acc.datetime.includes('T')) {
      this.dateInp = acc.datetime.substring(0, 10);
      this.timeInp = acc.datetime.substring(11, 16);
    }
    this.showModal('movesModal');
  }

  private getRequestPayload() {
    const fromObj = this.stocks().find(s => s.nameStock === this.nameStockFrom);
    const toObj = this.stocks().find(s => s.nameStock === this.nameStockTowhere);
    const goodObj = this.goods().find(g => g.nameGood === this.nameGood);
    return {
      stockFrom: fromObj ? fromObj.id : null,
      stockTo: toObj ? toObj.id : null,
      good: goodObj ? goodObj.id : null,
      qty: this.qty,
      datetime: `${this.dateInp}T${this.timeInp}:00Z`
    };
  }

  createClick() {
    this.http.post(`${this.API_URL}/goodmoves/`, this.getRequestPayload()).subscribe({
      next: () => this.refreshData(),
      error: (err) => alert('Transfer failed')
    });
  }

  updateClick() {
    this.http.put(`${this.API_URL}/goodmoves/${this.id}/`, this.getRequestPayload()).subscribe({
      next: () => this.refreshData(),
      error: (err) => alert('Update error')
    });
  }

  prepareDelete(id: number) {
    this.idToDelete = id;
    this.showModal('deleteConfirmModal');
  }

  confirmDelete() {
    this.http.delete(`${this.API_URL}/goodmoves/${this.idToDelete}/`).subscribe({
      next: () => this.refreshData()
    });
  }
}
