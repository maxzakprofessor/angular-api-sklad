import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebConfigService {
  // Base URL from environment
  private readonly baseUrl = environment.apiUrl;

  // Endpoints object (Equivalent to your ENDPOINTS in Vue)
  public readonly endpoints = {
    goods: `${this.baseUrl}/goods`,
    stocks: `${this.baseUrl}/stocks`,
    goodIncomes: `${this.baseUrl}/goodincomes`,
    goodMoves: `${this.baseUrl}/goodmoves`,
    goodRests: `${this.baseUrl}/goodrests`,
    aiReport: `${this.baseUrl}/ai-report`,
  };

  constructor() {}
}
