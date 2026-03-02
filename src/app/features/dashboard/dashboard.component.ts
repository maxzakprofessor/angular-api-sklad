import { Component, OnInit, signal, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  public auth = inject(AuthService);
  private readonly API_URL = environment.apiUrl;

  @ViewChild('stockChart') stockChart!: ElementRef;

  stats = signal<any>({ cards: { goods: 0, stocks: 0, operations: 0 } });
  aiHint = signal<string>('Analyzing your SaaS assets...');
  
  cardConfigs: any = {
    goods: { label: 'Active Goods', icon: 'bi-box-seam', color: 'bg-primary' },
    stocks: { label: 'Active Stocks', icon: 'bi-building', color: 'bg-success' },
    operations: { label: 'Total Ops', icon: 'bi-arrow-left-right', color: 'bg-info' }
  };
  objectKeys = Object.keys;

  ngOnInit() {
    this.loadStats();
    this.loadChartData();
  }

  loadStats() {
    this.http.get<any>(`${this.API_URL}/dashboard/stats/`).subscribe(data => this.stats.set(data));
  }

  loadChartData() {
    // Берем данные из остатков для графика
    this.http.get<any[]>(`${this.API_URL}/goodrests/All/All/`).subscribe(data => {
      if (data.length > 0) {
        this.createChart(data);
      }
    });
  }

  createChart(data: any[]) {
    const labels = data.map(item => `${item.nameStock} (${item.nameGood})`);
    const values = data.map(item => item.qty);

    new Chart(this.stockChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Inventory Level',
          data: values,
          backgroundColor: '#0d6efd',
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
}
