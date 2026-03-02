import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss'
})
export class StocksComponent implements OnInit {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  // Reactive State
  stocks = signal<any[]>([]);
  
  // Form State
  modalTitle = "";
  nameStock = "";
  id = 0;
  idToDelete = 0;

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.http.get<any[]>(`${this.API_URL}/stocks/`).subscribe({
      next: (res) => this.stocks.set(res),
      error: (err) => console.error('Error loading stocks:', err)
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
    this.modalTitle = "Add New Warehouse";
    this.id = 0;
    this.nameStock = "";
    this.showModal('stocksModal');
  }

  editClick(item: any) {
    this.modalTitle = "Edit Warehouse";
    this.id = item.id;
    this.nameStock = item.nameStock;
    this.showModal('stocksModal');
  }

  createClick() {
    this.http.post(`${this.API_URL}/stocks/`, { nameStock: this.nameStock }).subscribe(() => {
      this.refreshData();
    });
  }

  updateClick() {
    this.http.put(`${this.API_URL}/stocks/${this.id}/`, { nameStock: this.nameStock }).subscribe(() => {
      this.refreshData();
    });
  }

  prepareDelete(id: number) {
    this.idToDelete = id;
    this.showModal('deleteModal');
  }

  confirmDelete() {
    this.http.delete(`${this.API_URL}/stocks/${this.idToDelete}/`).subscribe(() => {
      this.refreshData();
    });
  }
}
