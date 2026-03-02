import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Using Signals (Modern Angular 18/19 state management)
  currentDate = signal(new Date());
  private timer: any;

  ngOnInit() {
    // Update the clock every second
    this.timer = setInterval(() => {
      this.currentDate.set(new Date());
    }, 1000);
  }

  ngOnDestroy() {
    // Best Practice: Clean up the interval when the component is destroyed
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
