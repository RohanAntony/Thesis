import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from '../shared/enums/URL';
import { OHLC } from '../shared/types/OHLC';

@Injectable({
  providedIn: 'root'
})
export class TechnicalService {

  constructor(private http: HttpClient) { }

  getOHLCForCompanyBetweenTimePeriod(symbol: string, start: Date, end: Date) {
    return this.http.get<{ data: OHLC[] }>(URLs.OHLC, {
      params: {
        symbol,
        start: start.toISOString(),
        end: end.toISOString(),
      }
    });
  }
}
