import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from '../shared/enums/URL';
import { Fundamental } from '../shared/types/Fundamental';

@Injectable({
  providedIn: 'root'
})
export class FundamentalService {
  constructor(private httpClient: HttpClient) { }

  public fetchFundamentalsForSymbol(symbol: string) {
    return this.httpClient.get<{ data: Fundamental }>(URLs.FUNDAMENTAL + `/${symbol}`);
  }

}
