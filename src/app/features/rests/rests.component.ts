import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-rests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rests.component.html',
  styleUrls: ['./rests.component.scss'],
  animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(1, 0.5, 0.8, 1)', style({ transform: 'translateY(-20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class RestsComponent implements OnInit {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  // State using Signals
  reportData = signal<any[]>([]);
  stocks = signal<any[]>([]);
  goods = signal<any[]>([]);
  selectedStock = signal<string>('All');
  selectedGood = signal<string>('All');
  aiMessage = signal<string>('');
  loadingAI = signal<boolean>(false);

  async ngOnInit() {
    await this.initData();
    await this.fetchReport();
  }

  async initData() {
    try {
      const [sRes, gRes] = await Promise.all([
        firstValueFrom(this.http.get<any[]>( `${this.API_URL}/stocks/` )),
        firstValueFrom(this.http.get<any[]>( `${this.API_URL}/goods/` ))
      ]);
      this.stocks.set([{ id: 0, nameStock: 'All' }, ...sRes]);
      this.goods.set([{ id: 0, nameGood: 'All' }, ...gRes]);
    } catch (err) {
      console.error('Error loading directories:', err);
    }
  }

  async fetchReport() {
    const s = encodeURIComponent(this.selectedStock());
    const g = encodeURIComponent(this.selectedGood());
    try {
      const data = await firstValueFrom(this.http.get<any[]>( `${this.API_URL}/goodrests/${s}/${g}/` ));
      this.reportData.set(data);
    } catch (err) {
      console.error('Error fetching report:', err);
    }
  }

  async downloadPDF() {
    const s = encodeURIComponent(this.selectedStock());
    const g = encodeURIComponent(this.selectedGood());
    try {
      const data = await firstValueFrom(this.http.post(`${this.API_URL}/goodrests/${s}/${g}/`, {}, { responseType: 'blob' }));
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Inventory_${this.selectedStock()}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error generating PDF on server');
    }
  }

  async askAI() {
    if (this.reportData().length === 0) return;
    this.loadingAI.set(true);
    this.aiMessage.set('');
    try {
      const res: any = await firstValueFrom(this.http.post(`${this.API_URL}/ai-analyze/`, { report_data: this.reportData() }));
      this.aiMessage.set(res.report);
    } catch (err) {
      this.aiMessage.set('Could not reach AI module.');
    } finally {
      this.loadingAI.set(false);
    }
  }
}
