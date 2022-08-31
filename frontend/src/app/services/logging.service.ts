import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from '../shared/enums/URL';
import { Log } from '../shared/types/Log';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor(private http: HttpClient) { }

  getLogs() {
    return this.http.get<{ data: Log[] }>(URLs.LOGGING);
  }
}
